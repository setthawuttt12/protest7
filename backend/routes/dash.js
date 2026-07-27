const express = require('express')
const db = require('../db')
const router = express.Router()
const {verifyToken,requireRole} = require('../middleware/authmiddleware')

router.get('/eva',verifyToken,requireRole('ผู้รับการประเมินผล'),async (req,res) => {
    try{
        const id_member = req.user.id_member
        const [[evaCount]] = await db.query(`select count(*)as total from tb_member,tb_eva where tb_member.id_member='${id_member}' and tb_eva.id_member=tb_member.id_member`)
        const [[y]] = await db.query(`select count(*)as total from tb_member,tb_eva where tb_member.id_member='${id_member}' and tb_eva.id_member=tb_member.id_member and status_eva!=1`)
        const [[n]] = await db.query(`select count(*)as total from tb_member,tb_eva where tb_member.id_member='${id_member}' and tb_eva.id_member=tb_member.id_member and status_eva=1`)
        res.json({
            box : [
                {title:'แบบประเมินทั้งหมด',value: evaCount.total || 0},
                {title:'แบบประเมินที่ประเมินแล้ว',value: evaCount.total > 0 ? `${ (y.total*100/evaCount.total).toFixed(2) }%` : '00.00%' },
                {title:'แบบประเมินที่ไม่ได้ประเมิน',value: evaCount.total > 0 ? `${ (n.total*100/evaCount.total).toFixed(2) }%` : '00.00%' },
            ]
        })
        // res.json({rows,message:'Insert Success!'})
    }catch(err){
        console.error("Error Get",err)
        res.status(500).json({message:'Error Get'})
    }
})

module.exports =router