import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:5000' });

API.interceptors.request.use((req) => {
  if (localStorage.getItem('profile')) {
    req.headers.Authorization = `Bearer ${JSON.parse(localStorage.getItem('profile')).token}`;
  }

  return req;
});

export const fetchCampgroundSearch = (pname) => API.get(`/campgrounds/${pname}`);
export const fetchCampgroundDetails = (contractCode, parkId ) => API.get(`/campgrounds/${contractCode, parkId}`);