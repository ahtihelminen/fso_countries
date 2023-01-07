import { useEffect, useState } from "react"
import axios from 'axios' 
import personService from './services/personService'


const Notification = ({identity, message}) => {
  if (identity === 0) {
    return null
  }
  
  if (identity === 1) {
    return (
      <div className="added">
        {message}
      </div>
    )
  }

  if (identity === 2) {
    return (
      <div className="replaced">
        {message}
      </div>
    )
  }

  if (identity === 3) {
    return (
      <div className="deleted">
        {message}
      </div>
    )
  }

  if (identity === 4) {
    return(
      <div className="error">
        {message}
      </div>
    )
  }
}

const Header = ({header}) => {
  return (
    <h2>
      {header}
    </h2>
  )
}

const PersonForm = ({addPerson, newName, handleNameChange, newNumber, handleNumberChange}) => {
  return(
    <form onSubmit={addPerson}>
      <div>
        name: 
      <input 
        value={newName}
        onChange={handleNameChange}
      />
      </div>
      <div>
      number:
      <input
        value = {newNumber}
        onChange = {handleNumberChange}
      />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
}

const Persons = ({persons, filter, handleDelete}) => {
  const filtered = []
  persons.map(person => 
    person.name.toLowerCase().includes(filter.toLowerCase())? filtered.push(person) : null
  )
  return (
    <ul>
      {filtered.map(person => <Person key={person.name} person={person} handleDelete={handleDelete}/>)}
    </ul>
  )
}
const Person = ({person, handleDelete}) => <li>{person.name} {person.number} <button type="button" onClick={() => handleDelete(person.id)}>delete</button></li>

const Filter = ({filter, handleFilterChange}) => {
  return (
    <form>
      <div>
        filter shown with 
      <input 
        value={filter}
        onChange={handleFilterChange}
      />  
      </div>
    </form>
  )
  
}


const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [message, setMessage] = useState(null)
  const [identity, setIdentity] = useState(0)

  useEffect(()=> {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      }
     )
   }, []
  )
  
  
  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }
  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }
  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }

  const handleDelete = (id) => {
    console.log(id)
    const person = persons.find(p => p.id === id)
    if (window.confirm(`Delete ${person.name}?`)) {
      personService
        .del(id)
        .then(returnedPersons => {
          setPersons(returnedPersons)
        })
      setIdentity(3)
      setMessage(`Deleted ${person.name}`)
      setTimeout(() => {
        setIdentity(0)
        setMessage(null)
      }
      , 5000)
    } 
  }

  const addPerson = (event) => {
    event.preventDefault()
    const personObject = {
      name: newName,
      number: newNumber
    }
    if (persons.some(person => person.name === newName)) {
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        const person = persons.find(p => p.name === newName)
        personService
          .update(person.id, personObject)
          .then(returnedPerson => {
            setPersons(persons.map(p => p.id !== person.id ? p : returnedPerson))
            setNewName('')
            setNewNumber('')
          })
          .catch(error => {
            setIdentity(4)
            if (error.code === 'ERR_BAD_REQUEST') {
              setMessage(`${JSON.stringify(error.response.data)}`)
            } else if (error.code === 'ERR_NOT_FOUND') {
              setMessage(`${JSON.stringify(error.response.data)}`)
              personService
                .getAll()
                .then(initialPersons => {
                  setPersons(initialPersons)
                })
                setNewName('')
                setNewNumber('')
            }
            setTimeout(() => {
              setIdentity(0)
              setMessage(null)
            }, 5000)
          })
        setIdentity(2)
        setMessage(`${person.name}'s number has been replaced`)
        setTimeout(() => {
          setIdentity(0)
          setMessage(null)
        }
        , 5000)
      } 

    }
      else {
        personService
          .create(personObject)
          .then(returnedPerson => {
            setPersons(persons.concat(returnedPerson))
            setNewName('')
            setNewNumber('')
            setIdentity(1)
            setMessage(`Added ${newName}`)
            setTimeout(() => {
              setIdentity(0)
              setMessage(null)
            }, 5000)
          })
          .catch(error => {
            setIdentity(4)
            setMessage(`${JSON.stringify(error.response.data)}`)            
            setTimeout(() => {
              setIdentity(0)
              setMessage(null)
            }, 5000)
          })
        
        
      }
  }

  return (
    <div>

      <Header header={'Phonebook'}/>
      <Notification identity={identity} message={message}/>
      <Filter filter={filter} persons={persons} handleFilterChange={handleFilterChange}/>
      
      <Header header={'Add a new'}/>
      <PersonForm addPerson={addPerson} newName={newName} handleNameChange={handleNameChange} newNumber={newNumber} handleNumberChange={handleNumberChange}/>
      
      <Header header={'Numbers'}/>
      <Persons persons={persons} filter={filter} handleDelete={handleDelete}/>

    </div>
  )
}


export default App