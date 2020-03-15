const projectId = location.href.split("?v=")[1].split("#")[0];;

var mainTitle, mainDesc;

var ideas;

const isLoggedIn = () => {
    if (page.page == "workspace" && page.level != undefined && page.pass != undefined && projectId != "") {
        loadProjectData();
    } else {
        loadPage("home");
    }
}

const loadProjectData = () => {
    ideas = db.collection(`workspace/${page.id}/projects/${projectId}/ideas`);
    loadIdeas();
    displaySettings();
    initMaterial();
}

const loadIdeas = () => {
    ideas
        .onSnapshot(ideas => {
            let html = "";
            ideas.forEach(doc => {
                let idea = doc.data();
                if (idea.creatorId != undefined) {
                    let key = page.pass + projectId + idea.creatorId + idea.date;
                    html += `<li id="idea${doc.id}">
                                <div class="collapsible-header">
                                    <i class="material-icons">lightbulb_outline</i>
                                    <span>${decrypt(idea.title,key,page.level)}</span>
                                </div>
                                <div class="collapsible-body left-align">
                                    <span>${decrypt(idea.desc,key,page.level)}</span>
                                    <br>
                                    <br>
                                    <span class="right">
                                        Ideator:${(idea.creatorId!=data.id)?idea.creatorName:"you"}
                                        <br>
                                        ideated On:${idea.date}
                                    </span>
                                    <br>
                                    <br>
                                </div>
                            </li>`;
                }
            })
            document.getElementById("IdeasList").innerHTML = html;
            document.getElementById("ideaCount").innerHTML = ideas.size - 1;
        })
}

const addIdea = () => {
    let title = document.getElementById("ideaTitle").value;
    let desc = document.getElementById("ideaDescription").value;
    let date = getDate();
    let key = page.pass + projectId + data.id + date;
    if (title.length > 5) {
        if (desc.length > 5) {
            let modal = document.getElementById('addIdeaModal')
            let html = modal.innerHTML;
            showLoading('addIdeaModal', 'Adding A New Idea To the Project')
            ideas
                .add({
                    creatorId: data.id,
                    creatorName: data.name,
                    date: date,
                    title: encrypt(title, key, page.level),
                    desc: encrypt(desc, key, page.level)
                })
                .then(e => {
                    showLoading('addIdeaModal', 'Complete')
                    $("#addIdeaModal").modal("close");
                    modal.innerHTML = html;
                })
                .catch(e => {
                    console.log(e);
                })
        } else {
            alert("Description too short");
        }
    } else {
        alert("Title Should be between 5-30 chars");
    }
}

const back = () => {
    loadPage("workspace?" + page.id + "#projects");
}

const loadData = () => {
    isLoggedIn();
}

const displaySettings = () => {
    db.collection(`workspace/${page.id}/projects`)
        .doc(projectId)
        .get()
        .then(p => {
            let key = page.id + data.id + data.name + page.key;
            document.getElementById('projectInfoTitle').innerHTML = decrypt(p.data().title, key, page.level);
            document.getElementById('projectInfoDesc').innerHTML = decrypt(p.data().description, key, page.level);
            document.getElementById('projectInfoCreatorName').innerHTML = p.data().creatorName;
            document.getElementById('projectInfoDate').innerHTML = p.data().date;
            if (p.data().creatorId == data.id) {
                document
                    .getElementsByTagName("main")[0]
                    .innerHTML += `<div class="fixed-action-btn tooltop">
                                      <a class="btn-floating btn-large theme modal-trigger" href="#settings">
                                        <i class="large material-icons">settings</i>
                                      </a>
                                    </div>`;
                mainTitle = decrypt(p.data().title, key, page.level);
                mainDesc = decrypt(p.data().description, key, page.level)
                document.getElementById('changeProjectTitleInput').value = mainTitle;
                document.getElementById('changeProjectDescInput').value = mainDesc;
                initMaterial();
                M.updateTextFields();
            }
        })
}

const changeSettings = () => {
    let [title, desc] = getValuesByIds(['changeProjectTitleInput', 'changeProjectDescInput']);
    console.log(title, desc);
    if (title.length > 5) {
        if (desc.length > 15) {
            if (title != mainTitle || desc != mainDesc) {
                showLoading('settings', "Making Changes");
                let key = page.id + data.id + data.name + page.key;
                let proj = db
                    .collection('workspace')
                    .doc(page.id)
                    .collection('projects')
                    .doc(projectId);

                db.runTransaction(transaction => {
                    return transaction
                        .get(proj)
                        .then(doc => {
                            transaction.update(proj, {
                                title: encrypt(title, key, page.level),
                                description: encrypt(desc, key, page.level)
                            });
                        });
                }).then(function () {
                    $("#settings").modal("close");
                    showLoading('settings', "Complete");
                }).catch(function (error) {
                    console.log("Transaction failed: ", error);
                });
            } else {
                $("#settings").modal("close");
            }
        } else {
            alert("Description Too Short!(atleast 15 chars)");
        }
    } else {
        alert("Title Too Short!(atleast 5 chars)");
    }
}
