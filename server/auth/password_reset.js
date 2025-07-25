const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const bcrypt = require('bcrypt');

const users = {
  'email': {
    email: '',
    password: '',
    resetCode: null,
    resetCodeExpires: null
  }
};

function generateResetCode() {
  return crypto.randomBytes(3).toString('hex').toUpperCase();
}

router.post('/request-reset', (req, res) => {
  const { email } = req.body;
  const user = users[email];
  if (!user) return res.status(404).json({ message: 'User not found' });

  const code = generateResetCode();
  user.resetCode = code;
  user.resetCodeExpires = Date.now() + 15 * 60 * 1000;

  console.log(`Reset code for ${email}: ${code}`);
  res.json({ message: 'Reset code sent' });
});

router.post('/reset-password', async (req, res) => {
  const { email, code, newPassword } = req.body;
  const user = users[email];
  if (!user || user.resetCode !== code || Date.now() > user.resetCodeExpires) {
    return res.status(400).json({ message: 'Invalid or expired code' });
  }

  const hashed = await bcrypt.hash(newPassword, 10);
  user.password = hashed;
  user.resetCode = null;
  user.resetCodeExpires = null;

  res.json({ message: 'Password reset successful' });
});

module.exports = router;
