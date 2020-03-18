const workId = location.href.split("?v=")[1].split("#")[0];

const loginToWorkspace = () => {
    let pass = document.getElementById("workspaceLoginPassInput").value;
    let level = document.getElementById("workspaceLoginLevelInput").value;
    send('read', 'validate', {
            id: workId
        })
        .then(wk => {
            try {
                let conf = decrypt(wk.pass, pass, level);
                if (conf == pass) {
                    page.page = "workspace";
                    page.id = workId;
                    page.pass = pass;
                    page.level = level;
                    $("#workspaceLoginModal").modal("close");
                    updateSession();
                    loadWorkspaceData();
                } else {
                    throw "Invalid Credentials";
                }
            } catch (e) {
                alert("Invalid Credentials");
            }
        })
}

const loadWorkspaceData = () => {
    setInterval(loadMessages, 1000);
    loadProjects();
    initUI();
    initMaterial();
}

const loadMessages = () => {
    send('read', 'message', {
            id: workId
        })
        .then(messages => {
            document.getElementById("messageDisplay").innerHTML = "";
            messages.forEach(mssg => {
                let isUser = mssg.uid == data.id;
                let html = `<div class="row message">
                            <div class="${isUser?"col s2 m4 l4":"hide"}"></div>
                            <div class="card col s10 m8 l8 ${isUser?'green':'grey'}" id="message${mssg.mid}">
                                <div class="white-text card-content">
                                <p><b>${isUser?"You":mssg.sender}</b>( ${getDate(mssg.date)} )
                                <!-- <span class="right">
                                    <a class="btn-floating btn-flat tooltipped" data-position="bottom" data-tooltip="Add as a project"><i class="material-icons">add</i></a>
                                    <a class="btn-floating btn-flat tooltipped" data-position="bottom" data-tooltip="reply"> <i class="material-icons">reply</i></a>
                                </span>--></p>
                                    ${decrypt(mssg.content, page.pass + workId + mssg.uid,page.level)}
                                </div>
                            </div>
                            <div class="col s2 m4 l4">
                            </div>
                        </div>`;
                document.getElementById("messageDisplay").insertAdjacentHTML("afterbegin", html);
            })
        })
}

const sendMessage = () => {
    let mssg = document.getElementById("messageTextInput").value;
    if (mssg.length > 0) {
        send('add', 'message', {
                creatorId: data.id,
                workspaceId: workId,
                content: encrypt(mssg, page.pass + workId + data.id, page.level)
            })
            .then(e => {
                loadMessages();
            })
            .catch(e => {
                console.log(e)
            })
    }
    document.getElementById("messageTextInput").value = "";
}

const loadProjects = () => {
    send('read', 'project', {
            id: workId
        })
        .then(projects => {
            document.getElementById("projectsList").innerHTML = "";
            let html = "";
            projects.forEach(project => {
                let key = workId + project.creatorId + page.key + project.creatorName;
                html += `<div class="col s12 m6 l4">
                                <div class="card block link hoverable rounded" onclick="loadPage('project?${project.id}')" id='project${project.id}'>
                                    <div class="card-title truncate flow-text"><b>${decrypt(project.title,key,page.level)}</b></div>
                                    <div class="card-content">
                                        <div class="left-align wrap">
                                            ${decrypt(project.description,key,page.level)}
                                        </div>
                                    </div>
                                    <div class="card-footer left-align container">
                                        Creator:${(project.creatorId==data.id)?"You":project.creatorName}
                                        <br>
                                        Date:${getDate(project.date)}
                                    </div>
                                </div>
                            </div>`;
            })
            document.getElementById("projectsList").innerHTML = html;
            document.getElementById("projectCount").innerHTML = projects.length;
        })
}

const addProject = () => {
    let desc = document.getElementById("projectDescription").value;
    let title = document.getElementById("projectTitle").value;
    if (title.length > 3) {
        if (desc.length > 10) {
            let modal = document.getElementById('addProjectModal');
            let html = modal.innerHTML;
            showLoading('addProjectModal', 'Adding A New Project For You');
            let key = workId + data.id + page.key + data.name;
            send('add', 'project', {
                    workspaceId: workId,
                    creatorId: data.id,
                    description: encrypt(desc, key, page.level),
                    title: encrypt(title, key, page.level)
                })
                .then(e => {
                    showLoading('addProjectModal', 'Complete');
                    $("#addProjectModal").modal("close");
                    modal.innerHTML = html;
                    loadProjects();
                })
                .catch(e => {
                    console.log(e);
                })
        } else {
            alert("Description Too Short!(atleast 10 chars)");
        }
    } else {
        alert("Title Too Short!(atleast 3 chars)");
    }
}

const isLoggedIn = () => {
    if (workId != "" && page.page == "workspace" && page.id == workId && page.pass != undefined && page.level != undefined) {
        loadWorkspaceData();
    } else {
        $("#workspaceLoginModal").modal({
            dismissible: false,
            opacity: 1,
            inDuration: 0,
            outDuration: 250
        });
        $("#workspaceLoginModal").modal("open");
    }
}

const loadData = () => {
    isLoggedIn();
}

const initUI = () => {
    send('read', 'workUI', {
            id: workId
        })
        .then(ws => {
            document.getElementById("workspaceInfoName").innerHTML = ws.name;
            document.getElementById("workspaceInfoCreatorName").innerHTML = ws.creatorName;
            document.getElementById("workspaceInfoDate").innerHTML = getDate(ws.date);
            document.getElementById("workspaceInfoTeam").innerHTML = ""
            let team = ws.team.split(',');
            let c = 1;
            team.forEach(member => {
                document.getElementById("workspaceInfoTeam").innerHTML += `
                                <li>${member==data.email?"You":member}</li>
                                <br>
                            `;
            })
            if (ws.creatorId == data.id) {
                document
                    .getElementsByTagName("main")[0]
                    .innerHTML += `<div class="fixed-action-btn tooltop">
                                      <a class="btn-floating btn-large theme modal-trigger" href="#settings">
                                        <i class="large material-icons">settings</i>
                                      </a>
                                    </div>`;
                document.getElementById('changeWorkspaceNameInput').value = ws.name;
                team.forEach(member => {
                    createDynamicElement("changeWorkspaceTeamList");
                    if (member != data.email) {
                        document.getElementById(`workspaceTeamList${c++}Input`).value = member;
                    }
                })
            }
            initMaterial();
        })
}

const changeSettings = () => {
    let [name, pass, level] = getValuesByIds(['changeWorkspaceNameInput']);
    let team = [data.email]
        .concat(getValuesByNames(["changeWorkspaceTeamListInput"])[0]
            .filter(el => {
                return validator("email", el) && data.email != el;
            }));
    if (name.length > 3 && name.length < 25) {
        let modal = document.getElementById("settings");
        let html = modal.innerHTML;
        showLoading('settings', "Making Changes");
        send('update', 'workspace', {
                name: name,
                team: team,
                id: workId
            })
            .then(e => {
                location.reload();
            }).catch(function (error) {
                console.log("Transaction failed: ", error);
            });
    } else {
        alert("Name Invalid \nlenght should be between 3 to 25 letters");
    }
}

const deleteWorkspace = () => {
    if (confirm("THIS WILL DELETE ALL DATA RELATED TO THE WORKSPACE AND IS IRREVERSIBLE")) {
        showLoading("settings", "Deleting Workspace and All its Data")
        send('delete', 'workspace', {
                id: workId
            })
            .then(e => {
                showLoading("settings", "Deletion Of Workspace Completed")
                alert("Workspace Deleted");
                loadPage('home');
            })
    }
}
