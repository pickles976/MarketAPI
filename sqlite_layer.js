import { Database } from "bun:sqlite";
import { User } from "./user";


export class UserDatabase {

    constructor(memory=false){
        this.db = memory ? new Database(":memory:") : new Database("db.sqlite", {create: true})
    }

    initialize() {
        const query = this.db.query(`create table if not exists Users (UserID string, body string);`);
        query.run()

        this.insert = this.db.prepare("INSERT INTO Users (UserID, body) VALUES ($UserID, $body);");
        this.select = this.db.prepare("SELECT * FROM Users WHERE UserID == $UserID;")
        this.selectAll = this.db.query("SELECT * FROM Users;")
    }

    insertUser(user) {
        return this.insert.run(user.id, JSON.stringify(user))
    }

    selectUser(id) {
        return this.select.run(id)
    }

    selectAllUsers() {
        return this.selectAll.all()
    }

}