import axios from 'axios';
import { getCookie } from './cookies';
import { env } from './function';

axios.defaults.baseURL = env('BACKEND_SERVER');

axios.interceptors.request.use(function (config) {
    const accessToken = getCookie('accessToken');
    config.headers.Authorization = `Bearer ${accessToken}`;
    return config;
});
