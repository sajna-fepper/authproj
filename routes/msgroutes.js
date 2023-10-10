const express = require('express')
const router = express.Router()

const {send_otp, verify_otp} = require('../controllers/msgcontroller')

router.route('/send-otp').post(send_otp)
router.route('/verify-otp').post(verify_otp)




module.exports = router