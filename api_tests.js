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
api.addItem("1", "WHEAT", 50)
api.addItem("2", "GOLD", 25)

api.addFunds("0", 200)
api.addFunds("1", 2000)

api.sell("0", "WHEAT", 50, 2.50)
api.buy("1", "WHEAT", 20, 3.0)


// console.log(api.showAllUsers())