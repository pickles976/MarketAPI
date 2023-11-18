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

- [x] Let people query the ledger
- [x] Let people cancel orders
- [ ] Query bid and ask prices

- [ ] Use sqlite to guarantee atomicity
- [ ] Create decorator? [https://www.geeksforgeeks.org/what-are-decorators-and-how-are-they-used-in-javascript/]
- [ ] https://bun.sh/docs/api/sqlite#transactions

- [ ] Switch to typescript
- [ ] Organize repository

- [ ] Add timestamps to transaction history
- [ ] Query transactions by timestamp, user, item type
- [ ] Query the ledger for current prices

- [ ] Separate concerns out (Market, UserDatabase, TransactionDatabase)
- [ ] Allow depedency injection for API
- [ ] REST endpoints for deployment

- [ ] Unit tests
- [ ] Load tests
- [ ] Load tests on Pi
- [ ] npm install wasm pkg


## End Goal

One-click deploy

```shell
bun index.js
```

Just hook up to your pre-existing API via the REST endpoints

Can swap out your transaction and user database to live elsewhere to take a load off of the actual transaction engine.
