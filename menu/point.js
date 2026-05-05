document.addEventListener("DOMContentLoaded", () => {
  const pointEl = document.getElementById("burger-points");

  if (pointEl) {
    const points = Number(localStorage.getItem("burgerPoints")) || 0;

    pointEl.innerText = points;
  }
});
