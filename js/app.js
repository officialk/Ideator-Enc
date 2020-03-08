const data = JSON.parse(localStorage.getItem("data")) || {};

var imported = false;

$(document).ready(function () {
    firebase.initializeApp(firebaseConfig);
    if (data.id != undefined) {
        let pageData = JSON.parse(session("page"));
        loadPage((pageData.page + '#' + pageData.id) || 'workspace');
    } else {
        loadPage('app');
    }
    initMaterial();
});

/*UI AND OTHER STUFF RELATED FUNCTIONS*/
const join = () => {
    var provider = new firebase.auth.GoogleAuthProvider();
    firebase
        .auth()
        .signInWithPopup(provider)
        .then(result => {
            let user = result.user;

            data.email = user.email;
            data.name = user.displayName;
            data.id = user.uid;
            data.pic = user.photoURL;
            localStorage.setItem("data", JSON.stringify(data));
            loadPage('home');
            //            if (!result.additionalUserInfo.isNewUser) {
            //
            //            }
        })
        .catch(function (error) {
            console.log("ERROR::", error);
        });
}

const logout = () => {
    firebase
        .auth()
        .signOut()
        .then(function () {
            local("data", "{}");
            session("page", null);
            location.reload();
        })
        .catch(function (error) {
            // An error happened.
        });
};

const loadPage = (page) => {
    var [page, id] = page.split("#");
    if (!imported && page != 'app') {
        $.getScript("js/main.js", x => {
            initSw();
            loadUserDetails();
            imported = true;
        })
    }
    fetch(`./pages/${page}.html`)
        .then(res => {
            res
                .text()
                .then(html => {
                    var pageSession;
                    if (page != "app") {
                        document.getElementById("appNavbar").classList.remove('hide');
                        try {
                            pageSession = JSON.parse(session("page")) || {};
                        } catch (e) {}
                    }
                    document.getElementsByTagName("main")[0].innerHTML = html;
                    if (page == "home") {
                        $.getScript("./js/home.js", () => {
                            session("page", null);
                            createDynamicElement('addWorkspaceTeamList');
                            loadHomeData();
                        })
                    } else if (page == "workspace") {
                        currentWorkspace = id;
                        $.getScript("./js/workspace.js", () => {
                            if (pageSession.page == page && pageSession.id == id) {
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
                        })
                    }
                    initMaterial();
                })
        })
}

const initMaterial = () => {
    M.AutoInit();
    $('.sidenav').sidenav();
    $('.tabs').tabs();
    $('.fixed-action-btn').floatingActionButton();
    $('.tooltipped').tooltip();
    $('.modal').modal();
    $('select').formSelect();
}

const loadUserDetails = () => {
    $("#userName").html(data.name);
    $("#userEmail").html(data.email);
    document.querySelector("#userPic").setAttribute("src", data.pic);
}
