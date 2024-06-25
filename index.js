const express = require('express')
const {request, response} = require("express");
const app = express()
app.use(express.json())
const cors = require('cors')
app.use(cors())
app.use(express.static('dist'))

var morgan = require('morgan')
//app.use(morgan('tiny')) //Может надо убрать

morgan.token('content', function (req) { return JSON.stringify(req.body) })
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :content'))


let notes = [
    {
        "id": 1,
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": 2,
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": 3,
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": 4,
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    }
]

app.get('/api/persons', (request, response) => {
    response.json(notes)
})

app.get('/api/persons/:id', (request, response) =>{
    const id = Number(request.params.id)
    console.log(request)
    console.log(request.params)
    const note = notes.find(note => note.id ===id)

    if (note){
        response.json(note)
    } else {
        return response.status(404).json({
            error: 'person not found'
        })
    }
})


const dateNow = new Date();

app.get('/info', (request,response)=> {
    response.send(`<p>Phone book has info for ${notes.length} people</p> <p>${dateNow}</p>`)
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id);
    const initialLength = notes.length;
    notes = notes.filter(note => note.id !== id);

    console.log(notes)

    if (notes.length === initialLength) {
        return response.status(404).json({ error: 'person not found' });
    }

    response.status(204).end();
})

function getRandomInRange() {
    return Math.floor(Math.random() * (188000 - 70 + 1)) + 70;
}

app.post('/api/persons', (request, response) => {
    const body = request.body;

    if (!body.name || !body.number){
        return response.status(400).json({
            error: 'name or number is missing'
        })
    }

    const nameExist = notes.find(note => note.name.toLowerCase()
            === body.name.toLowerCase())

    if (nameExist){
        return response.status(400).json({
            error: 'name must be unique'
        })
    }

    const note = {
        id: getRandomInRange(),
        name: body.name,
        number: body.number,
    }

    notes = notes.concat(note)

    response.json(note)
})



const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})