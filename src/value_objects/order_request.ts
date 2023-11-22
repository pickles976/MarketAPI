export class OrderRequest {
    /**
     * Javascript object for a non-yet-created Order
     */

    user_id: string
    item: string
    kind: string
    amount: number
    price_per: number

    constructor(user_id: string, item: string, kind: string, amount: number, price_per: number){
        this.user_id = user_id
        this.item = item
        this.kind = kind
        this.amount = amount
        this.price_per = price_per
    }

    static fromDict(data: {[key: string]: string}) : OrderRequest {
        return new OrderRequest(data["user_id"], data["item"], data["kind"], parseInt(data["amount"]), parseFloat(data["price_per"]))
    }

}