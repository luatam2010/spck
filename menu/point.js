document.addEventListener("DOMContentLoaded", () => {
  const pointEl = document.getElementById("burger-points");

  if (pointEl) {
    const points = Number(localStorage.getItem("burgerPoints")) || 0;

    pointEl.innerText = points;
  }
});

const resetBtn = document.getElementById("reset-points");

if (resetBtn) {
  resetBtn.addEventListener("click", () => {
    // RESET LOCALSTORAGE
    localStorage.setItem("burgerPoints", 0);

    // UPDATE UI
    updateBurgerPoints();

    alert("Burger Points Reset Successful!");
  });
}
