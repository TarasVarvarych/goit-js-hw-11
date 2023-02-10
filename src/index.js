// IMPORTS
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import axios from 'axios';
import addMarkup from './addMarkup';
// QUERY SELECTORS
const searchForm = document.querySelector('.search-form');
const galleryEl = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');
// VARS
let page = 1;
let perPage = 40;
let searchCounter = 0;
const URl = 'https://pixabay.com/api/?key=33482948-b5c83a7dc2a9b66355ab60109';
const ligthbox = new SimpleLightbox('.gallery a');
// EVENT LISTENERS
loadMoreBtn.addEventListener('click', onLoadMoreBtnClick);
searchForm.addEventListener('submit', onSearchFormSubmit);
galleryEl.addEventListener('click', onGalleryPictureClick);
// FUNCTIONS
const hideLoadBtn = () => (loadMoreBtn.style.display = 'none');
const showLoadBtn = () => (loadMoreBtn.style.display = 'block');
hideLoadBtn();

function onGalleryPictureClick(e) {
  e.preventDefault();
}

async function onSearchFormSubmit(e) {
  e.preventDefault();
  let searchQuery = searchForm.searchQuery.value.trim();
  searchCounter += 1;
  if (searchQuery === '') {
    Notify.info('Please, enter some text');
  } else if (searchCounter >= 1) {
    galleryEl.innerHTML = '';
    searchCounter = 0;
    page = 1;
  }
  try {
    const pics = await searchPictures(searchQuery);
    let totalHits = pics.data.totalHits;
    if (totalHits === 0) {
      hideLoadBtn();
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    } else if (totalHits === 1) {
      hideLoadBtn();
      Notify.success(`Hooray! We found ${totalHits} image.`);
    } else if (totalHits > 1 && totalHits <= 40) {
      hideLoadBtn();
      Notify.success(`Hooray! We found ${totalHits} images.`);
    } else if (totalHits > 40) {
      showLoadBtn();
      Notify.success(`Hooray! We found ${totalHits} images.`);
    }
    addMarkup(pics, galleryEl);
  } catch (error) {
    console.log(error);
  }
  ligthbox.refresh();
}

async function searchPictures(text) {
  if (text === '') {
    return;
  }
  try {
    const searchResult = await axios.get(
      `${URl}&q=${text}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${perPage}`
    );
    return searchResult;
  } catch (error) {
    console.log(error);
  }
}

async function onLoadMoreBtnClick(e) {
  page += 1;
  let searchQuery = searchForm.searchQuery.value.trim();

  try {
    const pics = await searchPictures(searchQuery);
    let totalHits = pics.data.totalHits;
    if (page > 1 && totalHits - page * perPage < 40) {
      hideLoadBtn();
      Notify.info("We're sorry, but you've reached the end of search results.");
    }
    addMarkup(pics, galleryEl);
  } catch (error) {
    console.log(error);
  }
  ligthbox.refresh();
}
