const searchInput = document.getElementById("searchInput");
const statusText = document.getElementById("status");
const resultsDiv = document.getElementById("results");

// API paprasta nuoroda į serverius kurie gražina informaciją

const allShowsApi = "https://api.tvmaze.com/shows";
const searchShow = "https://api.tvmaze.com/search/shows?q=";

function getAllShows() {
  resultsDiv.innerHTML = "";
  statusText.textContent = "Kraunami filmai...";
  fetch(allShowsApi)
    //   resolve
    .then((response) => {
      // response.json taippat yra promise
      return response.json();
    })
    .then((data) => {
      // data jau yra json paverstas į normalų informacijos tipą
      //   gautus duomenis kaip masyva ištraukiu su forEach ir sudedu į diva
      statusText.textContent = `Užkrauta ${data.length} filmų`;

      renderMovies(data);
    })
    // resolve
    // reject
    .catch((error) => {
      console.log(error);
      statusText.textContent = `Atsiprašome įvyko klaida`;
    });
  //   reject
}
// Ant puslapio užkrovimo paleis pačią funkciją
getAllShows();
// Ivykio formavimo pradzia
searchInput.addEventListener("keypress", (event) => {
  const value = searchInput.value;
  if (event.key === "Enter") {
    if (value.length >= 2) {
      searchShowsByName(value);
    } else {
      getAllShows(); // ✅ kai ištrinama paieška – grąžina visus
    }
  }
});
// Ivikio formavimo pabaiga

// Paieskos funkcijos pradzia
function searchShowsByName(value) {
  resultsDiv.innerHTML = "";
  statusText.textContent = "Ieškoma...";

  fetch(`${searchShow}${value}`)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      const movies = data.map((item) => item.show);

      if (movies.length === 0) {
        statusText.textContent = "Nieko nerasta.";
        return;
      }

      // Paieskos funkcijos pabaiga

      // Atsakymu pateikimas dive pradzia
      renderMovies(movies);

      statusText.textContent = `Rasta: ${movies.length} filmų`;
    })
    // Atsakymu pateikimu dive pabaiga
    .catch((error) => {
      statusText.textContent = "Įvyko klaida ieškant.";
      console.log(statusText);
    });
}
function renderMovies(movies) {
  movies.forEach((movie) => {
    const div = document.createElement("div");
    div.className = "card";
    // Ilgas būdas tikrinti ar reitingas yra:
    // const rating = `Reitingas: ${
    //   movie.rating?.average ? movie.rating.average : "Reitingo nėra"
    // }`;
    // Trumpas būdas tikrinti ar reitingas yra:
    const rating = movie.rating?.average ?? "Reitingo nėra";

    const imgSrc =
      movie.image?.medium ||
      "https://via.placeholder.com/210x295?text=No+Image";

    div.innerHTML = `<img src="${imgSrc}" alt="Nuotrauka">
        <h3>${movie.name} <br> Reitingas ⭐: ${rating}</h3>
        `;
    div.addEventListener("click", () => {
      // Leidžia žmopgų nukreipti į puslapį arba vididinį puslapį
      window.location.href = `details.html?id=${movie.id}`;
    });
    resultsDiv.appendChild(div);
  });
}
