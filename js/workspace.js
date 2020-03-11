const workId = location.href.split("?v=")[1].split("#")[0];

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
                    updateSession();
                    loadWorkspaceData();
                    $("#workspaceLoginModal").modal("close");
                } else {
                    throw new Error("Invalid Credentials");
                }
            } catch (e) {
                alert("Invalid Credentials");
            }
        })
}

const loadWorkspaceData = () => {
    loadMessages();
    loadProjects();
    initMaterial();
}

const loadMessages = () => {
    db
        .collection("messages")
        .where("workspaceId", "==", workId)
        .get()
        .then(messages => {
            let html = "";
            messages.forEach(doc => {
                let mssg = doc.data();
                html += `<div class="row message">
                            <div class="${(mssg.sender==data.name)?"col s2 m4 l4":"hide"}"></div>
                            <div class="card col s10 m8 l8 ${(mssg.sender==data.name)?"green":"grey"}" id="message${doc.id}">
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
            })
            document.getElementById("messageDisplay").innerHTML = html;
        })
}

const sendMessage = () => {
    let mssg = document.getElementById("messageTextInput").value;
    let date = getDate();
    if (mssg.length > 0) {
        db.collection("messages").add({
            workspaceId: workId,
            sender: data.name,
            date: date,
            content: encrypt(mssg, page.pass + workId + date, page.level)
        });
    }
    document.getElementById("messageTextInput").value = "";
}

const loadProjects = () => {
    db
        .collection("projects")
        .where("workspaceId", "==", workId)
        .get()
        .then(projects => {
            projects.forEach(doc => {
                let project = doc.data();
                let html = `<div class="col s12 m4 l4">
                                <div class="card block link rounded" onclick="loadPage('project?${doc.id}')">
                                    <div class="card-title truncate flow-text">${decrypt(project.title,workId + project.creatorId + project.creatorName + page.key,page.level)}</div>
                                    <div class="card-content">
                                        <div class="left-align truncate">
                                            Creator:${(project.creatorId==data.id)?"You":project.creatorName}
                                            <br>
                                            ${decrypt(project.description,workId + project.creatorId + project.creatorName + page.key,page.level)}
                                            <br>
                                            Date:${project.date}
                                        </div>
                                    </div>
                                </div>
                            </div>`;
                document.getElementById("projects").insertAdjacentHTML("beforeend", html);
                /*${(project.creatorId==data.id)?`<a class="btn-floating tooltipped" data-position="top" data-tooltip="Delete Project" onclick="deleteProject('${doc.id}')"><i class="material-icons">delete</i></a>`:""}*/
            })
            document.getElementById("projectCount").innerHTML = projects.size;
        })
}

const addProject = () => {
    let desc = document.getElementById("projectDescription").value;
    let title = document.getElementById("projectTitle").value;
    let date = getDate();
    if (title.length > 5) {
        if (desc.length > 15) {
            db
                .collection('projects')
                .add({
                    workspaceId: workId,
                    creatorId: data.id,
                    creatorName: data.name,
                    date: date,
                    description: encrypt(desc, workId + data.id + data.name + page.key, page.level),
                    title: encrypt(title, workId + data.id + data.name + page.key, page.level)
                })
            $("#addProjectModal").modal("close");
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
