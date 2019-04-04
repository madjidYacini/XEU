let convertArray = [];
function clickConvert() {
  let montant = document.querySelector("#mount").value;
  let toConvert = document.getElementById("toConvert");
  for (let index = 0; index < toConvert.options.length; index++) {
    if (toConvert.options[index].selected == true) {
      if (convertArray.indexOf(toConvert.options[index].value) === -1) {
        convertArray.push(toConvert.options[index].value);
      }
    }
  }
}

async function installServiceWorkerAsync() {
  if ("serviceWorker" in navigator) {
    try {
      const sw = await navigator.serviceWorker.register("/service-worker.js");
      console.log("service registered: ", sw);
    } catch (err) {
      console.log(`failed to install sw . ERROR : ${err}`);
    }
  }
}
document.addEventListener("DOMContentLoaded", function(event) {
  installServiceWorkerAsync();
});
