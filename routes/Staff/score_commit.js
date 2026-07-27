const express = require('express')
const db = require('../../db')
const router = express.Router()
const {requireRole,verifyToken} = require('../../middleware/authMiddleware')


router.get('/user/:id_eva',verifyToken,requireRole('กรรมการประเมิน'),async (req,res) =>{
    try {
        const id_member = req.user.id_member
        const id_eva = req.params.id_eva
        const [rows] = await db.query(
             `select * from tb_member m,tb_eva e,tb_system s,tb_commit c where c.id_member=? and c.id_eva=? and c.id_eva=e.id_eva and e.id_member=m.id_member and e.id_sys=s.id_sys order by e.id_eva desc`,
              [id_member,id_eva]
        )
        res.json(rows[0])
    } catch (error) {
           console.error("Error GET User",error)
           res.status(500).json({message:'Error GET User'})
    }
})

router.get('/topic/:id_eva',verifyToken,requireRole('กรรมการประเมิน'),async (req,res) =>{
    try {
        const id_eva = req.params.id_eva
        const [topics] = await db.query(`select * from tb_topic`)
        const [indicates] = await db.query(`select * from tb_indicate`)
        const result = topics.map(t =>({
            ...t,
            indicates:indicates.filter((i) => i.id_topic === t.id_topic)
        }))
        res.json(result)
    } catch (error) {
         console.error("Error GET User",error)
        res.status(500).json({message:'Error GET User'})
    }
})

router.get('/scores/:id_eva',verifyToken,requireRole('กรรมการประเมิน'),async (req,res) =>{
    try {
        const id_eva = req.params.id_eva
        const [rows] = await db.query(`select * from tb_indicate i,tb_evadetail d where i.id_indicate=d.id_indicate and status_eva in (2,3,4) and id_eva=?`,[id_eva])
        const scores = {}
        rows.map(row =>{

            if(!scores[row.id_indicate]){
                scores[row.id_indicate] = {
                    a:null,
                    b:null,
                    c:null
                }
            }
            if(row.status_eva === 2)scores[row.id_indicate].a = row.score_commit * row.point_indicate
            if(row.status_eva === 2)scores[row.id_indicate].b = row.score_commit * row.point_indicate
            if(row.status_eva === 2)scores[row.id_indicate].c = row.score_commit * row.point_indicate

        })
        res.json({scores})
    } catch (error) {
         console.error("Error GET User",error)
        res.status(500).json({message:'Error GET User'})
    }
})

module.exports = router