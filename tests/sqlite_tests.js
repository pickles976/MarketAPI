import { User } from "../src/user";
import { UserDatabase } from "../src/user_database"

let alice = new User("ALICE")
alice.id = "1234"

let bob = new User("Bob")
bob.id = "4321"

let database = new UserDatabase(true)
// database.initialize()

database.insertUser(alice)
database.insertUser(bob)

console.log(database.selectUser("1234"))

console.log(database.selectAllUsers())