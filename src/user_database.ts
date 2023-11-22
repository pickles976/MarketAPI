import { Database, Statement } from "bun:sqlite";
import { User } from "./value_objects/user";
import { Transaction } from "./value_objects/transaction";
import { RustDict } from "./custom_types";
import { Order } from "./value_objects/order";

export abstract class AbstractUserDatabase {

    debug(): void {
        console.log("Testing...");
    }

    abstract insertUser(user: User): void;

    abstract selectUser(id: string): User;

    abstract selectAllUsers(): User[];

    abstract processTransactions(item: string, transactions: Transaction[]): void;

    abstract processUpdates(updates: Order[]): void;
}

export class UserDatabase extends AbstractUserDatabase {
    /**
     * A simple wrapper around a sqlite database.
     * @param {boolean} memory If sqlite database should live in memory or not
     */

    db: Database
    insert: Statement
    upsert: Statement
    select: Statement
    selectAll: Statement

    constructor(memory = false) {
        super()

        this.db = memory ? new Database(":memory:") : new Database("db.sqlite", { create: true })

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

    selectUser(id: string): User {
        let data = this.select.get(id) as RustDict
        return User.fromDict(JSON.parse(data["body"]))
    }

    selectAllUsers(): User[] {
        let data = this.selectAll.all() as RustDict[]
        return data.map(item => User.fromDict(JSON.parse(item["body"])))
    }

    processTransactions(item: string, transactions: Transaction[]) {
        transactions.forEach(transaction => {
            const buyer_dict = this.select.get(transaction.buyer) as RustDict
            let buyer = User.fromDict(JSON.parse(buyer_dict["body"]))

            const seller_dict = this.select.get(transaction.seller) as RustDict
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

    processUpdates(updates: Order[]) {
        updates.forEach(update => {
            let data = this.select.get(update.user_id) as RustDict
            let user = User.fromDict(JSON.parse(data["body"]))
            user.applyOrderUpdate(update)
            this.upsert.run(user.id, JSON.stringify(user))
        })
    }

}
