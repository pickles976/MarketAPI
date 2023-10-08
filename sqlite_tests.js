import { Database } from "bun:sqlite";

// const db = new Database(":memory:");
const db = new Database("db.sqlite", {create: true})

const query = db.query(`create table if not exists Users (UserID string);`);
console.log(query.get())

const query_insert = db.query(`insert into Users values ("Hello, world");`)
console.log(query_insert.run())

const query_select = db.query(`select * from Users;`)
console.log(query_select.get())

// import { Database } from "bun:sqlite";

// const db = new Database(":memory:");
// const query = db.query("select 'Hello world' as message;");
// console.log(query.get()); // => { message: "Hello world" }
