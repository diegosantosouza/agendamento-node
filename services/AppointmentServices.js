var appointment = require('../models/Appointment');
var mongoose = require('mongoose');
const Appo = mongoose.model('Appointment', appointment);
var AppointmentFactory = require('../factories/AppointmentFactory');
class AppointmentServices {

    async Create(name, email, cpf, description, date, time) {
        var newAppo = new Appo({
            name,
            email,
            cpf,
            description,
            date,
            time,
            finished: false
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
        }else{
            var appos = await Appo.find({'finished': false});
            var appointments = [];
            
            appos.forEach(appointment => {
                if(appointment.date != undefined){
                    appointments.push(AppointmentFactory.Build(appointment))
                }
            });
            return appointments; 
        }
    }

    async GetById(id) {
        try {
            var event = await Appo.findOne({'_id': id});
            return event;
        }catch (err) {
            console.error(err);
            return false;
        }
    }

    async Finish(id) {
        try {
            await Appo.findByIdAndUpdate(id,{finished: true});
            return true;
        }catch (err) {
            console.error(err);
            return false;
        }
    }
}
module.exports = new AppointmentServices();