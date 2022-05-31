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
const PER_PAGE = 40;
let page = 1;
let hitCounter = 0;

//functions
function renderGallery(data) {
  const photoCard = photoCardTpl(data);
  console.log(photoCard);
  gallery.insertAdjacentHTML('beforeend', photoCard);
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
  const data = API.getPhotos(searchInput.value, page, PER_PAGE);
  data
    .then(resp => {
      if (resp.length < 1) {
        loadMoreBtn.classList.add('invisible');
        Notify.info('Sorry, there are no images matching your search query. Please try again.');
        return;
      }
      Notify.success(`Hooray! We found ${resp.totalHits} images.`);
      hitCounter = PER_PAGE;
      renderGallery(resp.hits);
      loadMoreBtn.classList.remove('invisible');
    })
    .catch(onError);
}
function onLoadMore() {
  const data = API.getPhotos(searchInput.value, page + 1, PER_PAGE);
  data
    .then(resp => {
      if (resp.totalHits < hitCounter) {
        loadMoreBtn.classList.add('invisible');
        Notify.info("We're sorry, but you've reached the end of search results.");
        return;
      }
      page++;
      hitCounter += PER_PAGE;
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
let lightbox = new SimpleLightbox('.gallery a', {
  //options
  caption: true,
  captionSelector: 'img',
  captionsData: 'alt',
  captionDelay: 250,
});
