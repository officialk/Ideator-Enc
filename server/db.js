const mysql = require("mysql");
const randomstring = require("randomstring");
//importing the db connection key from keys.js
const dbKey = require('./keys')[0];
//importing the tables key from keys.js
const tables = require('./keys')[1];

//creating a connection
var con = mysql.createPool(dbKey);

/*
Returns a random String which can be used as the Primary key
Params:Nan
eg.let primaryKey = db.primKey(); // 6uMSjJNgaQiqtIcPTGOrIKtZnmHOEULv
*/
con.primKey = () => {
    return randomstring.generate();
};
/*
Inserts Data into the connected database and the releases the connection
Params:
table:[String]The name of the table(the key of the tables in key.js(maps to the table requested as per the request(key) requested))
values:[json]data with keys as column names(of DB table) and values as strings to insert
fun:the function to run after the query is executed
    takes 3 parameters
    (Error:[json]contains the json data about the error
    ,Result:[json]contains the json data about the Result
    ,Fields:[json]contains the json data about the fields
    )
*/
con.insert = (table, values, fun) => {
    con.getConnection((e, c) => {
        let query = `insert into ${tables[table]} set ?`;
        c.query(query, values, fun);
        c.release()
    })
}
/*
Reads Data from the connected database and the releases the connection
Params:
table:[String]The name of the table(the key of the tables in key.js(maps to the table requested as per the request(key) requested))
columns:[String]the columns list seperated by, that you want to fetch
where:[String]where clause for the query(defaults to 1)
fun:the function to run after the query is executed
    takes 3 parameters
    (Error:[json]contains the json data about the error
    ,Result:[json]contains the json data about the Result
    ,Fields:[json]contains the json data about the fields
    )
*/
con.read = (table, columns, where, fun) => {
    con.getConnection((e, c) => {
        let query = `select ${columns} from ${tables[table]} where ${where||1}`;
        c.query(query, fun);
        c.release()
    })
}
/*
Updates Data of the connected database and the releases the connection
Params:
table:[String]The name of the table(the key of the tables in key.js(maps to the table requested as per the request(key) requested))
set:[json]data with keys as column names(of DB table) and values as strings to update
where:[String]where clause for the query(defaults to 1)
fun:the function to run after the query is executed
    takes 3 parameters
    (Error:[json]contains the json data about the error
    ,Result:[json]contains the json data about the Result
    ,Fields:[json]contains the json data about the fields
    )
*/
con.update = (table, set, where, fun) => {
    con.getConnection((e, c) => {
        let query = `update ${tables[table]} set ? where ${where||1}`;
        c.query(query, set, fun);
        c.release()
    })
}
/*
Deletes Data of the connected database and the releases the connection
Params:
table:[String]The name of the table(the key of the tables in key.js(maps to the table requested as per the request(key) requested))
where:[String]where clause for the query(defaults to 1)
fun:the function to run after the query is executed
    takes 3 parameters
    (Error:[json]contains the json data about the error
    ,Result:[json]contains the json data about the Result
    ,Fields:[json]contains the json data about the fields
    )
*/
con.del = (table, where, fun) => {
    con.getConnection((e, c) => {
        let query = `delete from ${tables[table]} where ${where||1}`;
        c.query(query, fun);
        c.release()
    })
}

module.exports = con;
