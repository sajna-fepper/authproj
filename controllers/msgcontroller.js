const Msg91 = require('msg91');

//const msg91 = new Msg91('YOUR_MSG91_API_KEY', 'YOUR_SENDER_ID', '4');
const {msg91} = process.env
//const {MSG91_API_KEY, SENDER_ID} = process.env;




// Generate and send OTP
exports.send_otp = async (req, res, next) => { 
    const phoneNumber = req.body.phone_number;
    const otp = Math.floor(100000 + Math.random() * 900000); // Generate a 6-digit OTP
    const otpExpiresAt = new Date();
    otpExpiresAt.setMinutes(otpExpiresAt.getMinutes() + 5); // OTP expires in 5 minutes

    // Store OTP and expiration time in the database
    db.query(
        'INSERT INTO users (phone_number, otp, otp_expires_at) VALUES (?, ?, ?)',
        [phoneNumber, otp, otpExpiresAt],
        (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Internal Server Error' });
            }

            // Send OTP via MSG91
            msg91.send(
                phoneNumber,
                `Your OTP for authentication is ${otp}. It will expire in 5 minutes.`,
                (err, response) => {
                    if (err) {
                        console.error(err);
                        return res.status(500).json({ error: 'Failed to send OTP' });
                    }
                    res.json({ message: 'OTP sent successfully' });
                }
            );
        }
    );

};

// Verify OTP
exports.verify_otp = async (req, res, next) => { 
    const phoneNumber = req.body.phone_number;
    const userOTP = req.body.otp;

    // Check if the OTP is valid
    db.query(
        'SELECT * FROM users WHERE phone_number = ? AND otp = ? AND otp_expires_at > NOW()',
        [phoneNumber, userOTP],
        (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Internal Server Error' });
            }

            if (result.length === 0) {
                return res.status(401).json({ error: 'Invalid OTP' });
            }

            // Delete the OTP record from the database
            db.query('DELETE FROM users WHERE phone_number = ?', [phoneNumber]);

            res.json({ message: 'OTP verified successfully' });
        }
    );
};

