const $ = (e) => document.querySelector(e);
const $$ = (e) => document.querySelectorAll(e);
const fromId = (name) => name.replace('-', ' ');
const toId = (name) => name.replace(' ', '-');

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

const round = (num) => +num.toFixed(2);

const formatNum = (num) => num.toLocaleString('en');

const branchToVersion = (branch) => {
  if (branch === 'stable') return CURRENT_STABLE_VERSION;
  if (branch === 'beta') return CURRENT_BETA_VERSION;
  return branch;
};

// Compute cheapest order
const orderItems = (items, costCalc = 'old') => {
  if (costCalc === 'new') return items;
  const todo = [...items];
  const result = [];
  while (todo.length > 0) {
    todo.sort((a, b) => {
      const aFirst = MULTIPLIER[0][a[2]] * a[1] + MULTIPLIER[a[2]][b[2]] * b[1];
      const bFirst = MULTIPLIER[0][b[2]] * b[1] + MULTIPLIER[b[2]][a[2]] * a[1];
      return bFirst - aFirst;
    });
    result.push(todo.pop());
  }
  return result;
};

const computeTotalCostOld = (items) => {
  let total = 0;
  let multiplier = 10;
  for (const [_id, cost, amnt] of orderItems(items)) {
    for (let i = 1; i <= amnt; i++) {
      total += i * cost * multiplier;
      multiplier += 1;
    }
  }
  return total / 10;
};

const computeTotalCostNew = (items) => {
  let total = 0;
  let count = 0;
  for (const [_id, cost, amnt] of items) {
    for (let i = 1; i <= amnt; i++) {
      total += i * cost;
      if (count > 0) total += Math.floor(20 * Math.pow(1.1, count));
      count++;
    }
  }
  return total;
};

const updateResults = () => {
  const version = branchToVersion(localStorage.getItem('branch'));
  const items = [];
  const costCalc = DATA[version].costCalc;

  $$('.input table tbody tr').forEach((e) => {
    const id = e.id;
    const cost = parseInt(e.querySelector('.base-cost').textContent);
    const amnt = parseInt(e.querySelector('.amnt-value').textContent);
    if (amnt > 0) items.push([id, cost, amnt]);
  });

  const computeTotalCost =
    costCalc === 'old' ? computeTotalCostOld : computeTotalCostNew;

  const totalCost = computeTotalCost(items);

  $$('.input table tbody tr').forEach((e) => {
    const id = e.id;
    const cost = parseInt(e.querySelector('.base-cost').textContent);
    const amnt = parseInt(e.querySelector('.amnt-value').textContent);
    const maxAmnt = DATA[version].powerUps[fromId(id)][1];
    if (amnt === maxAmnt) e.querySelector('.nxt-cost').textContent = '';
    else {
      const newItems = [];
      let found = false;
      for (const item of items) {
        if (item[0] === id) {
          newItems.push([id, cost, amnt + 1]);
          found = true;
        } else newItems.push(item);
      }
      if (!found) newItems.push([id, cost, 1]);
      e.querySelector('.nxt-cost').textContent = round(
        computeTotalCost(newItems) - totalCost
      );
    }
  });

  let multiplier = 10;
  let tableHtml = '';
  let prevAvgCost = null;
  let totalNoFees = 0;
  for (const [i, [id, cost, amnt]] of orderItems(items, costCalc).entries()) {
    let thisTotal = 0;
    for (let i = 1; i <= amnt; i++) {
      if (costCalc === 'old') {
        thisTotal += i * cost * multiplier;
        multiplier += 1;
      } else {
        thisTotal += i * cost * 10;
      }
    }
    totalNoFees += thisTotal / 10;
    const name = fromId(id);
    const avgCost = cost * (amnt + 1);
    tableHtml += `<tr>
            <td class="num hidden-when-new-calc">${
              avgCost === prevAvgCost ? '' : i + 1
            }</td>
            <td class="img"><img class="icon-bg" src="images/bg.png"><img class="icon" src="images/${name}.png"></td>
            <td>${name}</td>
            <td class="num-wide">${amnt}</td>
            <td class="num-wide">${cost}</td>
            <td class="num-wide">${thisTotal / 10}</td>
        </tr>`;
    prevAvgCost = avgCost;
  }
  $('.result h2').innerHTML =
    `Total cost: ${formatNum(totalCost)}` +
    (costCalc === 'old' || totalCost === totalNoFees
      ? ''
      : ` <small class="margin-left">(${formatNum(totalNoFees)} + ${formatNum(
          totalCost - totalNoFees
        )} in fees)</small>`);
  $('.result table tbody').innerHTML = tableHtml;
};

const selectNone = () => {
  $$('.input table tbody tr .amnt-slider').forEach((e) => (e.value = 0));
  $$('.input table tbody tr .amnt-value').forEach((e) => (e.textContent = 0));
  updateResults();
};

const selectAll = () => {
  $$('.input table tbody tr .amnt-slider').forEach((e) => {
    e.value = e.max;
    e.parentElement.parentElement.querySelector('.amnt-value').textContent =
      e.max;
  });
  updateResults();
};

const copyPermalink = (event) => {
  const params = new URLSearchParams();
  params.set(
    'branch',
    branchToVersion(localStorage.getItem('branch') || 'stable')
  );
  $$('.input table tbody tr').forEach((e) => {
    const id = e.id;
    const amnt = parseInt(e.querySelector('.amnt-value').textContent);
    if (amnt > 0) params.set(id, amnt);
  });

  const url = new URL(location.href);
  url.hash = params;
  navigator.clipboard.writeText(url.toString()).then(() => {
    const origText = event.target.textContent;
    event.target.textContent = 'Copied!';
    setTimeout(() => (event.target.textContent = origText), 1500);
  });
};

const render = (branch) => {
  branch ||= localStorage.getItem('branch') || 'stable';
  if (!DATA[branchToVersion(branch)]) branch = 'stable';
  localStorage.setItem('branch', branch);
  $('#branch').value = branch;
  const version = branchToVersion(branch);

  if (version === CURRENT_BETA_VERSION || version === CURRENT_STABLE_VERSION)
    $('#old-version-warning').classList.add('hidden');
  else $('#old-version-warning').classList.remove('hidden');

  $('#cost-calc-explanation').innerHTML =
    DATA[version].costCalc === 'old'
      ? 'Cost increases by 10% for every upgrade level bought'
      : 'Starting with the second upgrade, 20 * 1.1<sup>number of total upgrades bought</sup> is added to the cost';

  $('.result').dataset.costCalc = DATA[version].costCalc;

  const inputTable = $('.input table tbody');
  inputTable.innerHTML = '';

  for (const [name, [cost, max]] of Object.entries(DATA[version].powerUps)) {
    const el = document.createElement('tr');
    el.id = toId(name);

    el.innerHTML = `
<td class="img"><img class="icon-bg" src="images/bg.png"><img class="icon" src="images/${name}.png"></td>
<td class="num">${name}</td>
<td class="num base-cost">${cost}</td>
<td class="num-wide nxt-cost">${cost}</td>
<td class="num amnt-value">0</td>
<td><input type="range" max="${max}" class="range-${max} amnt-slider" value="0" list="tickmarks-${max}"></td>`;

    inputTable.append(el);
  }

  // handle slider change events
  $$('td .amnt-slider').forEach((e) =>
    e.addEventListener('input', (e) => {
      const row = e.target.parentElement.parentElement;
      const value = e.target.value;
      row.querySelector('.amnt-value').textContent = value;
      updateResults();
    })
  );

  updateResults();
};

document.addEventListener('DOMContentLoaded', () => {
  const branchSelector = $('#branch');
  const versions = Object.keys(DATA).sort((a, b) =>
    b.localeCompare(a, undefined, { sensitivity: 'base', numeric: true })
  );
  branchSelector.innerHTML = `<option value="beta">${CURRENT_BETA_VERSION} (beta)</option>`;
  branchSelector.innerHTML += `<option value="stable">${CURRENT_STABLE_VERSION} (stable)</option>`;
  for (const version of versions) {
    if (version === CURRENT_BETA_VERSION || version === CURRENT_STABLE_VERSION)
      continue;
    branchSelector.innerHTML += `<option value="${version}">${version}</option>`;
  }

  branchSelector.addEventListener('change', (e) => render(e.target.value));
  $('#update-date').innerText = LAST_UPDATE_DATE;

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
});
