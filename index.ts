#! /usr/bin/env node

import inquirer from "inquirer";
import chalk from "chalk";

//Creating Account class which includes the attributes and methods for user's bank accounts
class Account {
    accountNumber : number;
    creditCardNumber : number;
    accountHolder : string;
    balance : number;
    pin : number | undefined;
    activeStatus : boolean;

    constructor (accountNumber : number, accountHolder : string, creditCardNumber : number) {
        this.accountNumber = accountNumber;
        this.accountHolder = accountHolder;
        this.creditCardNumber = creditCardNumber;
        this.balance = 0;
        this.pin = undefined;
        this.activeStatus = false;
    }

    //This function will activate the user bank account by prompting the user to set the 4 digits pin for the account
    async activateAccount() {
        let userPin;
        //This loop will validate the user input so user only enters 4 digits pin
        do {
            userPin = await inquirer.prompt([
                {
                    name: "pin",
                    type: "input",
                    message: "Enter the 4 digits pin for your account:",
                    validate: function (input: string) {
                        if (/^\d{4}$/.test(input)) {
                            return true;
                        } else {
                            return "Pin must be exactly 4 digits!";
                        }
                    }
                }
            ]);
        } while (!/^\d{4}$/.test(userPin.pin));

        this.pin = parseInt(userPin.pin, 10);
        this.activeStatus = true;

        console.log(chalk.gray("Activating the account..."));

        //2 Seconds delay while activating the account
        await new Promise(resolve => setTimeout(resolve, 2000));
        console.log(chalk.italic.greenBright("Your account has been successfully activated!"));
    }

    //This function will add the amount entered by the user to the respective bank account
    deposit(amount : number) : void {
        this.balance += amount;
        console.log(chalk.bold.yellowBright(`Deposited ${amount}. New Balance: ${this.balance}`));
    }

    //This function will withdraw money from the respective user's account based on the amount entered by the user
    withdraw(amount : number) : void {
        if (amount > this.balance) {
            console.log(chalk.italic.red("Insufficient Balance!"));
        }
        else {
            this.balance -= amount;
            console.log(chalk.bold.yellowBright(`Withdraw ${amount}. New Balance: ${this.balance}`));
        }
    }

}

//This var variable will count the total number of accounts created and assign the account number to newly created account
var countBankAccounts : number = 0;

//Creating Bank class which contains an array of Account class's objects and methods to manage user's accounts
class Bank {
    accounts : Account[];
    creditCardRand : number;

    constructor() {
        this.accounts = [];
        this.creditCardRand = 0;
    }

    //This async function will create a bank account of a customer based on the provided account holder name, also generate random credit number and stores the information in accounts array
    async createAccount(accountHolderName : string){
        this.creditCardRand = parseInt(this.generateAccountNumber());
        const accountNum = countBankAccounts + 1;
        const account = new Account(accountNum, accountHolderName, this.creditCardRand);
        this.accounts.push(account);
        console.log(chalk.italic.greenBright(`Account Created!`));
        console.log(chalk.underline(`The details are as follows:`) + `\nAccount Number: ` + chalk.blueBright(`${accountNum}`) + `\nAccount Holder Name: ` + chalk.blueBright(`${accountHolderName}`) + `\nCredit Card Number: ` + chalk.blueBright(`${this.creditCardRand}`) + `\nAvailable Balance: ` + chalk.blueBright(`${account.balance}`) + `\nActive Status: ` + chalk.blueBright(`${account.activeStatus}`));

        this.accounts[countBankAccounts] = account;
 

        let ask = await inquirer.prompt([
            {
                type : "list",
                name : "active",
                message : "Do you want to activate the account now?",
                choices : ["Yes", "No"]
            }
        ]);

        if (ask.active == "Yes") {
            await bank.accounts[countBankAccounts].activateAccount();
        }

        countBankAccounts++;
    }

    //This function will generate 13 digits random credit card number for each new created account
    generateAccountNumber(): string {
        const digits = '0123456789';
        let accountNumber = '';
    
        for (let i = 0; i < 13; i++) {
            const randomIndex = Math.floor(Math.random() * digits.length);
            accountNumber += digits[randomIndex];
        }
    
        return accountNumber;
    }

    //This function will find whether the account number entered by the user exists in our bank system or not
    findAccount(accountNumber : number) : Account | undefined {
        return this.accounts.find(acc => acc.accountNumber === accountNumber);
    }

    //For depositing money
    async deposit(index : number) {
        let ask = await inquirer.prompt([
            {
                type : "number",
                name : "amount",
                message : "Enter the amount to deposit in the account:"
            }
        ]);

        this.accounts[index].deposit(ask.amount);
    }

    //For withdraw of money
    async withdraw(index : number) {
        let ask = await inquirer.prompt([
            {
                type : "number",
                name : "amount",
                message : "Enter the amount to withdraw from the account:"
            }
        ]);

        this.accounts[index].withdraw(ask.amount);
    }

    //Getting the balance of respective bank account
    getBalance(index : number) : void {
        console.log(chalk.bold.yellowBright(`Available Balance: ${this.accounts[index].balance}`));
    }

    //To chnage the pin of respective bank account, ensuring the valid format of the pin (4 digits only)
    async changePin (index : number) {
        let userInput = await inquirer.prompt([
            {
                type : "password",
                name : "pin",
                message : "Enter the current pin of your account:"
            }
        ]);

        if (userInput.pin == this.accounts[index].pin) {
            let newInput;
            do {
                newInput = await inquirer.prompt([
                    {
                        type: "input",
                        name: "pin",
                        message: "Enter the new 4 digits pin of your account:",
                        validate: function (input: string) {
                            if (/^\d{4}$/.test(input)) {
                                return true;
                            } else {
                                return "Pin must be exactly 4 digits!";
                            }
                        }
                    }
                ]);
            } while (!/^\d{4}$/.test(newInput.pin));

            this.accounts[index].pin = parseInt(newInput.pin, 10);

            console.log(chalk.italic.cyan("Pin has been successfully updated!"));
        }
        else {
            console.log(chalk.italic.red("Incorrect current pin! Please try again!"));
        }
    }

    //Activate user bank account
    async activateAccount(index : number) {
        if (this.accounts[index].activeStatus == true) {
            console.log(chalk.italic.blueBright("Your account is already activated and ready to perform transactions!"));
        }
        else {
            await this.accounts[index].activateAccount();
        }
    }

    //Showing the credit card number of respective bank account
    showCreditCard(index : number) : void {
        console.log(`Credit Card Number: ` + chalk.blueBright(`${this.accounts[index].creditCardNumber}`));
    }
}

//Creating an object of Bank Class
const bank = new Bank();

//Displaying the main menu of bank application
async function mainMenu() {
    console.log();
    let action = await inquirer.prompt([
        {
            type : "list",
            name : "perform",
            message : "Which operation do you want to perform?",
            choices : ["Create an account", "Log in to an existing account", "Exit"]
        }
    ]);

    switch (action.perform) {
        case "Create an account":
            await createAccount();
            break;
        case "Log in to an existing account":
            await loginAccount();
            break;
        case "Exit":
            console.log(chalk.italic.underline("\n\t\t\t\t\tThank you for using the bank application!"));
            process.exit();
    }

    mainMenu();
}

async function createAccount() {
    let answers = await inquirer.prompt([
        {
            type : "input",
            name : "holderName",
            message : "Enter the account holder name:"
        }
    ]);

    await bank.createAccount(answers.holderName);
}

//Function to allow the user to login to the existing bank account
async function loginAccount() {
    let answer = await inquirer.prompt([
        {
            type : "number",
            name : "accountNum",
            message : "Enter the account number:"
        }
    ]);

    console.log(chalk.gray("Finding the account..."));

    await new Promise(resolve => setTimeout(resolve, 2000));

    let check: Account | undefined = bank.findAccount(answer.accountNum);
    if (check) {
        console.log(chalk.italic.greenBright("Account found!"));

        let findIndex : number = bank.accounts.indexOf(check);

        if (check.activeStatus == true) {
            let action = await inquirer.prompt([
                {
                    type : "password",
                    name : "pin",
                    message : "Enter the 4 digits pin of your account:",
                }
            ]);

            if (action.pin == bank.accounts[findIndex].pin) {
                console.log(chalk.bold.yellowBright("Login Successfully!"));
                await showLoginMenu(findIndex);
            }
            else {
                console.log(chalk.italic.red("Pin is incorrect!"));
            }

        }
        else {
            console.log(chalk.red("Account is not activated! Please activate the account and then try again!"));
            let response = await inquirer.prompt([
                {
                    type : "list",
                    name : "activate",
                    message : "Do you want to activate this account?",
                    choices : ["Yes", "No"]
                }
            ]);

            if (response.activate == "Yes") {
                await bank.accounts[findIndex].activateAccount();
            }

        }  
    } else {
        console.log(chalk.italic.red("Account not found!"));
    }

}

//This function controls the functionalities after the user has login to the particular bank account
async function showLoginMenu(index : number) {
    console.log(`\nWelcome` + chalk.italic.magentaBright(` ${bank.accounts[index].accountHolder}`) + ` to your bank account!`);
    while (true) {
        console.log();
        let actions = await inquirer.prompt([
            {
                type : "list",
                name : "operation",
                message : "Which operation do you want to perform?",
                choices : ["Cash Deposit", "Cash Withdraw", "Balance Inquiry", "Change Pin", "Activate Account", "Show Credit Card Number", "Logout"]
            }
        ]);
    
        switch (actions.operation) {
            case "Cash Deposit":
                await bank.deposit(index);
                break;
            case "Cash Withdraw":
                await bank.withdraw(index);
                break;
            case "Balance Inquiry":
                bank.getBalance(index);
                break;
            case "Change Pin":
                await bank.changePin(index);
                break;
            case "Activate Account":
                bank.activateAccount(index);
                break;
            case "Show Credit Card Number":
                bank.showCreditCard(index);
                break;
            case "Logout" :
                console.log(chalk.bold.yellowBright("Logout Successfully!"));
                await mainMenu();
                process.exit();
        }
    
    } 
}

function printHeader() {
    const header = `
${chalk.blueBright.bold('\t\t\t\t\t╔════════════════════════════════════════╗')}
${chalk.blueBright.bold('\t\t\t\t\t║')}      ${chalk.yellow.bold('Welcome to My Bank Application')}    ${chalk.blueBright.bold('║')}
${chalk.blueBright.bold('\t\t\t\t\t╚════════════════════════════════════════╝')}
`;
    console.log(header);
}

// Call the function to print the header
printHeader();

//Calling the mainMenu() function
mainMenu();
