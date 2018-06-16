const Joi = require('joi');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const conn = require('./config/db');

mongoose.connect(conn.url);

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error'));
db.once('open', () => {
    console.log('connection established with database');
});

const app = express();

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({extended: true}));

// creates a new schema
const contactSchema = mongoose.Schema({
    name: String,
    email: String
});

// creates an model which creates a document
let Contact = mongoose.model('Contact', contactSchema);


app.get('/api/contacts', (req, res) => {
    // finds each contact on db
    Contact.find((err, result) => {
        res.json(result);
        console.log(result);
    });
});

app.get('/api/contacts/:id', (req, res) => {
    const id = req.params.id;
    Contact.findById(id, (err, contact) => {
        if (!contact) {
            return res.status(404).send('Contact is not found');
        }
        res.send(contact);
    });
});


app.post('/api/contacts/addcontact', (req, res) => {
   

    // creates an instance of Contace with properties 
    let contact = new Contact({
        name: req.body.name,
        email: req.body.email
    });

    // saves new contact information to db
    contact.save((err, result) => {
        if (err) {
            console.log(err);
        }
        res.send(result);
        console.log('successfully added to db');
    });

});

app.put('/api/contacts/updatecontact/:id', (req, res) => {
    const id = req.params.id;
    console.log("###id is", id);
    console.log(JSON.stringify(req.body));
   
    const updatedContact = Contact.where({ _id: id });
    updatedContact.update({
        $set: {
            name: req.body.name, email: req.body.email
        }
    }, (err, contact) => {
        if (err) {
            console.log('error occured');
        }

        res.json(contact);
        console.log('contact successfully updated');
    });
    console.log(updatedContact);
});

app.delete('/api/contacts/deletecontact/:id', (req, res) => {
    const id = req.params.id;
    console.log(req.body.name);
    console.log(JSON.stringify(req.body));
    Contact.remove({ _id: id }, (err, contact) => {
        if (err) {
            console.log('Error occured');
        }
        res.send('Deleted Successfully');

    });
});


const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}`));