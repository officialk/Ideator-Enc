/*
    Loads Firebase and check if if user is already logged in if they are then log them in directly
*/
window.onload = () => {
    firebase.initializeApp(firebaseConfig);
    let data = JSON.parse(local("data")) || {};
    if (data.id != undefined) {
        window.location.href = "app/";
    }
    M.AutoInit();
};

/*
The Function is called when a new or old user wants to login/signup to the system
prameters:NaN
*/
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
            if (result.additionalUserInfo.isNewUser) {
                fetch(`${location.protocol}//${location.host}/api/add/user/`, {
                        method: 'post',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(data)
                    })
                    .then(e => {
                        local("data", JSON.stringify(data));
                        window.location.href = "app/";
                    })
            } else {
                local("data", JSON.stringify(data));
                window.location.href = "app/";
            }
        })
        .catch(function (error) {
            console.log("ERROR::", error);
        });
}
