import { MarketWrapper, test } from './pkg/MarketCore.js'
import { Order, User } from './user.js'

console.log(test())

const market = MarketWrapper.new()

const alice = new User("ALICE")
alice.addItem("PIKMIN", 20)
const bob = new User("BOB")
bob.addFunds(30)

// Create orders
let aliceSellOrder = new Order(alice.id, "PIKMIN", "SELL", 10, 2.50)
let bobBuyOrder = new Order(bob.id, "PIKMIN", "BUY", 8, 3.0)

// Verify users can perform their transactions
console.log(alice.userCanDoOrder(aliceSellOrder))
console.log(bob.userCanDoOrder(bobBuyOrder))

// Post first order
console.log(aliceSellOrder)
let summary = market.sell(JSON.stringify(aliceSellOrder))
console.log(summary)

// Post second order
console.log(bobBuyOrder)
summary = market.buy(JSON.stringify(bobBuyOrder))
console.log(summary)
