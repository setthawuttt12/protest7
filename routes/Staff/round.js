const express = require('express')
const db = require('../../db')
const bc = require('bcrypt')
const {verifyToken,requireRole} = require('../../middleware/authMiddleware')
const router = express.Router()

router.post('/save',verifyToken,requireRole('ฝ่ายบุคลากร'),async (req,res) => {
  
    try {
        
        const {day_open,day_out,round_sys,year_sys,status_sys} = req.body
        const [rows] = await db.query(`insert into tb_system(day_open,day_out,round_sys,year_sys,status_sys) values(?,?,?,?,?)`,[day_open,day_out,round_sys,year_sys,status_sys])
        res.json(rows,{message:"save round"})
    } catch (error) {
        console.error("Error Save round",error);
        res.status(500).json({message:"save round Error"})
    }

})

router.put('/update/:id_sys',verifyToken,requireRole('ฝ่ายบุคลากร'),async (req,res) => {
  
    try {
        const {id_sys} = req.params
        const {day_open,day_out,round_sys,year_sys,status_sys} = req.body
        const [rows] = await db.query(`update tb_system set day_open=?,day_out=?,round_sys=?,year_sys=?,status_sys=? where id_sys = ?`,[day_open,day_out,round_sys,year_sys,status_sys,id_sys])
        res.json(rows,{message:"update sys"})
    } catch (error) {
        console.error("Error update sys",error);
        res.status(500).json({message:"update sys Error"})
    }

})

router.delete('/delete/:id_sys',verifyToken,requireRole('ฝ่ายบุคลากร'),async (req,res) => {
  
    try {
        const {id_sys} = req.params
        const [rows] = await db.query(`delete from tb_system where id_sys = ?`,[id_sys])
        res.json(rows,{message:"delete round"})
        
    } catch (error) {
        console.error("Error delete round",error);
        res.status(500).json({message:"delete round Error"})
    }

})

router.get('/show',verifyToken,requireRole('ฝ่ายบุคลากร'),async (req,res) => {
  
    try {
        const [rows] = await db.query(`select * from tb_system where status_sys = 'y' order by id_sys desc`)
        res.json(rows)
    } catch (error) {
        console.error("Error get round",error);
        res.status(500).json({message:"get round Error"})
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