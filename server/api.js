const express = require("express");
const api = express.Router();
const db = require('./db');
//const mailer = require('./mailer');
//CREATE
api.post('/add/:type', (req, res) => {
    let type = req.params.type;
    let body = req.body;
    if (type == 'workspace') {
        body.id = db.primKey();
        let team = body.team;
        delete body.team;
        db.insert('workspace', body, (e, r) => {
            addTeam(res, body.id, team, rem => {
                res.json({
                    msg: e ? "Invalid Request" : "Added Successfully",
                    insertId: e ? undefined : body.id,
                    rem: rem
                })
            })
        })
    } else if (type == 'user') {
        db.update('user', body, `email='${body.email}'`, (e, r, f) => {
            if (r.affectedRows == 0) {
                db.insert('user', body, (e, r, f) => {
                    if (e) {
                        return res.status(400).json({
                            msg: "Invalid Request"
                        });
                    }
                    return res.status(200).json({
                        msg: "Insertion Successful",
                        insertId: body.id
                    });
                })
            } else {
                if (e) {
                    return res.status(400).json({
                        msg: "Invalid Request"
                    });
                }
                return res.status(200).json({
                    msg: "Insertion Successful",
                    insertId: body.id
                });
            }
        })
    } else {
        body.id = body.id || db.primKey();
        db.insert(type, body, (e, r, f) => {
            if (e) {
                return res.status(400).json({
                    msg: "Invalid Request"
                });
            }
            return res.status(200).json({
                msg: "Insertion Successful",
                insertId: body.id
            });
        })
    }
})

//READ
api.post('/read/:type', (req, res) => {
    let type = req.params.type;
    let body = req.body;
    if (type == 'validate') {
        db.read('workspace', 'pass', `id='${body.id}'`, (e, r, f) => {
            return res.json(r[0] || {
                msg: "Invalid Request"
            })
        })
    } else if (type == 'workspace') {
        db.read('workList', '*', `uid='${body.id}'`, (e, r, f) => {
            return res.json(r || {
                msg: "Invalid Request"
            });
        })
    } else if (type == 'workUI') {
        db.read('workList', '*', `id='${body.id}'`, (e, r, f) => {
            return res.json(r[0] || {
                msg: "Invalid Request"
            });
        })
    } else if (type == 'message') {
        db.read('messageList', '*', `wid='${body.id}'`, (e, r, f) => {
            res.json(r)
        })
    } else if (type == 'project') {
        db.read('projectList', '*', `wid='${body.id}'`, (e, r, f) => {
            res.json(r)
        })
    } else if (type == 'projectUI') {
        db.read('projectList', '*', `id='${body.id}'`, (e, r, f) => {
            return res.json(r[0] || {
                msg: "Invalid Request"
            });
        })
    } else if (type == 'idea') {
        db.read('ideaList', '*', `pid='${body.id}'`, (e, r, f) => {
            res.json(r)
        })
    } else {
        return res.status(400).json({
            msg: `Bad Request of type ${type}`
        })
    }
})

//UPDATE
api.post('/update/:type', (req, res) => {
    let type = req.params.type;
    let body = req.body;
    if (type == 'workspace') {
        let team = body.team;
        let id = body.id;
        delete body.team;
        delete body.id;
        db.update(type, body, `id='${id}'`, (e, r, f) => {
            db.del('team', `workspaceId='${id}'`, (e, r, f) => {
                addTeam(res, id, team, rem => {
                    res.json({
                        msg: e ? "Invalid Request" : "Updated Successfully",
                        rem: rem
                    })
                })
            })
        })
    } else if (type == 'project') {
        let id = body.id;
        delete body.id;
        db.update(type, body, `id='${id}'`, (e, r, f) => {
            res.json({
                msg: e ? "Invalid Request" : "Updated Successfully",
            })
        })
    } else {
        return res.status(400).json({
            msg: `Bad Request of type ${type}`
        })
    }
})

//DELETE
api.post('/delete/:type', (req, res) => {
    let type = req.params.type;
    let body = req.body;
    db.del(type, `id='${body.id}'`, (e, r, f) => {
        return res.json({
            msg: e ? "Invalid Request" : "Deletion Successful"
        })
    })
})

const addTeam = (res, id, team, func) => {
    let rem = []
    let proc = 0
    team.forEach(email => {
        return db.read("user", 'id', `email='${email}'`, (e, r, f) => {
            if (r.length == 0) {
                rem.push(email)
                let ins = {
                    workspaceId: id,
                    userId: db.primKey()
                }
                let user = {
                    id: ins.userId,
                    name: email.split('@')[0],
                    email: email,
                    pic: ''
                }
                db.insert('user', user, (e, r, f) => {
                    //                        mailer.mail(email)
                    db.insert("team", ins)
                })
            } else {
                db.insert("team", {
                    workspaceId: id,
                    userId: r[0].id
                })
            }
            if (++proc == team.length) {
                func(rem)
            }
        })
    })
}

module.exports = api;
