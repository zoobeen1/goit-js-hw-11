const PIXA_KEY = '27472864-20a91975f294fe19c608dc0e7';
const BASE_URL = 'https://pixabay.com/api';
// const perPage = 40;
const PARAMS = `image_type=photo&orientation=horizontal&safesearch=true`;

import Axios from 'axios';
//functions
//create
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
  const resp = await Axios.get(
    // `${BASE_URL}/?key=${PIXA_KEY}&q=${searchQuery}&page=${page}&per_page=${perPage}&${PARAMS}`,
    `${BASE_URL}`,
    { params },
  );
  return await resp.data;
}
export default { getPhotos };
