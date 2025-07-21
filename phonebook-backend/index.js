require('dotenv').config()
const express = require('express')
const Contact = require('./models/contact')
var morgan = require('morgan')

const app = express()
app.use(express.static('dist'))
/*
// To use any middleware, you need to use the app.use()
app.use(morgan((token,request, response) => {
    return [
        'tiny',
        ':method'
    ].join(' ')
}))
*/

morgan.token('body', (req) => { return JSON.stringify(req.body) })
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
app.use(express.json())

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

app.get('/info', (request, response, next) => {

  const now = new Date()

  Contact.countDocuments({}).then(count => {
    return response.send(
      `<div>
            Phonebook has info for ${count} people
            <br></br>
            ${now} 
            </div>`
    )
  }).catch(error => next(error))

})


app.get('/api/persons', (request, response, next) => {
  Contact.find({}).then(result => {
    response.json(result)
  }).catch(error => next(error))

})

app.get('/api/persons/:id', (request, response, next) => {
  Contact.findById(request.params.id).then(contact => {
    if(!contact){
      return response.status(404).end()
    }
    return response.json(contact)
  }).catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  const id = request.params.id

  Contact.findByIdAndDelete(id).then(() => {
    return response.status(204).end()
  }).catch(error => next(error))

})

app.put('/api/persons/:id', (request, response, next) => {
  const { name, phone } = request.body
  /*
    find the id
        if not exists
            204
        if it exists
            replace
    */
  Contact.findById(request.params.id).then(contact => {
    if(!contact){
      return response.status(204).end()
    }
    contact.name = name
    contact.phone = phone

    contact.save().then(savedContact => {
      return response.json(savedContact)
    }).catch(error => next(error))
  })
})

app.post('/api/persons', (request, response, next) => {
  const body = request.body

  if(!body.name){
    return response.json({
      error: 'contact name missing'
    })
  }else if(!body.phone){
    return response.json({
      error:'contact number missing'
    })
  }else{
    const contact = new Contact({
      ...body
    })

    contact.save()
      .then(savedContact => {
        response.json(savedContact)
      })
      .catch(error => next(error))
    /* // Checks if contact already exists
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
            */
  }

})
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}
// handler of requests with unknown endpoint
app.use(unknownEndpoint)


const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if(error.name === 'ValidationError'){
    return response.status(400).json({ error: error.message })
  }

  next(error)
}
// this has to be the last loaded middleware, also all the routes should be registered before this!
app.use(errorHandler)

const PORT = process.env.PORT || 3002
app.listen(PORT, () => {
  console.log('Server Running on ' + PORT)
})

