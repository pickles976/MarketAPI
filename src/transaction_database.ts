import { Database, Statement } from "bun:sqlite";


export class TransactionHistory {

    db: Database
    insert: Statement
    select: Statement
    selectAll: Statement

    constructor(memory = false) {
        this.db = memory ? new Database(":memory:") : new Database("db.sqlite", { create: true })
        const query = this.db.query(`create table if not exists Transactions (TransactionID string PRIMARY KEY, body string);`);
        query.run()

        this.insert = this.db.prepare("INSERT INTO Transactions (TransactionID, buyer, seller, amount, price_per) VALUES ($TransactionID, $buyer, $seller, $amount, $price_per);");
        this.select = this.db.prepare("SELECT * FROM Transactions WHERE TransactionID == $TransactionID;")
        this.selectAll = this.db.query("SELECT * FROM Transactions;")
    }

    insertTransaction(transaction: any) {
        return this.insert.run(transaction.id, transaction.buyer, transaction.seller, transaction.amount, transaction.price_per)
    }

    selectTransaction(id: string): { [key: string]: string } {
        return this.select.get(id) as { [key: string]: string }
    }

    selectAllTransactions(): { [key: string]: string }[] {
        return this.selectAll.all() as { [key: string]: string }[]
    }
}