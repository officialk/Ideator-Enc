const data = JSON.parse(localStorage.getItem("data")) || {};
var db;
var page = JSON.parse(session("page")) || {};

/*MISC FUNCTIONS*/
const checkLogin = () => {
    return data.id != undefined
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
}

const getDate = () => {
    var today = new Date();
    var date =
        today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
    var time =
        today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    return date + " " + time;
};

const encrypt = (data, key, level) => {
    let ret = data;
    for (let i = 0; i < level; i++) {
        ret = sjcl.encrypt(key, ret);
    }
    return ret;
}

const decrypt = (data, key, level) => {
    let ret = data;
    for (let i = 0; i < level; i++) {
        ret = sjcl.decrypt(key, ret);
    }
    return ret;
}

const keyShift = (oldKey, newKey, text) => {
    return sjcl.encrypt(newKey, sjcl.decrypt(oldKey, text));
}

const loadPage = (page) => {
    let [to, id] = page.split("?");
    window.location.href = to + ".html?v=" + id;
}
/*INIT FUNCTIONS*/
const initSw = () => {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js', {
            scope: "/"
        });
    }
}

const loadUserDetails = () => {
    $("#userName").html(data.name);
    $("#userEmail").html(data.email);
    document.querySelector("#userPic").setAttribute("src", data.pic);
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

const initFirebase = () => {
    firebase.initializeApp(firebaseConfig);
    db = firebase.firestore();

}

const updateSession = () => {
    session("page", JSON.stringify(page));
}

$(document).ready(() => {
    if (checkLogin) {
        loadUserDetails();
        initMaterial();
        initFirebase();
        initSw();
    } else {
        location.href = "/";
    }
})
