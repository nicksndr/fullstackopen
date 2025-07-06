import { useState, useEffect } from 'react'
import axios from 'axios'

const App = () => {
  const [query, setQuery] = useState('')
  const [countries, setCountries] = useState([])
  const [selectedCountry, setSelectedCountry] = useState(null)

  useEffect(() => {
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


        {countries.length === 1 && showCountry(countries[0])}

        {selectedCountry && showCountry(selectedCountry)}
      </ul>
    </div>
  )
}

export default App
