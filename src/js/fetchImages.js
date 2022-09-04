import axios from "axios";

const BASE_URL = 'https://pixabay.com/api/';
const KEY = '29531020-3b97d8056313c52b7859c1bca';

export default async function fetchImages(query, page = 1) {
    const params = {
        key: `${KEY}`,
        q: `${query}`,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        per_page: 40,
        page: `${page}`,
    };
  try {
    const response = await axios.get(BASE_URL, {params});
    console.log(response.data)
    return response;
  } catch (error) {
    console.log(error);
  }
}
