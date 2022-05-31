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
const PER_PAGE = 40;
let page = 1;
let hitCounter = 0;
let lightbox = new SimpleLightbox('.gallery a');

//functions
function renderGallery(data) {
  const photoCard = photoCardTpl(data);
  gallery.insertAdjacentHTML('beforeend', photoCard);
  lightbox.refresh();
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
