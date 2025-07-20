import { useState, useEffect } from 'react'
import Filter from './components/Filter'
import Form from './components/Form'
import Persons from './components/Persons'
import phonebookService from './services/phonebook'
import phonebook from './services/phonebook'

const Notification = ({message, notificationType}) => {
  if(message === null) {
    return null
  }
  return (
    <div className={notificationType}>
      {message}
    </div>
  )
}
const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newPhone, setNewPhone] = useState('')
  const [search, setNewSearch] = useState('')
  const [messageObject, setMessageObject] = useState({
    message: null,
    notificationType: null
  })

  useEffect(() => {
    phonebookService 
      .getAll()
      .then(initialPersons => {
        console.log(initialPersons)
        setPersons(initialPersons)
      })
    
  }, [])
  
  const onSubmit = (event) => {
    event.preventDefault()
    const person = persons.find(person => person.name === newName)
    const containsElement = person === undefined ? false : true

    if(!containsElement){
      const personObject = {
        name: newName,
        phone: newPhone
      }
      console.log(personObject)
      phonebookService
        .createPerson(personObject)
        .then(response => {
          setPersons(persons.concat(response))
        })
        .catch(error => {
          setMessageObject({
            message: error.response.data.error,
            notificationType: "error"
          })
          setTimeout(() => {
            setMessageObject({
              message: null,
              notificationType: null
            })
          }, 5000)
          console.log(error.response.data.error)
        })
      setMessageObject({
          message: `Added ${personObject.name}`,
          notificationType: 'success'
      })
      setTimeout(() => {
        setMessageObject({
          message: null,
          notificationType: null
        })
      }, 5000)
      setNewName('')
      setNewPhone('')
      
    }else{
      const replacePerson = window.confirm(`${newName} is already in the Phonebook. Do you want to replace`)
      if(replacePerson){
        const personObject ={...person, phone: newPhone}
        phonebookService
          .replaceNumber(personObject.id, personObject)
          .then(response => {
            setPersons(persons.map(person => person.id !== response.id ? person : response))
          })
          .catch(error => {
            setPersons(persons.filter(person => person.id !== personObject.id))
            setMessageObject(
              {
                message: `Information of ${personObject.name} has already been removed from the servert`,
                notificationType: 'error'
              }
            )
            setTimeout(() => {
              setMessageObject({
                message: null,
                notificationType: null
              })
            }, 5000)


              
          })
      }
      
      
    }
  }
  const onDelete = (id) => {
    phonebookService
      .deletePerson(id)
      .then(response => {
        console.log(response)
        console.log('Is Deleted')
        setPersons(persons.filter(person => person.id !== id))
      })

  }

  const onNameChange = (event) => {
    console.log(event.target.value)
    setNewName(event.target.value)
  }

  const onPhoneChange = (event) => {
    setNewPhone(event.target.value)
  }

  const onSearchChange = (event) => {
    setNewSearch(event.target.value)
  }
  const filteredPersons = persons.filter(person => person.name.includes(search))

  return (
    <div>
      <div>debug: {newName}</div>
      <h2>Phonebook</h2>
      <Notification message={messageObject.message} notificationType={messageObject.notificationType}/>
      <Filter search={search} onChange={onSearchChange} />
      <h2>add new</h2>
      <Form 
        onSubmit={onSubmit} 
        newName={newName} 
        newPhone={newPhone} 
        onNameChange={onNameChange} 
        onPhoneChange={onPhoneChange}/>

      
      <h2>Numbers</h2>
      <div>
        {filteredPersons.map(person => {
          return(
            <Persons 
              key={person.id}
              person={person}
              onDelete={() => onDelete(person.id)}/>

              
            )
          })
        }
      </div>
    </div>
  )
}

export default App