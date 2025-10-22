require('dotenv').config()
const express = require('express')
const app = express()
const Person = require('./models/person')  //import the model
// const cors = require('cors')

// app.use(cors())
app.use(express.json())
app.use(express.static('dist'))


//all the persons
app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

// info page
app.get('/info', (request, response) => {
  Person.countDocuments({}).then(count => {
    const requestTime = new Date()
    response.send(`
      <p>Phonebook has info for ${count} people</p>
      <p>${requestTime}</p>
    `)
  })
  })

app.get('/api/persons/:id', (request, response) => {
  Person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
})

  // information for single phonebook entry
  // app.get('/api/persons/:id', (req, res) => {
    // const id = req.params.id
    // if(persons.some(p => p.id === id)){
    //     const person = persons.find(p => p.id === id)
    //     res.send(`Name: ${person.name}<br>Number: ${person.number}`)
    // }else{
    //     res.send("404 Person not found")
    // }
  // })

  // delete phone request
  app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    persons = persons.filter(p => p.id !== id)
  
    response.status(204).end()
  })

  // add new person with POST request
  app.post('/api/persons', (request, response) => {

    if (!request.body.name) {
        return response.status(400).json({ error: 'name is missing' })
      }

    if (!request.body.number) {
        return response.status(400).json({ error: 'number is missing' })
    }

    if (persons.some(p => p.name === request.body.name)) {
        return response.status(400).json({ error: 'name already exists' })
    }

    const person = {
        id: Math.floor(Math.random() * 10000),
        name: request.body.name,
        number: request.body.number
      }
    
      persons.push(person)
      response.json(person)
  })

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
