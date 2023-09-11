import { Wallet } from "./Wallet";

export class StatsManager {
    wallet: Wallet;
    counter: {
        pokemon: number;
        trainer: number;
        experience: number;
        level: number;
        move: number;
        egg: number;
    };

    constructor(oldStatsManager?: StatsManager | undefined) {
        if (oldStatsManager) {
            this.wallet = new Wallet(oldStatsManager.wallet);
            this.counter = { ...oldStatsManager.counter };
        } else {
            this.wallet = new Wallet();
            this.counter = {
                pokemon: 0,
                trainer: 0,
                experience: 0,
                level: 0,
                move: 0,
                egg: 0,
            };
        }
    }

    displayStats() {
        console.log(`Counter of pokémon ${this.counter.pokemon}`)
        console.log(`Counter of trainer ${this.counter.trainer}`)
        console.log(`Counter of experience ${this.counter.experience}`)
        console.log(`Counter of level ${this.counter.level}`)
        console.log(`Counter of move ${this.counter.move}`)
        console.log(`Counter of egg ${this.counter.egg}`)
        
    }
}
