window.onload = () => {
    firebase.initializeApp(firebaseConfig);
    let data = JSON.parse(local("data")) || {};
    if (data.id != undefined) {
        window.location.href = "app/home.html";
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
            console.log(result);
            if (result.additionalUserInfo.isNewUser) {
                fetch(`${location.protocol}//${location.host}/api/user/`, {
                        method: 'post',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(data)
                    })
                    .then(e => {
                        console.log(e);
                        local("data", JSON.stringify(data));
                        window.location.href = "app/home.html";
                    })
                    .catch(e => {
                        console.log(e);
                    })
            } else {
                local("data", JSON.stringify(data));
                window.location.href = "app/home.html";
            }
        })
        .catch(function (error) {
            console.log("ERROR::", error);
        });
}
