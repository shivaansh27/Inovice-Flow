import mongoose from "mongoose";

export const ConnectDB = async() => {
    await mongoose.connect("mongodb+srv://shivanshsharma2704_db_user:InvoiceFlow-2708@cluster0.evmmzgf.mongodb.net/InvoiceFlow")
    .then(() => {
        console.log('DB CONNECTED');
    })
}