const mysql = require("mysql");
const randomstring = require("randomstring");
const dbKey = require('./keys')[0];
const tables = require('./keys')[1];

var con = mysql.createPool(dbKey);

con.primKey = () => {
    return randomstring.generate();
};

con.insert = (table, values, fun) => {
    con.getConnection((e, c) => {
        let query = `insert into ${tables[table]} set ?`;
        c.query(query, values, fun);
        c.release()
    })
}

con.read = (table, columns, where, fun) => {
    con.getConnection((e, c) => {
        let query = `select ${columns} from ${tables[table]} where ${where}`;
        c.query(query, fun);
        c.release()
    })
}

con.update = (table, set, where, fun) => {
    con.getConnection((e, c) => {
        let query = `update ${tables[table]} set ? where ${where}`;
        c.query(query, set, fun);
        c.release()
    })
}

con.del = (table, where, fun) => {
    con.getConnection((e, c) => {
        let query = `delete from ${tables[table]} where ${where}`;
        c.query(query, fun);
        c.release()
    })
}

module.exports = con;
