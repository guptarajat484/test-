const express=require('express')
const router=express.Router()
const auth_middleware=require('../middlewares/auth_middleware')
const user_controller=require('../controllers/user_controller')

router.post('/signup',user_controller.signup)
router.post('/login',user_controller.login)
router.put('/updateprofile',auth_middleware,user_controller.update_profile)
router.delete('/deleteprofile',auth_middleware,user_controller.delete_profile)


module.exports=router