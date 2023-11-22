export class Order {
    /**
     * Javascript object for a created Order
     */

    id: string
    user_id: string
    item: string
    kind: string
    amount: number
    price_per: number

    constructor(id:string, user_id: string, item: string, kind: string, amount: number, price_per: number){
        this.id = id
        this.user_id = user_id
        this.item = item
        this.kind = kind
        this.amount = amount
        this.price_per = price_per
    }

    static fromDict(data: {[key: string] : string}) : Order {
        return new Order(data["id"], data["user_id"], data["item"], data["kind"], parseInt(data["amount"]), parseFloat(data["price_per"]))
    }

}