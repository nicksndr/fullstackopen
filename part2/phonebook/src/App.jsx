import { useState, useEffect } from 'react';
import axios from 'axios';
import personService from './services/persons'

const Filter = ({ filterName, handleFilterChange }) => {
  return (
    <div>
      Filter shown with: <input value={filterName} onChange={handleFilterChange} />
    </div>
  )
}


const PersonForm = ({ newName, newNumber, handleNameChange, handleNumberChange, addName }) => {
  return (
    <form onSubmit={addName}>
      <div>
        Name: <input value={newName} onChange={handleNameChange} />
      </div>
      <div>
        Number: <input value={newNumber} onChange={handleNumberChange} />
      </div>
      <div>
        <button type="submit">Add</button>
      </div>
    </form>
  )
}

const Persons = ({ personsToShow, removePerson }) => {
  return (
    <div>
      {personsToShow.map(person => (
        <Person key={person.id} person={person} removePerson={removePerson} />
      ))}
    </div>
  );
};


const Person = ({ person, removePerson }) => {
  return (
    <div>
      {person.name} {person.number}
      <button onClick={() => removePerson(person.id, person.name)}>delete</button>
    </div>
  );
};


const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filterName, setFilterName] = useState('')

  // Fetch data from JSON server when the component loads
  useEffect(() => {
  console.log('effect')
  axios.get('http://localhost:3001/persons')
    .then(response => {
      setPersons(response.data); // Set state with fetched data
    })
    .catch(error => {
      console.error("Error fetching data:", error);
    });
  }, []); // Empty dependency array means it runs once when the component mounts

  const personsToShow = filterName
  ? persons.filter(person => person.name.toLowerCase().includes(filterName.toLowerCase()))
  : persons;

  const addName = (event) => {
    // prevent default form submission
    // console.log('button clicked', event.target)
    event.preventDefault()

    if (persons.some(person => person.name === newName)) {
      if (persons.some(person => person.number === newNumber)){
        alert(`${newName} is already added to phonebook`);
        return;
      } else {
        if (!window.confirm(`${newName} is already added to phonebook, replace the old number with a new one`)) return;
        
        const existingPerson = persons.find(person => person.name === newName);
        const updatedPerson = { ...existingPerson, number: newNumber };

        personService
          .update(existingPerson.id, updatedPerson)
          .then(updatedPerson => {
            setPersons(persons.map(person => person.id !== updatedPerson.id ? person : updatedPerson))
          })
      }
    }


    const personObject = {
      name: newName,
      number: newNumber
    }

    personService
    .create(personObject)
    .then(newPerson => {
      setPersons(persons.concat(newPerson));
      setNewName('');
      setNewNumber('');
    })
    .catch(error => {
      console.error("Error adding person:", error);
    });
  };

  const removePerson = (id, name) => {
    if (!window.confirm(`Delete ${name}?`)) return;
  
    personService
      .remove(id)
      .then(() => {
        setPersons(persons.filter(person => person.id !== id));
      })
      .catch(error => {
        console.error("Error removing person:", error);
      });
    };


  return (
    <div>
      <h2>Phonebook</h2>
      <Filter filterName={filterName} handleFilterChange={(e) => setFilterName(e.target.value)} />
      <h3>Add a new</h3>
      <PersonForm 
        newName={newName} newNumber={newNumber} 
        handleNameChange={(e) => setNewName(e.target.value)}
        handleNumberChange={(e) => setNewNumber(e.target.value)}
        addName={addName} 
      />
      <h3>Numbers</h3>
      <Persons personsToShow={personsToShow} removePerson={removePerson} /> 
      {/* Also need to add removePerson here */}
    </div>
  )
}

export default App