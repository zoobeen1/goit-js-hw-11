'use strict';
// Делаем строгий код. Дальше идет весь код JS-файла

import { Notify } from 'notiflix/build/notiflix-notify-aio';
import API from './axis-crud';
const form = document.querySelector('form');
const searchInput = form.elements.searchQuery;
//functions
function onSubmit(e) {
  e.preventDefault();

  console.log(API.getPhotos(searchInput.value));
}
//Example
// Retrieving photos of "yellow flowers". The search term q needs to be
// URL encoded:
// https://pixabay.com/api/?key=27472864-20a91975f294fe19c608dc0e7&q=
// yellow+flowers&image_type=photo
form.addEventListener('submit', onSubmit);
