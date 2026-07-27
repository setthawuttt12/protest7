const express = require('express')
const db = require('../../db')
const router = express.Router()
const {requireRole,verifyToken} = require('../../middleware/authMiddleware')

router.get('/',verifyToken,requireRole('กรรมการประเมิน'),async (req,res) => {
    try {
       const id_member = req.user.id_member
       const [rows] = await db.query(`select * from tb_member m,tb_eva e,tb_system s,tb_commit c where c.id_member=? and c.status_commit=? and c.id_eva=e.id_eva and e.id_member=m.id_member and e.id_sys=s.id_sys order by e.id_eva desc`,[id_member,'n']) 
       res.json(rows)
    } catch (error) {
        console.error("Error Get User",error)
        res.status(500).json({message:'Error Get User'})
        
    }
})

module.exports = router