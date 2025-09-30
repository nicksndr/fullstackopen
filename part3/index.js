const express = require('express')
const cors = require('cors')
const app = express()

app.use(express.json())
app.use(cors()) // <--- enable CORS for all routes

let persons = [
    { id: "1", name: "Arto Hellas", number: "040-123456" },
    { id: "2", name: "Ada Lovelace", number: "39-44-5323523" },
    { id: "3", name: "Dan Abramov", number: "12-43-234345" },
    { id: "4", name: "Mary Poppendieck", number: "39-23-6423122" }
  ]

  //all the persons
  app.get('/api/persons', (request, response) => {
    response.json(persons)
  })

  // info page
  app.get('/info', (req, res) => {
    const entriesCount = persons.length
    const requestTime = new Date().toString()  
    res.send(`Phonebook has info of ${entriesCount} people <br> Request received at: ${requestTime}`)
    //res.send('Info page is working')
  })

  // information for single phonebook entry
  app.get('/api/persons/:id', (req, res) => {
    const id = req.params.id
    
    if(persons.some(p => p.id === id)){
        const person = persons.find(p => p.id === id)
        res.send(`Name: ${person.name}<br>Number: ${person.number}`)
    }else{
        res.send("404 Person not found")
    }
  })

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
