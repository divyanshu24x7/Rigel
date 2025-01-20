import express from 'express'
import authRouter from './routes/auth.js'
import mongoose from 'mongoose';
import cors from "cors"
const app = express()
const PORT = process.env.PORT || 5000;
const corsOptions = {
    origin: 'http://localhost:3000',
};
//Middleware
app.use(cors(corsOptions));
app.use(express.json())
app.use("/auth", authRouter)

mongoose
    .connect('mongodb://localhost:27017/rigel', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.log('MongoDB connection error:', err));

app.listen(PORT, () => {
    console.log("Server running on port:" + PORT)
})