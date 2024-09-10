console.log("Random Meal Generator using Meal DB-Api");

// selecting DOM elements
const search = document.getElementById("search"),
    submit = document.getElementById("submit"),
    randomMeal = document.getElementById("random"),
    mealEle = document.getElementById("meal"),
    resultHeading = document.getElementById("result-heading"),
    signleMeal = document.getElementById("signle-meal");

// search meal function
function searchMeal(e){
    e.preventDefault();

    //clear signle meal
    signleMeal.innerHTML = "";

    //get the search value

    const text = search.value;
    // console.log(text);

    if(text.trim()){
        fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${text}`)
            .then(res => res.json())
            .then(data=>{
                console.log(data);
                resultHeading.innerHTML = `<h1>Search results for ${text}:</h1>`;

                if(data.meals == null){
                    resultHeading.innerHTML = `<p>There is no such type of Meal ${text}</p>`;
                }
                else{
                    mealEle.innerHTML = data.meals.map(meal=>`
                    <div class="meal"> 
                    <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
                    <div class="meal-info" data-mealId="${meal.idMeal}">
                    <h3>${meal.strMeal}</div>
                    </div>
                    `).join('');
                }
            });

            // clear search text
            search.value = '';
    }else{
        alert("Put right meal text!")
    }
}

//get signle meal by Id
function getMealById(mealId){
    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`)
        .then(res => res.json())
        .then(data =>{
            
            console.log(data);
            const meal = data.meals[0];

            // console.log(meal.strMeal);
            addMealToDOM(meal);  
        });
}

// add signle meal details into DOM
function addMealToDOM(meal){
    const ingredients = [];
    
    for(let i= 1; i<=20; i++){
        if(meal[`strIngredient${i}`]){
            ingredients.push(`${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`)
        }else{
            break;
        }
    }
 
    signleMeal.innerHTML = `
        <div class="signleMeal">
        <h1>${meal.strMeal}</h1>
        <img src="${meal.strMealThumb}" alt="${meal.strMeal}" width="250px" height="250px"/>
        <div class="single-meal-info">
            ${meal.strCategory ? `<p>${meal.strCategory}</p>` : ''}
            ${meal.strArea ? `<p>${meal.strArea}</p>` : ''}
        </div>
        
        <div class=""meal-instruct">
            <p>${meal.strInstructions}</p>
            <h2>Ingredients</h2>
            <ul>
                ${ingredients.map(ing => `<li>${ing}</li>`).join()}
            </ul>
        </div>`;
}

function getRandomMeal(){
    mealEle.innerHTML = "";
    resultHeading.innerHTML = "";

    fetch(`https://www.themealdb.com/api/json/v1/1/random.php`)
        .then(res => res.json())
        .then(data => {
            console.log(data);

            const meal = data.meals[0];

            console.log(meal);

            addMealToDOM(meal);
        })
}
// Event listener when clicking on search meals
submit.addEventListener('submit', searchMeal);
randomMeal.addEventListener('click', getRandomMeal);

mealEle.addEventListener('click', e =>{
    const mealInfo = e.path.find(item => {

        if(item.classList){
            return item.classList.contains('meal-info');

        }
        else{
            return false;
        }
     
    });
    // console.log(mealInfo);

    if(mealInfo){
        const mealId = mealInfo.getAttribute('data-mealid');
        // console.log(mealId);

        getMealById(mealId);

    }
});