const express = require('express');
const app = express();
const mongoose = require('mongoose');
const appointmentServices = require('./services/AppointmentServices');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));
app.set('view engine', 'ejs');

mongoose.connect("mongodb://localhost:27017/agendamento", { useNewUrlParser: true, useUnifiedTopology: true });

app.get('/', (req, res) => {
    res.render('index');
})

app.get('/cadastro', (req, res) => {
    res.render('create');
})

app.post('/create', async (req, res) => {
    var status = await appointmentServices.Create(
        req.body.name,
        req.body.email,
        req.body.cpf,
        req.body.description,
        req.body.date,
        req.body.time
    )

    if (status) {
        res.redirect('/');
    } else {
        res.send('ocorreu um erro ao cadastrar');
    }
})

app.get('/getcalendar', async (req, res) => {
    var appointments = await appointmentServices.GetAll(false);
    res.json(appointments);
})

app.get('/event/:id', async (req, res) => {
    var appointment = await appointmentServices.GetById(req.params.id);
    console.log(appointment);
    res.render('event', { appo: appointment });
})

app.post('/finish', async (req, res) => {
    var id = req.body.id;
    var result = await appointmentServices.Finish(id);

    res.redirect('/');
})

app.listen(8080, () => {
    console.log("Server run in http://localhost:8080");
})