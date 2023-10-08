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
