# marketapi

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