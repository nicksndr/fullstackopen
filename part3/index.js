require('dotenv').config()
const express = require('express')
const app = express()
const Person = require('./persons.js')  //import the model
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

app.get('/api/persons/:id', (request , response) => {
  Person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => {
      console.log(error)
      response.status(400).send({ error: 'malformatted id' })
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
  app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndDelete(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
  })

  // add new person with POST request
  app.post('/api/persons', (request, response) => {

    const body = request.body


    if (!body.name) {
      return response.status(400).json({ error: 'name is missing' })
    }
  
    if (!body.number) {
      return response.status(400).json({ error: 'number is missing' })
    }

    const person = new Person({
        // id: Math.floor(Math.random() * 10000),
        name: body.name,
        number: body.number
      })
    
    // Save to the database
    person.save().then(savedPerson => {
      response.json(savedPerson)
    })
  })

  //update person with PUT request
  app.put('/api/persons/:id', (request, response, next) => {
    const id = request.params.id
    const updatedData = request.body
  
    //new:  If set to true, returns the modified document rather than the original.
    //runValidators:  If true, runs schema validation during the update
    Person.findByIdAndUpdate(id, updatedData, { new: true, runValidators: true })
      .then(updatedItem => {
        if (updatedItem) {
          response.json(updatedItem)
        } else {
          response.status(404).end()
        }
      })
      .catch(error => next(error))
  })

  // 404 handler
  const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
  }
  app.use(unknownEndpoint)

  // ERROR HANDLER
  const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === 'CastError') {
      return response.status(400).send({ error: 'malformatted id' })
    }

    // Handle all other errors
    response.status(500).send({ error: 'something went wrong' })
  }
  app.use(errorHandler)

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
