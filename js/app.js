window.onload = () => {
    firebase.initializeApp(firebaseConfig);
    let data = JSON.parse(local("data")) || {};
    if (data.id != undefined) {
        window.location.href = "pages/home.html";
    }
    M.AutoInit();
};

/*UI AND OTHER STUFF RELATED FUNCTIONS*/
const join = () => {
    var provider = new firebase.auth.GoogleAuthProvider();
    firebase
        .auth()
        .signInWithPopup(provider)
        .then(result => {
            let user = result.user;
            var data = {};
            data.email = user.email;
            data.name = user.displayName;
            data.id = user.uid;
            data.pic = user.photoURL;
            local("data", JSON.stringify(data));
            window.location.href = "pages/home.html";
        })
        .catch(function (error) {
            console.log("ERROR::", error);
        });
}
