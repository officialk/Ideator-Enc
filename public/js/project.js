const projectId = location.href.split("?v=")[1].split("#")[0];;
/*
    loads the Project data
*/
const loadProjectData = () => {
    loadIdeas();
    initUI();
    initMaterial();
}
/*
    loads the Ideas List of the Project
*/
const loadIdeas = () => {
    send('read', 'idea', {
            id: projectId
        })
        .then(ideas => {
            let html = "";
            ideas.forEach(idea => {
                let key = page.pass + projectId + idea.creatorId;
                html += `<li id="idea${idea.id}">
                                <div class="collapsible-header">
                                    <i class="material-icons">lightbulb_outline</i>
                                    <span>${decrypt(idea.title,key,page.level)}</span>
                                </div>
                                <div class="collapsible-body left-align">
                                    <span>${decrypt(idea.description,key,page.level)}</span>
                                    <br>
                                    <br>
                                    <span class="right">
                                        Ideator:${(idea.creatorId!=data.id)?idea.creatorName:"you"}
                                        <br>
                                        ideated On:${getDate(idea.date)}
                                    </span>
                                    <br>
                                    <br>
                                </div>
                            </li>`;
            })
            document.getElementById("IdeasList").innerHTML = html;
            document.getElementById("ideaCount").innerHTML = ideas.length;
        })
        .catch(e => {
            console.log(e)
            alert("Some Error Occured While Trying To Load Your Ideas\nPlease Try Again!")
            location.reload()
        })
}
/*
    adds an Ideas to the Project
*/
const addIdea = () => {
    let title = document.getElementById("ideaTitle").value;
    let desc = document.getElementById("ideaDescription").value;
    let key = page.pass + projectId + data.id;
    if (title.length > 3) {
        if (desc.length > 5) {
            let modal = document.getElementById('addIdeaModal')
            let html = modal.innerHTML;
            showLoading('addIdeaModal', 'Adding A New Idea To the Project')
            send('add', 'idea', {
                    creatorId: data.id,
                    projectId: projectId,
                    title: encrypt(title, key, page.level),
                    description: encrypt(desc, key, page.level)
                })
                .then(e => {
                    showLoading('addIdeaModal', 'Complete')
                    $("#addIdeaModal").modal("close");
                    modal.innerHTML = html;
                    loadIdeas()
                })
                .catch(e => {
                    console.log(e);
                    showLoading('addIdeaModal', 'Error')
                    alert("Some Error Occured While Trying To Add Your Idea\nPlease Try Again!")
                    $("#addIdeaModal").modal("close");
                    modal.innerHTML = html;
                })
        } else {
            alert("Description too short");
        }
    } else {
        alert("Title Should be between 5-30 chars");
    }
}
/*
 goes back to the workspace page
 */
const back = () => {
    loadPage("workspace?" + page.id + "#projects");
}
/*
    checks for users login
    if user.loginValid
        then loadProjectData
    else
        back to workspace page
*/
const loadData = () => {
    if (page.page == "workspace" && page.level != undefined && page.pass != undefined && projectId != "") {
        loadProjectData();
    } else {
        loadPage("home");
    }
}
/*
    loads the Projects data and show extra options if you are the creator of the Project
*/
const initUI = () => {
    send('read', 'projectUI', {
            id: projectId
        })
        .then(p => {
            let key = page.id + p.creatorId + page.key + p.creatorName;
            let title = decrypt(p.title, key, page.level)
            let description = decrypt(p.description, key, page.level)
            document.getElementById('projectInfoTitle').innerHTML = title;
            document.getElementById('projectInfoDesc').innerHTML = description;
            document.getElementById('projectInfoCreatorName').innerHTML = p.creatorName;
            document.getElementById('projectInfoDate').innerHTML = getDate(p.date);
            if (p.creatorId == data.id) {
                document
                    .getElementsByTagName("main")[0]
                    .innerHTML += `<div class="fixed-action-btn tooltop">
                                      <a class="btn-floating btn-large theme modal-trigger" href="#settings">
                                        <i class="large material-icons">settings</i>
                                      </a>
                                    </div>`;
                document.getElementById('changeProjectTitleInput').value = title;
                document.getElementById('changeProjectDescInput').value = description;
                initMaterial();
                M.updateTextFields();
            }
        })
        .catch(e => {
            console.log(e)
            alert("Some Error Occured While Trying To Load Your Settings\nPlease Try Again!")
        })
}
/*
    changes the projects name and description as per data gathered from the UI
*/
const changeSettings = () => {
    let [title, desc] = getValuesByIds(['changeProjectTitleInput', 'changeProjectDescInput']);
    if (title.length > 3) {
        if (desc.length > 15) {
            showLoading('settings', "Making Changes");
            let key = page.id + data.id + page.key + data.name;
            send('update', 'project', {
                id: projectId,
                title: encrypt(title, key, page.level),
                description: encrypt(desc, key, page.level)
            }).then(function () {
                showLoading('settings', "Complete");
                location.reload()
            }).catch(e => {
                console.log(e);
                showLoading('settings', "Error");
                alert("Some Error Occured While Trying To Change Your Settings\nPlease Try Again!")
                location.reload();
            });
        } else {
            alert("Description Too Short!(atleast 15 chars)");
        }
    } else {
        alert("Title Too Short!(atleast 3 chars)");
    }
}
/*
    DELETES THE CURRENT WORKSPACES
*/
const deleteProject = () => {
    if (confirm("THIS WILL DELETE ALL DATA RELATED TO THE PROJECT AND IS IRREVERSIBLE")) {
        showLoading("settings", "Deleting Project and All its Data")
        send('delete', 'project', {
                id: projectId
            })
            .then(e => {
                showLoading("settings", "Deletion Of Project Completed")
                alert("Project Deleted");
                back()
            })
            .catch(e => {
                showLoading("settings", "Error")
                alert("Some Error Occured While Trying To Delete Your Project\nPlease Try Again!")
                location.reload();
            })
    }
}
