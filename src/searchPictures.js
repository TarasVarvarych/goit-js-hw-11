import axios from 'axios';
export default async function searchPictures(text, page = 1, perPage = 40) {
  const URl = 'https://pixabay.com/api/?key=33482948-b5c83a7dc2a9b66355ab60109';

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
