const PIXA_KEY = '27472864-20a91975f294fe19c608dc0e7';
const BASE_URL = 'https://pixabay.com/api';

import Axios from 'axios';
const instance = Axios.create({
  baseURL: BASE_URL,
});
//functions
//read
async function getPhotos(searchQuery, page, perPage) {
  const params = {
    key: PIXA_KEY,
    q: searchQuery,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    per_page: perPage,
    page: page,
  };
  const resp = await instance.get('', { params });
  return await resp.data;
}
export default { getPhotos };
