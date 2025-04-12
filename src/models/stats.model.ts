import mongoose from 'mongoose';

const statsSchema = new mongoose.Schema({
    projectsDone: { type: Number, required: true },
    yearsOfExperience: { type: Number, required: true },
    hoursOfCoding: { type: Number, required: true }, // New field added
    commitsPushed: { type: Number, required: true },
    cupsOfCoffeeConsumed: { type: Number, required: true }
});

export const Stats = mongoose.model('Stats', statsSchema);