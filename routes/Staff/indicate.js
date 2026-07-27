const express = require('express')
const db = require('../../db')
const bc = require('bcrypt')
const {verifyToken,requireRole} = require('../../middleware/authMiddleware')
const router = express.Router()

router.post('/save',verifyToken,requireRole('ฝ่ายบุคลากร'),async (req,res) => {
  
    try {
        
        const {id_topic,name_indicate,detail_indicate,point_indicate,check_indicate} = req.body
        const [rows] = await db.query(`insert into tb_indicate(id_topic,name_indicate,detail_indicate,point_indicate,check_indicate) values(?,?,?,?,?)`,[id_topic,name_indicate,detail_indicate,point_indicate,check_indicate])
        res.json(rows,{message:"save indicate"})
    } catch (error) {
        console.error("Error Save indicate",error);
        res.status(500).json({message:"save indicate Error"})
    }

})

router.put('/update/:id_indicate',verifyToken,requireRole('ฝ่ายบุคลากร'),async (req,res) => {
  
    try {
        const {id_indicate} = req.params
        const {id_topic,name_indicate,detail_indicate,point_indicate,check_indicate} = req.body
        const [rows] = await db.query(`update tb_indicate set id_topic=?,name_indicate=?,detail_indicate=?,point_indicate=?,check_indicate=? where id_indicate = ?`,[id_topic,name_indicate,detail_indicate,point_indicate,check_indicate,id_indicate])
        res.json(rows,{message:"update indicate"})
    } catch (error) {
        console.error("Error update indicate",error);
        res.status(500).json({message:"update indicate Error"})
    }

})

router.delete('/delete/:id_indicate',verifyToken,requireRole('ฝ่ายบุคลากร'),async (req,res) => {
  
    try {
        const {id_indicate} = req.params
        const [rows] = await db.query(`delete from tb_indicate where id_indicate = ?`,[id_indicate])
        res.json(rows,{message:"delete indicate"})
        
    } catch (error) {
        console.error("Error delete indicate",error);
        res.status(500).json({message:"delete indicate Error"})
    }

})

router.get('/show',verifyToken,requireRole('ฝ่ายบุคลากร'),async (req,res) => {
  
    try {
        const [rows] = await db.query(`select * from tb_topic,tb_indicate where tb_topic.id_topic = tb_indicate.id_topic order by id_indicate desc`)
        res.json(rows)
    } catch (error) {
        console.error("Error get indicate",error);
        res.status(500).json({message:"get indicate Error"})
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