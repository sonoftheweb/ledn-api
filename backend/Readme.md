## Spin up the backend
* cd backend && npm run start:dev

### API Endpoints
1. GET /api/v1/accounts/ - lists all accounts.
   #### query
    * perPage = number of pages to get at a time
    * page = page number
2. GET /api/v1/accounts/:email_or_id?withBalance=false - returns account details with or without final balance.
   #### query
    * withBalance (default: false) get the account with balance from transactions
3. PUT /api/v1/accounts/:email_or_id
   #### param
   * account_status = either of "active" or "inactive" else an error is thrown (when set, transactions are ignored)
   * transaction_amount = transaction amount to be recorded to account
   * transaction_type = either of "receive" or "send" else an error is thrown