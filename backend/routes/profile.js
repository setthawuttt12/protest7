const express = require('express')
const db = require('../db')
const router = express.Router()
const {verifyToken,requireRole} = require('../middleware/authmiddleware')

router.get('/',verifyToken,async(req,res)=>{
    try {
        const id_member = req.user.id_member
        const [rows] = await db.query(`select * from tb_member where id_member=?`,[id_member])
        res.json(rows[0])
    } catch (error) {
        console.error('Errorr Get Profile',error)
        res.status(500).json({message:'Errorr Get Profile'})
    }
})
module.exports = router