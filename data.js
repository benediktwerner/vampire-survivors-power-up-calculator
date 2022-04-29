
const latest_data_version="v51"
// cost, max rank
const DATA = {
    v42: {
        name: "0.4.2 (stable)",
        Might: [200, 5],
        Armor: [600, 3],
        'Max Health': [200, 3],
        Recovery: [200, 5],
        Cooldown: [900, 2],
        Area: [300, 2],
        Speed: [300, 2],
        Duration: [300, 2],
        Amount: [5000, 1],
        MoveSpeed: [300, 2],
        Magnet: [300, 2],
        Luck: [600, 3],
        Growth: [900, 5],
        Greed: [200, 5],
        Curse: [1666, 5],
        Revival: [10000, 1],
        Reroll: [5000, 3],
        Skip: [200, 2],
        Banish: [200, 2],
    },
    v50: {
        name: "0.5.0 (stable)",
        Might: [200, 5],
        Armor: [600, 3],
        'Max Health': [200, 3],
        Recovery: [200, 5],
        Cooldown: [900, 2],
        Area: [300, 2],
        Speed: [300, 2],
        Duration: [300, 2],
        Amount: [5000, 1],
        MoveSpeed: [300, 2],
        Magnet: [300, 2],
        Luck: [600, 3],
        Growth: [900, 5],
        Greed: [200, 5],
        Curse: [1666, 5],
        Revival: [10000, 1],
        Reroll: [5000, 3],
        Skip: [200, 2],
        Banish: [200, 3],
    },
    v51: {
        name: "0.5.1 (stable)",
        Might: [200, 5],
        Armor: [600, 3],
        'Max Health': [200, 3],
        Recovery: [200, 5],
        Cooldown: [900, 2],
        Area: [300, 2],
        Speed: [300, 2],
        Duration: [300, 2],
        Amount: [5000, 1],
        MoveSpeed: [300, 2],
        Magnet: [300, 2],
        Luck: [600, 3],
        Growth: [900, 5],
        Greed: [200, 5],
        Curse: [1666, 5],
        Revival: [10000, 1],
        Reroll: [1000, 4],
        Skip: [100, 3],
        Banish: [100, 3],
    },
};

//Code Below Creates Options from data above

const toId = (name) => name.replace(' ', '-');

const el = document.getElementById('branch');

for (const [name, data] of Object.entries(DATA)) {


    el.innerHTML += `<option value="${toId(name)}">${data.name}</option>`


}