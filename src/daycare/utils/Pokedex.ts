import { PokemonClient } from "pokenode-ts";
import { Pokemon } from '../pokemon/Pokemon';

export class Pokedex {
    _pokemonAPI: PokemonClient;

    constructor() {
        this._pokemonAPI = new PokemonClient();
    }

    async randomPokemon() {
        const pokedexLength = (await this._pokemonAPI.listPokemons()).count;
        const randomPokemonName = (await this._pokemonAPI.listPokemons(Math.floor(Math.random() * pokedexLength - 1), 1)).results[0].name;
        return await this._pokemonAPI.getPokemonSpeciesByName(randomPokemonName);
    }
}