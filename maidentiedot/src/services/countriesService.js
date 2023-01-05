import axios from 'axios'
const baseURL = 'https://restcountries.com/v3.1/all'

const getCountries = () => {
    const request = axios.get(baseURL)
    return request.then(response => response.data)
}

const getWeather = (lat, lon, api_key) => {
    const request = axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${api_key}&units=metric`)
    return request.then(response => response.data)
}

export default {getCountries, getWeather}
