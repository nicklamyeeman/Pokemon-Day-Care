import { Pokedex } from "./pokemon/Pokedex";
import { Pokemon } from './pokemon/Pokemon';

export class DayCare {
	_experience: number;
    _pokedex: Pokedex;
    _pokemons : Pokemon[];

	constructor(oldDayCare : DayCare | undefined) {
		if (oldDayCare) {
			this._experience = (oldDayCare._pokemons || []).reduce((acc, pokemon) => acc + pokemon._experience, 0);
			this._pokemons = oldDayCare._pokemons;
		} else {
			this._experience = 0;
			this._pokemons = [];
		}
        this._pokedex = new Pokedex();
		console.log("EXPERIENCE : ");
		console.log(this._experience);
		console.log("POKEMONS : ");
		this._pokemons.map(pokemon => console.log(pokemon._localeName));
	}

    async addExperience() {
		if (this._pokemons && this._pokemons.length > 0) {
			this._pokemons[Math.floor(Math.random() * this._pokemons.length)]._experience += 1;
			this._experience = this._pokemons.reduce((acc, pokemon) => acc + pokemon._experience, 0);
			console.log("EXPERIENCE : ");
			console.log(this._experience);
			console.log("POKEMONS : ");
			this._pokemons.map(pokemon => console.log(pokemon._localeName));
			if (Math.round((4 * (Math.pow(this._pokemons.length, 3)) / 5)) < this._experience) {
				const randomPokemon = await this.catchRandomPokemon();
				console.log("NEW POKEMON !");
				console.log(randomPokemon._localeName);
				this._pokemons = [...this._pokemons, randomPokemon]
			}
		} else {
			const randomPokemon = await this.catchRandomPokemon();
			console.log("NEW POKEMON !");
			console.log(randomPokemon._localeName);
			this._pokemons = [randomPokemon];
		}
	}

    async catchRandomPokemon() {
        const randomPokemon = await this._pokedex.randomPokemon();
		return new Pokemon(randomPokemon.names[4].name);
    }
}