import { Order } from "./value_objects/order"
import { OrderRequest } from "./value_objects/order_request"
import { Summary } from "./value_objects/summary"
import { User } from "./value_objects/user"

export class TradingAPI {

    db : any
    market: any

    // TODO: abstract base class for database and market
    constructor(database: any, market: any) {
        this.db = database
        this.market = market
        // this.transactions = transactions
    }

    createUser(username: string, id=null): User | null {
        try {
            const newUser = new User(username, id)
            this.db.insertUser(newUser)
            return newUser
        } catch (error) {
            console.error(`Failed to create user ${username} with error: ${error}`)
            return null
        }
    }

    addItem(userID: string, item: string, quantity: number) {
        try {
            const user = this.db.selectUser(userID)
            user.addItem(item, quantity)
            this.db.insertUser(user)
        } catch (error) {
            console.error(`Failed to give item to user with error: ${error}`)
        }
    }

    addFunds(userID: string, quantity: number) {
        try {
            const user = this.db.selectUser(userID)
            user.addFunds(quantity)
            this.db.insertUser(user)
        } catch (error) {
            console.error(`Failed to give funds to user with error: ${error}`)
        }
    }

    placeOrder(userID: string, kind: string, item: string, amount: number, price_per: number) {
        const user = this.db.selectUser(userID)
        const order = new OrderRequest(user.id, item, kind, amount, price_per)

        if (user.userCanDoOrder(order)) {
            let summary = null

            switch(kind) {
                case "SELL":
                    summary = this.market.sell(JSON.stringify(order))
                    break;
                case "BUY":
                    summary = this.market.buy(JSON.stringify(order))
                    break;
                default:
                    throw new Error("Order type not recognized")
            }

            this._processOrderSummary(user, item, summary)
        }
    }

    _processOrderSummary(user: User, item: string, _summary: string) : void {
        const summary = JSON.parse(_summary) as Summary
                
        // Update user with created order
        if (summary.created !== null){
            let created = summary.created
            created.item = item
            user.activeOrders[created.id] = created

            // credit user
            if (created.kind === "BUY") {
                user.removeFunds(created.amount * created.price_per)
            } else {
                user.removeItem(created.item, created.amount)
            }
    
            this.db.insertUser(user)
        }

        // Update transactions
        this.db.processTransactions(item, summary.transactions)

        // Update active orders
        this.db.processUpdates(summary.to_update)
    }

    showAllUsers() : string {
        return this.db.selectAllUsers()
    }

    getUser(id: string) : string {
        return this.db.selectUser(id)
    }

    queryLedger(item: string) : string {
        return this.market.query_ledger(item)
    }

    cancelOrder(order: Order) {
        let item = order.item
        //@ts-ignore
        delete order["item"]
        let response = JSON.parse(this.market.cancel_order(item, JSON.stringify(order)))
        if (response['status'] === "SUCCESS") {
            // Refund user
            let user = this.db.selectUser(order.user_id)
            user.addFunds(order.price_per * order.amount)
            this.db.insertUser(user)

            // Remove order from user account
            order.amount = 0 // Setting order amount to zero will remove it from the player's active orders
            this.db.processUpdates([order])
        } else {
            console.error(response)
        }
    }

    getAsk(item: string) {
        return this.market.get_best_selling_price(item)
    }

    getBid(item: string) {
        return this.market.get_best_buying_price(item)
    }


}