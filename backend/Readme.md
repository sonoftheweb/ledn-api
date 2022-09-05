#### In My Head
_I am thinking of an application that serves an API for a frontend. The frontend does not necessarily need to be within the 
same folder structure or even infra as the API. Backend folder needs to exist, just in-case I need to do some for frontend Also, the API need to be built in a way that it's easy to take concerns and 
say, slap them onto Lambda with little to no effort. API inner layers need to be built to be dumb thanks to the use of 
dynamic injections here and there. I do not like the folder structure in Angular and prefer what's available on Laravel._ 

## Spin up the backend
Before anything is done, please make sure to create a .env file with its content copied from .env.example. In the .env file
also ensure that the settings are correct IE mongo db settings. Once that's out of the way, run:
* `cd backend && npm i && npm run start:dev` to start the server.
* While in the backend folder, you should also run `npm run import:small` or `npm run import:large` to seed data into MongoDB.

## API Endpoints
For a more testable intro into the API (Sorry opted not to write jest tests because of time constraints), see backend_tests.http 
file in the root of the project.
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