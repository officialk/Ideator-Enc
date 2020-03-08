var currentWorkspace;
const loginToWorkspace = () => {
    let pass = document.getElementById("workspaceLoginPassInput").value;
    let level = document.getElementById("workspaceLoginLevelInput").value;
    db
        .collection("workspace")
        .doc(currentWorkspace)
        .get()
        .then(wk => {
            try {
                let conf = decrypt(wk.data().pass, pass, level);
                if (conf == pass) {
                    session("page", JSON.stringify({
                        id: currentWorkspace,
                        pass: pass,
                        level: level,
                        page: 'workspace'
                    }))
                    loadWorkspaceData();
                } else {
                    throw new Error("Invalid Credentials");
                }
            } catch (e) {
                alert("Invalid Credentials");
            }
        })
}
const loadWorkspaceData = () => {
    loadMessages(currentWorkspace);
    loadProjects(currentWorkspace);
    initMaterial();
    $("#workspaceLoginModal").modal("close");
}
const loadMessages = () => {

}
const loadProjects = () => {

}
