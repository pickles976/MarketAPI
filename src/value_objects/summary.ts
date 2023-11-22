import { Order } from "./order"
import { Transaction } from "./transaction"

export class Summary {
    key: String
    transactions: Transaction[]
    to_update: Order[]
    created: Order

    constructor(key: string, transactions: Transaction[], to_update: Order[], created: Order) {
        this.key = key
        this.transactions = transactions
        this.to_update = to_update
        this.created = created
    }
}