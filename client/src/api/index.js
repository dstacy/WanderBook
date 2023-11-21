import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:5000' });

API.interceptors.request.use((req) => {
  if (localStorage.getItem('profile')) {
    req.headers.Authorization = `Bearer ${JSON.parse(localStorage.getItem('profile')).token}`;
  }

  return req;
});

export const fetchPost = (id) => API.get(`/posts/${id}`);
export const fetchPosts = (page) => API.get(`/posts?page=${page}`);
export const fetchPostsByCreator = (name) => API.get(`/posts/creator?name=${name}`);
//export const fetchPostsBySearch = (searchQuery) => API.get(`/posts/search?searchQuery=${searchQuery.search || 'none'}&tags=${searchQuery.tags}`);
export const fetchPostsBySearch = (searchQuery) => {
  const { search = '', tags = '', site = '', state = '', amps = false, water = false, pets = false, sewer = false, waterfront = false } = searchQuery;

  const queryString = new URLSearchParams({
    search, tags, site, state, amps, water, pets, sewer, waterfront
  }).toString();

  return API.get(`/posts/search?${queryString}`);
};
export const createPost = (newPost) => API.post('/posts', newPost);
export const likePost = (id) => API.patch(`/posts/${id}/likePost`);
export const comment = (value, id) => API.post(`/posts/${id}/commentPost`, { value });
export const updatePost = (id, updatedPost) => API.patch(`/posts/${id}`, updatedPost);
export const deletePost = (id) => API.delete(`/posts/${id}`);

export const signIn = (formData) => API.post('/user/signin', formData);
export const signUp = (formData) => API.post('/user/signup', formData);

export const fetchList = (id) => API.get(`/lists/${id}`);
export const fetchLists = (page) => API.get(`/lists?page=${page}`);
export const createList = (newList) => API.post('/lists', newList);
export const updateList = (id, updatedList) => API.patch(`/lists/${id}`, updatedList);
export const deleteList = (id) => API.delete(`/lists/${id}`);

