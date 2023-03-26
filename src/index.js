import './css/styles.css';
import { fetchCountries } from './fetchCountries';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const DEBOUNCE_DELAY = 300;
const searchBox = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

searchBox.addEventListener('input', debounce(handleInput, DEBOUNCE_DELAY));
function handleInput(event) {
  event.preventDefault();
  if (event.target.value.trim() !== '') {
    fetchCountries(event.target.value.trim()).then(name => {
      if (name.length > 10) {
        Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
        clearMarkup();
      } else if (name.length === 1) {
        renderCountryInfo(name);
      } else if (name.length > 1 && name.length < 11) {
        renderCountryList(name);
      }
    });
  }
}
function renderCountryList(name) {
  const markup = name
    .map(user => {
      return `
          <li class="list-item">
          <img src="${user.flags.svg}" alt="${user.name.official}" width="60" height="40">
          <p><b>${user.name.official}</b></p>
          </li>
      `;
    })
    .join('');
  countryList.innerHTML = markup;
  countryInfo.innerHTML = '';
}

function renderCountryInfo(name) {
  const markup = name
    .map(user => {
      return `
      <img src="${user.flags.svg}" alt="${
        user.name.official
      }" width="200" height="100">
          <p class="country-name">${user.name.official}</p>
          <ul class="info-list">
            <li class="list-item"><b>Capital</b>: ${user.capital}</li>
            <li class="list-item"><b>Population</b>: ${user.population}</li>
            <li class="list-item"><b>Languages</b>: ${Object.values(
              user.languages
            ).join(',')}</li>
          </ul>
      `;
    })
    .join('');
  countryInfo.innerHTML = markup;
  countryList.innerHTML = '';
}

function clearMarkup() {
  countryInfo.innerHTML = '';
  countryList.innerHTML = '';
}
