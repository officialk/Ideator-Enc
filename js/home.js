/*WORKSPACE FUNCTIONS*/
const addWorkspace = () => {
    let [name, level, pass, passconf] = getValuesByIds(["addWorkspaceNameInput", "addWorkspaceLevelInput", "addWorkspacePassInput", "addWorkspacePassConfInput"]);
    let team = getValuesByNames(["addWorkspaceEmailInput"])
        .filter(el => {
            return validator("email", el);
        });
    if (name.length > 3 && name.length < 25) {
        if (level > 0 && level < 11) {
            if (pass.length > 5) {
                if (pass == passconf) {
                    let wdata = {
                        creatorId: data.id,
                        creatorName: data.name,
                        name: name,
                        pass: encrypt(pass, pass, level),
                        team: team[0].concat(data.email),
                        date: getDate()
                    }
                    console.log(wdata);
                    db
                        .collection("workspace")
                        .add(wdata);
                    $("#addWorkspaceModal").modal("close");
                    loadHomeData();
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

const loadHomeData = () => {
    db
        .collection("workspace")
        .get()
        .then(list => {
            let html = ``;
            list.forEach(ws => {
                html += `<div class="col s12 m4 l4">
                            <div class="card theme block link" onclick="loadPage('workspace#${ws.id}')">
                                <div class="card-title truncate flow-text">${ws.data().name}</div>
                                <div class="card-content">
                                    <div class="left-align truncate">
                                    Creator:${(ws.data().ownerId==data.id)?"You":ws.data().ownerName}
                                    <br>
                                    Date:${ws.data().date}
                                    </div>
                                </div>
                                <div class="card-action">
                                    <div class="btn-floating theme"><i class="material-icons">remove_red_eye</i></div>
                                </div>
                            </div>
                        </div>`;
            })
            document
                .getElementById("workspaceList")
                .insertAdjacentHTML("beforeend", html);
        })
}
