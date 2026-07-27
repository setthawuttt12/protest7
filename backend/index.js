require('dotenv').config()
const express = require('express')
const fileupload = require('express-fileupload')
const path = require('path')
const cors = require('cors')
const app = express()

app.use(cors({
    origin:`http://localhost:3000`,
    credentials:true
}))

app.use(express.json())
app.use(fileupload())
app.use('/uploads',express.static(path.join(__dirname,'uploads')))

const profile = require('./routes/profile')
app.use('/api/profile',profile)

const auth = require('./routes/auth')
app.use('/api/auth',auth)

const doc = require('./routes/docnoe')
app.use('/api/docnoe',doc)

const dash = require('./routes/dash')
app.use('/api/dash',dash)

//eva

const edit = require('./routes/Eva/edit_eva')
app.use('/api/Eva/edit_eva',edit)

const self = require('./routes/Eva/selfeva')
app.use('/api/Eva/selfeva',self)

const score_m = require('./routes/Eva/score_member')
app.use('/api/Eva/score_member',score_m)

const score_c = require('./routes/Eva/score_commit')
app.use('/api/Eva/score_commit',score_c)


app.use((req,res)=> res.status(404).json({message:'404 invalid Route77'}))
app.listen(3001, ()=> console.log("Server Runnig in Port 3001✅"))