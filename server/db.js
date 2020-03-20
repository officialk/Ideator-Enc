const mysql = require("mysql");
const randomstring = require("randomstring");
const dbKey = require('./keys')[0];
const tables = require('./keys')[1];

var con;

function handleDisconnect() {
    con = mysql.createConnection(dbKey);
    con.connect(function (err) {
        if (err) {
            setTimeout(handleDisconnect, 5000);
        } else {
            con.primKey = () => {
                return randomstring.generate();
            };

            con.insert = (table, values, fun) => {
                let query = `insert into ${tables[table]} set ?`;
                con.query(query, values, fun);
            }

            con.read = (table, columns, where, fun) => {
                let query = `select ${columns} from ${tables[table]} where ${where}`;
                con.query(query, fun);
            }

            con.update = (table, set, where, fun) => {
                let query = `update ${tables[table]} set ? where ${where}`;
                con.query(query, set, fun);
            }

            con.del = (table, where, fun) => {
                let query = `delete from ${tables[table]} where ${where}`;
                con.query(query, fun);
            }
        }
    });
    con.on('error', function (err) {
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            handleDisconnect();
        } else {

        }
    });

}

handleDisconnect();

module.exports = con;
