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
const show_eva = require('./routes/Commit/show_eva')
app.use('/api/Commit/show_eva',show_eva)

const check_confirm = require('./routes/Commit/check_confirm')
app.use('/api/Commit/check_confirm',check_confirm)

const score_member2 = require('./routes/Commit/score_member')
app.use('/api/Commit/score_member',score_member2)

const save_score = require('./routes/Commit/save_score')
app.use('/api/Commit/save_score',save_score)

const score_commit2 = require('./routes/Commit/score_commit')
app.use('/api/Commit/score_commit',score_commit2)

const signature = require('./routes/Commit/signature')
app.use('/api/Commit/signature',signature)

app.use((req,res)=> res.status(404).json({message:'404 invalid Route77'}))
app.listen(3001, ()=> console.log("Server Runnig in Port 3001✅"))