# bank_application_ts_project11

This is a command-line bank application written in TypeScript. It allows users to create and manage bank accounts, deposit and withdraw funds, check balances, and perform other banking operations.

## Features

- Create a new bank account
- Activate accounts
- Deposit and withdraw funds
- Check account balance
- Change account PIN
- Display account details
- Log in to an existing account
- Display credit card number

## Prerequisites

- Node.js 
- npm 

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/hassanali38/bank_application_ts_project11.git
   ```

2. Install the dependencies:

   ```bash
   npm install
   ```

## Usage

1. Run the application:

   ```bash
   node index.js
   ```

2. Follow the on-screen prompts to interact with the application.

## Running by npx Command:

1. You can also run directly by running the npx command on the cmd terminal:

   ```bash
   npx bank-application-byhassanali
   ```

## Creating an Account

- Select "Create an account" from the main menu.
- Enter the account holder's name.
- Optionally activate the account by setting a 4-digit PIN.

## Logging into an Account

- Select "Log in to an existing account" from the main menu.
- Enter the account number.
- Enter the 4-digit PIN if the account is activated.

## Account Operations

Once logged in, you can perform the following operations:

- Cash Deposit: Add funds to the account.
- Cash Withdraw: Withdraw funds from the account.
- Balance Inquiry: Check the current balance.
- Change Pin: Change the account PIN.
- Activate Account: Activate the account if not already activated.
- Show Credit Card Number: Display the account's credit card number.
- Logout: Log out of the account.

## Dependencies

- [inquirer](https://www.npmjs.com/package/inquirer): Used for creating interactive command-line prompts.
- [chalk](https://www.npmjs.com/package/chalk): Used for styling command-line output.

## Contributing 

Contributions are welcome! Please fork the repository and submit a pull request.

## Author

Hassan Ali

