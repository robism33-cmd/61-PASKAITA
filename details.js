const detailsDiv = document.getElementById("details");

const api = "https://api.tvmaze.com/shows/";
// Gaunu prieiga prie naršyklės dabartinės nuorodos
const params = new URLSearchParams(window.location.search);
const movieId = params.get("id");

function getMovieDetails() {
  fetch(`${api}${movieId}`)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      detailsDiv.innerHTML = `<h1>${data.name}</h1>
      ${
        data.image
          ? `<img src="${data.image.original}" alt="nuotrauka">`
          : `Nuotraukos nėra`
      }
          <p><strong>Reitingas: </strong>${
            data.rating?.average ?? `Reitingo nėra`
          }</p>
          <p>${data.summary}</p>`;
    })
    .catch((error) => {
      console.log("Ivyko klaida pabandykite vėliau");
    });
}

function getMovieCast() {
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

getMovieDetails();
detailsDiv.addEventListener("click", () => {
  // Leidžia žmogų nukreipti į puslapį arba vididinį puslapį
  // window.location.href = `cast.html`;
  // Bet būtinai turi būti nukreiptas ir id

  window.location.href = `cast.html?id=${movieId}`;
});
