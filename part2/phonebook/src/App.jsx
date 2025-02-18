import { useState } from 'react'

const Person = ({ person }) => {
  return (
    <div>{person.name} {person.number}</div>
  )
}

const App = () => {
  // const [persons, setPersons] = useState([
  //   { name: 'Arto Hellas',
  //     number: '929839323' }
  // ]) 

  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456', id: 1 },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
  ])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filterName, setFilterName] = useState('')

  const personsToShow = filterName
  ? persons.filter(person => person.name.toLowerCase().includes(filterName.toLowerCase()))
  : persons;

  const addName = (event) => {
    // prevent default form submission
    // console.log('button clicked', event.target)
    event.preventDefault()

    if (persons.some(person => person.name === newName)) {
      alert(`${newName} is already added to phonebook`);
      return;
    }

    const personObject = {
      name: newName,
      number: newNumber
    }

    setPersons(persons.concat(personObject))
    setNewName('')
    setNewNumber('')
  }

  const handleNameChange = (event) => {
    console.log(event.target.value)
    setNewName(event.target.value)
  }

  const handleFilterChange = (event) => {
    console.log(event.target.value)
    setFilterName(event.target.value)
  }

  const handleNumberChange = (event) => {
    console.log(event.target.value)
    setNewNumber(event.target.value)
  }

  return (
    <div>
      <h2>Phonebook</h2>
      {/* once submitted the HTML default is prevented and the name is added to the list */}
      <form onSubmit={addName}>
        <div>
          filter shown with: <input value={filterName} onChange={handleFilterChange}/>
        </div>
        <h2>add a new</h2>
        <div>
          {/* handles when something is typed to properly display */}
          Name: <input value={newName} onChange={handleNameChange}/>
        </div>
        <div>
          Number: <input value={newNumber} onChange={handleNumberChange}/>
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      <div>
        {personsToShow.map(person => 
          <Person key={person.id} person={person} />
        )}
      </div>
    </div>
  )
}

export default App