import express from "express";
import cors from "cors";
const app = express();

const PORT = 5130;

app.use(express.json())
app.use(cors())

app.get("/",(_req,res)=>{
    res.json({
        message: "get method on port 5130! hi"
    })
});
app.listen(PORT, ()=>{
    console.log(`BOOKD server running on http://localhost:${PORT}`)
})