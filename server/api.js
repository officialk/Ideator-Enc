const express = require("express");
const api = express.Router();
const db = require('./db');
//CREATE
api.post('/add/:type', (req, res) => {
    let type = req.params.type;
    let body = req.body;
    if (type == 'workspace') {
        body.id = db.primKey();
        let team = body.team;
        let rem = [];
        let proc = 0;
        delete body.team;
        db.insert('workspace', body, (e, r) => {
            team.forEach(email => {
                db.read("user", 'id', `email='${email}'`, (e, r, f) => {
                    if (r.length == 0) {
                        /*SEND MAIL TO THE NEW USER*/
                        rem.push(email);
                    } else {
                        let ins = {
                            workspaceId: body.id,
                            userId: r[0].id
                        }
                        db.insert("team", ins)
                    }
                    if (++proc == team.length) {
                        return res.json({
                            msg: e ? "Invalid Request" : "Updated Successfully",
                            rem: rem
                        })
                    }
                })
            })
        })
    } else {
        body.id = db.primKey();
        db.insert(type, body, (e, r, f) => {
            if (e) {
                return res.status(400).json({
                    msg: "Invalid Request"
                });
            }
            return res.status(200).json({
                msg: "Insertion Successful"
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
        let rem = [];
        let proc = 0;
        delete body.team;
        delete body.id;
        db.update(type, body, `id='${id}'`, (e, r, f) => {
            db.del('team', `workspaceId='${id}'`, (e, r, f) => {
                team.forEach(email => {
                    db.read("user", 'id', `email='${email}'`, (e, r, f) => {
                        if (r.length == 0) {
                            /*SEND MAIL TO THE NEW USER*/
                            rem.push(email);
                        } else {
                            let ins = {
                                workspaceId: id,
                                userId: r[0].id
                            }
                            db.insert("team", ins)
                        }
                        if (++proc == team.length) {
                            return res.json({
                                msg: e ? "Invalid Request" : "Updated Successfully",
                                rem: rem
                            })
                        }
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

module.exports = api;
