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

//eva

const edit = require('./routes/Eva/edit_eva')
app.use('/api/Eva/edit_eva',edit)


//commit
const score_member2 = require('./routes/Commit/score_member')
app.use('/api/Commit/score_member',score_member2)

const show_eva = require('./routes/Commit/show_eva')
app.use('/api/Commit/show_eva',show_eva)

const save_score = require('./routes/Commit/save_score')
app.use('/api/Commit/save_score',save_score)


app.use((req,res)=> res.status(404).json({message:'404 invalid Route77'}))
app.listen(3001, ()=> console.log("Server Runnig in Port 3001✅"))