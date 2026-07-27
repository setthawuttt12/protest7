const express = require('express')
const db = require('../../db')
const router = express.Router()
const {verifyToken,requireRole} = require('../../middleware/authMiddleware')
const path = require('path')
const upload = path.join(__dirname,'../../uploads/signature')

router.post('/:id_eva',verifyToken,requireRole('กรรมการประเมิน'),async (req,res) =>{
    try {
        const id_member=req.user.id_member
        const id_eva= req.params.id_eva
        const file=req.files?.file
        const file_name=Date.now()+path.extname(file.name)
        await file.mv(path.join(upload,file_name))
        const [row] = await db.query(`update tb_commit set signature=? where id_eva='${id_eva}' and id_member='${id_member}'`,[file_name])
        const [SumCommit] = await db.query(`select * from tb_commit where status_commit=? and signature!='${null}' and id_eva=?`,['y',id_eva])
        if(SumCommit.length === 3 ){
            await db.query(`update tb_eva set status_eva=? where id_eva=?`,[3,id_eva])
        }
        res.status(201).json({message:'Upload Sucess'})
    } catch (error) {
        console.error("Error Upload",error)
        res.status(500).json({message:'Error Upload'})
    }
})

//
router.delete('/:id_eva',verifyToken,requireRole('กรรมการประเมิน'),async (req,res) => {
    try{
        const id_member = req.user.id_member
        const id_eva = req.params.id_eva
        const [[d]] = await db.query(`select signature from tb_commit where id_eva=? and id_member=?`,[id_eva,id_member])
        res.status(201).json({message:'Upload Success'})
        const fp = path.join(uploadDir,d.signature)
        if(fs.existsSync(fp)){
            fs.unlinkSync(fp)
        }
        await db.query(`update tb_commit set signature=? where id_eva=? and id_member=?`,[null,id_eva,id_member])
        res.json({message:'Delete Success!'})
    }catch(error){
        console.error("Error Delete",error)
        res.status(500).json({message:'Error Delete'})
    }
})

module.exports = router