// import { Database } from "bun:sqlite";
// import { User } from "./user";

// const db = new Database(":memory:");
// // const db = new Database("db.sqlite", {create: true})

// const query = db.query(`create table if not exists Users (UserID string, body string);`);
// console.log(query.get())

// let alice = new User("ALICE")
// alice.id = "1234"

// let bob = new User("Bob")
// bob.id = "4321"

// let query_insert = db.query(`insert into Users (UserID, body) values ( ${alice.id}, '${JSON.stringify(alice)}' );`)
// console.log(query_insert.run())

// let insert = db.query(`insert into Users (UserID, body) values ( ${bob.id}, '${JSON.stringify(bob)}' );`)
// console.log(insert.run())

// const query_select = db.query(`select * from Users;`)
// let output = query_select.all()

// console.log(output)

import { User } from "./user";
import { UserDatabase } from "./sqlite_layer"

let alice = new User("ALICE")
alice.id = "1234"

let bob = new User("Bob")
bob.id = "4321"

let database = new UserDatabase(true)
database.initialize()

database.insertUser(alice)
database.insertUser(bob)

console.log(database.selectAllUsers())