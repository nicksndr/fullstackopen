import { useState, useEffect } from 'react'
import axios from 'axios'

const App = () => {
  const [query, setQuery] = useState('')
  const [countries, setCountries] = useState([])
  const [selectedCountry, setSelectedCountry] = useState(null)
  const [weather, setWeather] = useState([])

  const api_key = import.meta.env.VITE_WEATHER_API_KEY

  // code here runs every time selectedCountry changes
  useEffect(() => {
    console.log(selectedCountry)
    if (!selectedCountry) return
  
    const capital = selectedCountry.capital?.[0]
    console.log(capital)
    if (!capital) return
  
    axios
      .get(`https://api.openweathermap.org/geo/1.0/direct?q=${capital}&limit=1&appid=${api_key}`)
      .then(geoResponse => {
        const { lat, lon } = geoResponse.data[0]

        console.log(geoResponse)
        console.log(`https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=minutely,alerts&units=metric&appid=${api_key}`)
  
        return axios.get(`https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=minutely,alerts&units=metric&appid=${api_key}`)
      })
      .then(weatherResponse => {
        console.log("Weather API response:", weatherResponse.data)
        setWeather(weatherResponse.data.daily)
      })
      .catch(error => {
        console.error("Error fetching weather data:", error)
      })
  }, [selectedCountry, api_key])

  useEffect(() => {
    setWeather([])
    if (query) {
      axios
        .get(`https://studies.cs.helsinki.fi/restcountries/api/all`)
        .then(response => {
          const filtered = response.data.filter(country =>
            // use the common name of the country
            country.name.common.toLowerCase().includes(query.toLowerCase())
          )
          setCountries(filtered)
        })
    } else {
      setCountries([])
    }
  }, [query])

  const handleChange = (event) => {
    setQuery(event.target.value)
  }

  const showCountry = (country) => {
    return(
      <div>
      {/* We can't just use countries.languages, because countries is still an array, even if it has only one item. */}
      <h2>{country.name.common}</h2>
      <p>Capital: {country.capital?.[0]}</p>
      <p>Area: {country.area} km²</p>
      <h3>Languages:</h3>
      <ul>
        {/* Turn object into array to iterate over it */}
        {Object.values(country.languages || {}).map(lang => (
          <li key={lang}>{lang}</li>
        ))}
      </ul>
      <img
        src={country.flags.png}
        alt={`Flag of ${country.name.common}`}
        style={{ width: '150px' }}
      />
    {weather.length > 0 && (
      <>
        <h2>Weather in {country.capital?.[0]}</h2>
        {/* You need to use [0] because the daily weather data returned by the OpenWeather API is an array 
        The question mark (?.) is called the optional chaining operator in JavaScript.
        It prevents your code from crashing if a value is undefined or null.*/}
        <p>Temperature: {weather[0].temp.day} °C</p>
        <p>Wind: {weather[0].wind_speed} m/s</p>
        <img src={`https://openweathermap.org/img/wn/${weather[0].weather[0].icon}@2x.png`} alt="Weather icon" />
      </>
    )}
      </div>
    )
  }

  return (
    <div>
      <div>
        find countries: <input value={query} onChange={handleChange} />
      </div>
      <ul>
        {countries.length > 10 && <p>Too many matches, specify another filter</p>}


        {countries.length <= 10 && countries.length > 1 && (
          <ul>
            {countries.map(country => (
              <li key={country.cca3}>
                {country.name.common}{' '}
                <button onClick={() => setSelectedCountry(country)}>Show</button>
              </li>
            ))}
          </ul>
        )}


        {countries.length === 1 && !selectedCountry && setSelectedCountry(countries[0])}

        {selectedCountry && showCountry(selectedCountry)}
      </ul>
    </div>
  )
}

export default App
