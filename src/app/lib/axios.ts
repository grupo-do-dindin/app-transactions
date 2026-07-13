import axios from 'axios';

export const api = axios.create({
    baseURL: 'https://api-ten-ivory-33.vercel.app',
});