import * as vscode from "vscode";
import { Pokemon } from "./pokemon/Pokemon";
import { StatsManager } from "./daycare/StatsManager";
import { EventsManager } from "./daycare/EventsManager";
import { Trainer, trainersNames } from "./utils/Trainer";

const MAXIMUM_DAY_CARE_CAPACITY = 9;

export class DayCare {
  pokemons: Pokemon[];
  trainers: Trainer[];
  stats: StatsManager;
  events: EventsManager;
  locale: string;

  constructor(oldDayCare?: DayCare | undefined) {
    this.locale = vscode.env.language;

    if (oldDayCare) {
      this.pokemons = oldDayCare.pokemons;
      this.trainers = oldDayCare.trainers;
      this.stats = new StatsManager(oldDayCare.stats);
    } else {
      this.pokemons = [];
      this.trainers = [];
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
        } - eggGroups : ${pokemon.eggGroups.map((eggGroup) => eggGroup)})} - ${
          pokemon?.gender || ""
        }`
      );
    });
    this.stats.counter.experience += 1 * this.pokemons.length;
    if (this.stats.counter.experience >= 1000 * this.stats.counter.level) {
      this.stats.counter.level += 1;
    }
  }

  async addPokemon() {
    console.log("Trainer approching...");

    const availbleTrainersName = trainersNames.filter((trainerName) =>
      this.trainers.every((trainer) => trainer.name !== trainerName) ||
      this.trainers.some((trainer) => trainer.name === trainerName && trainer.pokemons.length < 2)
    );
    const trainerName = 
      availbleTrainersName[this.events.rolls(availbleTrainersName.length)];
    
    const trainer = this.trainers.find(trainer => trainer.name === trainerName) ?? new Trainer(trainerName);

    const newPokemon = await this.events.addPokemon();
    const pokemon = new Pokemon(newPokemon);

    console.log(
      `Trainer ${trainer.name} leaves a ${pokemon.names?.[this.locale]}`
    );

    this.pokemons.push(pokemon);
    trainer.addPokemon(pokemon);

    if (!this.trainers.find(trainer => trainer.name === trainerName)) {
      this.trainers.push(trainer);
      this.stats.counter.trainer += 1;
    }
    this.stats.counter.pokemon += 1;
  }

  removePokemon() {
    console.log("Trainer approching...");

    const trainer = this.trainers[this.events.rolls(this.trainers.length)];
    const pokemon = trainer.pokemons[this.events.rolls(trainer.pokemons.length)];

    console.log(
      `Trainer ${trainer.name} takes back his ${pokemon.names?.[this.locale]}`
    );

    this.pokemons = this.pokemons.filter((p) => p !== pokemon);
    trainer.removePokemon(pokemon);
  
    if (trainer.pokemons.length === 0) {
      this.trainers = this.trainers.filter((t) => t !== trainer);
    }
    this.stats.wallet.addMoney(100);
  }

  addEgg(compatiblePokemons: Pokemon[]) {
    console.log("Someone is having an egg...");

    const random = this.events.rolls(compatiblePokemons.length);
    compatiblePokemons[random].hasEgg = true;
    console.log(`${compatiblePokemons[random].names?.[this.locale]} is now carrying an egg!`)

    this.stats.counter.egg += 1;
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
      await this.addPokemon();
    }
    if (canRemovePokemon && isRemovingPokemon) {
      this.removePokemon();
    }
  }

  async managePokemonsEvents() {
    const eventType = this.events.getPokemonEventType();

    const eggGroupedPokemons = this.pokemons.reduce((acc, pokemon) => {
      pokemon.eggGroups.map((eggGroup) => {
        if (eggGroup === "no-eggs" || eggGroup === "undiscovered" || eggGroup === "ditto") {
          return;
        }
        if (!acc[eggGroup]) {
          acc[eggGroup] = [];
        }
        acc[eggGroup].push(pokemon);
      });
      return acc;
    }, {} as { [eggGroup: string]: Pokemon[] });
    
    let compatiblePokemons = [];

    if (this.pokemons.some((pokemon) => pokemon.isDitto)) {
      compatiblePokemons = Object.values(eggGroupedPokemons).flat();
    } else {
      compatiblePokemons = Object.values(eggGroupedPokemons)
      .filter(
        (pokemons) =>
          pokemons.length > 1 &&
          pokemons.some((pokemon) => pokemon.gender === "male") &&
          pokemons.some((pokemon) => pokemon.gender === "female")
      )
      .flat()
      .filter((pokemon) => pokemon.gender === "female");
    }
    compatiblePokemons.filter((pokemon) => !pokemon.hasEgg);

    if (eventType === "addEgg" && compatiblePokemons.length > 0) {
      this.addEgg(compatiblePokemons);
    }
  }

  async manageEvents() {
    let random = 0;
    if (this.pokemons.length > 1) {
      random = this.events.rolls(2);
    }
    if (random < 1) {
      await this.manageTrainersEvents();
    } else {
      await this.managePokemonsEvents();
    }
  }

  async tick() {
    this.addExperience();
    await this.manageEvents();
    console.log(this.stats.wallet.money);
  }
}
