const mongoose = require('mongoose')
require('dotenv').config()

if (process.argv.length<3) {
  console.log('Usage: node <script-file> <password> <name> <number>')
  process.exit(1)
}

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]

const url =
    `mongodb+srv://ex7dev:${password}@cluster0.qfqxx3y.mongodb.net/phonebookApp?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery',false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 3){
  Person.find({}).then(result => {
    console.log('phonebook:')
    result.forEach(person => {
      console.log(`${person.name} ${person.number}`)
    })
    mongoose.connection.close()
  }).catch(err => {
    console.log('Error fetching persons:', err)
    mongoose.connection.close()
  })
} else if(process.argv.length === 5){
  const person = new Person({
    name: name,
    number: number,
  })

  person.save().then(res => {
    console.log(`added ${res.name} number ${res.number} to phonebook`)
    mongoose.connection.close()
  }).catch(err => {
    console.log('Error saving person:', err)
    mongoose.connection.close()
  })
} else {
  console.log('Usage: node <script-file> <password> [name] [number]')
  mongoose.connection.close()
}
