const detailsDiv = document.getElementById("details");
const actorsDiv = document.getElementById("actors");
const actorsBtn = document.getElementById("actorsBtn");

const params = new URLSearchParams(window.location.search);
const movieId = params.get("filmas");

const api = "https://api.tvmaze.com/shows/";

if (!movieId) {
  detailsDiv.innerHTML = "<p class='error'>Filmo ID nerastas URL'e.</p>";
  actorsDiv.innerHTML = "";
} else {
  // ✅ mygtukas į atskirą puslapį
  actorsBtn.href = `actors.html?filmas=${movieId}`;

  loadMovieDetails();
  loadActors();
}

function stripHtml(html) {
  const tmp = document.createElement("div");
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || "";
}

function shortText(text, maxLen = 280) {
  if (text.length <= maxLen) return text;
  return text.slice(0, maxLen).trim() + "…";
}

function loadMovieDetails() {
  detailsDiv.innerHTML = "<p class='loading'>Kraunama informacija...</p>";

  fetch(`${api}${movieId}`)
    .then((response) => response.json())
    .then((data) => {
      const rating = data.rating?.average ?? "Nėra";
      const summaryRaw = data.summary ?? "Aprašymo nėra.";
      const clean = stripHtml(summaryRaw);
      const shortSummary = shortText(clean, 300);

      detailsDiv.innerHTML = `
        <h1>${data.name}</h1>
        <p class="meta"><strong>Reitingas:</strong> ${rating}</p>
        <p class="summary">${shortSummary}</p>
      `;
    })
    .catch(() => {
      detailsDiv.innerHTML =
        "<p class='error'>Nepavyko gauti filmo informacijos.</p>";
    });
}

function loadActors() {
  actorsDiv.innerHTML = "<p class='loading'>Kraunami aktoriai...</p>";

  fetch(`${api}${movieId}/cast`)
    .then((response) => response.json())
    .then((cast) => {
      actorsDiv.innerHTML = "";

      if (!cast.length) {
        actorsDiv.innerHTML = "<p class='error'>Aktorių nerasta.</p>";
        return;
      }

      cast.slice(0, 12).forEach((item) => {
        const actor = item.person;
        const character = item.character;

        const imgSrc =
          actor.image?.medium ||
          "https://via.placeholder.com/210x295?text=No+Image";

        const div = document.createElement("div");
        div.className = "actor-card";
        div.innerHTML = `
          <img src="${imgSrc}" alt="${actor.name}">
          <h3>${actor.name}</h3>
          <p>Vaidmuo: ${character?.name ?? "N/A"}</p>
        `;
        actorsDiv.appendChild(div);
      });
    })
    .catch(() => {
      actorsDiv.innerHTML =
        "<p class='error'>Nepavyko gauti aktorių sąrašo.</p>";
    });
}
