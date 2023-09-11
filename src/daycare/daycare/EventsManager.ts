import { Pokedex } from "../utils/Pokedex";

export class EventsManager {
    pokedex: Pokedex;

    constructor() {
        this.pokedex = new Pokedex();
    }

    async addPokemon() {
        return await this.pokedex.randomPokemon();
    }

    getTrainerEventType() {
        const random = this.rolls(20);
        
        if (random < 1) {
            return 'removePokemon';
        }
        if (random < 2) {
            return 'addPokemon';
        }
        if (random >= 10) {
            return 'newPokemon';
        }
        return 'unknown';
    }

    getPokemonEventType() {
        const random = this.rolls(5);

        if (random < 1) {
            return 'addEgg';
        }
        else 'unknown'
    }

    rolls(modifier: number = 100) {
        return Math.floor(Math.random() * modifier);
    }
}