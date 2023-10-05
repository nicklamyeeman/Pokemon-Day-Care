//@ts-check

(function () {
  window.addEventListener("message", (event) => {
    const message = event.data;

    switch (message.type) {
      case "updateExp":
        const globalexptext = document.getElementById('globalexptext');
        if (globalexptext) {
          globalexptext.textContent = `exp : ${message.exp}`;
        }
        const globalleveltext = document.getElementById('globalleveltext');
        if (globalleveltext) {
          globalleveltext.textContent = `Niv. ${message.level}`;
        }
        const globalmoneytext = document.getElementById('globalmoneytext');
        if (globalmoneytext) {
          globalmoneytext.textContent = `${message.money}`;
        }
        const globalexpprogress = document.getElementById('globalexpprogress');
        if (globalexpprogress) {
          const percent = Math.floor((message.exp - (Math.trunc(message.exp / 1000) * 1000)) / 10)
          globalexpprogress.style.width = `${percent}%`
        }
        break;
    }
  });
})();
