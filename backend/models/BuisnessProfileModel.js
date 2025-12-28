import mongoose from "mongoose";
const businessProfileSchema = new mongoose.Schema({
    owner: {
        typeof: String,
        required: true,
        index: true,
    },
    buisnessName: {
        typeof: String,
        required: true
    }
})