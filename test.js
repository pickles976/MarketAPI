import { MarketWrapper, test } from './pkg/CRABSHAQ.js'

let market = MarketWrapper.new()

let names = ["ALICE", "BOB", "CLYDE", "DOOFUS", "EDGAR", "FRANK", "GOMEZ", 
"HASAN", "ISKANDAR", "JOE", "KYLE", "LARRY", "MOE", "NIGEL", "OSACR", "PAUL", "QBERT", 
"RON", "SEBASTIAN", "TOM", "ULANBATAAR", "VIKTOR", "WYOMING", "XANDER", "YOLANDE", "ZACHARY"]

let items = ["APPLES", "BANANAS", "CORN", "DETERGENT", "EGGS", "FROGS", "GRUEL", 
"HALO_3", "INCENSE", "JUUL", "KNIVES", "LAVA", "MYCELIUM", "NITROGEN", "OVALTINE", "POGS"]

let start = new Date()

for (let i = 0; i < 1_000_000; i++ ) {

  let order = {
    user_id: getRandom(names),
    item: getRandom(items),
    amount: Math.round(1 + Math.random() * 999.0),
    price_per: Math.round(1.0 + Math.random() * 24.0)
  }

  order = JSON.stringify(order)

  // console.log(order)

  if (Math.random() > 0.5) {
    market.sell(order)
  } else {
    market.buy(order)
  }
 
}

console.log(`${new Date() - start}ms`)

function getRandom(array) {
  return array[Math.floor(Math.random()*array.length)]
}