'use strict';
// Делаем строгий код. Дальше идет весь код JS-файла
import '../css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import API from './axis-crud';
import photoCardTpl from '../templates/photo-card.hbs';
// import SimpleLightbox from 'simplelightbox';
import SimpleLightbox from 'simple-lightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
//vars
const form = document.querySelector('form');
const searchInput = form.elements.searchQuery;
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');
let page = 1;
let hitCounter = 0;
let lightbox = new SimpleLightbox('.la', {
  //options
  caption: true,
  captionSelector: 'img',
  captionsData: 'alt',
  captionDelay: 250,
});
//functions
function renderGallery(data) {
  data.map(item => {
    hitCounter += 1;
    const photoCard = photoCardTpl(item);
    gallery.insertAdjacentHTML('beforeend', photoCard);
  });
}
function clearGallery() {
  gallery.innerHTML = '';
}
function onSubmit(e) {
  e.preventDefault();
  clearGallery();
  page = 1;
  hitCounter = 0;
  loadMoreBtn.classList.add('invisible');
  const data = API.getPhotos(searchInput.value, page);
  data
    .then(resp => {
      if (resp.length < 1) {
        loadMoreBtn.classList.add('invisible');
        Notify.info('Sorry, there are no images matching your search query. Please try again.');
        return;
      }
      if (hitCounter < 1) {
        Notify.success(`Hooray! We found ${resp.totalHits} images.`);
      }
      renderGallery(resp.hits);
      loadMoreBtn.classList.remove('invisible');
    })
    .catch(onError);
}
function onLoadMore() {
  page++;
  const data = API.getPhotos(searchInput.value, page);
  data
    .then(resp => {
      if (resp.totalHits <= hitCounter) {
        loadMoreBtn.classList.add('invisible');
        Notify.info("We're sorry, but you've reached the end of search results.");
        return;
      }
      renderGallery(resp.hits);
    })
    .catch(onError);
}
function onError() {
  Notify.failure('Oops, something went wrong. Please try again.');
}
//Example
// Retrieving photos of "yellow flowers". The search term q needs to be
// URL encoded:
// https://pixabay.com/api/?key=27472864-20a91975f294fe19c608dc0e7&q=
// yellow+flowers&image_type=photo
form.addEventListener('submit', onSubmit);
loadMoreBtn.addEventListener('click', onLoadMore);
