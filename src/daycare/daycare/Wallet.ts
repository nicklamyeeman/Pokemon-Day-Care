// Wallet class

export class Wallet {
    money: number;

    constructor(oldWallet?: Wallet | undefined) {
        if (oldWallet) {
            this.money = oldWallet.money;
        } else {
            this.money = 0;
        }
    }

    addMoney(money: number) {
        this.money += money;
    }

    removeMoney(money: number) {
        this.money -= money;
    }
}
