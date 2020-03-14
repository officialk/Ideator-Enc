/*WORKSPACE FUNCTIONS*/
const addWorkspace = () => {
    let [name, level, pass, passconf] = getValuesByIds(["addWorkspaceNameInput", "addWorkspaceLevelInput", "addWorkspacePassInput", "addWorkspacePassConfInput"]);
    let team = [data.email]
        .concat(getValuesByNames(["addWorkspaceEmailInput"])[0]
            .filter(el => {
                return validator("email", el) && data.email != el;
            }));
    if (name.length > 3 && name.length < 25) {
        if (level > 0 && level < 11) {
            if (pass.length > 5) {
                if (pass == passconf) {
                    showLoading('addWorkspaceModal', 'Adding A New Workspace For You');
                    let wdata = {
                        creatorId: data.id,
                        creatorName: data.name,
                        name: name,
                        pass: encrypt(pass, pass, level),
                        team: team,
                        date: getDate()
                    }
                    db
                        .collection("workspace")
                        .add(wdata)
                        .then(e => {
                            showLoading('addWorkspaceModal', 'Workspace Added');
                            db
                                .collection("workspace")
                                .doc(e.id)
                                .collection("projects")
                                .add({})
                                .then(x => {
                                    showLoading('addWorkspaceModal', 'Setting Up Other Stuff');
                                    db
                                        .collection("workspace")
                                        .doc(e.id)
                                        .collection("messages")
                                        .add({})
                                        .then(x => {
                                            showLoading('addWorkspaceModal', 'Complete');
                                            $('addWorkspaceModal').modal('close');
                                            loadData();
                                        })
                                })
                        })
                        .catch(e => {
                            console.log(e);
                        });
                } else {
                    alert("Passwords dont match");
                }
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

const loadData = () => {
    sessionStorage.clear();
    createDynamicElement('addWorkspaceTeamList');
    db
        .collection("workspace")
        .get()
        .then(list => {
            let html = ``;
            list.forEach(ws => {
                let work = ws.data();
                if (work.creatorId != undefined && work.team.indexOf(data.email) != -1) {
                    html += `<div class="col s12 m6 l4">
                            <div class="card block link rounded ${ws.metadata.hasPendingWrites?"grey":""}" onclick="loadPage('workspace?${ws.id}')" id="workspace${ws.id}">
                                <div class="card-title truncate flow-text">${work.name}</div>
                                <div class="card-content">
                                    <div class="left-align truncate">
                                    Creator:${(work.creatorId==data.id)?"You":work.creatorName}
                                    <br>
                                    Date:${work.date}
                                    </div>
                                </div>
                            </div>
                        </div>`;
                }
            })
            document
                .getElementById("workspaceList").innerHTML = html;
        })
}
