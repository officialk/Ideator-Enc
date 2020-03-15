const workId = location.href.split("?v=")[1].split("#")[0];

var projects;

var messages;

const loginToWorkspace = () => {
    let pass = document.getElementById("workspaceLoginPassInput").value;
    let level = document.getElementById("workspaceLoginLevelInput").value;
    db
        .collection("workspace")
        .doc(workId)
        .get()
        .then(wk => {
            try {
                let conf = decrypt(wk.data().pass, pass, level);
                if (conf == pass) {
                    page.page = "workspace";
                    page.id = workId;
                    page.pass = pass;
                    page.level = level;
                    $("#workspaceLoginModal").modal("close");
                    updateSession();
                    loadWorkspaceData();
                } else {
                    throw new Error("Invalid Credentials");
                }
            } catch (e) {
                alert("Invalid Credentials");
            }
        })
        .catch(e => {
            console.log(e);
        })
}

const loadWorkspaceData = () => {
    projects = db.collection(`workspace/${workId}/projects`)
    messages = db.collection(`workspace/${workId}/messages`)
    loadMessages();
    loadProjects();
    displaySettings();
    createDynamicElement('changeWorkspaceTeamList');
    initMaterial();
}

const loadMessages = () => {
    messages
        .orderBy("date", "asc")
        .onSnapshot(messages => {
            document.getElementById("messageDisplay").innerHTML = "";
            //            let html = '';
            messages.forEach(doc => {
                let mssg = doc.data();
                if (mssg.content != undefined) {
                    let html = `<div class="row message">
                            <div class="${(mssg.sender==data.name)?"col s2 m4 l4":"hide"}"></div>
                            <div class="card col s10 m8 l8 ${(mssg.sender==data.name)?((doc.metadata.hasPendingWrites)?"blue":"green"):"grey"}" id="message${doc.id}">
                                <div class="white-text card-content">
                                <p><b>${(mssg.sender==data.name)?"You":mssg.sender}</b>( ${mssg.date} )
                                <!-- <span class="right">
                                    <a class="btn-floating btn-flat tooltipped" data-position="bottom" data-tooltip="Add as a project"><i class="material-icons">add</i></a>
                                    <a class="btn-floating btn-flat tooltipped" data-position="bottom" data-tooltip="reply"> <i class="material-icons">reply</i></a>
                                </span>--></p>
                                    ${decrypt(mssg.content, page.pass + workId + mssg.date,page.level)}
                                </div>
                            </div>
                            <div class="col s2 m4 l4">
                            </div>
                        </div>`;
                    document.getElementById("messageDisplay").insertAdjacentHTML("afterbegin", html);
                }
                //                document.getElementById("messageDisplay").innerHTML = html;
            })
        })
}

const sendMessage = () => {
    let mssg = document.getElementById("messageTextInput").value;
    let date = getDate();
    if (mssg.length > 0) {
        messages
            .add({
                sender: data.name,
                date: date,
                content: encrypt(mssg, page.pass + workId + date, page.level)
            })
            .then(e => {
                document.getElementById(`message${e.id}`).classList.remove("blue");
                document.getElementById(`message${e.id}`).classList.add("green");
            })
            .catch(e => {
                console.log(e)
            })
    }
    document.getElementById("messageTextInput").value = "";
}

const loadProjects = () => {
    projects
        .get()
        .then(projects => {
            document.getElementById("projectsList").innerHTML = "";
            let html = "";
            projects.forEach(doc => {
                let project = doc.data();
                let key = workId + project.creatorId + project.creatorName + page.key;
                if (project.creatorId != undefined) {
                    html += `<div class="col s12 m6 l4">
                                <div class="card block link hoverable rounded" onclick="loadPage('project?${doc.id}')" id='project${doc.id}'>
                                    <div class="card-title truncate flow-text"><b>${decrypt(project.title,key,page.level)}</b></div>
                                    <div class="card-content">
                                        <div class="left-align wrap">
                                            ${decrypt(project.description,key,page.level)}
                                        </div>
                                    </div>
                                    <div class="card-footer left-align container">
                                        Creator:${(project.creatorId==data.id)?"You":project.creatorName}
                                        <br>
                                        Date:${project.date}
                                    </div>
                                </div>
                            </div>`;
                }
            })
            document.getElementById("projectsList").innerHTML = html;
            document.getElementById("projectCount").innerHTML = (projects.size - 1) || 0;
        })
}

const addProject = () => {
    let desc = document.getElementById("projectDescription").value;
    let title = document.getElementById("projectTitle").value;
    let date = getDate();
    if (title.length > 5) {
        if (desc.length > 15) {
            let modal = document.getElementById('addProjectModal');
            let html = modal.innerHTML;
            showLoading('addProjectModal', 'Adding A New Project For You');
            let key = workId + data.id + data.name + page.key;
            projects
                .add({
                    creatorId: data.id,
                    creatorName: data.name,
                    date: date,
                    description: encrypt(desc, key, page.level),
                    title: encrypt(title, key, page.level)
                }).then(e => {
                    showLoading('addProjectModal', 'Setting Up Other Stuff');
                    db
                        .collection(`workspace/${workId}/projects/${e.id}/ideas`)
                        .add({})
                        .then(e => {
                            showLoading('addProjectModal', 'Complete');
                            $("#addProjectModal").modal("close");
                            modal.innerHTML = html;
                        })
                })
                .catch(e => {
                    console.log(e);
                })
            loadProjects();
        } else {
            alert("Description Too Short!(atleast 15 chars)");
        }
    } else {
        alert("Title Too Short!(atleast 5 chars)");
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

const displaySettings = () => {
    db
        .collection(`workspace`)
        .doc(`${workId}`)
        .get()
        .then(ws => {
            document.getElementById("workspaceInfoName").innerHTML = ws.data().name;
            document.getElementById("workspaceInfoCreatorName").innerHTML = ws.data().creatorName;
            document.getElementById("workspaceInfoDate").innerHTML = ws.data().date;
            let c = 1;
            ws.data().team.forEach(member => {
                document.getElementById("workspaceInfoTeam").innerHTML += `
                    <b>${member==data.email?"You":member}</b>
                    <br>
                `;
            })
            if (ws.data().creatorId == data.id) {
                document
                    .getElementsByTagName("main")[0]
                    .innerHTML += `<div class="fixed-action-btn tooltop">
                                      <a class="btn-floating btn-large theme modal-trigger" href="#settings">
                                        <i class="large material-icons">settings</i>
                                      </a>
                                    </div>`;
                document.getElementById('changeWorkspaceNameInput').value = ws.data().name;
                ws.data().team.forEach(member => {
                    if (member != data.email) {
                        createDynamicElement("changeWorkspaceTeamList");
                        document.getElementById(`workspaceTeamList${c++}Input`).value = member;
                    }
                })
                M.updateTextFields();
                initMaterial();
            }
        })
}

const changeSettings = () => {
    let [name, pass, level] = getValuesByIds(['changeWorkspaceNameInput', 'changeWorkspacePassInput', 'changeWorkspaceLevelInput']);
    let team = [data.email]
        .concat(getValuesByNames(["changeWorkspaceTeamListInput"])[0]
            .filter(el => {
                return validator("email", el) && data.email != el;
            }));
    if (name.length > 3 && name.length < 25) {
        if (level > 0 && level < 11) {
            if (pass.length > 5) {
                showLoading('settings', "Making Changes");
                var main = db
                    .collection("workspace")
                    .doc(workId);
                db.runTransaction(transaction => {
                    return transaction
                        .get(main)
                        .then(doc => {
                            transaction.update(main, {
                                name: name,
                                team: team
                            });
                        });
                }).then(function () {
                    $("#settings").modal("close");
                    showLoading('settings', "Complete");
                }).catch(function (error) {
                    console.log("Transaction failed: ", error);
                });
            } else {
                alert("Password too short");
            }
        } else {
            alert("Encryption Level invalid");
        }
    } else {
        alert("Name Invalid \nlenght should be between 3 to 25 letters");
    }
}

const deleteWorkspace = () => {
    if (confirm("THIS WILL DELETE ALL DATA RELATED TO THE WORKSPACE AND IS IRREVERSIBLE")) {
        showLoading("settings", "Deleting Workspace and All its Data")
        db
            .collection('workspace')
            .doc(workId)
            .delete()
            .then(e => {
                showLoading("settings", "Deletion Of Workspace Completed")
                alert("Workspace Deleted");
                loadPage('home');
            })
    }
}
