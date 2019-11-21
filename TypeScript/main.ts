
/**
 * represents single joke about chuck norris
 * from icndb.com
 */
class ChuckNorrisJoke{
    /**
     * unique ID of the joke
     */
    id:Number;
    /**
     * The text of the joke
     */
    joke:string;
    /**
     * either blank, nerdy, or explicit
     */
    categories:string[];
}

window.onload = function(){
    let jokeBtn = document.getElementById("get-joke");
    jokeBtn.onclick = fetchJoke;
    populateCategories();
}

function fetchJoke(){
    let jokeBtn = <HTMLButtonElement> this;
    jokeBtn.disabled = true;

    let loaderImg = document.getElementById("loader");
    loaderImg.classList.add("loader");

    //Hold the JSON response from the server
    let request = new XMLHttpRequest();
    //function to decide what happen when recieve answer
    //based on answer(system down: cant do anything, answer:display)
    request.onreadystatechange = handleJokeResponse;

    //Set url to send request to
    request.open("GET", "https://api.icndb.com/jokes/random");
    //initiate request
    request.send();
}

function handleJokeResponse(){
    let request = <XMLHttpRequest> this;
    //ready state 4(request completed) && 
    //status 200(Everything is successful)
    if (request.readyState == 4 && request.status == 200) {
        let responseData = JSON.parse(request.responseText);
        let myJoke = <ChuckNorrisJoke>responseData.value;
        displayJoke(myJoke);
        //console.log(myJoke.joke);
        //console.log(myJoke);
    }
    else if(request.readyState == 4 && request.status != 200){
        alert("Please try again later. Something is wrong.")
    }
}

function displayJoke(j:ChuckNorrisJoke):void{
    let jokeTxtP = document.getElementById("joke-text");
    jokeTxtP.innerHTML = j.joke;

    let jokeId = document.getElementById("joke-id");
    jokeId.innerHTML = "#" + JSON.stringify(j.id);

    let categoryList = document.getElementById("categories");
    categoryList.innerHTML = "";

    let allCategories = j.categories;
    for (let i = 0; i < allCategories.length; i++) {
        let item = document.createElement("li");
        item.innerHTML = allCategories[i];
        categoryList.appendChild(item);
    }

    let categoryDisplay = document.getElementById("category");
    if(allCategories.length == 0){
        //categoryDisplay.style.display = "none";
        categoryDisplay.setAttribute("hidden", "true");
    }
    else{
        //categoryDisplay.style.display = "block";
        document.querySelector("h2").removeAttribute("hidden");
        categoryDisplay.removeAttribute("hidden")
    }

    //remove the loader img
    let loaderImg = document.getElementById("loader");
    loaderImg.classList.remove("loader");

    //Display btn again
    setTimeout(function(){
        let jokeBtn = <HTMLButtonElement> document.getElementById("get-joke");
        jokeBtn.disabled = false;
    }, 2000)
}

/**
 * Display categories in a dropdown list
 */
function populateCategories(){
    let request = new XMLHttpRequest();
    request.open("GET", "https://api.icndb.com/categories" );

    request.onreadystatechange = function(){
        //request or this same thang
        if(this.readyState == 4 && request.status == 200){
            let categories:string[] = JSON.parse(this.responseText).value;
            console.log(categories);
        }
    }

    request.send();
}