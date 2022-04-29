// cost, max rank
var DATA = {
    previous: {
        Might: [200, 5,0],
        Armor: [600, 3,0],
        'Max Health': [200, 3,0],
        Recovery: [200, 5,0],
        Cooldown: [900, 2,0],
        Area: [300, 2,0],
        Speed: [300, 2,0],
        Duration: [300, 2,0],
        Amount: [5000, 1,0],
        MoveSpeed: [300, 2,0],
        Magnet: [300, 2,0],
        Luck: [600, 3,0],
        Growth: [900, 5,0],
        Greed: [200, 5,0],
        Curse: [1666, 5,0],
        Revival: [10000, 1,0],
        Reroll: [5000, 3,0],
        Skip: [200, 2,0],
        Banish: [200, 2,0],
    },
    stable: {
        Might: [200, 5,0],
        Armor: [600, 3,0],
        'Max Health': [200, 3,0],
        Recovery: [200, 5,0],
        Cooldown: [900, 2,0],
        Area: [300, 2,0],
        Speed: [300, 2,0],
        Duration: [300, 2,0],
        Amount: [5000, 1,0],
        MoveSpeed: [300, 2,0],
        Magnet: [300, 2,0],
        Luck: [600, 3,0],
        Growth: [900, 5,0],
        Greed: [200, 5,0],
        Curse: [1666, 5,0],
        Revival: [10000, 1,0],
        Reroll: [5000, 3,0],
        Skip: [200, 2,0],
        Banish: [200, 3,0],
    },
    beta51: {
        Might: [200, 5,0],
        Armor: [600, 3,0],
        'Max Health': [200, 3,0],
        Recovery: [200, 5,0],
        Cooldown: [900, 2,0],
        Area: [300, 2,0],
        Speed: [300, 2,0],
        Duration: [300, 2,0],
        Amount: [5000, 1,0],
        MoveSpeed: [300, 2,0],
        Magnet: [300, 2,0],
        Luck: [600, 3,0],
        Growth: [900, 5,0],
        Greed: [200, 5,0],
        Curse: [1666, 5,0],
        Revival: [10000, 1,0],
        Reroll: [1000, 4,0],
        Skip: [100, 3,0],
        Banish: [100, 3,0],
    },
};

const $ = (e) => document.querySelector(e);
const $$ = (e) => document.querySelectorAll(e);
const toId = (name) => name.replace(' ', '-');
const fromId = (name) => name.replace('-', ' ');

const MULTIPLIER = [];
const MAX_AMOUNT = 5;

for (let offset = 0; offset <= MAX_AMOUNT; offset++) {
    const row = [0];
    let last = 0;
    for (let amnt = 1; amnt <= MAX_AMOUNT; amnt++) {
        last += amnt * (offset + amnt - 1);
        row.push(last);
    }
    MULTIPLIER.push(row);
}

const orderItems = (todo) => {
    const result = [];
    while (todo.length > 0) {
        todo.sort((a, b) => {
            const aFirst =
                MULTIPLIER[0][a[2]] * a[1] + MULTIPLIER[a[2]][b[2]] * b[1];
            const bFirst =
                MULTIPLIER[0][b[2]] * b[1] + MULTIPLIER[b[2]][a[2]] * a[1];
            return bFirst - aFirst;
        });
        result.push(todo.pop());
    }
    return result;
};

const computeTotalCost=(items)=>{
    if (items.length > 0) {
        const params = new URLSearchParams(
            items.map(([id, _, amnt]) => [id, amnt])
        );
        history.replaceState(undefined, undefined, '#' + params);
    } else
        history.replaceState(
            undefined,
            undefined,
            window.location.pathname + window.location.search
        );

    let multiplier = 10;
    let total = 0;
    let prevAvgCost = null;
    for (const [i, [id, cost, amnt]] of orderItems(items).entries()) {
        let thisTotal = 0;
        for (let i = 1; i <= amnt; i++) {
            thisTotal += i * cost * multiplier;
            multiplier += 1;
        }
        thisTotal /= 10;
        total += thisTotal;
        const avgCost = cost * (amnt + 1);
        prevAvgCost = avgCost;
    }

    return total;
}

const checkNextLvlPrice=(item_id)=>{
    const itemsBefore = [];
    const itemsAfter = [];
    $$('.input table tbody tr').forEach((e) => {
        const id = e.id;
        const cost = parseInt(e.children[2].firstChild.textContent);
        const amnt = parseInt(e.children[4].firstChild.textContent);
        if(id==item_id){
            if (amnt > 0) itemsBefore.push([id, cost, amnt])
            itemsAfter.push([id, cost, amnt+1]);
        }else{
            if (amnt > 0) {
                itemsBefore.push([id, cost, amnt]);
                itemsAfter.push([id, cost, amnt]);
            }
        }
        
    });
    return computeTotalCost(itemsAfter)-computeTotalCost(itemsBefore);
    
}

const updateResults = () => {
    const items = [];
    const branch = localStorage.getItem('branch');
    $$('.input table tbody tr').forEach((e) => {
        const id = e.id;
        const cost = parseInt(e.children[2].firstChild.textContent);
        const amnt = parseInt(e.children[4].firstChild.textContent);
        //Check Should Next Lvl Cost Be Computed
        const in_table_id=fromId(id);
        const max_lvl=branch[in_table_id][1];
        if (amnt!=max_lvl){
            
        }else{
            e.children[3].firstChild.textContent="";
        }
        if (amnt > 0) items.push([id, cost, amnt]);
    });

    if (items.length > 0) {
        const params = new URLSearchParams(
            items.map(([id, _, amnt]) => [id, amnt])
        );
        if (branch !== 'stable') params.set('branch', branch);
        history.replaceState(undefined, undefined, '#' + params);
    } else
        history.replaceState(
            undefined,
            undefined,
            window.location.pathname + window.location.search
        );

    let multiplier = 10;
    let total = 0;
    let tableHtml = '';
    let prevAvgCost = null;
    for (const [i, [id, cost, amnt]] of orderItems(items).entries()) {
        let thisTotal = 0;
        for (let i = 1; i <= amnt; i++) {
            thisTotal += i * cost * multiplier;
            multiplier += 1;
        }
        thisTotal /= 10;
        total += thisTotal;
        const name = fromId(id);
        const avgCost = cost * (amnt + 1);
        tableHtml += `<tr>
            <td class="num">${avgCost === prevAvgCost ? '' : i + 1}</td>
            <td class="img"><img class="icon-bg" src="images/bg.png"><img class="icon" src="images/${name}.png"></td>
            <td>${name}</td>
            <td class="num-wide">${amnt}</td>
            <td class="num">${cost}</td>
            <td class="num-wide">${thisTotal}</td>
        </tr>`;
        prevAvgCost = avgCost;
    }
    $('.result h2').textContent = `Total cost: ${total}`;
    $('.result table tbody').innerHTML = tableHtml;
};

const selectNone = () => {
    $$('.input table tbody tr input').forEach((e) => (e.value = 0));
    $$('.input table tbody tr').forEach(
        (e) => (e.children[4].textContent = 0)
    );
    updateResults();
};

const selectAll = () => {
    $$('.input table tbody tr input').forEach((e) => {
        e.value = e.max;
        e.parentElement.parentElement.children[4].textContent = e.max;
    });
    updateResults();
};

const render = (branch) => {
    branch ||= localStorage.getItem('branch') || 'stable';
    if (!DATA[branch]) branch = 'stable';
    localStorage.setItem('branch', branch);
    $('#branch').value = branch;

    const inputTable = $('.input table tbody');
    inputTable.innerHTML = '';

    for (const [name, [cost, max,cost_eval]] of Object.entries(DATA[branch])) {
        const el = document.createElement('tr');
        el.id = toId(name);
        
        if(cost_eval==-1){
            //No next lvl
            el.innerHTML = `
<td class="img"><img class="icon-bg" src="images/bg.png"><img class="icon" src="images/${name}.png"></td>
<td class="num">${name}</td>
<td class="num">${cost}</td>
<td class="num"></td>
<td class="num amnt-value">0</td>
<td><input type="range" max="${max}" class="range-${max} amnt-slider" value="0" list="tickmarks-${max}"></td>`;
        }else if (cost_eval==0){
            //Lvl = 0 or eval wasn't updated
            el.innerHTML = `
<td class="img"><img class="icon-bg" src="images/bg.png"><img class="icon" src="images/${name}.png"></td>
<td class="num">${name}</td>
<td class="num">${cost}</td>
<td class="num">${cost}</td>
<td class="num amnt-value">0</td>
<td><input type="range" max="${max}" class="range-${max} amnt-slider" value="0" list="tickmarks-${max}"></td>`;
        }else{
            //Next lvl exists
            el.innerHTML = `
<td class="img"><img class="icon-bg" src="images/bg.png"><img class="icon" src="images/${name}.png"></td>
<td class="num">${name}</td>
<td class="num">${cost}</td>
<td class="num">${cost_eval}</td>
<td class="num amnt-value">0</td>
<td><input type="range" max="${max}" class="range-${max} amnt-slider" value="0" list="tickmarks-${max}"></td>`;
        }
        
        inputTable.append(el);
    }

    $$('td:nth-child(6)').forEach((e) =>
        e.addEventListener('input', (e) => {
            const row = e.target.parentElement.parentElement;
            const value = e.target.value;
            row.children[4].textContent = value;
            updateResults();
        })
    );

    updateResults();
};

if (location.hash) {
    const params = new URLSearchParams(location.hash.substring(1));
    render(params.get('branch'));
    params.delete('branch');
    for (const [id, amnt] of params.entries()) {
        const el = document.getElementById(id);
        if (el) {
            for (const e of el.getElementsByClassName('amnt-value'))
                e.textContent = amnt;
            for (const e of el.getElementsByClassName('amnt-slider'))
                e.value = amnt;
        }
    }
    updateResults();
} else {
    render();
}

$('#branch').addEventListener('change', (e) => render(e.target.value));