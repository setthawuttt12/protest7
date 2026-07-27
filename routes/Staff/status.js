const express = require('express')
const db = require('../../db')
const bc = require('bcrypt')
const {verifyToken,requireRole} = require('../../middleware/authMiddleware')
const router = express.Router()


router.get('/show/:id_eva',verifyToken,requireRole('ฝ่ายบุคลากร'),async (req,res) => {
  
    try {
        const {id_eva} = req.params
        const [rows] = await db.query(`select * from tb_commit c,tb_member m,tb_eva e where c.id_eva = ? and c.id_eva = e.id_eva and c.id_member = m.id_member`,[id_eva])
        res.json(rows)
    } catch (error) {
        console.error("Error get status",error);
        res.status(500).json({message:"get eva status"})
    }

})

module.exports = router