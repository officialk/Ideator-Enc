/*
    Theglobal variable for localStorage.getItem("data")
*/
const data = JSON.parse(local("data")) || {};
/*
    Page(ie.workspace) related data
*/
var page = JSON.parse(session("page")) || {};

/*MISC FUNCTIONS*/
/*
    verifies if the user is logged in to google or not
*/
const checkLogin = () => {
    return data != {} && data.id != undefined && data.name != undefined && data.email != undefined && data.pic != undefined
}
/*
    logout the user
*/
const logout = () => {
    firebase
        .auth()
        .signOut()
        .then(function () {
            local("data", "{}");
            sessionStorage.clear();
            location.href = "../";
        })
        .catch(function (error) {
            // An error happened.
        });
}
/*
    converts the DB Full DateTime Format to the Readable mm/dd/yyyy hh:mm:ss a format
    Params:
        date:[DateString]:The Date to be converted to the readable format
*/
const getDate = (date) => {
    var date = new Date(date);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
};
/*
    encrypts the data level number of times using the key
    Params:
        data:[String] :any string that is to be encrypted
        key:[String] :encryption key(password)
        level:[integer] :the number of times encryption has to occur
*/
const encrypt = (data, key, level) => {
    let ret = data;
    for (let i = 0; i < level; i++) {
        ret = sjcl.encrypt(key, ret);
    }
    return ret;
}
/*
    decrypts the data level number of times using the key
    Params:
        data:[String] :any string that is to be encrypted
        key:[String] :encryption key(password)
        level:[integer] :the number of times encryption has to occur
    Throws Error if Pass is invalid
*/
const decrypt = (data, key, level) => {
    let ret = data;
    for (let i = 0; i < level; i++) {
        ret = sjcl.decrypt(key, ret);
    }
    return ret;
}
/*
    redirects to the page
    Params:
        page:[string]:the page name followed by ? and the id of the page to be loaded
        (eg.workspace?fgex98sxyKm20vDbnACJ1hDejikDIrmD)
        (eg.index)
        (cannot be empty)
*/
const loadPage = (page) => {
    let [to, id] = page.split("?");
    window.location.href = to + ".html?v=" + (id || "");
}

/*INIT FUNCTIONS*/
/*
    initializes the service worker and the install banner
*/
const initSw = () => {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js', {
            scope: "/"
        });
    }
}
/*
    displays the user details
*/
const loadUserDetails = () => {
    $("#userName").html(data.name);
    $("#userEmail").html(data.email);
    document.querySelector("#userPic").setAttribute("src", data.pic);
}
/*
    initializes materialize and its components
*/
const initMaterial = () => {
    $('.sidenav').sidenav();
    $('.tabs').tabs();
    $('.fixed-action-btn').floatingActionButton();
    $('.tooltipped').tooltip();
    $('.modal').modal({
        dismissible: false
    });
    $('select').formSelect();
    $('.collapsible').collapsible();
    M.updateTextFields();
}
/*
    initializes Firebase and its components
*/
const initFirebase = () => {
    firebase.initializeApp(firebaseConfig);
}
/*
    updates the sessionStorage.getItem("page") to contents of page variable
*/
const updateSession = () => {
    session("page", JSON.stringify(page));
}
/*
    displays a loading screen with a message on the modal mentioned
    NOTE:This method will replace HTML of the mentioned modal with loading bar
    Params:
        id:[String :: modalId]:The modal in which you want to show the loading in
        message:[String]:The Message you want to display while loading
*/
const showLoading = (id, message) => {
    document.getElementById(id).innerHTML = ` <div class='modal-content row container'>
                                                    <br>
                                                    <br>
                                                    <div class="progress col s12 m12 l12">
                                                        <div class="indeterminate"></div>
                                                    </div> <br>
                                                    <div class="flow-text center col s12 m12 l12">${message}</div>
                                                </div>`;
}

/*Manipulation Functions*/
/*
    send a request to the api server and returns the json response
    Params:
        type:[String]:The type of request you are making to the server
            valid ones are(read,add,update,delete)
        page:[String]:the page you want to request to(workspace,project,etc(refer /server/api.js))
        data:[json]:the data to be sent to the server
*/
const send = (type, page, data) => {
    return fetch(`${location.protocol}//${location.host}/api/${type}/${page}`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(res => res.json())
}
/*
    initialize stuff and check user is valid or not on page load
*/
$(document).ready(() => {
    if (checkLogin()) {
        initFirebase();
        loadUserDetails();
        initMaterial();
        loadData();
        initSw();
    } else {
        location.href = "/";
    }
})
