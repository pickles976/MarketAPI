# marketapi

## Installation

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run index.js
```

This project was created using `bun init` in bun v1.0.0. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.

https://bun.sh/docs/api/sqlite

## Architecture

1. Market Engine
2. User/portfolio database
3. Market API

The Market Engine is a hash table of ledgers, each ledger holds buy and sell orders. 

The User/Portfolio database is a simple object that acts as a key/value store of User objects. The one I am using runs SQLite under the hood, but it could also just be a js object that holds everything in memory.

The Market API is an object that exposes all the functionality of a market using a combination of the ledgers and database. It is set up like a service layer pattern so you can just wrap it in a REST API.

## Info

1. Create user

    - Server generates a UUID
    - User Object is created
    - User is serialized and inserted into sqlite db

2. Update user

    - User ID and update are applied
    - User is updated in sqlite

3. Perform transaction

    - User is loaded from sqlite
    - Check if transaction can be performed
    - Perform transaction in Market API
    - Update user with returned information
    - Update other users with returned information

```json
{"key":"PIKMIN","transactions":[{"buyer":"de9aedd2-4234-40e6-b0bd-5f8d64d9e6d1","seller":"b33c6339-af33-420d-9f97-b08bd44e95ba","amount":8,"price_per":2.5}],"to_update":[{"id":"a3de2f18-fbae-4d58-a53c-c2bce79c723c","user_id":"b33c6339-af33-420d-9f97-b08bd44e95ba","kind":"SELL","amount":2,"price_per":2.5}],"created":null}
```

## TODO

- [ ] Add integer timestamps to transaction history
- [ ] Query transactions by timestamp, user, item type

- [ ] Unit tests (do DDD-style methods, properly enforce the relationships)
- [ ] SQLite level tests
- [ ] Service layer tests (api.py)

- [ ] Write a program with trading bots (Use CATAN resources, try to build different structures)
- [ ] GOAP, STRIPS
- [ ] https://gamedevelopment.tutsplus.com/goal-oriented-action-planning-for-a-smarter-ai--cms-20793t
- [ ] https://medium.com/@vedantchaudhari/goal-oriented-action-planning-34035ed40d0b
- [ ] RoadBot, Village-Bot, City-Bot

- [ ] REST API 
    - [ ] User CRUD (create user, get user, view users)
    - [ ] Order CRUD (create order, cancel order, view orders)
    - [ ] Transaction querying (query transaction history by time, filter by item type)
- [ ] Integration tests
- [ ] Load tests

- [ ] Visualize transactions in webpage

- [ ] Test for double-spend
- [ ] Load tests on Pi
- [ ] npm install wasm pkg

- [ ] Add transactionality to the market engine core so that we can undo transactions if we encounter a failure
- [ ] Try out alternative backends for user database that support transactionality


## End Goal

One-click deploy

```shell
bun market-server.js
```

Just hook up to your pre-existing API via the REST endpoints

Can swap out your transaction and user database to live elsewhere to take a load off of the actual transaction engine.
