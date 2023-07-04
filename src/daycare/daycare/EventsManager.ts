import { Pokedex } from "../utils/Pokedex";

export class EventsManager {
    pokedex: Pokedex;

    constructor() {
        this.pokedex = new Pokedex();
    }

    async catchPokemon() {
        return await this.pokedex.randomPokemon();
    }

    rolls() {
        const roll = Math.random();
        if (roll < 0.1) {
            console.log("You found a shiny!");
        }
    }
}