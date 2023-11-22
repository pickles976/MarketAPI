import { Database, Statement } from "bun:sqlite";
import { User } from "./value_objects/user";
import { Transaction } from "./value_objects/transaction";

export class UserDatabase {
    /**
     * A simple wrapper around a sqlite database.
     * @param {boolean} memory If sqlite database should live in memory or not
     */

    db : Database
    insert : Statement
    upsert: Statement
    select: Statement
    selectAll: Statement

    constructor(memory=false){
        this.db = memory ? new Database(":memory:") : new Database("db.sqlite", {create: true})

        const query = this.db.query(`create table if not exists Users (UserID string PRIMARY KEY, body string);`);
        query.run()

        this.insert = this.db.prepare("INSERT INTO Users (UserID, body) VALUES ($UserID, $body);");
        this.upsert = this.db.prepare(`INSERT INTO Users (UserID, body) VALUES ($UserID, $body) ON CONFLICT (UserID) DO UPDATE SET body=$body;`)
        this.select = this.db.prepare("SELECT * FROM Users WHERE UserID == $UserID;")
        this.selectAll = this.db.query("SELECT * FROM Users;")
    }

    insertUser(user: User) {
        return this.upsert.run(user.id, JSON.stringify(user))
    }

    // updateUser(user) {
    //     return this.
    // }

    selectUser(id: string) {
        let data = this.select.get(id) as {[key: string]: string}
        return User.fromDict(JSON.parse(data["body"]))
    }

    selectAllUsers() {
        let data = this.selectAll.all() as {[key: string]: string}[]
        return data.map(item => User.fromDict(JSON.parse(item["body"])))
    }

    processTransactions(item: string, transactions: Transaction[]) {
        transactions.forEach(transaction => {
            const buyer_dict = this.select.get(transaction.buyer) as {[key: string]: string}
            let buyer = User.fromDict(JSON.parse(buyer_dict["body"]))

            const seller_dict = this.select.get(transaction.seller) as {[key: string]: string}
            let seller = User.fromDict(JSON.parse(seller_dict["body"]))

            // Seller remove item, add funds
            seller.removeItem(item, transaction.amount)
            seller.addFunds(transaction.amount * transaction.price_per)

            // Buyer remove funds, add item
            buyer.addItem(item, transaction.amount)
            buyer.removeFunds(transaction.amount * transaction.price_per)

            // Update database
            this.upsert.run(seller.id, JSON.stringify(seller))
            this.upsert.run(buyer.id, JSON.stringify(buyer))
        })
    }

    processUpdates(updates: any[]) {
        updates.forEach(update => {
            let data = this.select.get(update.user_id) as {[key: string]: string}
            let user = User.fromDict(JSON.parse(data["body"]))
            user.applyOrderUpdate(update)
            this.upsert.run(user.id, JSON.stringify(user))
        })
    }

}
