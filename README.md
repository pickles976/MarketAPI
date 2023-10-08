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