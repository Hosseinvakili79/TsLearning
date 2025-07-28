"use strict";
var BankAccount = /** @class */ (function () {
    //private balance: number;
    //public readonly accountNumber: number;
    function BankAccount(balance, accountNumber) {
        this.balance = balance;
        this.accountNumber = accountNumber;
        //this.balance = balance;
        // this.accountNumber = accountNumber;
    }
    BankAccount.prototype.deposite = function (amount) {
        if (amount > 0) {
            this.balance += amount;
        }
    };
    BankAccount.prototype.getBalance = function () {
        return this.balance;
        var arrayList = [1, 2, 3];
    };
    return BankAccount;
}());
var acount1 = new BankAccount(1000, 6969);
acount1.deposite(500);
console.log(acount1.getBalance());
var obj = { id: 25 };
