import axios from 'axios'

function getAuthToken() {
    const token = localStorage.getItem("access_token")

    if (token) {
        return "Bearer " + token
    }
    
    return ''
}

const api = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL + "/api/",
});

api.defaults.headers.common['Authorization'] = getAuthToken();
api.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

export default api