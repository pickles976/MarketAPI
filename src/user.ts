import { v4 as uuidv4 } from 'uuid';

// TODO: Transaction object, OrderRequest object
export class Order {

    id: string | null
    user_id: string
    item: string
    kind: string
    amount: number
    price_per: number

    // TODO: typed dict?
    static fromDict(data: any) {
        return new Order(data["user_id"], data["item"], data["kind"], data["amount"], data["price_per"], data["id"])
    }

    // TODO: why is the ID optional? it breaks other code. Plox fix
    // ANSWER: the order id is only created after an order has been processed by the market engine. Maybe we should have an OrderRequest class?
    constructor(user_id: string, item: string, kind: string, amount: number, price_per: number, id:string|null = null){
        this.id = id
        this.user_id = user_id
        this.item = item
        this.kind = kind
        this.amount = amount
        this.price_per = price_per
    }

}

export class User {

    name: string
    id: string | null
    funds: number
    portfolio: Object
    activeOrders: Object

    constructor(name:string, id:string|null=null) {
        this.name = name
        this.id = id === null ? uuidv4() : id
        this.funds = 0
        this.portfolio = {}
        this.activeOrders = {}
    }

    // TODO: add typed dict
    static fromDict(data: any) : User{
        let user = new User(data["name"], data["id"])
        user.funds = data["funds"]
        user.portfolio = data["portfolio"]
        user.activeOrders = data["activeOrders"]
        return user
    }

    addFunds(amount: number) {
        this.funds += amount
    }

    removeFunds(amount: number) {
        this.funds -= amount
    }

    // TODO: fix this
    addItem(item: number, quantity: number) {
        if (item in this.portfolio) {
            //@ts-ignore
            this.portfolio[item] += quantity
        } else {
            //@ts-ignore
            this.portfolio[item] = quantity
        }
    }

    removeItem(item: number, quantity: number) {
        //@ts-ignore
        this.portfolio[item] -= quantity
    }

    // TODO: throw a custom exception, also fix the ts-ignore
    userCanDoOrder(order: Order) {
        if (order.kind == "SELL") {
            // @ts-ignore
            return (order.item in this.portfolio && this.portfolio[order.item] >= order.amount)
        }

        if (order.kind == "BUY") {
            return (this.funds >= order.amount * order.price_per)
        }
    }

    applyOrderUpdate(update: Order) {
        //@ts-ignore
        let order = this.activeOrders[update.id]
        order.amount = update.amount

        if (order.amount > 0) {
            //@ts-ignore
            this.activeOrders[update.id] = order
        } else {
            //@ts-ignore
            delete this.activeOrders[update.id]
        }
    }

}