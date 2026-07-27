const express = require('express')
const db = require('../../db')
const bc = require('bcrypt')
const {verifyToken,requireRole} = require('../../middleware/authMiddleware')
const router = express.Router()

router.post('/save',verifyToken,requireRole('ฝ่ายบุคลากร'),async (req,res) => {
  
    try {
        
        const {first_name,last_name,email,username,password,role} = req.body
        const hash = await bc.hash(password,10)
        const [rows] = await db.query(`insert into tb_member(first_name,last_name,email,username,password,role) values(?,?,?,?,?,?)`,[first_name,last_name,email,username,hash,role])
        res.json(rows,{message:"save Memeber"})
    } catch (error) {
        console.error("Error Save Member",error);
        res.status(500).json({message:"save Memeber Error"})
    }

})

router.put('/update/:id_member',verifyToken,requireRole('ฝ่ายบุคลากร'),async (req,res) => {
  
    try {
        const {id_member} = req.params
        const {first_name,last_name,email,username,password,role} = req.body
        if(password && password.trim()){
            const hash = await bc.hash(password,10)
            const [rows] = await db.query(`update tb_member set first_name=?,last_name=?,email=?,username=?,password=?,role=? where id_member = ?`,[first_name,last_name,email,username,hash,role,id_member])
            res.json(rows,{message:"update Member"})
        }else{
            const [rows] = await db.query(`update tb_member set first_name=?,last_name=?,email=?,username=?,role=? where id_member = ?`,[first_name,last_name,email,username,role,id_member])
            res.json(rows,{message:"update Member"})
        }
        
    } catch (error) {
        console.error("Error update Member",error);
        res.status(500).json({message:"update Memeber Error"})
    }

})

router.delete('/delete/:id_member',verifyToken,requireRole('ฝ่ายบุคลากร'),async (req,res) => {
  
    try {
        const {id_member} = req.params
        const [rows] = await db.query(`delete from tb_member where id_member = ?`,[id_member])
        res.json(rows,{message:"delete Member"})
        
    } catch (error) {
        console.error("Error delete Member",error);
        res.status(500).json({message:"delete Memeber Error"})
    }

})

router.get('/showE',verifyToken,requireRole('ฝ่ายบุคลากร'),async (req,res) => {
  
    try {
        const [rows] = await db.query(`select * from tb_member where role='ผู้รับการประเมินผล' order by id_member desc`)
        res.json(rows)
    } catch (error) {
        console.error("Error get Member",error);
        res.status(500).json({message:"update get Error"})
    }

})

router.get('/showC',verifyToken,requireRole('ฝ่ายบุคลากร'),async (req,res) => {
  
    try {
        const [rows] = await db.query(`select * from tb_member where role='กรรมการประเมิน' order by id_member desc`)
        res.json(rows)
    } catch (error) {
        console.error("Error get Member",error);
        res.status(500).json({message:"get Member Error"})
    }

})
module.exports = router