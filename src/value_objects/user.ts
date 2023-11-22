import { v4 as uuidv4 } from 'uuid';
import { Order } from './order';
import { OrderRequest } from './order_request';


export class User {
    /**
     * User
     * @param portfolio dictionary of items and their amounts
     * @param activeOrders dictionary of ids and their associated Order
     */

    name: string
    id: string
    funds: number
    portfolio: { [key: string]: number }
    activeOrders: { [key: string]: Order }

    constructor(name:string, id:string|null=null) {
        this.name = name
        this.id = id === null ? uuidv4() : id
        this.funds = 0
        this.portfolio = {}
        this.activeOrders = {}
    }

    static fromDict(data: {[key: string]: any}) : User{
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

    addItem(item: string, quantity: number) {
        if (item in this.portfolio) {
            this.portfolio[item] += quantity
        } else {
            this.portfolio[item] = quantity
        }
    }

    removeItem(item: string, quantity: number) {
        this.portfolio[item] -= quantity
    }

    // TODO: throw a custom exception
    userCanDoOrder(order: OrderRequest) {
        if (order.kind == "SELL") {
            return (order.item in this.portfolio && this.portfolio[order.item] >= order.amount)
        }

        if (order.kind == "BUY") {
            return (this.funds >= order.amount * order.price_per)
        }
    }

    applyOrderUpdate(update: Order) {

        let order = this.activeOrders[update.id]
        order.amount = update.amount

        if (order.amount > 0) {
            this.activeOrders[update.id] = order
        } else {
            delete this.activeOrders[update.id]
        }
    }

}