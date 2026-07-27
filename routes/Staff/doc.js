const express = require('express')
const db = require('../../db')
const bc = require('bcrypt')
const {verifyToken,requireRole} = require('../../middleware/authMiddleware')
const path = require('path')
const fs = require('fs')
const uploadDir = path.join(__dirname,'../../uploads/document')
const router = express.Router()

router.post('/save',async (req,res) => {
    
    try {
        
        const file = req.files?.file
        const {name_doc} = req.body
        const maxSize =10*1024*1024

        if (file.size > maxSize) {
            return res.status(400).json({message:"ไฟล์มีขนาดเกิน 10MB"})
        }
        const filename = Date.now() + path.extname(file.name)
        await file.mv(path.join(uploadDir,filename))
        const [rows] = await db.query(`insert into tb_doc(name_doc,day_doc,file) values(?,CURDATE(),?)`,[name_doc,filename])
        res.json(rows,{message:`regis success`})

    } catch (error) {
        console.error("error regis",error)
        res.status(500).json({message:'error regis'})
    }

})


router.delete('/delete/:id_doc',verifyToken,requireRole('ฝ่ายบุคลากร'),async (req,res) => {
  
    try {
        const {id_doc} = req.params
        const [[d]] = await db.query(`select file from tb_doc where id_doc = ?`,[id_doc])
        const fp = path.join(uploadDir,d.file)
        if(fs.existsSync(fp)){

            fs.unlinkSync(fp)

        }
        const [rows] = await db.query(`delete from tb_doc where id_doc = ?`,[id_doc])
        res.json(rows,{message:"delete doc"})
        
    } catch (error) {
        console.error("Error delete doc",error);
        res.status(500).json({message:"delete doc Error"})
    }

})

router.get('/show',verifyToken,requireRole('ฝ่ายบุคลากร'),async (req,res) => {
  
    try {
        const [rows] = await db.query(`select * from tb_doc order by id_doc desc`)
        res.json(rows)
    } catch (error) {
        console.error("Error get doc",error);
        res.status(500).json({message:"get doc Error"})
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
