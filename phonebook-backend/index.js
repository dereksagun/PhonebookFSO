const express = require('express')
var morgan = require('morgan')

const app = express()
/*
// To use any middleware, you need to use the app.use()
app.use(morgan((token,request, response) => {
    return [
        'tiny',
        ':method'
    ].join(' ')
}))
*/

morgan.token('body', (req, res) => { return JSON.stringify(req.body) })
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
app.use(express.json())



let phonebook = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]
/*
const requestLogger = (request, response, next) => {
    console.log('Method:', request.method)
    console.log('Path:  ', request.path)
    console.log('Body:  ', request.body)
    console.log('---')
    next()
  }
  
app.use(requestLogger)
*/
app.get('/api/persons', (request, response) => {
    response.json(phonebook)
})

app.get('/info', (request, response) => {
    const numberOfContacts = phonebook.length
    const now = new Date()

    response.send(
        `<div>
        Phonebook has info for ${numberOfContacts} people
        <br></br>
        ${now} 
        </div>`
)
})

app.get('/api/persons/:id', (request, response) => {
    const contact = phonebook.find(contact => contact.id === request.params.id)

    if(contact){
        response.json(contact)
    }else{
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    phonebook = phonebook.filter(p => p.id !== id)
    
    response.status(204).end()
})

app.post('/api/persons', (request, response) => {
    const body = request.body
    
    if(!body.name){
        return response.json({
            error: 'contact name missing'
        })
    }else if(!body.number){
        return response.json({
            error:'contact number missing'
        })
    }else{
        const alreadyExists = phonebook.find(p => p.name === body.name)
        if(alreadyExists){
            return response.json({
                error: "name must be unique"
            })
        }else{
            const randomId = Math.floor(Math.random()*(1000))
            const person = {
                ...body, 
                id: String(randomId)
            }
            phonebook = phonebook.concat(person)
            return response.json(person)
        }
    }

})
/*
const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
  }
  
app.use(unknownEndpoint)
*/

const PORT = 3003
app.listen(PORT, () => {
    console.log("Server Running on " + PORT)
})

