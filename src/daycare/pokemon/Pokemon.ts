export class Pokemon {
    localeName: string;
    experience: number;

    constructor(name: string) {
        this.localeName = name;
        this.experience = 0;
    }
}