const express = require('express')
const db = require('../../db')
const bc = require('bcrypt')
const {verifyToken,requireRole} = require('../../middleware/authMiddleware')
const router = express.Router()

router.post('/save',verifyToken,requireRole('ฝ่ายบุคลากร'),async (req,res) => {
  
    try {
        
        const {id_member,id_sys,date_eva,status_eva} = req.body
        const [rows] = await db.query(`insert into tb_eva(id_member,id_sys,date_eva,status_eva) values(?,?,?,?)`,[id_member,id_sys,date_eva,1])
        res.json(rows,{message:"save eva "})
    } catch (error) {
        console.error("Error Save eva ",error);
        res.status(500).json({message:"save eva Error"})
    }

})

router.put('/update/:id_eva',verifyToken,requireRole('ฝ่ายบุคลากร'),async (req,res) => {
  
    try {
        const {id_eva} = req.params
        const {id_member,id_sys,date_eva,status_eva} = req.body
        const [rows] = await db.query(`update tb_eva set id_member=?,id_sys=?,date_eva=?,status_eva=? where id_eva = ?`,[id_member,id_sys,date_eva,status_eva,id_eva])
        res.json(rows,{message:"update eva"})
    } catch (error) {
        console.error("Error update eva",error);
        res.status(500).json({message:"update eva Error"})
    }

})

router.delete('/delete/:id_eva',verifyToken,requireRole('ฝ่ายบุคลากร'),async (req,res) => {
  
    try {
        const {id_eva} = req.params
        const [rows] = await db.query(`delete from tb_eva where id_eva = ?`,[id_eva])
        res.json(rows,{message:"delete eva"})
        
    } catch (error) {
        console.error("Error delete eva",error);
        res.status(500).json({message:"delete eva Error"})
    }

})

router.get('/show',verifyToken,requireRole('ฝ่ายบุคลากร'),async (req,res) => {
  
    try {
        const [rows] = await db.query(`select * from tb_system s,tb_member m,tb_eva e where s.id_sys = e.id_sys and m.id_member = e.id_member  order by id_eva desc`)
        res.json(rows)
    } catch (error) {
        console.error("Error get eva",error);
        res.status(500).json({message:"get eva Error"})
    }

})

// router.get('/showC',verifyToken,requireRole('ฝ่ายบุคลากร'),async (req,res) => {
  
//     try {
//         const [rows] = await db.query(`select * from tb_member where role='กรรมการประเมิน' order by id_member desc`)
//         res.json(rows)
//     } catch (error) {
//         console.error("Error get Member",error);
//         res.status(500).json({message:"get Member Error"})
//     }

// })
module.exports = router