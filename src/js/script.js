'use strict';
// Делаем строгий код. Дальше идет весь код JS-файла
import '../css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import API from './axis-crud';
import photoCardTpl from '../templates/photo-card.hbs';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
//vars
const form = document.querySelector('form');
const searchInput = form.elements.searchQuery;
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');
// const PER_PAGE = 40;
// API.params.page = 1;
let hitCounter = 0;
let lightbox = new SimpleLightbox('.gallery a');

//functions
function renderGallery(data) {
  const photoCard = photoCardTpl(data);
  gallery.insertAdjacentHTML('beforeend', photoCard);
  lightbox.refresh();
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();
  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}
function clearGallery() {
  gallery.innerHTML = '';
}
function onSubmit(e) {
  e.preventDefault();
  clearGallery();
  API.params.page = 1;
  hitCounter = 0;
  loadMoreBtn.classList.add('invisible');
  API.params.q = searchInput.value;
  const data = API.getPhotos();
  data
    .then(resp => {
      if (resp.length < 1) {
        loadMoreBtn.classList.add('invisible');
        Notify.info('Sorry, there are no images matching your search query. Please try again.');
        return;
      }
      Notify.success(`Hooray! We found ${resp.totalHits} images.`);
      hitCounter = API.params.per_page;
      renderGallery(resp.hits);
      loadMoreBtn.classList.remove('invisible');
    })
    .catch(onError);
}
function onLoadMore() {
  API.params.page++;
  // API.params.q = searchInput.value;
  const data = API.getPhotos();
  data
    .then(resp => {
      if (resp.totalHits < hitCounter) {
        loadMoreBtn.classList.add('invisible');
        Notify.info("We're sorry, but you've reached the end of search results.");
        return;
      }

      hitCounter += API.params.per_page;
      lightbox.refresh();
      renderGallery(resp.hits);
    })
    .catch(onError);
}
function onError() {
  Notify.failure('Oops, something went wrong. Please try again.');
}

form.addEventListener('submit', onSubmit);
loadMoreBtn.addEventListener('click', onLoadMore);
