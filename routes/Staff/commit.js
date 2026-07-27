const express = require('express')
const db = require('../../db')
const bc = require('bcrypt')
const {verifyToken,requireRole} = require('../../middleware/authMiddleware')
const router = express.Router()

router.post('/save/:id_eva',verifyToken,requireRole('ฝ่ายบุคลากร'),async (req,res) => {
  
    try {
        const {id_eva} = req.params
        await db.query(`delete from tb_commit where tb_commit.id_eva = ?`,[id_eva])
        const m = req.body
        const v = m.map(p => [id_eva,p.id_member,'n',p.role])
        const [rows] = await db.query(`insert into tb_commit(id_eva,id_member,status_commit,level_commit) values ?`,[v])
        res.json(rows,{message:"save commit "})
    } catch (error) {
        console.error("Error Save commit ",error);
        res.status(500).json({message:"save commit Error"})
    }

})


router.delete('/delete/:id_commit',verifyToken,requireRole('ฝ่ายบุคลากร'),async (req,res) => {
  
    try {
        const {id_commit} = req.params
        const [rows] = await db.query(`delete from tb_commit where id_commit = ?`,[id_commit])
        res.json(rows,{message:"delete commit"})
        
    } catch (error) {
        console.error("Error delete commit",error);
        res.status(500).json({message:"delete commit Error"})
    }

})

router.get('/header/:id_eva',verifyToken,requireRole('ฝ่ายบุคลากร'),async (req,res) => {
  
    try {
        const {id_eva} = req.params
        const [rows] = await db.query(`select * from tb_system s,tb_member m,tb_eva e where e.id_eva = ? and s.id_sys = e.id_sys and m.id_member = e.id_member`,[id_eva])
        res.json(rows)
    } catch (error) {
        console.error("Error get eva",error);
        res.status(500).json({message:"get eva Error"})
    }

})

router.get('/member/:id_eva',verifyToken,requireRole('ฝ่ายบุคลากร'),async (req,res) => {
  
    try {
        const {id_eva} = req.params
        const [pick] = await db.query(`select id_member,concat(first_name,'',last_name)as fullname_commit from tb_member where role='กรรมการประเมิน'`)
        const [picked] = await db.query(`select tb_member.id_member,first_name,last_name,id_commit,level_commit as role from tb_member,tb_commit where tb_commit.id_eva = ? and tb_commit.id_member = tb_member.id_member`,[id_eva])
        res.json({pick,picked})
    } catch (error) {
        console.error("Error get commit",error);
        res.status(500).json({message:"get commit Error"})
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