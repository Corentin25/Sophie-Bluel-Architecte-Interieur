
const response = await fetch("http://localhost:5678/api/works");
const data = await response.json();
console.log(data);

for (let i = 0; i < data.length; i++) {

    const sectionGallery = document.querySelector(".gallery");
    const article = document.createElement("article");
    sectionGallery.appendChild(article);

    const imgProject = document.createElement("img");
    imgProject.src = data[i].imageUrl;
    article.appendChild(imgProject);

    const titleProject = document.createElement("h3");
    titleProject.innerText = data[i].title;
    article.appendChild(titleProject);
    titleProject.style.padding = "1em 0em";
}