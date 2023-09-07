import { PokemonSpecies } from "pokenode-ts";

export class Pokemon {
    names: {[locale: string]: string};
    experience: number;
    eggGroups: string[];
    gender?: 'male' | 'female';
    isDitto?: boolean;
    hasEgg?: boolean;

    constructor(pokemon: PokemonSpecies) {
        this.experience = 0;
        
        this.names = pokemon.names.reduce((acc, value) => {
            acc[value.language.name] = value.name;
            return acc;
        }, {} as {[locale: string]: string})
        this.eggGroups = pokemon.egg_groups.map((eggGroup) => eggGroup.name);
        if (pokemon.gender_rate !== -1) {
            this.gender = Math.floor(Math.random() * 8) < pokemon.gender_rate ? 'female' : 'male';
        }
    }
}