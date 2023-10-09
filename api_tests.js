import { TradingAPI } from "./api";
import { MarketWrapper } from "./pkg/MarketCore";
import { UserDatabase } from "./sqlite_layer"
import { Order } from "./user"

const userDB = new UserDatabase(true)
userDB.initialize()

const market = MarketWrapper.new()

const api = new TradingAPI(userDB, market)

api.createUser("Alice", "0")
api.createUser("Bob", "1")
api.createUser("Charlie", "2")

api.addItem("0", "WHEAT", 100)

api.addFunds("1", 2000)
api.addFunds("2", 3000)

api.order("0", "SELL", "WHEAT", 50, 2.50)
api.order("1", "BUY", "WHEAT", 20, 3.0)
api.order("2", "BUY", "WHEAT", 40, 4.0)

console.log(api.showAllUsers())