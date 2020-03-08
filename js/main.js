var db;
var currentWorkspace;
$.getScript("./js/crypto.js");
db = firebase.firestore();

/*MISC FUNCTIONS*/
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

/*SW and PWA FUNCTIONS*/
const initSw = () => {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js', {
            scope: "/"
        });
    }
}

