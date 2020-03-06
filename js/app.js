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
var curProject, curProjectType;
$(document).ready(function () {
    firebase.initializeApp(firebaseConfig);
    db = firebase.firestore();
    if (data.uid != undefined) {
        loadDisplay();
    }
    initSw();
});

/*SW and PWA related Functions*/
const initSw = () => {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js', {
            scope: "/"
        });
    }
}

/*UI AND OTHER STUFF RELATED FUNCTIONS*/
const login = () => {
    var provider = new firebase.auth.GoogleAuthProvider();
    provider.addScope('profile');
    provider.addScope('email');
    firebase.auth().signInWithPopup(provider).then(function (result) {
        db.collection("users").doc(result.user.uid).get().then((querySnapshot) => {
            let pin = prompt("Enter PIN");
            try {

                if (sjcl.decrypt(pin, querySnapshot.data().pin) == pin) {
                    data.name = querySnapshot.data().name;
                    data.email = querySnapshot.data().email;
                    data.uid = result.user.uid;
                    data.pin = pin;
                    localStorage.setItem("data", JSON.stringify(data));
                    loadDisplay();
                } else {
                    alert("Pin Wrong Please Try Again");
                    window.location.reload();
                }
            } catch (e) {
                alert("Pin Wrong Please Try Again");
                window.location.reload();
            }
        });
    }).catch(function (error) {
        console.log(error);
    });
}

const signup = () => {
    var provider = new firebase.auth.GoogleAuthProvider();
    provider.addScope('profile');
    provider.addScope('email');
    firebase.auth().signInWithPopup(provider).then(function (result) {
        let pin = prompt("ENTER Password/PIN");
        db.collection("users").doc(result.user.uid).set({
            name: result.user.displayName,
            email: result.user.email,
            pin: sjcl.encrypt(pin, pin)
        });
        data.name = result.user.displayName;
        data.email = result.user.email;
        data.uid = result.user.uid;
        data.pin = pin;
        localStorage.setItem("data", JSON.stringify(data));
        loadDisplay();
    }).catch(function (error) {
        console.log(error);
    });
}

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

const loadDisplay = () => {
    initMaterial();
    document.getElementsByTagName("header")[0].classList.remove("hide");
    document.getElementsByTagName("main")[0].classList.remove("hide");
    document.getElementsByTagName("footer")[0].classList.remove("hide");
    document.getElementsByTagName("extras")[0].innerHTML = "";
    loadProjectList();
    loadMessages();
}

const initMaterial = () => {
    $('.tabs').tabs();
    $('.fixed-action-btn').floatingActionButton();
    $('.tooltipped').tooltip();
    $('.modal').modal();
    $('select').formSelect();
}

const getDate = () => {
    var today = new Date();
    var date =
        today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
    var time =
        today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    return date + " " + time;
};

const keyShift = (oldKey, newKey, text) => {
    return sjcl.encrypt(newKey, sjcl.decrypt(oldKey, text));
}

/*USER AND SETTING RELATED FUNCTIONS*/
/*const updatePassword = () => {
    let newPass = document.getElementById("newPasswordInput").value;
    let newName = document.getElementById("newNameInput").value;
    if (newName.length == 0) {
        newName = data.name;
    }
    if (newPass.length > 5) {
        db
            .collection("projects")
            .where("creatorId", "==", data.uid)
            .get()
            .then(docs => {
                let size = docs.size;
                docs.forEach(doc => {
                    docCopy = doc.data();
                    let req = db.collection("projects").doc(doc.id);
                    db.runTransaction(transaction => {
                        return transaction.get(req).then(ans => {
                            let oldKey = data.uid + data.name + ans.data().date;
                            let newKey = data.uid + newName + ans.data().date;
                            if (docCopy.type == "private") {
                                oldKey = data.pin + data.name + data.uid + ans.data().date;
                                newKey = newPass + newName + data.uid + ans.data().date;
                            }
                            transaction.update(req, {
                                creatorName: newName,
                                title: keyShift(oldKey, newKey, ans.data().title),
                                description: keyShift(oldKey, newKey, ans.data().description)
                            })
                        })
                    })
                })
            })
        db.collection("users").doc(data.uid).set({
            name: newName,
            email: data.email,
            pin: sjcl.encrypt(newPass, newPass)
        })
        data.pin = newPass;
        data.name = newName;
        localStorage.setItem("data", JSON.stringify(data));
        $("#settings").modal("close");

    } else {
        alert("Password should be atleast 5 chars long(enter current password if you dont want to change it)");
    }
}*/

/*MESSAGES RELATED FUNCTIONS*/
const loadMessages = () => {
    document.getElementById("messageDisplay").innerHTML = "";
    db.collection("messages")
        .onSnapshot(doc => {
            document.getElementById("messageDisplay").innerHTML = "<b><center>**END OF MESSAGES**</center></b>";
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
                            ${sjcl.decrypt(mssg.date+data.name,mssg.content)}
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
    let date = getDate();
    if (mssg.length > 0) {
        db.collection("messages").add({
            sender: data.name,
            date: date,
            content: sjcl.encrypt(date + data.name, mssg)
        });
    }
}

/*PROJECT RELATED FUNCTIONS*/
const loadProjectList = () => {
    document.getElementById("public").innerHTML = "<h3><center>No Public Projects Available hover over bottom right button and + button to add a project</center></h3>";
    document.getElementById("private").innerHTML = "<h3><center>No Private Projects Available hover over bottom right button and + button to add a project</center></h3>";
    db
        .collection("projects")
        .get()
        .then(ideaList => {
            let privhtml = "",
                pubhtml = "";
            ideaList.forEach(doc => {
                let idea = doc.data();
                if (idea.type == "private" && idea.creatorId == data.uid) {
                    privhtml += `<div class="card idea col s12 m6 l4">
                                    <div class="card-title">${sjcl.decrypt(data.pin+data.name+data.uid+idea.date,idea.title)}</div>
                                    <div class="card-content">
                                        ${sjcl.decrypt(data.pin+data.name+data.uid+idea.date,idea.description)}
                                        <!--Idea Count::${idea.count}-->
                                        <br>
                                        ${idea.date}
                                    </div>
                                    <div class="card-action">
                                        <a class="btn-floating tooltipped" data-position="top" data-tooltip="View Idea List" onclick="curProject='${doc.id}';viewIdeaList('${doc.id}')"><i class="material-icons">remove_red_eye</i></a>
                                        <a class="btn-floating tooltipped" data-position="top" data-tooltip="Add Idea" onclick="curProject='${doc.id}';curProjectType='private';$('#addIdeaModal').modal('open');"><i class="material-icons">add</i></a>
                                        <a class="btn-floating tooltipped" data-position="top" data-tooltip="Delete Project" onclick="deleteProject('${doc.id}')"><i class="material-icons">delete</i></a>
                                        <a class="btn-floating tooltipped" data-position="top" data-tooltip="Convert To Public Project" onclick="convProject('${doc.id}','public')"><i class="material-icons">refresh</i></a>
                                    </div>
                                </div>`;
                } else {
                    pubhtml += `<div class="card idea col s12 m6 l4">
                                    <div class="card-title">${sjcl.decrypt(idea.creatorId+idea.creatorName+idea.date,idea.title)}</div>
                                    <div class="card-content">
                                        ${sjcl.decrypt(idea.creatorId+idea.creatorName+idea.date,idea.description)}
                                        <br>
                                        ${idea.creatorName}::${idea.date}
                                        <br>
                                        <!--Idea Count::${idea.count}-->
                                    </div>
                                    <div class="card-action">
                                        <a class="btn-floating tooltipped" data-position="top" data-tooltip="View Idea List" onclick="curProject='${doc.id}';viewIdeaList('${doc.id}')"><i class="material-icons">remove_red_eye</i></a>
                                        <a class="btn-floating tooltipped" data-position="top" data-tooltip="Add Idea" onclick="curProject='${doc.id}';curProjectType='public';$('#addIdeaModal').modal('open');"><i class="material-icons">add</i></a>`;
                    if (idea.creatorId == data.uid) {
                        pubhtml += `
                                    <a class="btn-floating tooltipped" data-position="top" data-tooltip="Delete Idea" onclick="deleteProject('${doc.id}')"><i class="material-icons">delete</i></a>
                                    <a class="btn-floating tooltipped" data-position="top" data-tooltip="revert To Private Project" onclick="convProject('${doc.id}','private')"><i class="material-icons">refresh</i></a>`;
                    }
                    pubhtml += `</div></div>`;
                }
            });
            if (privhtml != "") {
                document.getElementById("private").innerHTML = privhtml;
            }
            if (pubhtml != "") {
                document.getElementById("public").innerHTML = pubhtml;
            }
            initMaterial();
        })
}

const convProject = (id, type) => {
    let req = db.collection("projects").doc(id);
    db.runTransaction(transaction => {
        return transaction.get(req).then(ans => {
            let oldKey = data.pin + data.name + data.uid + ans.data().date;
            let newKey = data.uid + data.name + ans.data().date;
            if (type == "private") {
                let temp = oldKey;
                oldKey = newKey;
                newKey = temp;
            }
            transaction.update(req, {
                type: type,
                title: keyShift(oldKey, newKey, ans.data().title),
                description: keyShift(oldKey, newKey, ans.data().description)
            })
        })
    }).then(x => {
        alert("updated Project type");
        loadProjectList();
    })
}

const deleteProject = id => {
    if (confirm("DO YOU REALY WANT TO DELETE THE PROJECT AS IT IS A IRREVERSIBLE PROCESS")) {
        //        db
        //            .collection("projects")
        //            .doc(id)
        //            .collection("ideas")
        //            .delete()
        //            .then(e => {
        db
            .collection("projects")
            .doc(id)
            .delete()
            .then(e => {
                alert("Project Deleted");
                loadProjectList();
            })
        //            })
        //    }
    }
}

const addProject = () => {
    let desc = document.getElementById("projectDescription").value;
    let title = document.getElementById("projectTitle").value;
    let type = document.getElementById("projectType").value || "private";
    let date = getDate();
    let key = data.uid + data.name + date;
    if (title.length > 5) {
        if (desc.length > 15) {
            if (type == "private") {
                key = data.pin + data.name + data.uid + date;
            }
            db.collection("projects").add({
                creatorId: data.uid,
                creatorName: data.name,
                date: date,
                description: sjcl.encrypt(key, desc),
                title: sjcl.encrypt(key, title),
                type: type
            })
            $("#addProject").modal("close");
            loadProjectList();
        } else {
            alert("Description Too Short!(atleast 15 chars)");
        }
    } else {
        alert("Title Too Short!(atleast 5 chars)");
    }
}

/*IDEA RELATED FUNCTIONS*/
const addIdea = () => {
    let id = curProject;
    let title = document.getElementById("ideaTitle").value;
    let description = document.getElementById("ideaDescription").value;
    let date = getDate();
    let key = data.uid + data.name + date;
    if (title.length > 5) {
        if (desc.length > 15) {
            if (curProjectType == "private") {
                key = data.uid + data.name + data.pin + date;
            }
            db.collection(`projects/${curProject}/ideas`).add({
                title: sjcl.encrypt(key, title),
                description: sjcl.encrypt(key, description),
                creatorId: data.uid,
                creatorName: data.name,
                date: date,
                type: curProjectType
            });
            $("#addIdeaModal").modal("close");
        } else {
            alert("Description Too Short!(atleast 15 chars)");
        }
    } else {
        alert("Title Too Short!(atleast 5 chars)");
    }
}

const deleteIdea = id => {
    console.log(id);
    if (confirm("DO YOU REALY WANT TO DELETE THE IDEA AS IT IS A IRREVERSIBLE PROCESS")) {
        db
            .collection("projects")
            .doc(`${curProject}`)
            .collection("ideas")
            .doc(id)
            .delete()
            .then(e => {
                alert("Idea Deleted");
                viewIdeaList();
            })
    }
}

const viewIdeaList = id => {
    console.log(id);
    $("#ideaListModal").modal("open");
    db.collection(`projects/${id}/ideas`)
        .get()
        .then(ideas => {
            //            console.log(ideas.docs());
            let html = ``;
            ideas.forEach(ideaDoc => {
                console.log(ideaDoc.id);
                idea = ideaDoc.data();
                let key = idea.creatorId + idea.creatorName + idea.date;
                if (idea.type == "private") {
                    key = data.uid + data.name + data.pin + idea.date;
                }
                html += `<li>
                            <div class="collapsible-header"><i class="material-icons">lightbulb_outline</i>${sjcl.decrypt(key,idea.title)}</div>
                            <div class="collapsible-body">
                                <span>${sjcl.decrypt(key,idea.description)}</span>
                                <p><span>Suggestor::${(idea.creatorName==data.name)?"You":idea.creatorName}</span><br><span>date::${idea.date}</span></p>`;
                if (data.uid == idea.creatorId) {
                    html += `<p><div class="btn-floating" onclick="deleteIdea('${ideaDoc.id}')"><i class="material-icons">delete</i></div></p>`
                }
                html += `</div></li>`;
            })
            if (html != "") {
                document.getElementById("ideaListDisplay").innerHTML = html;
                $('.collapsible').collapsible();
            }
        })

}
