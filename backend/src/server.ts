import express from "express";
import cors from "cors";
import dotenv from "dotenv"
import { connectDB } from "./conifg/db";
import mongoose from "mongoose";
import { connected } from "node:process";
import authRoutes from "./routes/authRoutes"
import favouriteRoutes from "./routes/favouriteRoutes";
import ratingRoutes from "./routes/ratingRoutes";
dotenv.config();
const app = express();

const PORT = process.env.PORT || 5000;

app.use(express.json())
app.use(cors())
app.use("/api/auth", authRoutes)
app.use("/api/favourites", favouriteRoutes)
app.use("/api/ratings", ratingRoutes);
app.get("/",(_req,res)=>{
    res.json({
        message: "get method on port 5000! hi"
    });
});
connectDB().then(()=>{
    app.listen(PORT, ()=>{
    console.log(`BOOKD server running on http://localhost:${PORT}`)
})
})

// app.get("/api/test-db", async(_req,res)=>{
//     try{
//         const collections = await mongoose.connection.db?.listCollections().toArray();
//         res.json({
//             connected : mongoose.connection.readyState === 1,
//             collections: collections?.map((collection)=>collection.name)
//         })
//     }
//     catch(error){
//         res.status(500).json({
//             message : "Database test failed"
//         });
//     }
// })