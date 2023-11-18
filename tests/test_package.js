import { MarketWrapper, test } from '../pkg/MarketCore.js'

console.log(test())

let market = MarketWrapper.new()

let order = {
    user_id: "ALICE",
    item: "CORN",
    kind: "SELL",
    amount: 200,
    price_per: 12.0
}
order = JSON.stringify(order)

market.sell(order)
market.sell(order)

let corn_ledger = market.query_ledger("CORN")
console.log("Current Ledger: ")
console.log(corn_ledger)

let summary = market.buy(order)
console.log(summary)

corn_ledger = market.query_ledger("CORN")
console.log("New Ledger: ")
console.log(corn_ledger)