//@ts-check

(function () {
  window.addEventListener("message", (event) => {
    const message = event.data;

    switch (message.type) {
      case 'isLoading':
        const spinner = document.getElementById("spinner");
        const element = document.getElementById(message.element);
        if (spinner && element) {
          spinner.style.display = message.isLoading ? "block" : "none";
          element.style.display = message.isLoading ? "none" : "block";
        }
        break;
      case "updateExp":
        const experience = document.getElementById("exp");
        if (experience) {
          experience.textContent = message.exp;
        }
        break;
    }
  });
})();
