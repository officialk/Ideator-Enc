/*
adds a workspace to the database
Data is gathered from the UI adn send it to the server
Params:NaN
Data = workspace{
    name,
    password,
    encryption level,
    team
}
*/
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
                    let modal = document.getElementById('addWorkspaceModal');
                    let html = modal.innerHTML;
                    showLoading('addWorkspaceModal', 'Adding A New Workspace For You');
                    let wdata = {
                        creatorId: data.id,
                        name: name,
                        pass: encrypt(pass, pass, level),
                        team: team
                    }
                    send('add', 'workspace', wdata)
                        .then(e => {
                            showLoading('addWorkspaceModal', 'Workspace Added');
                            $('#addWorkspaceModal').modal('close');
                            loadData();
                            modal.innerHTML = html;
                        })
                        .catch(e => {
                            console.log(e);
                            showLoading('addWorkspaceModal', 'ERROR');
                            alert("Some Error Occured While Trying To Add Your Workspace\nPlease Try Again!")
                            $('#addWorkspaceModal').modal('close');
                            modal.innerHTML = html;
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
/*
Requests the server for workspace list whose teams the user is
and displays it
*/
const loadData = () => {
    sessionStorage.clear();
    try {
        createDynamicElement('addWorkspaceTeamList');
    } catch (e) {}
    send('read', 'workspace', {
            id: data.id
        })
        .then(list => {
            let teamHtml = '';
            let html = ``;
            list.forEach(work => {
                let teamHtml = '';
                work.team.split(',').forEach(member => {
                    teamHtml += `
                            <div class='btn-floating btn-small theme tooltipped' data-position="top" data-tooltip="${member}">
                                ${member[0].toUpperCase()}
                            </div>`
                })
                html += `<div class="col s12 m6 l4">
                                <div class="card block link hoverable rounded" onclick="loadPage('workspace?${work.id}')" id="workspace${work.id}">
                                    <div class="card-title truncate flow-text">${work.name}</div>
                                    <div class="card-content truncate">
                                        <div class=" wrap left-align container">
                                            Creator : ${(work.creatorId==data.id)?"You":work.creatorName}
                                            <br>
                                            Date : ${getDate(work.date)}
                                        </div>
                                    </div>
                                    <div class="card-footer">
                                        ${teamHtml}
                                    </div>
                                </div>
                            </div>`;
            })
            document
                .getElementById("workspaceList")
                .innerHTML = html;
            $('.tooltipped').tooltip();
        })
}
