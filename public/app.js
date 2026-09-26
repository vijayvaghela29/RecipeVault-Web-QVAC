const form = document.getElementById("searchForm");
const queryInput = document.getElementById("query");
const resultsEl = document.getElementById("results");
const messageEl = document.getElementById("message");
const resultTitle = document.getElementById("resultTitle");
const resultCount = document.getElementById("resultCount");
const statusPill = document.getElementById("statusPill");

function renderResults(data) {
  resultTitle.textContent = `Matches for “${data.query}”`;
  resultCount.textContent = `${data.results.length} recipes`;

  resultsEl.innerHTML = data.results.map((recipe) => `
    <article class="recipe-card">
      <div class="recipe-emoji">${recipe.emoji}</div>
      <div class="recipe-body">
        <div class="recipe-title-row">
          <h4>${escapeHtml(recipe.name)}</h4>
          <strong>${recipe.match}%</strong>
        </div>
        <div class="meter">
          <span style="width:${recipe.match}%"></span>
        </div>
        <p>${escapeHtml(recipe.description)}</p>
        <div class="ingredients">
          ${recipe.ingredients.split(", ").map((item) =>
            `<span>${escapeHtml(item)}</span>`
          ).join("")}
        </div>
      </div>
    </article>
  `).join("");
}

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

async function search(query) {
  messageEl.className = "message loading";
  messageEl.textContent =
    "Running QVAC locally… The first search may download the model.";
  resultsEl.innerHTML = "";
  statusPill.classList.add("working");

  try {
    const response = await fetch("/api/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query })
    });

    const data = await response.json();

    if (!response.ok) throw new Error(data.error || "Search failed.");

    renderResults(data);
    messageEl.className = "message success";
    messageEl.textContent = "✓ Search completed with local QVAC embeddings.";
  } catch (error) {
    messageEl.className = "message error";
    messageEl.textContent = `Error: ${error.message}`;
  } finally {
    statusPill.classList.remove("working");
  }
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const query = queryInput.value.trim();
  if (query) search(query);
});

document.querySelectorAll("[data-query]").forEach((button) => {
  button.addEventListener("click", () => {
    const query = button.dataset.query;
    queryInput.value = query;
    search(query);
  });
});
