import axios from "axios";
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import "simplelightbox/dist/simple-lightbox.min.css";
import fetchImages from './js/fetchImages';

const form = document.querySelector('.search-form');
const inputEl = document.querySelector('.search-form input');
const galleryEl = document.querySelector('.gallery');
const buttonLoadEl = document.querySelector('.load-more');

form.addEventListener('submit', searchImage);
galleryEl.addEventListener('click', onClickGallery)
buttonLoadEl.addEventListener('click', onLoadMore);

buttonLoadEl.classList.add('hidden');

let page = 1;
let query = '';
let repeatQuery = null;
let showLightbox = null;

function onClickGallery(event) {
  event.preventDefault();
  if (event.target.nodeName !== 'IMG') {
    return;
  }
}

async function searchImage(e) {
  e.preventDefault();
  page = 1;
  repeatQuery = query;
  query = form.elements.searchQuery.value.trim();

  if (query === '') {
    Notiflix.Notify.info('Please enter a word to search.');
    return;
  }

  if (query === repeatQuery) {
    Notiflix.Notify.info('Please enter a new word to search.');
    return;
  }

  await fetchImages(query, page).then(images => {
  
  if (images.data.total === 0) {
      buttonLoadEl.classList.add('hidden');
      galleryEl.innerHTML = '';
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }

  if (images.data.totalHits > 40) {
  buttonLoadEl.classList.remove('hidden');

  window.scroll({
    top: 0,
    left: 0,
    behavior: 'smooth'
  });}
      
    Notiflix.Notify.success(`Hooray! We found ${images.data.totalHits} images.`);
    galleryEl.innerHTML = '';
      createGallaryMarkup(images.data);
      showLightbox = new SimpleLightbox('.gallery a', { captionDelay: 250 });
    });
};

async function onLoadMore() {
  page += 1;
  console.log(page);
  showLightbox.refresh();

  await fetchImages(query, page).then(images => {
  
    if (Math.floor(images.data.totalHits / 40) < page) {
      Notiflix.Notify.info(
        'We are sorry, but you have reached the end of search results.'
      );

      buttonLoadEl.classList.add('hidden');
      createGallaryMarkup(images.data);
      return;
    }

    createGallaryMarkup(images.data);
    showLightbox = new SimpleLightbox('.gallery a', { captionDelay: 250 });

  const { height: cardHeight } = document
  .querySelector(".gallery")
  .firstElementChild.getBoundingClientRect();
  window.scrollBy({
  top: cardHeight * 2,
  behavior: "smooth"});
  });
};

function createGallaryMarkup(data) {
  const markup = data.hits
    .map(el => {
      return `<div class="photo-card">
      <a href="${el.largeImageURL}">
  <img src="${el.webformatURL}" alt="${el.tags}" loading="lazy" class="photo-card_img"/></a>
  <div class="info">
    <p class="info-item">
      <b>Likes</b><span>${el.likes}</span>
    </p>
    <p class="info-item">
      <b>Views</b><span>${el.views}</span>
    </p>
    <p class="info-item">
      <b>Comments</b><span>${el.comments}</span>
    </p>
    <p class="info-item">
      <b>Downloads</b><span>${el.downloads}</span>
    </p>
  </div>
  </div>
  `;}).join('');
  
  galleryEl.insertAdjacentHTML('beforeend', markup);
}









