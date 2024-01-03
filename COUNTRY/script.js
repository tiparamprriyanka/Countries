const homepageTitle = document.querySelector('.homepage-title');
const subTitle = document.querySelector('.sub-title');
const countriesContainer = document.querySelector('.countries-container');
const filterByRegion = document.querySelector('.filter-by-region');
const searchInput = document.querySelector('.search-container input');
const themeChanger = document.querySelector('.theme-changer');
const sortSelect = document.querySelector('.sort-select'); // Add this line
let allCountriesData;
let alertShown = false;

// Function to show an alert message every 2 seconds
function showWelcomeAlert() {
  setInterval(() => {
    if (!alertShown) {
      const result = confirm('Welcome to the API! Click OK to fetch data.');
      if (result) {
        // If the user clicks OK, hide the welcome message and fetch data
        hideWelcomeMessage();
        fetchData();
        alertShown = true; // Set the flag to true after the alert is shown
      }
    }
  }, 2000);
}

// Function to hide welcome message
function hideWelcomeMessage() {
  homepageTitle.style.display = 'none';
  subTitle.style.display = 'none';
}

// Function to show an error message
function displayErrorMessage(message) {
  countriesContainer.innerHTML = `<p>Error: ${message}</p>`;
}

// Function to fetch data and handle errors
function fetchData() {
  // Show loading message
  countriesContainer.innerHTML = '<p>Loading...</p>';

  // Show header and main sections
  document.querySelector('.header-container').style.display = 'block';
  document.querySelector('main').style.display = 'block';

  fetch('https://restcountries.com/v3.1/all')
    .then((res) => {
      if (!res.ok) {
        throw new Error(`Failed to fetch data. Status: ${res.status}`);
      }
      return res.json();
    })
    .then((data) => {
      allCountriesData = data;
      renderCountries(data);
    })
    .catch((error) => {
      console.error(error);
      displayErrorMessage('Failed to fetch data. Please try again later.');
    });
}

// Function to render countries
function renderCountries(data) {
  countriesContainer.innerHTML = '';

  if (data.length === 0) {
    // Display "Not Found" message
    countriesContainer.innerHTML = '<p>Not Found</p>';
    return;
  }

  data.forEach((country) => {
    const countryCard = document.createElement('a');
    countryCard.classList.add('country-card');
    countryCard.href = `country.html?name=${country.name.common}`;
    countryCard.innerHTML = `
      <img src="${country.flags.svg}" alt="${country.name.common} flag" />
      <div class="card-text">
        <h3 class="card-title">${country.name.common}</h3>
        <p><b>Population: </b>${country.population.toLocaleString('en-IN')}</p>
        <p><b>Region: </b>${country.region}</p>
        <p><b>Capital: </b>${country.capital?.[0]}</p> 
      </div>
    `;
    countriesContainer.append(countryCard);
  });
}

// Event listeners
searchInput.addEventListener('input', (e) => {
  const filteredCountries = allCountriesData.filter((country) =>
    country.name.common.toLowerCase().includes(e.target.value.toLowerCase())
  );
  renderCountries(filteredCountries);
});

filterByRegion.addEventListener('change', () => {
  const selectedRegion = filterByRegion.value;

  const filteredCountries = selectedRegion !== 'Filter by Region'
    ? allCountriesData.filter((country) => country.region === selectedRegion)
    : allCountriesData;

  renderCountries(filteredCountries);
});

themeChanger.addEventListener('click', () => {
  document.body.classList.toggle('dark');
});

// Sorting event listener
sortSelect.addEventListener('change', () => {
  const selectedSort = sortSelect.value;

  let sortedCountries;

  if (selectedSort === 'a-z') {
    sortedCountries = allCountriesData.sort((a, b) => a.name.common.localeCompare(b.name.common));
  } else if (selectedSort === 'z-a') {
    sortedCountries = allCountriesData.sort((a, b) => b.name.common.localeCompare(a.name.common));
  } else {
    // Default sorting or other sorting options
    sortedCountries = allCountriesData;
  }

  renderCountries(sortedCountries);
});

// Show welcome alert every 2 seconds
showWelcomeAlert();
