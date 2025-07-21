const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}
const password = process.argv[2]

const url = `mongodb+srv://fullstack:${password}@cluster0.ckl9c5v.mongodb.net/phonebookApp?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery',false)

mongoose.connect(url)


const contactSchema = new mongoose.Schema({
  name: String,
  phone: String,
})

const Contact = mongoose.model('Contact', contactSchema)

if(process.argv.length > 3){
  const name = process.argv[3]
  const phone = process.argv[4]

  const contact = new Contact({
    name: name,
    phone: phone
  })

  contact.save().then(() => {
    console.log(`Added ${name} number ${phone} to the phonebook`)
    mongoose.connection.close()
  })
}else{
  Contact.find({}).then(result => {
    result.forEach(contact => {
      console.log(contact)
    })
    mongoose.connection.close()
  })
}
