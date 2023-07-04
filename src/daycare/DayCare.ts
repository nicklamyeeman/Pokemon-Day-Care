import { Pokemon } from "./pokemon/Pokemon";
import { StatsManager } from "./daycare/StatsManager";
import { EventsManager } from "./daycare/EventsManager";

const MAXIMUM_DAY_CARE_CAPACITY = 6;

export class DayCare {
  pokemons: Pokemon[];
  stats: StatsManager;
  events: EventsManager;

  constructor(oldDayCare?: DayCare | undefined) {
    if (oldDayCare) {
      this.pokemons = oldDayCare.pokemons;
      this.stats = new StatsManager(oldDayCare.stats);
    } else {
      this.pokemons = [];
      this.stats = new StatsManager();
    }
    this.events = new EventsManager();
    this.pokemons.map((pokemon) => console.log(pokemon.localeName));
  }

  addExperience() {
    this.pokemons.map((pokemon) => {
      pokemon.experience += 1;
      console.log(`Pokémon: ${pokemon.localeName} - exp : ${pokemon.experience}`);
    });
    this.stats.counter.experience += 1;
  }

  // async catchPokemon() {
  //   if (this.pokemons.length < MAXIMUM_DAY_CARE_CAPACITY) {
  //     const pokemon = new Pokemon((await this.events.catchPokemon()).names[4].name);
  //     this.pokemons.push(pokemon);
  //     this.stats.counter.pokemon += 1;
  //     console.log(`Pokémon: ${pokemon.localeName} - exp : ${pokemon.experience}`);
  //   }
  // }

  tick() {
    this.addExperience();
    this.events.rolls();
  }
}
