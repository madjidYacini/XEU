let convertArray = [];
let convertHistory = [];
const STORAGE_HISTORY_KEY = "pwanimexeu.history";

let SECRET_KEY = "fd6ae76502be6b395cbf6cdc8573659a";
const API_BASE = `http://localhost:4242/api/xeu`;

(async () => {
  try {
    let storage = JSON.parse(localStorage.getItem(STORAGE_HISTORY_KEY));
    if (!storage) {
      const responseGeneral = await fetch(API_BASE);
      if (!responseGeneral.ok) {
        return;
      }

      let res = await responseGeneral.json();

      localStorage.setItem(STORAGE_HISTORY_KEY, JSON.stringify(res.rates));
    }
  } catch (error) {
    console.log("====================================");
    console.log(error);
    console.log("====================================");
  }
})();

async function clickConvert() {
  let amount = document.querySelector("#amount").value;
  let toConvert = document.getElementById("toConvert");
  for (let index = 0; index < toConvert.options.length; index++) {
    if (toConvert.options[index].selected == true) {
      if (convertArray.indexOf(toConvert.options[index].value) === -1) {
        convertArray.push(toConvert.options[index].value);
      }
    }
  }

  // calculate
  try {
    let storage = JSON.parse(localStorage.getItem(STORAGE_HISTORY_KEY));
    let rates = {};
    convertArray.forEach(money => {
      rates[money] = storage[money] * amount;
    });
    document.querySelector("#current").innerHTML = "";
    addCUrrencyToMarkupSelector([rates], "#current");

    convertArray = [];
  } catch (error) {
    console.log("ERROR:", error);
  }
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
    if (element !== "amount") {
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
    }
  });

  return content;
}

async function installServiceWorkerAsync() {
  let storage = JSON.parse(localStorage.getItem(STORAGE_HISTORY_KEY));
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
