import {useState, useEffect} from 'react'
import Countries from './components/Countries'
import countriesService from './services/countriesService'
import Country from './components/Country'

const Filter = ({filter, handleFilterChange}) => {
  return (
    <form>
      <div>
        find countries&nbsp;
        <input 
          value={filter}
          onChange={handleFilterChange}
        />
      </div>  
    </form>
  )
}





const App = () => {
  const [countries, setCountries] = useState([])
  const [filter, setFilter] = useState('')
  const [filteredCountries, setFilteredCountries] = useState([])

  const api_key = process.env.REACT_APP_API_KEY

  useEffect(() => {
    countriesService
      .getCountries()
      .then(countries => {
        setCountries(countries)
      })
    }, [])

  useEffect(() => {
    setFilteredCountries(
      countries.filter(country => country['name']['common'].toLowerCase().includes(filter.toLowerCase()))
    )
  }, [countries, filter])


  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }

  const handleShow = (country) => {
    setFilteredCountries([country])
  }

  if (filteredCountries.length > 1) {
    return (
      <div>
        <Filter filter={filter} handleFilterChange={handleFilterChange}/>
        <Countries countries={filteredCountries} handleShow={handleShow}/>
      </div>
    )
  }

  else if (filteredCountries.length ===0) {
    return (
      <div>
        <Filter filter={filter} handleFilterChange={handleFilterChange}/>
        <p>No countries found</p>
      </div>
    )
  }

  else {
    return (
      <div>
        <Filter filter={filter} handleFilterChange={handleFilterChange}/>
        <Country country={filteredCountries['0']} api_key={api_key}/>
      </div>
    )
  }
}

export default App