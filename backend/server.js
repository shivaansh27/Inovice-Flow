import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { clerkMiddleware } from '@clerk/express';
import { ConnectDB } from './config/db.js';
import path from "path";
import invoiceRouter from './routes/invoiceRouter.js';
import aiInvoiceRouter from './routes/aiInvoiceRouter.js/index.js';

const app = express();
const port = 4000;

app.use(clerkMiddleware());
app.use(cors(
   { origin: "http://localhost:5173/",
    credentials: true}
));
app.use(express.json({limit: "20mb"}));
app.use(express.urlencoded({limit: "20mb", extended: true}));

ConnectDB();

app.use("/uploads",express.static(path.join(process.cwd(), "uploads")))

app.use("/api/invoice", invoiceRouter);
app.use("/api/ai",aiInvoiceRouter);

app.get('/',(req,res) => {
    res.send("API WORKING")
});

app.listen(port, () =>{
    console.log(`Server is runnin on http://localhost:${port}`);
})