var ChuckNorrisJoke = (function () {
    function ChuckNorrisJoke() {
    }
    return ChuckNorrisJoke;
}());
window.onload = function () {
    var jokeBtn = document.getElementById("get-joke");
    jokeBtn.onclick = fetchJoke;
    populateCategories();
};
function fetchJoke() {
    var jokeBtn = this;
    jokeBtn.disabled = true;
    var loaderImg = document.getElementById("loader");
    loaderImg.classList.add("loader");
    var request = new XMLHttpRequest();
    request.onreadystatechange = handleJokeResponse;
    var url = "https://api.icndb.com/jokes/random";
    if (isCategorySelected) {
        url += "?limitTo=[" + getSelectedCategory + "]";
    }
    request.open("GET", url);
    request.send();
}
function isCategorySelected() {
    var list = document.getElementById("cat-list");
    if (list.selectedIndex == 0) {
        return false;
    }
    return true;
}
function getSelectedCategory() {
    var list = document.getElementById("cat-list");
    var index = list.selectedIndex;
    var cat = list.options[index].text;
    return cat;
}
function handleJokeResponse() {
    var request = this;
    if (request.readyState == 4 && request.status == 200) {
        var responseData = JSON.parse(request.responseText);
        var myJoke = responseData.value;
        displayJoke(myJoke);
    }
    else if (request.readyState == 4 && request.status != 200) {
        alert("Please try again later. Something is wrong.");
    }
}
function displayJoke(j) {
    var jokeTxtP = document.getElementById("joke-text");
    jokeTxtP.innerHTML = j.joke;
    var jokeId = document.getElementById("joke-id");
    jokeId.innerHTML = "#" + JSON.stringify(j.id);
    var categoryList = document.getElementById("categories");
    categoryList.innerHTML = "";
    var allCategories = j.categories;
    for (var i = 0; i < allCategories.length; i++) {
        var item = document.createElement("li");
        item.innerHTML = allCategories[i];
        categoryList.appendChild(item);
    }
    var categoryDisplay = document.getElementById("category");
    if (allCategories.length == 0) {
        categoryDisplay.setAttribute("hidden", "true");
    }
    else {
        document.querySelector("h2").removeAttribute("hidden");
        categoryDisplay.removeAttribute("hidden");
    }
    var loaderImg = document.getElementById("loader");
    loaderImg.classList.remove("loader");
    setTimeout(function () {
        var jokeBtn = document.getElementById("get-joke");
        jokeBtn.disabled = false;
    }, 2000);
}
function populateCategories() {
    var request = new XMLHttpRequest();
    request.open("GET", "https://api.icndb.com/categories");
    request.onreadystatechange = function () {
        if (this.readyState == 4 && request.status == 200) {
            var categories = JSON.parse(this.responseText).value;
            console.log(categories);
            populateCatDropDown(categories);
        }
    };
    request.send();
}
function populateCatDropDown(categories) {
    var list = document.getElementById("cat-list");
    for (var i = 0; i < categories.length; i++) {
        var option = document.createElement("option");
        option.text = categories[i];
        list.appendChild(option);
    }
}
