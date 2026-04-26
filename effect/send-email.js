const nodemailer = require('nodemailer');

exports.handler = async function (event, context) {
  // 仅允许 POST 请求
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const data = JSON.parse(event.body);
    const userEmail = data.email || 'Anonymous';
    const userMessage = data.message || '';

    // 配置 SMTP 协议发件服务器 (需在 Netlify 环境变量中设置，切勿将密码写死在代码里)
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT) || 465,
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS 
      }
    });

    // 构造要发给你的邮件
    const mailOptions = {
      from: process.env.SMTP_USER, // 这个必须是你的发件邮箱
      replyTo: data.email ? data.email : undefined, // 如果对方留了邮箱，你直接点"回复"就能回信给他
      to: 'hmz1969a@gmail.com', // 你的接收邮箱
      subject: `New message from ${userEmail} via YuKi's Website`,
      text: `You have received a new message from your website.\n\nSender: ${userEmail}\n\nMessage:\n${userMessage}`
    };

    await transporter.sendMail(mailOptions);

    return { statusCode: 200, body: JSON.stringify({ message: "Message sent successfully" }) };
  } catch (error) {
    console.error('Error sending email:', error);
    return { statusCode: 500, body: JSON.stringify({ error: "Failed to send email." }) };
  }
};