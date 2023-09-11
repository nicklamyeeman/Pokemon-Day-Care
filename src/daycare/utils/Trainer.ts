import { Pokemon } from "../pokemon/Pokemon";

export const trainersNames = [
    "Pierre",
    "Ondine",
    "Major Bob",
    "Erika",
    "Koga",
    "Morgane",
    "Auguste",
    "Giovanni",
    "Olga",
    "Peter",
    "Aldo"
]

export class Trainer {
    name: string;
    pokemons: Pokemon[];

    constructor(trainerName: string) {
        this.name = trainerName;
        this.pokemons = [];
    }

    addPokemon(pokemon: Pokemon) {
        this.pokemons.push(pokemon);
    }

    removePokemon(pokemon: Pokemon) {
        this.pokemons = this.pokemons.filter((p) => p !== pokemon);
    }
}