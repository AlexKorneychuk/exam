const button = document.getElementById("search");
const container = document.getElementById("photogrid");
const words = ["earth", "moon", "trees", "volcano", "bird", "space"];
const API_KEY = '4598851-cd6e9cce5ba46c07d51937926';
button.onclick = (e) => {
    let searchWord = document.getElementById("searchfield").value;
    document.getElementById("searchfield").value = "";
    insertImages(searchWord);
    e.preventDefault();
};

//Request to pixabay and insert result
function insertImages(val) {
    let URL = "https://pixabay.com/api/?key=" + API_KEY + "&q=" + encodeURIComponent(val);
    let request = new Request(URL);

    fetch(request).then(function (response) {
        return response.json().then(function (json) {

            if (json.total === 0) {
                container.innerHTML = "";
                let p = document.createElement("p");
                p.classList.add("warning");
                p.innerHTML = "No images found. Try again...";
                container.appendChild(p);
                msnryInitialize();
            } else {

                container.innerHTML = "";
                for (let i = 0; i < 7; i++) {
                    let figure = document.createElement("figure");
                    figure.classList.add("grid-item");
                    figure.innerHTML = `<img src="${json.hits[i].webformatURL}" alt="no image"><figcaption> ${json.hits[i].tags.split(",")[0]}</figcaption>`;
                    container.appendChild(figure);
                }
                msnryInitialize();
            }
        });
    });

}

//Masonry initialize
function msnryInitialize() {
    imagesLoaded(container, () => {
        let msnry = new Masonry(container, {
            itemSelector: '.grid-item',
            columnWidth: '.grid-item',
            percentPosition: true,
            transitionDuration: 0,
        });
    });
}

//First request and insert images
let randomWord = (words[Math.round(Math.random() * (words.length - 1))]);
insertImages(randomWord);