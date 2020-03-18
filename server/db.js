const mysql = require("mysql");
const randomstring = require("randomstring");
const dbKey = require('./keys')[0];
const tables = require('./keys')[1];

var con = mysql.createConnection(dbKey)

con.connect(e => {
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
})
module.exports = con;
