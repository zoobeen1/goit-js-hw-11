const PIXA_KEY = '27472864-20a91975f294fe19c608dc0e7';
const BASE_URL = 'https://pixabay.com/api/';

import axios from 'axios';
const params = {
  q: '', //Qery (строка запроса поиска)
  image_type: 'photo',
  orientation: 'horizontal',
  safesearch: true,
  per_page: 40,
  page: 1,
};
const instance = axios.create({
  baseURL: BASE_URL,
});
//functions
//read
async function getPhotos() {
  try {
    const resp = await instance.get('', { params: { key: PIXA_KEY, ...params } });
    return await resp.data;
  } catch (err) {
    console.log(err);
  }
}
export default { params, getPhotos };
