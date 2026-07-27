const express = require('express')
const db = require('../db')
const router = express.Router()
const {verifyToken,requireRole} = require('../middleware/authmiddleware')

router.get('/',async(req,res)=>{
    try {
        const [rows] = await db.query(`select * from tb_doc order by id_doc desc`)
        res.json(rows)
    } catch (error) {
        console.error("Error Get",err)
        res.status(500).json({message:'Error Get'})
    }
})

module.exports = router