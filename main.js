let convertArray = [];
let convertHistory = [];
const STORAGE_HISTORY_KEY = "pwanimexeu.history";

let SECRET_KEY = "fd6ae76502be6b395cbf6cdc8573659a";
const API_BASE = `http://data.fixer.io/api/latest?access_key=${SECRET_KEY}&base=EUR`;

async function clickConvert() {
  let amount = document.querySelector("#mount").value;
  let toConvert = document.getElementById("toConvert");
  for (let index = 0; index < toConvert.options.length; index++) {
    if (toConvert.options[index].selected == true) {
      if (convertArray.indexOf(toConvert.options[index].value) === -1) {
        convertArray.push(toConvert.options[index].value);
      }
    }
  }
  try {
    const response = await fetch(`${API_BASE}&symbols=${convertArray.join()}`);
    if (!response.ok) {
      return;
    }
    let results = await response.json();
    let rates = results.rates;
    for (var key in rates) {
      if (rates.hasOwnProperty(key)) {
        rates[key] = rates[key] * amount;
      }
    }
    document.querySelector("#current").innerHTML = "";
    addCUrrencyToMarkupSelector([results.rates], "#current");
    updateHistory(results.rates);
    convertArray = [];
  } catch (error) {
    console.log("ERROR:", error);
  }
}

function updateHistory(currencyToStore) {
  console.log(currencyToStore);
  convertHistory.push(currencyToStore);
  console.log(convertHistory);

  addCUrrencyToMarkupSelector([currencyToStore], "#history");
  localStorage.setItem(STORAGE_HISTORY_KEY, JSON.stringify(convertHistory));
}
function addCUrrencyToMarkupSelector(convertCurrency, selector) {
  console.log(convertCurrency, selector);

  let el = document.querySelector(selector);
  convertCurrency.forEach(currency => {
    el.innerHTML = addCurrencyMarkup(currency) + el.innerHTML;
  });
}

function addCurrencyMarkup(convertCurrency) {
  let key = Object.keys(convertCurrency);
  let value = Object.values(convertCurrency);
  let content = "";

  key.forEach((element, i) => {
    content += `
    <div class ="row">
        <div class="card col-sm-4 " style="width: 18rem;">
            <div class="card-body">
              <h5 class="card-title">Card title</h5>
          <h4>${element}: ${value[i]} </h4> 
        </div>               
      </div>
      </div>
    `;
  });

  return content;
}

async function installServiceWorkerAsync() {
  let storage = JSON.parse(localStorage.getItem(STORAGE_HISTORY_KEY));
  console.log("====================================");
  console.log(storage);
  console.log("====================================");
  if (storage) {
    convertHistory = storage;
    addCUrrencyToMarkupSelector(convertHistory, "#history");
  }
  if ("serviceWorker" in navigator) {
    try {
      const sw = await navigator.serviceWorker.register("/service-worker.js");
      console.log("service registered: ", sw);
      console.log("test", SECRET_KEY);
    } catch (err) {
      console.log(`failed to install sw . ERROR : ${err}`);
    }
  }
}
document.addEventListener("DOMContentLoaded", function(event) {
  installServiceWorkerAsync();
});
