import { Order, User } from "./user"

export class TradingAPI {

    constructor(database, market) {
        this.db = database
        this.market = market
        // this.transactions = transactions
    }

    createUser(username, id=null) {
        try {
            const newUser = new User(username, id)
            this.db.insertUser(newUser)
            return newUser
        } catch (error) {
            console.error(`Failed to create user ${username} with error: ${error}`)
            return null
        }
    }

    addItem(userID, item, quantity) {
        try {
            const user = this.db.selectUser(userID)
            user.addItem(item, quantity)
            this.db.insertUser(user)
        } catch (error) {
            console.error(`Failed to give item to user with error: ${error}`)
        }
    }

    addFunds(userID, quantity) {
        try {
            const user = this.db.selectUser(userID)
            user.addFunds(quantity)
            this.db.insertUser(user)
        } catch (error) {
            console.error(`Failed to give funds to user with error: ${error}`)
        }
    }

    order(userID, kind, item, amount, price_per) {
        const user = this.db.selectUser(userID)
        const order = new Order(user.id, item, kind, amount, price_per, user.id)

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

    _processOrderSummary(user, item, summary) {
        summary = JSON.parse(summary)
                
        // Update user with created order
        if (summary.created !== null){
            let created = Order.fromDict(summary.created)
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

    showAllUsers() {
        return this.db.selectAllUsers()
    }

    getUser(id) {
        return this.db.selectUser(id)
    }

    queryLedger(item) {
        return this.market.query_ledger(item)
    }

    cancelOrder(order) {
        let item = order.item
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

    getAsk(item) {
        return this.market.get_best_selling_price(item)
    }

    getBid(item) {
        return this.market.get_best_buying_price(item)
    }


}