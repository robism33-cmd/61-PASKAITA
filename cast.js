const actorsDiv = document.getElementById("actors");
const statusText = document.getElementById("status");
const backLink = document.getElementById("backLink");

const Api = "https://api.tvmaze.com/shows/";

// Gaunu prieiga prie naršyklės dabartinės nuorodos
const params = new URLSearchParams(window.location.search);
const movieId = params.get("id");

// if (!movieId) {
//   statusText.textContent = "";
//   actorsDiv.innerHTML = "<p class='error'>Filmo ID nerastas URL'e.</p>";
// } else {
//   backLink.href = `details.html?id=${movieId}`;
//   getMovieCast();
// }

const actors = `https://api.tvmaze.com/shows/${movieId}/cast`;

function getMovieCast() {
  statusText.textContent = "Kraunami aktoriai...";
  actorsDiv.innerHTML = "";

  fetch(`${actors}`)
    .then((response) => {
      return response.json();
    })
    .then((cast) => {
      actorsDiv.innerHTML = "";

      if (!cast.length) {
        statusText.textContent = "";
        actorsDiv.innerHTML = "<p class='error'>Aktorių nerasta.</p>";
        return;
      }

      // Einame per gauto masyvo realius
      //  duomenis iš tvmaze cast dalies
      cast.forEach((item) => {
        const actor = item.person;
        const character = item.character;

        const img =
          actor.image?.medium ??
          "https://via.placeholder.com/210x295?text=No+Image";

        const div = document.createElement("div");
        div.className = "actor-card";

        div.innerHTML = `

          

          <img src="${img}" alt="${actor.name}">
          <h3>${actor.name}</h3>
          <p>Vaidmuo: ${character?.name ?? "N/A"}</p>
        `;
        actorsDiv.appendChild(div);
      });
      statusText.textContent = `Rasta aktorių: ${cast.length}`;
    })
    .catch((error) => {
      console.log("Įvyko klaida pabandykite vėliau");
    });
}
if (!movieId) {
  statusText.textContent = "";
  actorsDiv.innerHTML = "<p class='error'>Filmo ID nerastas URL'e.</p>";
} else {
  getMovieCast();
}
