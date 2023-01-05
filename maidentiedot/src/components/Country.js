import countriesService from "../services/countriesService"
import { useState, useEffect } from "react"

const PrintLanguages = ({country}) => {
    const languages = country['languages']
    const keys = Object.keys(languages)
    return(    
        keys.map(key => 
        <li key={languages[key]}>
            {languages[key]}
        </li>
        )
    )
    
}

const PrintWeather = ({country, api_key}) => {
    const [weather, setWeather] = useState([])

    const lat = country['latlng'][0]
    const lon = country['latlng'][1]
    

    useEffect(() => {
        countriesService
            .getWeather(lat, lon, api_key)
            .then(weather => {
                setWeather(weather)
            })
    }, [lat, lon, api_key])

    if (weather.length === 0) {
    }

    else {
        let imgCode = null
        const imgCodes0 = {2: '11', 3: '09', 6: '13', 7: '50'}
        const imgCodes1 = {50: '10', 51: '13', 52: '09', 53: '09'}
        const imgCodes2 = {800: '01', 801: '02', 802: '03', 803: '04', 804: '04'}
        const imgInfo = weather['weather']['0']
        
        const id = imgInfo['id'].toString()

        if (imgCodes0[`${id[0]}`]) {
            imgCode = imgCodes0[`${id[0]}`]
        }

        else if (imgCodes1[`${id.slice(0,2)}`]) {
            imgCode = imgCodes1[`${id.slice(0,2)}`]
        }

        else if (imgCodes2[`${id}`]) {
            imgCode = imgCodes2[`${id}`]
        }

        else {
            return <p>error in loading image</p>
        }
        const link = `http://openweathermap.org/img/wn/${imgCode}n@2x.png`
        return (
            <div>
                <p>
                    temperature {weather['main']['temp']} Celsius
                </p>
                <img src={link} alt=""/>
                <p>wind {weather['wind']['speed']} m/s</p>
            </div>
        )
    }
    
}

const Country = ({country, api_key}) => {
    return (
        <div>  
            <h1>
                {country['name']['common']}
            </h1>
            <p>
                capital {country['capital']}
            </p>
            <p>
                area {country['area']}
            </p>
            <h2>
                languages
            </h2>
            <ul>
                <PrintLanguages country={country}/>
            </ul>
            <img src={country['flags']['png']} alt=''></img>
            <h3>
                Weather in {country['capital']}
            </h3>
            <PrintWeather country={country} api_key={api_key}/>
        </div>
    )    
}

export default Country