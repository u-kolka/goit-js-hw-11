import axios from "axios";
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import "simplelightbox/dist/simple-lightbox.min.css";
import fetchImages from './js/fetchImages';

const form = document.querySelector('.search-form');
const inputEl = document.querySelector('.search-form input');
const galleryEl = document.querySelector('.gallery');
const buttonLoadEl = document.querySelector('.load-more');
buttonLoadEl.classList.remove('load-more')

form.addEventListener('submit', searchImage);
galleryEl.addEventListener('click', onClickGallery)
buttonLoadEl.addEventListener('click', onLoadMore);

let page = 1;
let query = '';
let showLightbox = new SimpleLightbox('.gallery a', { captionDelay: 200 });

function onClickGallery(event) {
  event.preventDefault();

  if (event.target.nodeName !== 'IMG') {
    return;
  }
}



function searchImage(e) {
    e.preventDefault();
    query = form.elements.searchQuery.value.trim();
    console.log(query);
  
    fetchImages(query, page).then(images => {
    if (images.data.total === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }
    if (images.data.totalHits > 40) {
      buttonLoadEl.removeAttribute('hidden');
      buttonLoadEl.classList.add('load-more')
    }
    Notiflix.Notify.success(`Hooray! We found ${images.data.totalHits} images.`);
    galleryEl.innerHTML = '';
    createGallaryMarkup(images.data);
    });
 
};

function onLoadMore() {
  page += 1;
  console.log(page);

  fetchImages(query, page).then(images => {
    if (Math.floor(images.data.totalHits / 40) < page) {
      Notiflix.Notify.info(
        'We are sorry, but you have reached the end of search results.'
      );
      galleryEl.insertAdjacentHTML('beforeend', createGallaryMarkup(images.data));
      return;
    }
    galleryEl.insertAdjacentHTML('beforeend', createGallaryMarkup(images.data));
    showLightbox.refresh();

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









