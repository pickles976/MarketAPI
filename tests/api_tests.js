import { TradingAPI } from "../src/api";
import { MarketWrapper } from "../pkg/MarketCore";
import { UserDatabase } from "../src/sqlite_layer"
import { Order } from "../src/user"

const userDB = new UserDatabase(true)
userDB.initialize()

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
api.order("0", "SELL", "WHEAT", 50, 2.50)
api.order("1", "BUY", "WHEAT", 20, 3.0)
api.order("2", "BUY", "WHEAT", 40, 4.0)

// Show users
// User 2 should have an order to BUY 10 WHEAT at 4.0
console.log(api.showAllUsers())

// Query the Wheat ledger, should see user 2 BUY 10 WHEAT at 4.0
console.log(`Wheat ledger: ${api.queryLedger("WHEAT")}`)

// Query a ledger for a non-existent item "{}"
console.log(`Wood ledger: ${api.queryLedger("WOOD")}`)

// Obtain the active roder from user 2
let user_2_active_orders = api.getUser("2").activeOrders
let keys = Object.keys(user_2_active_orders)
let active_order = user_2_active_orders[keys[0]]

// Again, user 2, BUY order, 10 at 4
console.log(`Active order: ${JSON.stringify(active_order)}`)

// Cancel the order and update the user
api.cancelOrder(active_order)

// Ledger should be empty
console.log(api.queryLedger("WHEAT"))

// User 2 should no longer have any outstanding orders
console.log(api.getUser("2"))

// TODO: user funds should be tied up by currently active orders