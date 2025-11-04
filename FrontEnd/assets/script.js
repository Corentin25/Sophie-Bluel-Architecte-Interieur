/* DATA RETRIEVAL AND RUN */

let data = [];

async function run() {

  const works = await fetch("http://localhost:5678/api/works");
  data = await works.json();
  console.log("All works : ", data);

  const token = localStorage.getItem("authToken");
  if (token) {
    console.log("Vous êtes en mode administrateur");
    activAdminMood();
  }

  genererWorks();
  activeFilters();
}

/* GENERATE ALL WORKS */

const sectionGallery = document.querySelector(".gallery");

function genererWorks(arrayWorks = data) {

  sectionGallery.innerHTML = "";

  for (let i = 0; i < arrayWorks.length; i++) {

    const article = document.createElement("article");
    sectionGallery.appendChild(article);

    const imgProject = document.createElement("img");
    imgProject.src = arrayWorks[i].imageUrl;
    imgProject.alt = "Projet";
    article.appendChild(imgProject);

    const titleProject = document.createElement("h3");
    titleProject.innerText = arrayWorks[i].title;
    article.appendChild(titleProject);
    titleProject.style.padding = "1em 0em";
  }
}

/* FILTERS */

const filters = document.querySelector(".filters");

function activeFilters() {

  const withoutFilter = document.createElement("button");
  withoutFilter.textContent = "Tous";
  filters.appendChild(withoutFilter);
  withoutFilter.addEventListener("click", () => {
    genererWorks();
    activeButton(withoutFilter);
  });

  const objectFilter = document.createElement("button");
  objectFilter.textContent = "Objets";
  filters.appendChild(objectFilter);
  objectFilter.addEventListener("click", () => {
    const filtered = data.filter((work) => work.categoryId === 1);
    genererWorks(filtered);
    activeButton(objectFilter);
    console.log("Objects : ", filtered);
  });

  const appartmentsFilter = document.createElement("button");
  appartmentsFilter.textContent = "Appartements";
  filters.appendChild(appartmentsFilter);
  appartmentsFilter.addEventListener("click", () => {
    const filtered = data.filter((work) => work.categoryId === 2);
    genererWorks(filtered);
    activeButton(appartmentsFilter);
    console.log("Appartments : ", filtered);
  });

  const hotelsFilter = document.createElement("button");
  hotelsFilter.textContent = "Hôtels & Restaurants";
  filters.appendChild(hotelsFilter);
  hotelsFilter.addEventListener("click", () => {
    const filtered = data.filter((work) => work.categoryId === 3);
    genererWorks(filtered);
    activeButton(hotelsFilter);
    console.log("Hotels & Restaurants : ", filtered);
  });

  const allbuttons = [withoutFilter, objectFilter, appartmentsFilter, hotelsFilter];
  function activeButton(newButton) {
    allbuttons.forEach((previousButton) => previousButton.classList.remove("active"));
    newButton.classList.add("active");
  };

  activeButton(withoutFilter);
};

/* ADMIN MOOD */

const logOut = document.querySelector(".logInOut");

function activAdminMood() {

  logOut.textContent = "logout";
  logOut.removeAttribute("href");
  logOut.style.cursor = "pointer";
  logOut.addEventListener("click", () => {
    localStorage.removeItem("authToken");
    window.location.href = "index.html";
  });

  const editionMarker = document.querySelector(".editionMood");
  editionMarker.style.display = "flex";
  const header = document.querySelector("header")
  header.style.marginTop = "5.5em";

  filters.style.display = "none";
  
  const editProjects = document.querySelector(".editProjects");
  editProjects.style.display = "flex";
}

run();




