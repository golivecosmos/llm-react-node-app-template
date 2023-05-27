import axios from 'axios';

const requestClient = axios.create({
  baseURL: 'http://localhost:5174',
  headers: {
    'Content-Type': 'application/json'
  }
});

requestClient.interceptors.response.use(
  res => res,
  err => {
    return Promise.reject(err);
  }
);

export { requestClient };
