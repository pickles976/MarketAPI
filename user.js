export class Order {

    static fromDict(data) {
        return Order(data["user_id"], data["item"], data["kind"], data["amount"], data["price_per"], data["id"])
    }

    constructor(user, item, kind, amount, price_per, id = null){
        this.id = id
        this.user_id = user.name
        this.item = item
        this.kind = kind
        this.amount = amount
        this.price_per = price_per
    }

}

export class User {

    constructor(name) {
        this.name = name
        this.id = null
        this.funds = 0
        this.portfolio = {}
        this.activeOrders = {}
        this.transactionHistory = []
    }

    addFunds(amount) {
        this.funds = amount
    }

    addItem(item, quantity) {
        if (item in this.portfolio) {
            this.portfolio[item] += quantity
        } else {
            this.portfolio[item] = quantity
        }
    }

    userCanDoOrder(order) {
        if (order.kind == "SELL") {
            return (order.item in this.portfolio && this.portfolio[order.item] >= order.amount)
        }

        if (order.kind == "BUY") {
            return (this.funds >= order.amount * order.price_per)
        }
    }




    

}