var appointment = require('../models/Appointment');
var mongoose = require('mongoose');
const Appo = mongoose.model('Appointment', appointment);
var AppointmentFactory = require('../factories/AppointmentFactory');
var mailer = require('nodemailer');
class AppointmentServices {

    async Create(name, email, cpf, description, date, time) {
        var newAppo = new Appo({
            name,
            email,
            cpf,
            description,
            date,
            time,
            finished: false,
            notified: false
        });

        try {
            await newAppo.save();
            return true;
        } catch (err) {
            console.error(err);
            return false;
        }
    }

    async GetAll(showFinished) {
        if (showFinished) {
            return await Appo.find();
        } else {
            var appos = await Appo.find({ 'finished': false });
            var appointments = [];

            appos.forEach(appointment => {
                if (appointment.date != undefined) {
                    appointments.push(AppointmentFactory.Build(appointment))
                }
            });
            return appointments;
        }
    }

    async GetById(id) {
        try {
            var event = await Appo.findOne({ '_id': id });
            return event;
        } catch (err) {
            console.error(err);
            return false;
        }
    }

    async Finish(id) {
        try {
            await Appo.findByIdAndUpdate(id, { finished: true });
            return true;
        } catch (err) {
            console.error(err);
            return false;
        }
    }

    async Search(query) {
        try {
            var appos = await Appo.find().or([{ email: query }, { cpf: query }])
            return appos;
        } catch (err) {
            console.error(err);
            return [];
        }
    }

    async SendNotification() {
        var appos = await this.GetAll(false);
        var transport = mailer.createTransport({
            host: "smtp.mailtrap.io",
            port: 2525,
            auth: {
              user: "41654131314314",
              pass: "65416456166154"
            }
          });

        appos.forEach(async app => {
            var date = app.start.getTime();
            var hour = 1000 * 60 * 5;
            var gap = date - Date.now();
            if (gap <= hour) {
                if (!app.notified) {
                    await Appo.findByIdAndUpdate(app.id, {notified: true});
                    transport.sendMail({
                        from: 'Diego souza <diego@teste.com.br>',
                        to: app.email,
                        subject: 'Sua consulta vai acontecer em breve!',
                        text: 'seu agendamento ocorrerá em uma hora'
                    }).then(() => {
                        console.log(app.email);
                    }).catch((err) => {
                        console.log(err);
                    })
                }
            }
        })
    }
}
module.exports = new AppointmentServices();