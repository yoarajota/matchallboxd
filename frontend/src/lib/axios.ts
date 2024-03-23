import axios from 'axios'

function getAuthToken() {
    return localStorage.getItem("access_token") ?? ''
}

const api = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL + "/api/",
});

api.defaults.headers.common['Authorization'] = getAuthToken();
api.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

export default api