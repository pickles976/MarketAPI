import { Database } from "bun:sqlite";
import { User } from "./user";


export class UserDatabase {

    constructor(memory=false){
        this.db = memory ? new Database(":memory:") : new Database("db.sqlite", {create: true})
    }

    initialize() {
        const query = this.db.query(`create table if not exists Users (UserID string PRIMARY KEY, body string);`);
        query.run()

        this.insert = this.db.prepare("INSERT INTO Users (UserID, body) VALUES ($UserID, $body);");
        this.upsert = this.db.prepare(`INSERT INTO Users (UserID, body) VALUES ($UserID, $body) 
        ON CONFLICT (UserID) DO UPDATE SET body=$body;`)
        this.select = this.db.prepare("SELECT * FROM Users WHERE UserID == $UserID;")
        this.selectAll = this.db.query("SELECT * FROM Users;")
    }

    insertUser(user) {
        // return this.insert.run(user.id, JSON.stringify(user))
        return this.upsert.run(user.id, JSON.stringify(user))
    }

    // updateUser(user) {
    //     return this.
    // }

    selectUser(id) {
        let data = this.select.get(id)
        return User.fromDict(JSON.parse(data["body"]))
    }

    selectAllUsers() {
        let data = this.selectAll.all()
        return data.map(item => User.fromDict(JSON.parse(item["body"])))
    }

    processTransactions(item, transactions) {
        transactions.forEach(transaction => {
            let buyer = this.select.get(transaction.buyer)
            buyer = User.fromDict(JSON.parse(buyer["body"]))

            let seller = this.select.get(transaction.seller)
            seller = User.fromDict(JSON.parse(seller["body"]))

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

    processUpdates(updates) {
        updates.forEach(update => {
            let data = this.select.get(update.user_id)
            let user = User.fromDict(JSON.parse(data["body"]))
            user.applyUpdate(update)
            this.upsert.run(user.id, JSON.stringify(user))
        })
    }

    

}

export class TransactionHistory {

    constructor(memory=false){
        this.db = memory ? new Database(":memory:") : new Database("db.sqlite", {create: true})
    }

    initialize() {
        const query = this.db.query(`create table if not exists Transactions (TransactionID string PRIMARY KEY, body string);`);
        query.run()

        this.insert = this.db.prepare("INSERT INTO Transactions (TransactionID, buyer, seller, amount, price_per) VALUES ($TransactionID, $buyer, $seller, $amount, $price_per);");
        this.select = this.db.prepare("SELECT * FROM Transactions WHERE TransactionID == $TransactionID;")
        this.selectAll = this.db.query("SELECT * FROM Transactions;")
    }

    insertTransaction(transaction) {
        return this.insert.run(transaction.id, transaction.buyer, transaction.seller, transaction.amount, transaction.price_per)
    }

    selectTransaction(id) {
        return this.select.run(id)
    }

    selectAllTransactions() {
        return this.selectAll.all()
    }
}