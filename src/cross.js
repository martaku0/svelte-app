import { writable } from "svelte/store";

export let loadWord = writable([]);
export let words = writable([]);
export let definitions = writable([]);

var max_i = 0;
var max_len = 0;

export const fetchData = async() => {
    let url = `https://api.api-ninjas.com/v1/randomword`;
    const data = (await (await fetch(url)).json());
    const load = data.word.toLowerCase();
    let url1 = `https://api.dictionaryapi.dev/api/v2/entries/en/${load}`;
    const data1 = (await (await fetch(url1)).json());
    if (data1.title == "No Definitions Found") {
        fetchData();
        return;
    } else {
        var n = load.length;
        loadWord.set(load);
    }

    for (let i = 0; i < n; i++) {
        fetchData_Words(load);
    }
};

let t = 0;
export const fetchData_Words = async(w) => {
    let url = `https://api.api-ninjas.com/v1/randomword`;
    const data = (await (await fetch(url)).json());
    let load = data.word.toLowerCase();
    let url1 = `https://api.dictionaryapi.dev/api/v2/entries/en/${load}`;
    const data1 = (await (await fetch(url1)).json());
    if (data1.title == "No Definitions Found") {
        fetchData_Words(w);
    } else {
        if (load.includes(w[t]) && load.length < 10) {
            let index = load.indexOf(w[t]);
            let chars = load.split('');
            chars[index] = chars[index].toUpperCase();
            load = chars.join('');
            if (index > max_i) {
                max_i = index;
            }
            if (load.length > max_len) {
                max_len = load.length;
            }
            let def = data1[0].meanings[0].definitions[0].definition;
            definitions.update(items => {
                items.push(def);
                return items;
            });
            words.update(items => {
                items.push(index + load);
                return items;
            });
            t++;
        } else {
            fetchData_Words(w);
        }
    }
};

// fetchData(); - ładuje krzyżówkę