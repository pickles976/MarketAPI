import { TradingAPI } from "../src/api";
import { MarketWrapper } from "../pkg/MarketCore";
import { UserDatabase } from "../src/user_database"
import { Order } from "../src/value_objects/order"

const errorMsg = "Assertion failed!";

const userDB = new UserDatabase(true)

const market = MarketWrapper.new()

const api = new TradingAPI(userDB, market)

// Create users
api.createUser("Alice", "0")
api.createUser("Bob", "1")
api.createUser("Charlie", "2")

// Give items and funs
api.addItem("0", "WHEAT", 100)
api.addFunds("1", 2000)
api.addFunds("2", 3000)

// Transact
api.placeOrder("0", "SELL", "WHEAT", 50, 2.50)

// Confirm Alice's Wheat is locked up in a transaction
console.assert(api.showAllUsers()[0].portfolio["WHEAT"] === 50, "%o", {errorMsg})

api.placeOrder("1", "BUY", "WHEAT", 20, 3.0)
api.placeOrder("2", "BUY", "WHEAT", 40, 4.0)

// Show users
// User 2 should have an order to BUY 10 WHEAT at 4.0
let user_2_order = Object.values(api.showAllUsers()[2].activeOrders)[0]
console.assert(user_2_order.item === "WHEAT" && user_2_order.amount === 10 && user_2_order.price_per === 4.0, "%o", { errorMsg });

// User 2 should still have 40 currency locked away in their order. 3000 - (4.0 * 40) = 2840.0
console.assert(api.showAllUsers()[2].funds == 2840.0, "%o", { errorMsg });

// Query the Wheat ledger, should see user 2 BUY 10 WHEAT at 4.0
let wheat_ledger = JSON.parse(api.queryLedger("WHEAT"))
let wheat_buy_order = wheat_ledger["buy_orders"][0]
console.assert(
    wheat_buy_order.id === user_2_order.id &&
    wheat_buy_order.user_id === user_2_order.user_id &&
    wheat_buy_order.kind === user_2_order.kind &&
    wheat_buy_order.amount === user_2_order.amount &&
    wheat_buy_order.price_per === user_2_order.price_per,
    "%o", { errorMsg })

// Query a ledger for a non-existent item "{}"
console.assert(api.queryLedger("WOOD") == "{}", "%o", { errorMsg })

// Obtain the active order from user 2
let user_2_active_orders = api.getUser("2").activeOrders
let keys = Object.keys(user_2_active_orders)
let active_order = user_2_active_orders[keys[0]]

// Again, user 2, BUY order, 10 at 4
console.assert(
    active_order.id === user_2_order.id &&
    active_order.user_id === user_2_order.user_id &&
    active_order.kind === user_2_order.kind &&
    active_order.amount === user_2_order.amount &&
    active_order.price_per === user_2_order.price_per,
    "%o", { errorMsg })

// Cancel the order and update the user
api.cancelOrder(active_order)

// Ledger should be empty
console.assert(api.queryLedger("WHEAT") === '{"buy_orders":[],"sell_orders":[]}', "%o", { errorMsg })

// User 2 should no longer have any outstanding orders
console.assert(JSON.stringify(api.getUser("2").activeOrders) === "{}", "%o", { errorMsg })

// User 2 should be credited back 40 currency
console.assert(api.showAllUsers()[2].funds == 2880.0, "%o", { errorMsg });

console.log("Tests complete")

console.log(market.dump())