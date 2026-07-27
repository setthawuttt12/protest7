const express = require('express')
const db = require('../db')
const router = express.Router()
const bc = require('bcrypt')
const jwt = require('jsonwebtoken')
const JWT_SECRET = process.env.JWT_SECRET

// Login API
router.post('/login',async (req,res) => {
    try{
        const {username,password,role} = req.body
        const [rows] = await db.query(`select * from tb_member where username=? and role=?`,[username,role])
        const m = rows[0]
        if(!m || !password || !(await bc.compare(password,m.password))){
            return res.status(400).json({message:'Login Failed : Invalid Password'})
        }
        const token = jwt.sign(
            {id_member:m.id_member,username:m.username,role:m.role} , JWT_SECRET , {expiresIn:'24h'}
        )
        res.json({token,role:m.role})
    }catch(err){
        console.error("Error Login",err)
        res.status(500).json({message:'Error Login'})
    }
})

// Register API
router.post('/regis',async (req,res) => {
    try{
        const {first_name,last_name,email,username,password,role} = req.body
        const hash = await bc.hash(password,10)
        const [rows] = await db.query(`insert into tb_member (first_name,last_name,email,username,password,role) values (?,?,?,?,?,?)`,[first_name,last_name,email,username,hash,role])
        res.json({rows,message:'Resgister Success'})
    }catch(err){
        console.error("Error Regis",err)
        res.status(500).json({message:'Error Regis'})
    }
})

module.exports = router