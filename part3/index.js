const express = require('express')
const app = express()
const PORT = 3001

app.use(express.json())

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
    res.send(`Phonebook has info fo ${entriesCount} people <br> Request received at: ${requestTime}`)
    //res.send('Info page is working')
  })

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
