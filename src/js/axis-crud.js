const PIXA_KEY = '27472864-20a91975f294fe19c608dc0e7';
const BASE_URL = 'https://pixabay.com/api/';

import Axios from 'axios';
const params = {
  key: PIXA_KEY,
  q: '',
  image_type: 'photo',
  orientation: 'horizontal',
  safesearch: true,
  per_page: 40,
  page: 1,
};
const instance = Axios.create({
  baseURL: BASE_URL,
});
//functions
//read
async function getPhotos() {
  try {
    const resp = await instance.get('', { params });
    return await resp.data;
  } catch (err) {
    console.log(err);
  }
}
export default { params, getPhotos };
