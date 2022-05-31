const PIXA_KEY = '27472864-20a91975f294fe19c608dc0e7';
const BASE_URL = 'https://pixabay.com/api';
const perPage = 40;
const PARAMS = `per_page=${perPage}&image_type=photo&orientation=horizontal&safesearch=true`;
import Axios from 'Axios';
//functions
//create
//read
async function getPhotos(searchQuery, page) {
  const resp = await Axios.get(
    `${BASE_URL}/?key=${PIXA_KEY}&q=${searchQuery}&page=${page}&${PARAMS}`,
  );
  return await resp.data;
}
export default { getPhotos };
