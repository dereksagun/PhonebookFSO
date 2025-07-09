import axios from 'axios'
const baseURL = '/api/persons'

const getAll = () => {
    const request = axios.get(baseURL)
    return request.then(response => {
        console.log(response.data)
        return response.data
    })

}

const createPerson = (personObject) => {
    return (
        axios
            .post(baseURL, personObject)
            .then(response => response.data)
    )
}

const deletePerson = (id) => {
    return(
        axios
            .delete(baseURL + '\/' + id)
            .then(response => response.data)
    )
}

const replaceNumber = (id,personObject) =>{
    return(
        axios
            .put(baseURL + '\/' + personObject.id, personObject)
            .then(response => response.data)
    )
}


export default {getAll , createPerson, deletePerson, replaceNumber}