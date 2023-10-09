import { v4 as uuidv4 } from 'uuid';

export class Order {

    static fromDict(data) {
        return new Order(data["user_id"], data["item"], data["kind"], data["amount"], data["price_per"], data["id"])
    }

    constructor(user_id, item, kind, amount, price_per, id = null){
        this.id = id
        this.user_id = user_id
        this.item = item
        this.kind = kind
        this.amount = amount
        this.price_per = price_per
    }

}

export class User {

    constructor(name, id=null) {
        this.name = name
        this.id = id === null ? uuidv4() : id
        this.funds = 0
        this.portfolio = {}
        this.activeOrders = {}
    }

    static fromDict(data) {
        let user = new User(data["name"], data["id"])
        user.funds = data["funds"]
        user.portfolio = data["portfolio"]
        user.activeOrders = data["activeOrders"]
        return user
    }

    addFunds(amount) {
        this.funds += amount
    }

    removeFunds(amount) {
        this.funds -= amount
    }

    addItem(item, quantity) {
        if (item in this.portfolio) {
            this.portfolio[item] += quantity
        } else {
            this.portfolio[item] = quantity
        }
    }

    removeItem(item, quantity) {
        this.portfolio[item] -= quantity
    }

    // TODO: throw a custom exception
    userCanDoOrder(order) {
        if (order.kind == "SELL") {
            return (order.item in this.portfolio && this.portfolio[order.item] >= order.amount)
        }

        if (order.kind == "BUY") {
            return (this.funds >= order.amount * order.price_per)
        }
    }

    applyUpdate(update) {
        let order = this.activeOrders[update.id]
        order.amount = update.amount

        if (order.amount > 0) {
            this.activeOrders[update.id] = order
        } else {
            delete this.activeOrders[update.id]
        }
    }

}