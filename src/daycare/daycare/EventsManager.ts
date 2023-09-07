import { Pokemon } from "../pokemon/Pokemon";
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
        const random = this.rolls();
        
        if (random < 5) {
            return 'addPokemon';
        }
        if (random > 5 && random < 55) {
            return 'newPokemon';
        }
        if (random > 55 && random < 60) {
            return 'removePokemon';
        }
        return 'unknown';
    }

    getPokemonEventType() {
        const random = this.rolls();

        if (random < 20) {
            return 'addEgg';
        }
        else 'unknown'
    }

    rolls(modifier: number = 100) {
        // chance of a trainer leaves a Pokémon : if no Pokémon : 50%, if at least 1 Pokémon : 10%
        // chance of a trainer take back his Pokémon : 10%
        // chance of a Pokémon lays an egg : 10%

        return Math.floor(Math.random() * modifier);
    }
}