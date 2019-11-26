
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
    let url = "https://api.icndb.com/jokes/random";
    if(isCategorySelected){
        url += "?limitTo=[" + getSelectedCategory + "]";
    }
    //Set url to send request to
    request.open("GET", url);
    //initiate request
    request.send();
}

/**
 * Check that a category in the category list is selected if not 
 * return false
 */
function isCategorySelected():boolean{
    let list = <HTMLSelectElement>
                        document.getElementById("cat-list");
    if(list.selectedIndex == 0){
        return false;
    }
    return true;
}

/**
 * return the category(single) that is selected 
 */
function getSelectedCategory():string{
    let list = <HTMLSelectElement>
                document.getElementById("cat-list");
    let index = list.selectedIndex;
    let cat = list.options[index].text;

    return cat;
}

/**
 * Grab joke from database check to see that everything is going right
 */
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

/**
 * Grab all of the variables(joke, ID, category) from the icndb website
 * and displays them to the user
 */

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
        //(request/this) same thang
        if(this.readyState == 4 && request.status == 200){
            let categories:string[] = JSON.parse(this.responseText).value;
            console.log(categories);
            populateCatDropDown(categories);
        }
    }
    request.send();
}

/**
 * Grabbing the categories from icndb database array list of categories
 * add adding it to the drop down menu 
*/
function populateCatDropDown(categories:string[]):void{
    let list = document.getElementById("cat-list");
    for(let i = 0; i < categories.length; i++){
        let option = document.createElement("option");
        option.text = categories[i];
        list.appendChild(option); ///add option to the select
    }
}