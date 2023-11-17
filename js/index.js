let solarSystemArray = populateSolarSystemArray(); //saving the fetched data of the solar system

const displayElem = document.querySelector(".planetInfo"); // display element to display planet info

// returns a list of nodes/elements with classname planet
const listOfPlanet = document.querySelectorAll(".planet");

//iterating over the list of nodes/elements to add onclick event listener
listOfPlanet.forEach((planetElem) => {
  planetElem.addEventListener("click", async () => {
    let planetName = planetElem.id;

    const planet = getplanet(solarSystemArray, planetName);

    showPlanetDetils();

    displayPlanet(planet);
  });
});

// poulating solar syatem array
async function populateSolarSystemArray() {
  const apiKey = await getApiKey();
  solarSystemArray = await fetchSolarSystem(apiKey);
}

// fetching the api key
async function getApiKey() {
  try {
    let response = await fetch(
      "https://n5n3eiyjb0.execute-api.eu-north-1.amazonaws.com/keys",
      {
        method: "POST",
      }
    );
    const keyValue = await response.json();
    return keyValue.key;
  } catch (error) {
    console.log("could not get API key");
  }
}

//fetching the data of the solar system
async function fetchSolarSystem(apiKey) {
  try {
    let response = await fetch(
      "https://n5n3eiyjb0.execute-api.eu-north-1.amazonaws.com/bodies",
      {
        method: "GET",
        headers: { "x-zocom": apiKey },
      }
    );
    const data = await response.json();

    return data.bodies;
  } catch (error) {
    console.log("could not get data for solar system");
  }
}

// filtering the data of the planet clicked out from the solar system array
function getplanet(solarSystemArray, planetName) {
  let planet = solarSystemArray.filter(
    (planet) => planet.name.toUpperCase() === planetName.toUpperCase()
  );
  return planet;
}

// display the info of the planet clicked
function displayPlanet(planet) {
  let isMoonPresent = ""; //checking if moon is present
  if (planet[0].moons.length === 0) {
    isMoonPresent = false;
  } else {
    isMoonPresent = true;
  }

  displayElem.innerHTML = ` <p class="planet-name">${planet[0].name.toUpperCase()} </p>
  <p class="latin-name">${planet[0].latinName.toUpperCase()} </p>
  <p class="desc">${planet[0].desc} </p>
  <section class="details">
  <p class="detail detail1">OMKRETS</p>
  <p class="detail-value value1">${planet[0].circumference}</p>
  <p class="detail detail2">KM FRÅN SOLEN</p>
  <p class="detail-value value2">${planet[0].distance}</p>
  <p class="detail detail3">MAX TEMPERATUR</p>
  <p class="detail-value value3">${planet[0].temp.day}</p>
  <p class="detail detail4">MIN TEMPERATUR</p>
  <p class="detail-value value4">${planet[0].temp.night}</p>
  </section>
  <p class="detail">  MÅNAR</p>
  <p class="value5">${
    isMoonPresent ? planet[0].moons.join(" , ") : "No Moons"
  }</p>
  <button class="button" onClick=closePlanetDetails()>Back</button>
  `;
}

//pop-up to display planet details
function showPlanetDetils() {
  document.getElementById("solarSys").style.opacity = 0.3;
  document.getElementById("planet-info").style.display = "block";
}

//closing pop-up to go back to main page
function closePlanetDetails() {
  document.getElementById("planet-info").style.display = "none";
  document.getElementById("solarSys").style.display = "flex";
  document.getElementById("solarSys").style.opacity = 1;
}
