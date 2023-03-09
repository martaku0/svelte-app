// @ts-ignore
import { writable } from "svelte/store";

export let loadPokemons = writable([]);


export let offset = writable(0);
export let limit = writable(31);

const fetchData = async() => {
    let url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=500`;
    const data = (await (await fetch(url)).json()).results;

    const loadPokes = data.map((data, index) => {
        return {
            id: index + 1,
            url: data.url,
            name: data.name,
            img: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${index + 1}.png`
        }
    });

    loadPokemons.set(loadPokes);
};

fetchData();