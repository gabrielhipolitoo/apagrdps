const express = require('express')
const router = express.Router()


router.get('/teste',(req,res) => {
    return res.json(200)
})

//post
router.post('/auth/register', async(req,res) =>{
    const {name,email,password,confirmpassword} = req.body
    
    return res.send(req.body)
    // campos obrigatorios no final
})


module.exports=router