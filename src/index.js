import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import axios from 'axios';
const searchForm = document.querySelector('.search-form');
const galleryEl = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');
loadMoreBtn.style.display = 'none';
let page = 1;
let perPage = 40;
let searchCounter = 0;
loadMoreBtn.addEventListener('click', onLoadMoreBtnClick);
const URl = 'https://pixabay.com/api/?key=33482948-b5c83a7dc2a9b66355ab60109';
searchForm.addEventListener('submit', onSearchFormSubmit);

function onSearchFormSubmit(e) {
  let searchQuery = searchForm.searchQuery.value.trim();
  searchCounter += 1;

  e.preventDefault();
  if (searchQuery === '') {
    Notify.info('Enter some text');
  } else if (searchCounter >= 1) {
    galleryEl.innerHTML = '';
    searchCounter = 0;
    page = 1;
  }
  searchPictures(searchQuery).then(pics => {
    let totalHits = pics.data.totalHits;
    if (totalHits === 0) {
      loadMoreBtn.style.display = 'none';
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    } else if (totalHits === 1) {
      loadMoreBtn.style.display = 'none';
      Notify.success(`Hooray! We found ${totalHits} image.`);
    } else if (totalHits > 1 && totalHits <= 40) {
      loadMoreBtn.style.display = 'none';
      Notify.success(`Hooray! We found ${totalHits} images.`);
    } else if (totalHits > 40) {
      loadMoreBtn.style.display = 'block';
      Notify.success(`Hooray! We found ${totalHits} images.`);
    }
    addMarkup(pics);
  });
  // lightbox.refresh();
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
    Notify.failure('Error');
  }
}

async function addMarkup(pics) {
  const markup = await pics.data.hits
    .map(
      ({
        largeImageURL,
        webformatURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => ` <div class="photo-card">
      <a href="${largeImageURL}">
          <img
            class="gallery__image"
            src="${webformatURL}"
            alt="${tags}"
            loading="lazy"
          />
        <div class="info">
          <p class="info-item"><b>Likes</b> <span>${likes}</span></p>
          <p class="info-item"><b>Views</b> <span>${views}</span></p>
          <p class="info-item"><b>Comments </b><span>${comments}</span></p>
          <p class="info-item"><b>Downloads </b><span>${downloads}</span></p>
        </div></a
      >
    </div>`
    )
    .join('');

  galleryEl.insertAdjacentHTML('beforeend', markup);
  new SimpleLightbox('.gallery a');
}

function onLoadMoreBtnClick(e) {
  page += 1;
  let searchQuery = searchForm.searchQuery.value.trim();
  searchPictures(searchQuery).then(pics => {
    let totalHits = pics.data.totalHits;
    if (page > 1 && totalHits - page * perPage < 40) {
      loadMoreBtn.style.display = 'none';
      Notify.info("We're sorry, but you've reached the end of search results.");
    }
    addMarkup(pics);
  });
}

galleryEl.addEventListener('click', onGalleryPictureClick);
function onGalleryPictureClick(e) {
  e.preventDefault();
}
