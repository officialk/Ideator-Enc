const projectId = location.href.split("?v=")[1].split("#")[0];;

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
                    html += `<li id="idea${doc.id}" class="${doc.metadata.hasPendingWrites?"grey":""}">
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
            ideas
                .add({
                    creatorId: data.id,
                    creatorName: data.name,
                    date: date,
                    title: encrypt(title, key, page.level),
                    desc: encrypt(desc, key, page.level)
                })
                .then(e => {
                    document.getElementById(`idea${e.id}`).classList.remove("grey");
                })
                .catch(e => {
                    console.log(e);
                })
            document.getElementById("ideaTitle").value = "";
            document.getElementById("ideaDescription").value = "";
            $("#addIdeaModal").modal("close");
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
