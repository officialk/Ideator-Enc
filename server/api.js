const express = require("express");
const api = express.Router();
//import the database class and functions
const db = require('./db');
//CREATE
api.post('/add/:type', (req, res) => {
    let type = req.params.type;
    let body = req.body;
    /*
        adds a workspace to the DB
        //adding members to the team
        if ! user.exists
            then create temporary user and add them to the team
        else
            add them to the team
    */
    if (type == 'workspace') {
        body.id = db.primKey();
        let team = body.team;
        delete body.team;
        db.insert('workspace', body, (e, r) => {
            addTeam(body.id, team, rem => {
                res.json({
                    msg: e ? "Invalid Request" : "Added Successfully",
                    insertId: e ? undefined : body.id,
                    rem: rem
                })
            })
        })
    }
    /*
        adds a user to the DB
        if user.email.exists //added to a team previously when user was not a part of the product
            then update details as provided
        else
            add new user
    */
    else if (type == 'user') {
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
        /*
            adds anything other than a user and workspace
            as rest all have the same simple insertion process to it
            this is generalized
        */
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
    /*
        Sends the encrypted password string of the workspace whose id is sent in the request to the user to validate entry
    */
    if (type == 'validate') {
        db.read('workspace', 'pass', `id='${body.id}'`, (e, r, f) => {
            return res.json(r[0] || {
                msg: "Invalid Request"
            })
        })
    }
    /*
        send the workspace list for the user whose id is sent in the request
    */
    else if (type == 'workspace') {
        db.read('workList', '*', `uid='${body.id}'`, (e, r, f) => {
            return res.json(r || {
                msg: "Invalid Request"
            });
        })
    }
    /*
        Sends The Workspace(singular) Data which the user is currently viewing
    */
    else if (type == 'workUI') {
        db.read('workList', '*', `id='${body.id}'`, (e, r, f) => {
            return res.json(r[0] || {
                msg: "Invalid Request"
            });
        })
    }
    /*
        Selects all messages of the mentioned workspace and sends it to the user
    */
    else if (type == 'message') {
        db.read('messageList', '*', `wid='${body.id}'`, (e, r, f) => {
            res.json(r)
        })
    }
    /*
        Sends The Project List Data of the current(requested) workspace
    */
    else if (type == 'project') {
        db.read('projectList', '*', `wid='${body.id}'`, (e, r, f) => {
            res.json(r)
        })
    }
    /*
        Sends The Project(singular) Data which the user is currently viewing
    */
    else if (type == 'projectUI') {
        db.read('projectList', '*', `id='${body.id}'`, (e, r, f) => {
            return res.json(r[0] || {
                msg: "Invalid Request"
            });
        })
    }
    /*
        Sends the Idea list of the current(requested) Project
    */
    else if (type == 'idea') {
        db.read('ideaList', '*', `pid='${body.id}'`, (e, r, f) => {
            res.json(r)
        })
    }
    /*
        Sends An error for requesting an unknown parameter
    */
    else {
        return res.status(400).json({
            msg: `Bad Request of type ${type}`
        })
    }
})

//UPDATE
api.post('/update/:type', (req, res) => {
    let type = req.params.type;
    let body = req.body;
    /*
        updates a workspace
        //updating members to the team
        if ! user.exists
            then create temporary user and add them to the team
        else
            add them to the team
    */
    if (type == 'workspace') {
        let team = body.team;
        let id = body.id;
        delete body.team;
        delete body.id;
        db.update(type, body, `id='${id}'`, (e, r, f) => {
            db.del('team', `workspaceId='${id}'`, (e, r, f) => {
                addTeam(id, team, rem => {
                    res.json({
                        msg: e ? "Invalid Request" : "Updated Successfully",
                        rem: rem
                    })
                })
            })
        })
    }
    /*
        Updates the projects name and description as per sent data
    */
    else if (type == 'project') {
        let id = body.id;
        delete body.id;
        db.update(type, body, `id='${id}'`, (e, r, f) => {
            res.json({
                msg: e ? "Invalid Request" : "Updated Successfully",
            })
        })
    }
    /*
        Sends An error for requesting an unknown parameter
    */
    else {
        return res.status(400).json({
            msg: `Bad Request of type ${type}`
        })
    }
})

//DELETE
api.post('/delete/:type', (req, res) => {
    let type = req.params.type;
    let body = req.body;
    /*
        Deletes the Workspace/Project whos id is mentioned
    */
    db.del(type, `id='${body.id}'`, (e, r, f) => {
        return res.json({
            msg: e ? "Invalid Request" : "Deletion Successful"
        })
    })
})

/*
Used to add members to the team of requested workspace
Params:
id:workspace id for which the request has been made(if new workspace then pass the primary key of the new workspace)
team:array of emails to be added
func:the function that is to be called on execution completes
    (
    parameter:
        rem:the array of new members
    )
*/
const addTeam = (id, team, func) => {
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
