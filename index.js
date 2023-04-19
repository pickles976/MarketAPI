import { MarketWrapper, test } from './pkg/CRABSHAQ.js'

let market = MarketWrapper.new()

let order = {
    user_id: "ALICE",
    item: "CORN",
    amount: 200,
    price_per: 12.0
}
order = JSON.stringify(order)

market.sell(order)
let summary = market.sell(order)
console.log(summary)

summary = market.buy(order)
console.log(summary)