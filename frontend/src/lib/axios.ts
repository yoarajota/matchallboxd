import axios from 'axios'

const api = axios.create({
    baseURL: "http://" + import.meta.env.VITE_BACKEND_DOMAIN + "/api/",
});

api.defaults.withCredentials = true

export default api