const data = JSON.parse(localStorage.getItem("data")) || {};
const firebaseConfig = {
    apiKey: "AIzaSyDLKOTc-PKbspDjOFlpkiMDYHuN_77DJpo",
    authDomain: "ideator-c9f1d.firebaseapp.com",
    databaseURL: "https://ideator-c9f1d.firebaseio.com",
    projectId: "ideator-c9f1d",
    storageBucket: "ideator-c9f1d.appspot.com",
    messagingSenderId: "337836532873",
    appId: "1:337836532873:web:38436b11705df954df5258"
};
var db;

$(document).ready(function () {
    firebase.initializeApp(firebaseConfig);
    db = firebase.firestore();
    if (data.uid != undefined) {
        loadDisplay();
    }
});

const login = () => {
    var provider = new firebase.auth.GoogleAuthProvider();
    provider.addScope('profile');
    provider.addScope('email');
    firebase.auth().signInWithPopup(provider).then(function (result) {
        db.collection("users").doc(result.user.uid).get().then((querySnapshot) => {
            data.name = querySnapshot.data().name;
            data.email = querySnapshot.data().email;
            data.pin = querySnapshot.data().pin;
            data.uid = result.user.uid;
            localStorage.setItem("data", JSON.stringify(data));
            loadDisplay();
        });
    }).catch(function (error) {
        console.log(error);
    });
}

const loadDisplay = () => {
    initMaterial();
    document.getElementsByTagName("header")[0].classList.remove("hide");
    document.getElementsByTagName("main")[0].classList.remove("hide");
    document.getElementsByTagName("footer")[0].classList.remove("hide");
    document.getElementsByTagName("extras")[0].innerHTML = "";
    loadIdeas();
    loadMessages();
}

const initMaterial=()=>{
    $('.tabs').tabs();
    $('.fixed-action-btn').floatingActionButton();
    $('.tooltipped').tooltip();
    $('.modal').modal();
    $('select').formSelect();
}

const loadIdeas = () => {
    db
        .collection("ideas")
        .get()
        .then(ideaList => {
            ideaList.forEach(doc => {
                let idea = doc.data();
                if (idea.type == "private" && idea.creatorId == data.uid) {
                    let html = `<div class="card idea col s12 m6 l4">
                                    <div class="card-title">${idea.title}</div>
                                    <div class="card-content">
                                        ${idea.description}
                                        <!--Idea Count::${idea.count}-->
                                        <br>
                                        ${idea.date}
                                    </div>
                                    <div class="card-action">
                                        <a class="btn-floating tooltipped" data-position="top" data-tooltip="Add Idea"><i class="material-icons">add</i></a>
                                        <a class="btn-floating tooltipped" data-position="top" data-tooltip="Delete Idea"><i class="material-icons">delete</i></a>
                                        <a class="btn-floating disabled tooltipped" data-position="bottom" data-tooltip="Begin Work"><i class="material-icons">airplay</i></a>
                                    </div>
                                </div>`;
                    document.getElementById("private").insertAdjacentHTML("beforeend", html);
                }
                else{
                    let html = `<div class="card idea col s12 m6 l4">
                                    <div class="card-title">${idea.title}</div>
                                    <div class="card-content">
                                        ${idea.description}
                                        <br>
                                        ${idea.creatorName}::${idea.date}
                                        <br>
                                        <!--Idea Count::${idea.count}-->
                                    </div>
                                    <div class="card-action">
                                        <a class="btn-floating tooltipped" data-position="top" data-tooltip="Add Idea"><i class="material-icons">add</i></a>
                                        <a class="btn-floating disabled tooltipped" data-position="top" data-tooltip="Begin Work"><i class="material-icons">airplay</i></a>
                                    </div>
                                </div>`;
                    document.getElementById("public").insertAdjacentHTML("beforeend", html);
                }
            });
        })
    initMaterial();
}

const addIdea = () => {
    db.collection("ideas").add({
        creatorId: data.uid,
        creatorName:data.name,
        date: getDate(),
        description: document.getElementById("ideaDescription").value,
        title: document.getElementById("ideaTitle").value,
        type: document.getElementById("ideaType").value
    })
    $("#addIdea").modal("close");
    loadIdeas();
}

const loadMessages = () => {
    document.getElementById("messageDisplay").innerHTML = "";
    db.collection("messages")
        .onSnapshot(doc => {
            doc.forEach(mssg => {
                var mssg = mssg.data();
                let html = `<div class="row message">
                    <div class="${(mssg.sender==data.name)?"col s2 m4 l4":"hide"}"></div>
                    <div class="card col s10 m8 l8 ${(mssg.sender==data.name)?"green":"grey"}" id="message${mssg.id}">
                        <div class="white-text card-content">
                        <p><b>${(mssg.sender==data.name)?"You":mssg.sender}</b>( ${mssg.date} )
                        <!-- <span class="right">
                            <a class="btn-floating btn-flat tooltipped" data-position="bottom" data-tooltip="Add as a project"><i class="material-icons">add</i></a>
                            <a class="btn-floating btn-flat tooltipped" data-position="bottom" data-tooltip="reply"> <i class="material-icons">reply</i></a>
                        </span>--></p>
                            ${mssg.content}
                        </div>
                    </div>
                    <div class="col s2 m4 l4">
                    </div>
                </div>`;
                document.getElementById("messageDisplay").insertAdjacentHTML("afterbegin", html);
            })

        });
}

const sendMessage = () => {
    let mssg = document.getElementById("messageTextInput").value;
    db.collection("messages").add({
        sender: data.name,
        date: getDate(),
        content: mssg,
    })
}

const getDate = () => {
    var today = new Date();
    var date =
        today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
    var time =
        today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    return date + " " + time;
};

const logout = () => {
    firebase
        .auth()
        .signOut()
        .then(function () {
            localStorage.setItem("data", "{}");
            location.reload();
        })
        .catch(function (error) {
            // An error happened.
        });
};
