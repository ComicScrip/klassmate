import axios from 'axios';
import browserHistory from './history';

// If our API is deployed somewhere else, we just have to change the
// REACT_APP_API_BASE_URL variable in .env file at the root of the project
const API = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
  withCredentials: true,
});

API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (
      err.response &&
      (err.response.status === 401 || err.response.status === 403) &&
      window.location.pathname !== '/'
    ) {
      browserHistory.push(`/?redirectUrl=${window.location.pathname}`);
    }
    return Promise.reject(err);
  }
);

export default API;
