import * as vscode from "vscode";
import { Pokemon } from "./pokemon/Pokemon";
import { StatsManager } from "./daycare/StatsManager";
import { EventsManager } from "./daycare/EventsManager";

const MAXIMUM_DAY_CARE_CAPACITY = 10;

export class DayCare {
  pokemons: Pokemon[];
  stats: StatsManager;
  events: EventsManager;
  locale: string;

  constructor(oldDayCare?: DayCare | undefined) {
    this.locale = vscode.env.language;

    if (oldDayCare) {
      this.pokemons = oldDayCare.pokemons;
      this.stats = new StatsManager(oldDayCare.stats);
    } else {
      this.pokemons = [];
      this.stats = new StatsManager();
    }
    this.events = new EventsManager();
    this.pokemons.map((pokemon) => console.log(pokemon.names?.[this.locale]));
  }

  addExperience() {
    if (!this.pokemons) {
      return;
    }
    this.pokemons.map((pokemon, index) => {
      pokemon.experience += 1;
      console.log(
        `Pokémon ${index}: ${pokemon.names?.[this.locale]} - exp : ${
          pokemon.experience
        } - eggGroups : ${pokemon.eggGroups.map((eggGroup) => eggGroup)})} - ${pokemon?.gender || ''}`
      );
    });
    this.stats.counter.experience += 1;
  }

  async manageTrainersEvents() {
    const eventType = this.events.getTrainerEventType();

    const canAddPokemon = this.pokemons.length < MAXIMUM_DAY_CARE_CAPACITY;
    const canRemovePokemon = this.pokemons.length > 0;

    const isAddingPokemon =
      (this.pokemons.length === 0 &&
        (eventType === "addPokemon" || eventType === "newPokemon")) ||
      (this.pokemons.length > 0 && eventType === "addPokemon");
    const isRemovingPokemon = eventType === "removePokemon";

    if (canAddPokemon && isAddingPokemon) {
      console.log("Trainer leaves Pokémon");

      const newPokemon = await this.events.addPokemon();
      console.log(newPokemon);
      this.pokemons.push(new Pokemon(newPokemon));
    }
    if (canRemovePokemon && isRemovingPokemon) {
      console.log("Trainer takes back his Pokémon");
      this.pokemons.pop();
    }
  }

  async managePokemonsEvents() {
    const eventType = this.events.getPokemonEventType();

    const canGetEgg =
      this.pokemons.length > 1 &&
      this.pokemons.length < MAXIMUM_DAY_CARE_CAPACITY;
    const isGettingEgg = eventType === "addEgg";

    const compatiblePokemons = this.pokemons.filter(
      (pokemon) => !pokemon.hasEgg
    );
    const hasDitto = Object.values(compatiblePokemons).some(
      (pokemon) => pokemon.isDitto
    );

    const eggGroupedPokemons = compatiblePokemons.reduce((acc, pokemon) => {
      pokemon.eggGroups.map((eggGroup) => {
        if (eggGroup === "no-eggs" || eggGroup === "undiscovered") {
          return;
        }
        if (!acc[eggGroup]) {
          acc[eggGroup] = [];
        }
        acc[eggGroup].push(pokemon);
      });
      return acc;
    }, {} as { [eggGroup: string]: Pokemon[] });
    const femalePokemons = Object.values(eggGroupedPokemons)
      .filter((pokemons) => pokemons.length > 1)
      .flat()
      .filter((pokemon) => pokemon.gender === "female");
    const dittoPokemons = hasDitto
      ? Object.values(compatiblePokemons).filter((pokemon) => !pokemon.isDitto)
      : [];
    const availablePokemonForEgg = [...femalePokemons, ...dittoPokemons];

    console.log(availablePokemonForEgg);

    if (canGetEgg && isGettingEgg && availablePokemonForEgg.length > 0) {
      console.log("Someone is having a baby");
      const random = this.events.rolls(availablePokemonForEgg.length);
      availablePokemonForEgg[random].hasEgg = true;
    }
  }

  async manageEvents() {
    const random = this.events.rolls();

    if (random < 50) {
      await this.manageTrainersEvents();
    } else {
      await this.managePokemonsEvents();
    }
  }
  // async catchPokemon() {
  //   if (this.pokemons.length < MAXIMUM_DAY_CARE_CAPACITY) {
  //     const pokemon = new Pokemon((await this.events.catchPokemon()).names[4].name);
  //     this.pokemons.push(pokemon);
  //     this.stats.counter.pokemon += 1;
  //     console.log(`Pokémon: ${pokemon.localeName} - exp : ${pokemon.experience}`);
  //   }
  // }

  async tick() {
    this.addExperience();
    await this.manageEvents();
  }
}
