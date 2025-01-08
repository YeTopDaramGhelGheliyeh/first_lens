const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3000;

// برای مدیریت فایل HTML
app.use(express.static('public'));

// تنظیم Body Parser برای خواندن درخواست‌های JSON
app.use(bodyParser.json());

// مسیر برای دریافت اطلاعات از کلاینت
app.post('/send-to-telegram', async (req, res) => {
    const { message } = req.body;

    const botToken = process.env.TELEGRAM_BOT_TOKEN; // باید در Railway ست شود
    const chatId = process.env.TELEGRAM_CHAT_ID; // باید در Railway ست شود

    try {
        const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: chatId,
                text: message,
            }),
        });

        if (response.ok) {
            res.status(200).send({ success: true, message: 'Message sent to Telegram!' });
        } else {
            const errorText = await response.text();
            res.status(500).send({ success: false, error: errorText });
        }
    } catch (error) {
        res.status(500).send({ success: false, error: error.message });
    }
});

// راه‌اندازی سرور
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
