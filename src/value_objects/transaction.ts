import { RustDict } from "../custom_types"

export class Transaction {
    /**
     * Class representing a transaction that occured
     */

    buyer: string
    seller: string
    amount: number
    price_per: number

    constructor(buyer: string, seller: string, amount: number, price_per: number){
        this.buyer = buyer
        this.seller = seller
        this.amount = amount
        this.price_per = price_per
    }

    static fromDict(data: RustDict) : Transaction {
        return new Transaction(data["buyer"], data["seller"], parseInt(data["amount"]), parseFloat(data["price_per"]))
    }
}