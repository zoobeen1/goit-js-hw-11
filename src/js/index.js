'use strict';
// Делаем строгий код. Дальше идет весь код JS-файла
import '../css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import API from './axis-crud';
import refs from './refs';
import photoCardTpl from '../templates/photo-card.hbs';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
//vars
let hitCounter = 0;
const lightbox = new SimpleLightbox('.gallery a');

//functions
function renderGallery(data, scroll = false) {
  const photoCard = photoCardTpl(data);
  refs.gallery.insertAdjacentHTML('beforeend', photoCard);
  lightbox.refresh();
  if (scroll) {
    const { height: cardHeight } = refs.gallery.firstElementChild.getBoundingClientRect();
    window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
    });
  }
}
function clearGallery() {
  refs.gallery.innerHTML = '';
}
function onSubmit(e) {
  e.preventDefault();
  clearGallery();
  API.params.page = 1;
  hitCounter = 0;
  // refs.loadMoreBtn.classList.add('invisible');
  API.params.q = e.target.elements.searchQuery.value;
  API.getPhotos()
    .then(resp => {
      if (resp.total === 0) {
        // refs.loadMoreBtn.classList.add('invisible');
        Notify.info('Sorry, there are no images matching your search query. Please try again.');
        return;
      }
      Notify.success(`Hooray! We found ${resp.total} images.`);
      hitCounter = API.params.per_page;
      renderGallery(resp.hits);
      // refs.loadMoreBtn.classList.remove('invisible');
    })
    .catch(onError);
}
function onLoadMore() {
  API.params.page++;
  API.getPhotos()
    .then(resp => {
      if (resp.totalHits <= hitCounter) {
        // refs.loadMoreBtn.classList.add('invisible');
        Notify.info("We're sorry, but you've reached the end of search results.");
        return;
      }

      hitCounter += API.params.per_page;
      lightbox.refresh();
      renderGallery(resp.hits, true);
    })
    .catch(onError);
}
function onError() {
  Notify.failure('Oops, something went wrong. Please try again.');
}
function everScroll() {
  console.log('ClientHeight ', document.documentElement.clientHeight);
  console.log('InnerHeight ', window.innerHeight);
  console.log('ScrollBottom ', document.documentElement.getBoundingClientRect().bottom);
  if (document.documentElement.getBoundingClientRect().bottom == window.innerHeight) {
    // if (
    //   document.documentElement.getBoundingClientRect().bottom ===
    //   document.documentElement.clientHeight + 100
    // ) {
    console.log('yes');
    onLoadMore();
  }
}

refs.form.addEventListener('submit', onSubmit);
// refs.loadMoreBtn.addEventListener('click', onLoadMore);
window.addEventListener('scroll', everScroll);
