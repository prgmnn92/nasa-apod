const selectId = (id) => document.getElementById(id);
const selectQuery = (query) => document.querySelector(query);
const createElement = (element) => document.createElement(element);

const resultsNav = selectId("resultsNav");
const favoritesNav = selectId("favoritesNav");
const imagesContainer = selectQuery(".images-container");
const saveConfirmed = selectQuery(".save-confirmed");
const loader = selectQuery(".loader");

const count = 10;
const apiKey = "DEMO_KEY";
const apiUrl = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&count=${count}`;

let resultsArray = [];
let favorites = {};

function showContent(page) {
  window.scrollTo({ top: 0, behavior: "instant" });
  if (page === "results") {
    resultsNav.classList.remove("hidden");
    favoritesNav.classList.add("hidden");
  } else {
    resultsNav.classList.add("hidden");
    favoritesNav.classList.remove("hidden");
  }
  loader.classList.add("hidden");
}

function createDOMNodes(page) {
  let displayedResults =
    page === "results" ? resultsArray : Object.values(favorites);

  displayedResults.forEach((result) => {
    // Card Container
    const card = createElement("div");
    card.classList.add("card");
    // Link
    const link = createElement("a");
    link.href = result.hdurl;
    link.title = "View Full Image";
    link.target = "_blank";
    // Image
    const image = createElement("img");
    image.src = result.url;
    image.alt = "NASA Picutre of the Day";
    image.loading = "lazy";
    image.classList.add("card-img-top");
    // Card Body
    const cardBody = createElement("div");
    cardBody.classList.add("card-body");
    // Card Title
    const cardTitle = createElement("h5");
    cardTitle.classList.add("card-title");
    cardTitle.textContent = result.title;
    // Add to Favorites
    const saveText = createElement("p");
    saveText.classList.add("clickable");
    if (page === "results") {
      saveText.textContent = "Add to Favorites";
      saveText.setAttribute("onclick", `saveFavorite('${result.url}')`);
    } else {
      saveText.textContent = "Remove Favorite";
      saveText.setAttribute("onclick", `removeFavorite('${result.url}')`);
    }
    // Card Text
    const cardText = createElement("p");
    cardText.classList.add("card-text");
    cardText.textContent = result.explanation;
    // Card Footer
    const footer = createElement("small");
    footer.classList.add("text-muted");
    // Footer Dat
    const date = createElement("strong");
    date.textContent = result.date;
    // Footer Copyright
    const copyrightResult =
      result.copyright === undefined ? "" : result.copyright;
    const copyright = createElement("span");
    copyright.textContent = ` ${copyrightResult}`;

    footer.append(date, copyright);
    cardBody.append(cardTitle, saveText, cardText, footer);
    link.appendChild(image);
    card.append(link, cardBody);

    imagesContainer.appendChild(card);
  });
}

function updateDOM(page) {
  // Get Favorites from locale storage
  let nasaFavorites = localStorage.getItem("nasaFavorites");
  if (nasaFavorites) {
    favorites = JSON.parse(localStorage.getItem("nasaFavorites"));
  }
  imagesContainer.textContent = "";
  createDOMNodes(page);
  showContent(page);
}

// Get 10 Images from NASA API
async function getNasaPictures() {
  //  show loader
  loader.classList.remove("hidden");
  try {
    const response = await fetch(apiUrl);
    resultsArray = await response.json();
    updateDOM("results");
  } catch (error) {
    // Catch Error Here
  }
}

// Add result to favorite
function saveFavorite(itemUrl) {
  // Loop through Results Array to select Favorite
  resultsArray.forEach((item) => {
    if (item.url.includes(itemUrl) && !favorites[itemUrl]) {
      favorites[itemUrl] = item;
      // Show Save Confirmation for 2 s
      saveConfirmed.hidden = false;
      setTimeout(() => {
        saveConfirmed.hidden = true;
      }, 2000);
      //   Set Favorite in local storea
      localStorage.setItem("nasaFavorites", JSON.stringify(favorites));
    }
  });
}

// Remove item from Favorites
function removeFavorite(itemUrl) {
  if (favorites[itemUrl]) {
    delete favorites[itemUrl];
    //   Set Favorite in local storea
    localStorage.setItem("nasaFavorites", JSON.stringify(favorites));
    updateDOM("favorites");
  }
}

// On Load
getNasaPictures();
