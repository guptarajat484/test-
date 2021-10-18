require('dotenv').config({path:'./config/.env'})
const express=require('express')
const app=express()
const PORT=process.env.PORT||8000
const index_router=require('./routes/index_router')

app.use(express.json())

app.use('/api',index_router)



app.listen(8000,()=>{
    console.log(`Server is running on port ${PORT}`)
})