const express = require('express')
const db = require('../../db')
const router = express.Router()
const {requireRole,verifyToken} = require('../../middleware/authMiddleware')
const path = require('path')
const uploadDir = path.join(__dirname,'../../uploads/evadetail')
// Register API
router.get('/user/:id_eva',verifyToken,requireRole('กรรมการประเมิน'),async (req,res) => {
    try{
        const id_member = req.user.id_member
        const id_eva = req.params.id_eva
        const [rows] = await db.query(
            `select * from tb_member m,tb_eva e,tb_system s,tb_commit c where c.id_member=? and c.id_eva=? and c.id_eva=e.id_eva and e.id_member=m.id_member and e.id_sys=s.id_sys order by e.id_eva desc`,
            [id_member,id_eva]
        )
        res.json(rows[0])
    }catch(err){
        console.error("Error GET User",err)
        res.status(500).json({message:'Error GET User'})
    }
})

router.get('/topic/:id_eva',verifyToken,requireRole('กรรมการประเมิน'),async (req,res) => {
    try{
        const id_member = req.user.id_member
        const id_eva = req.params.id_eva
        const [topics] = await db.query(`select * from tb_topic`)
        const [indicates] = await db.query(`select * from tb_indicate i,tb_evadetail d where i.id_indicate=d.id_indicate and status_eva in (1) and id_eva=?`,[id_eva])
        const result = topics.map(t =>({
            ...t,
            indicates:indicates.filter((i) => i.id_topic === t.id_topic)
        }))
        res.json(result)
    }catch(err){
        console.error("Error GET User",err)
        res.status(500).json({message:'Error GET User'})
    }
})

router.post('/save/:id_eva',verifyToken,requireRole('กรรมการประเมิน'),async (req,res) => {
    try{
        const id_member = req.user.id_member
        const id_eva = req.params.id_eva
        const scores = JSON.parse(req.body.scores)
        const detail_commit = req.body.detail_commit
        const [[RowCommit]] = await db.query(`select * from tb_commit where id_member=? and id_eva=?`,[id_member,id_eva])
        var statusCommit = 0
        if(RowCommit.level_commit === 'ประธาน'){
            statusCommit = 2
        }else if(RowCommit.level_commit === 'กรรมการ'){
            statusCommit = 3
        }else if(RowCommit.level_commit === 'เลขา'){
            statusCommit = 4
        }
        for(const item of scores){
            await db.query(
                `insert into tb_evadetail (id_eva,id_indicate,status_eva,score_commit) values(?,?,?,?)`,
                [id_eva,item.id_indicate,statusCommit,item.score]
            )
        }
        const [[sumRow]] = await db.query(
            `select coalesce(sum(score_commit*(select i.point_indicate from tb_indicate i where i.id_indicate=d.id_indicate)),0) as total
            from tb_evadetail d where d.id_eva=?`,[id_eva]
        )
        await db.query(`update tb_eva set total_commit=? where id_eva=?`,[sumRow.total,id_eva])
        await db.query(`update tb_commit set detail_commit=?,status_commit=? where id_eva=? and id_member=?`,[detail_commit,'y',id_eva,id_member])
        // const [SumCommit] = await db.query(`select * from tb_commit where status_commit=? and id_eva=?`,['y',id_eva])
        // if(SumCommit.length === 3){
        //     await db.query(`update tb_eva set status_eva=? where id_eva=?`,[3,id_eva])
        // }
        res.json({message:'POST Score Success'})
    }catch(err){
        console.error("Error POST Score",err)
        res.status(500).json({message:'Error POST Score'})
    }
})

module.exports = router