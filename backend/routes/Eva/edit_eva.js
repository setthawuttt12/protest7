const express = require('express')
const db = require('../../db')
const router = express.Router()
const {verifyToken,requireRole} = require('../../middleware/authmiddleware')
const bc = require('bcrypt')

router.get('/',verifyToken,requireRole('ผู้รับการประเมินผล'),async(req,res)=>{
    try {
        const id_member = req.user.id_member
        const [rows] = await db.query(`select first_name,last_name,username,email,role from tb_member where id_member=?`,[id_member])
        res.json(rows[0])
        
    } catch (error) {
       console.error('Errorr Get Profile',error)
        res.status(500).json({message:'Errorr Get Profile'}) 
        
    }
})

router.put('/',verifyToken,requireRole('ผู้รับการประเมินผล'),async(req,res)=>{
    try {
        const id_member = req.user.id_member
        const {first_name,last_name,username,email,role,password} = req.body
        if(password && password.trim()){
            const hash = await bc.hash(password,10)
            await db.query(`update tb_member set  first_name=?,last_name=?,username=?,email=?,role=?,password=? where id_member='${id_member}'`,[first_name,last_name,username,email,role,hash])
        }else{
            await db.query(`update tb_member set  first_name=?,last_name=?,username=?,email=?,role=? where id_member='${id_member}'`,[first_name,last_name,username,email,role])
        }
        res.json({message:'Update Suceess'})
    } catch (error) {
       console.error('Errorr Put member',error)
        res.status(500).json({message:'Errorr Put Member'})  
    }
})

module.exports =router