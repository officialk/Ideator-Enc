
/*MESSAGES FUNCTIONS*/
const loadMessages = () => {
    document.getElementById("messageDisplay").innerHTML = "";
    db.collection("messages")
        .onSnapshot(doc => {
            document.getElementById("messageDisplay").innerHTML = "<b><center>**END OF MESSAGES**</center></b>";
            doc.forEach(mssg => {
                var mssg = mssg.data();
                let html = `<div class="row message">
                    <div class="${(mssg.sender==data.name)?"col s2 m4 l4":"hide"}"></div>
                    <div class="card col s10 m8 l8 ${(mssg.sender==data.name)?"green":"grey"}" id="message${mssg.id}">
                        <div class="white-text card-content">
                        <p><b>${(mssg.sender==data.name)?"You":mssg.sender}</b>( ${mssg.date} )
                        <!-- <span class="right">
                            <a class="btn-floating btn-flat tooltipped" data-position="bottom" data-tooltip="Add as a project"><i class="material-icons">add</i></a>
                            <a class="btn-floating btn-flat tooltipped" data-position="bottom" data-tooltip="reply"> <i class="material-icons">reply</i></a>
                        </span>--></p>
                            ${sjcl.decrypt(mssg.date+data.name,mssg.content)}
                        </div>
                    </div>
                    <div class="col s2 m4 l4">
                    </div>
                </div>`;
                document.getElementById("messageDisplay").insertAdjacentHTML("afterbegin", html);
            })

        });
}

const sendMessage = () => {
    let mssg = document.getElementById("messageTextInput").value;
    let date = getDate();
    if (mssg.length > 0) {
        db.collection("messages").add({
            sender: data.name,
            date: date,
            content: sjcl.encrypt(date + data.name, mssg)
        });
    }
}

/*PROJECT FUNCTIONS*/
const loadProjectList = () => {
    document.getElementById("public").innerHTML = "<h3><center>No Public Projects Available hover over bottom right button and + button to add a project</center></h3>";
    document.getElementById("private").innerHTML = "<h3><center>No Private Projects Available hover over bottom right button and + button to add a project</center></h3>";
    db
        .collection("projects")
        .get()
        .then(ideaList => {
            let privhtml = "",
                pubhtml = "";
            ideaList.forEach(doc => {
                let idea = doc.data();
                if (idea.type == "private" && idea.creatorId == data.uid) {
                    privhtml += `<div class="card idea col s12 m6 l4">
                                    <div class="card-title">${sjcl.decrypt(data.pin+data.name+data.uid+idea.date,idea.title)}</div>
                                    <div class="card-content">
                                        ${sjcl.decrypt(data.pin+data.name+data.uid+idea.date,idea.description)}
                                        <!--Idea Count::${idea.count}-->
                                        <br>
                                        ${idea.date}
                                    </div>
                                    <div class="card-action">
                                        <a class="btn-floating tooltipped" data-position="top" data-tooltip="View Idea List" onclick="curProject='${doc.id}';viewIdeaList('${doc.id}')"><i class="material-icons">remove_red_eye</i></a>
                                        <a class="btn-floating tooltipped" data-position="top" data-tooltip="Add Idea" onclick="curProject='${doc.id}';curProjectType='private';$('#addIdeaModal').modal('open');"><i class="material-icons">add</i></a>
                                        <a class="btn-floating tooltipped" data-position="top" data-tooltip="Delete Project" onclick="deleteProject('${doc.id}')"><i class="material-icons">delete</i></a>
                                        <a class="btn-floating tooltipped" data-position="top" data-tooltip="Convert To Public Project" onclick="convProject('${doc.id}','public')"><i class="material-icons">refresh</i></a>
                                    </div>
                                </div>`;
                } else {
                    pubhtml += `<div class="card idea col s12 m6 l4">
                                    <div class="card-title">${sjcl.decrypt(idea.creatorId+idea.creatorName+idea.date,idea.title)}</div>
                                    <div class="card-content">
                                        ${sjcl.decrypt(idea.creatorId+idea.creatorName+idea.date,idea.description)}
                                        <br>
                                        ${idea.creatorName}::${idea.date}
                                        <br>
                                        <!--Idea Count::${idea.count}-->
                                    </div>
                                    <div class="card-action">
                                        <a class="btn-floating tooltipped" data-position="top" data-tooltip="View Idea List" onclick="curProject='${doc.id}';viewIdeaList('${doc.id}')"><i class="material-icons">remove_red_eye</i></a>
                                        <a class="btn-floating tooltipped" data-position="top" data-tooltip="Add Idea" onclick="curProject='${doc.id}';curProjectType='public';$('#addIdeaModal').modal('open');"><i class="material-icons">add</i></a>`;
                    if (idea.creatorId == data.uid) {
                        pubhtml += `
                                    <a class="btn-floating tooltipped" data-position="top" data-tooltip="Delete Idea" onclick="deleteProject('${doc.id}')"><i class="material-icons">delete</i></a>
                                    <a class="btn-floating tooltipped" data-position="top" data-tooltip="revert To Private Project" onclick="convProject('${doc.id}','private')"><i class="material-icons">refresh</i></a>`;
                    }
                    pubhtml += `</div></div>`;
                }
            });
            if (privhtml != "") {
                document.getElementById("private").innerHTML = privhtml;
            }
            if (pubhtml != "") {
                document.getElementById("public").innerHTML = pubhtml;
            }
            initMaterial();
        })
}

const convProject = (id, type) => {
    let req = db.collection("projects").doc(id);
    db.runTransaction(transaction => {
        return transaction.get(req).then(ans => {
            let oldKey = data.pin + data.name + data.uid + ans.data().date;
            let newKey = data.uid + data.name + ans.data().date;
            if (type == "private") {
                let temp = oldKey;
                oldKey = newKey;
                newKey = temp;
            }
            transaction.update(req, {
                type: type,
                title: keyShift(oldKey, newKey, ans.data().title),
                description: keyShift(oldKey, newKey, ans.data().description)
            })
        })
    }).then(x => {
        alert("updated Project type");
        loadProjectList();
    })
}

const deleteProject = id => {
    if (confirm("DO YOU REALY WANT TO DELETE THE PROJECT AS IT IS A IRREVERSIBLE PROCESS")) {
        //        db
        //            .collection("projects")
        //            .doc(id)
        //            .collection("ideas")
        //            .delete()
        //            .then(e => {
        db
            .collection("projects")
            .doc(id)
            .delete()
            .then(e => {
                alert("Project Deleted");
                loadProjectList();
            })
        //            })
        //    }
    }
}

const addProject = () => {
    let desc = document.getElementById("projectDescription").value;
    let title = document.getElementById("projectTitle").value;
    let type = document.getElementById("projectType").value || "private";
    let date = getDate();
    let key = data.uid + data.name + date;
    if (title.length > 5) {
        if (desc.length > 15) {
            if (type == "private") {
                key = data.pin + data.name + data.uid + date;
            }
            db.collection("projects").add({
                creatorId: data.uid,
                creatorName: data.name,
                date: date,
                description: sjcl.encrypt(key, desc),
                title: sjcl.encrypt(key, title),
                type: type
            })
            $("#addProject").modal("close");
            loadProjectList();
        } else {
            alert("Description Too Short!(atleast 15 chars)");
        }
    } else {
        alert("Title Too Short!(atleast 5 chars)");
    }
}

/*IDEA FUNCTIONS*/
const addIdea = () => {
    let id = curProject;
    let title = document.getElementById("ideaTitle").value;
    let description = document.getElementById("ideaDescription").value;
    let date = getDate();
    let key = data.uid + data.name + date;
    if (title.length > 5) {
        if (desc.length > 15) {
            if (curProjectType == "private") {
                key = data.uid + data.name + data.pin + date;
            }
            db.collection(`projects/${curProject}/ideas`).add({
                title: sjcl.encrypt(key, title),
                description: sjcl.encrypt(key, description),
                creatorId: data.uid,
                creatorName: data.name,
                date: date,
                type: curProjectType
            });
            $("#addIdeaModal").modal("close");
        } else {
            alert("Description Too Short!(atleast 15 chars)");
        }
    } else {
        alert("Title Too Short!(atleast 5 chars)");
    }
}

const deleteIdea = id => {
    console.log(id);
    if (confirm("DO YOU REALY WANT TO DELETE THE IDEA AS IT IS A IRREVERSIBLE PROCESS")) {
        db
            .collection("projects")
            .doc(`${curProject}`)
            .collection("ideas")
            .doc(id)
            .delete()
            .then(e => {
                alert("Idea Deleted");
                viewIdeaList();
            })
    }
}

const viewIdeaList = id => {
    console.log(id);
    $("#ideaListModal").modal("open");
    db.collection(`projects/${id}/ideas`)
        .get()
        .then(ideas => {
            //            console.log(ideas.docs());
            let html = ``;
            ideas.forEach(ideaDoc => {
                console.log(ideaDoc.id);
                idea = ideaDoc.data();
                let key = idea.creatorId + idea.creatorName + idea.date;
                if (idea.type == "private") {
                    key = data.uid + data.name + data.pin + idea.date;
                }
                html += `<li>
                            <div class="collapsible-header"><i class="material-icons">lightbulb_outline</i>${sjcl.decrypt(key,idea.title)}</div>
                            <div class="collapsible-body">
                                <span>${sjcl.decrypt(key,idea.description)}</span>
                                <p><span>Suggestor::${(idea.creatorName==data.name)?"You":idea.creatorName}</span><br><span>date::${idea.date}</span></p>`;
                if (data.uid == idea.creatorId) {
                    html += `<p><div class="btn-floating" onclick="deleteIdea('${ideaDoc.id}')"><i class="material-icons">delete</i></div></p>`
                }
                html += `</div></li>`;
            })
            if (html != "") {
                document.getElementById("ideaListDisplay").innerHTML = html;
                $('.collapsible').collapsible();
            }
        })

}
/*FILE FUNCTIONS*/


<!DOCTYPE html>
<html>

<head>
    <!-- META Tags -->
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>Ideator</title>
    <meta name="author" content="Karthik Koppaka" />
    <meta name="description" content="description here" />
    <meta name="keywords" content="keywords,here" />
    <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
    <link rel="manifest" href="manifest.json" />
    <!-- CSS -->
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/css/materialize.min.css" />
    <link rel="stylesheet" href="css/app.css" type="text/css" />

    <!--    Firebase JS-->
    <script src="https://www.gstatic.com/firebasejs/7.9.2/firebase.js"></script>
    <script src="https://www.gstatic.com/firebasejs/7.9.2/firebase-app.js"></script>
    <script src="https://www.gstatic.com/firebasejs/7.9.2/firebase-auth.js"></script>
    <script src="https://www.gstatic.com/firebasejs/7.9.2/firebase-firestore.js"></script>
    <!--UI JS-->
    <script src="https://code.jquery.com/jquery-3.4.1.min.js" integrity="sha256-CSXorXvZcTkaix6Yvo6HppcZGetbYMGWSFlBw8HfCJo=" crossorigin="anonymous"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/js/materialize.min.js"></script>
    <script src="js/helper.js"></script>
    <script src="js/crypto.js"></script>
    <script src="js/app.js"></script>
</head>

<body>
    <header class="hide">
        <nav class="navbar-fixed">
            <a href="#" class="brand-logo left">Ideator</a>
            <ul class="right valign-wrapper">
                <li><a onclick="loadWorkspaceList()"><i class="material-icons">home</i></a></li>
                <li><a onclick="$('#userSettingsModal').modal('open');"><i class="material-icons">settings</i></a></li>
                <li><a onclick="$('#userSettingsModal').modal('open');"><i class="material-icons">settings</i></a></li>
            </ul>
        </nav>
    </header>
    <main class="container hide">
        <div class="heading">
            <ul class="tabs row container">
                <li class="tab col s4 m4 l4 center"><a href="#chat"><i class="material-icons">chat</i>
                        <!--<span id="messageCount" class="badge new">1</span>--></a></li>
                <li class="tab col s4 m4 l4 center"><a href="#public"><i class="material-icons">group</i>
                        <!--<span id="publicCount" class="badge">3</span>--></a></li>
                <li class="tab col s4 m4 l4 center"><a href="#private"><i class="material-icons">face</i>
                        <!--<span id="privateCount" class="badge">3</span>--></a></li>
            </ul>
        </div>
        <div class="fixed-action-btn">
            <a class="btn-floating btn-large">
                <i class="large material-icons">face</i>
            </a>
            <ul>
                <li><a class="btn-floating red tooltipped" data-position="left" data-tooltip="Logout" onclick="logout()"><i class="material-icons">exit_to_app</i></a></li>
                <li><a class="btn-floating blue tooltipped modal-trigger" href="#settingsModal" data-position="left" data-tooltip="Settings"><i class="material-icons">settings</i></a></li>
                <li><a class="btn-floating green tooltipped modal-trigger" href="#addProjectModal" data-position="left" data-tooltip="Add Project"><i class="material-icons">add</i></a></li>
            </ul>
        </div>
        <br>
        <div class="card" id="chat">
            <br>
            <div class="row container" id="messageInput">
                <div class="col s10 m10 l10 input-field">
                    <textarea type="text" class="materialize-textarea" id="messageTextInput"></textarea>
                    <label for="messageTextInput">Enter Message</label>
                </div>
                <div class="col s2 m2 l2 input-field">
                    <div class="btn-floating" onclick="sendMessage()"><i class="material-icons">send</i></div>
                </div>
            </div>
            <div class="scrollable container" id="messageDisplay">

            </div>
        </div>
        <div class="row" id="public">

        </div>
        <div class="row" id="private">

        </div>
        <div class="modal" id="addProjectModal">
            <div class="modal-content row">
                <h5 class="center">Add Project</h5>
                <div class="input-field col s12 m6 l6">
                    <input type="text" id="projectTitle">
                    <label for="projectTitle">Project Title</label>
                </div>
                <div class="input-field col s12 m6 l6">
                    <select id="projectType">
                        <option value="private" selected disabled>Select Project Type</option>
                        <option value="private">private</option>
                        <option value="public">public</option>
                    </select>
                </div>
                <div class="input-field col s12 m12 l12">
                    <textarea id="projectDescription" class="materialize-textarea"></textarea>
                    <label for="projectDescription">Project Description</label>
                </div>
            </div>
            <div class="modal-footer center">
                <div class="btn" onclick="addProject()">Add <i class="material-icons">add</i></div>
                <br>
            </div>
        </div>
        <div class="modal" id="addIdeaModal">
            <div class="modal-content row">
                <h5 class="center">Add Idea</h5>
                <div class="input-field col s12 m6 l6">
                    <input type="text" id="ideaTitle">
                    <label for="ideaTitle">Idea Title</label>
                </div>
                <div class="input-field col s12 m6 l6">
                    <textarea id="ideaDescription" class="materialize-textarea"></textarea>
                    <label for="ideaDescription">Idea Description</label>
                </div>
                <center>
                    <div class="btn-floating" onclick="addIdea()"><i class="material-icons">add</i></div>
                </center>
            </div>
        </div>
        <div class="modal" id="ideaListModal">
            <div class="modal-content">
                <center>
                    <h2>IDEA LIST</h2>
                </center>
                <ul class="collapsible" id="ideaListDisplay">
                    <h4>NO IDEAS YET ADD ONE USING THE + BUTTON</h4>
                </ul>
            </div>
        </div>
        <div class="modal" id="settingsModal">
            <div class="modal-content">
                <h5>
                    <center>Settings</center>
                </h5>
                <div class="row container">
                    <div class="input-field col s12 m6 l6">
                        <input type="password" id="newPasswordInput">
                        <label for="newPasswordInput">Enter New Password</label>
                    </div>
                    <div class="input-field col s12 m6 l6">
                        <input type="text" id="newNameInput">
                        <label for="newNameInput">Enter New Name</label>
                    </div>
                </div>
                <div class="row container">
                    <div class="input-field col s12 m12 l12 center">
                        <div class="btn-floating" onclick="updatePassword()"><i class="material-icons">done_all</i></div>
                    </div>
                </div>
            </div>
            <div class="modal-footer">

            </div>
        </div>
        <div class="modal" id="addWorkSpaceModal">
            <div class="modal-content row">
                <h5 class="center">Add Workspace</h5>
                <div class="input-field col s12 m6 l6">
                    <input type="text" id="workspaceName">
                    <label for="workspaceName">Workspace Name</label>
                </div>
                <div class="input-field col s12 m6 l6">
                    <select id="workspaceLevel">
                        <option value="1" selected>1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                        <option value="6">6</option>
                        <option value="7">7</option>
                        <option value="8">8</option>
                        <option value="9">9</option>
                    </select>
                </div>
                <div class="input-field col s12 m6 l6">
                    <input type="password" id="workspacePassword">
                    <label for="workspacePassword">Workspace Password</label>
                </div>
            </div>
            <div class="modal-footer center">
                <div class="btn" onclick="addWorkspace()">Add <i class="material-icons">add</i></div>
                <br>
            </div>
        </div>
    </main>
    <footer class="hide">
    </footer>
    <extras>
        <br>
        <br>
        <br>
        <br>
        <div class="center">
            <div class="btn" onclick="join()">JOIN USING GOOGLE</div>
        </div>
    </extras>
</body>

</html>
