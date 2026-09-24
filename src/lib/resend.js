import { Resend } from 'resend';

export const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * إرسال OTP عبر البريد
 */
export async function sendOtpEmail({ to, code, name = 'عزيزي' }) {
  try {
    const { data, error } = await resend.emails.send({
    from: 'AURA TRADE <noreply@auratrade.abrdns.com>', // مؤقتاً
      to: [to],
      subject: `رمز التحقق الخاص بك: ${code}`,
      html: `
        <!DOCTYPE html>
        <html dir="rtl" lang="ar">
        <head>
          <meta charset="UTF-8">
          <style>
            body {
              font-family: 'Tajawal', Arial, sans-serif;
              background: #05070f;
              margin: 0;
              padding: 40px 20px;
            }
            .container {
              max-width: 520px;
              margin: 0 auto;
              background: #0d1424;
              border: 1px solid #1a2440;
              border-radius: 16px;
              padding: 32px;
            }
            .logo {
              width: 60px;
              height: 60px;
              border-radius: 14px;
              background: linear-gradient(135deg, #f5b041, #ff8c42);
              color: #0a0f1c;
              font-size: 28px;
              font-weight: 800;
              display: flex;
              align-items: center;
              justify-content: center;
              margin: 0 auto 20px;
            }
            h1 {
              color: #e6edf7;
              text-align: center;
              font-size: 22px;
              margin: 0 0 8px;
            }
            .subtitle {
              color: #7d8aab;
              text-align: center;
              font-size: 14px;
              margin-bottom: 24px;
            }
            .code-box {
              background: #111a2e;
              border: 2px dashed #f5b041;
              border-radius: 12px;
              padding: 20px;
              text-align: center;
              margin: 24px 0;
            }
            .code {
              font-size: 36px;
              font-weight: 800;
              color: #f5b041;
              letter-spacing: 8px;
              font-family: 'Courier New', monospace;
            }
            .label {
              color: #7d8aab;
              font-size: 12px;
              margin-bottom: 8px;
            }
            .note {
              color: #7d8aab;
              font-size: 12px;
              text-align: center;
              margin-top: 20px;
              line-height: 1.7;
            }
            .warning {
              background: rgba(234, 57, 67, 0.1);
              border: 1px solid rgba(234, 57, 67, 0.3);
              border-radius: 8px;
              padding: 12px;
              color: #ea3943;
              font-size: 12px;
              text-align: center;
              margin-top: 16px;
            }
            .footer {
              text-align: center;
              color: #4d5876;
              font-size: 11px;
              margin-top: 24px;
              padding-top: 20px;
              border-top: 1px solid #141c33;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="logo">A</div>
            <h1>رمز التحقق</h1>
            <p class="subtitle">مرحباً ${name}، استخدم الرمز التالي لإكمال العملية</p>

            <div class="code-box">
              <div class="label">رمز التحقق</div>
              <div class="code">${code}</div>
            </div>

            <div class="warning">
              ⏱️ الرمز صالح لمدة 10 دقائق فقط
            </div>

            <p class="note">
              إذا لم تكن أنت من طلب هذا الرمز، يمكنك تجاهل هذا البريد بأمان.
              لا تشارك هذا الرمز مع أي شخص.
            </p>

            <div class="footer">
              © 2026 AURA TRADE & INVEST<br>
              جميع الحقوق محفوظة
            </div>
          </div>
        </body>
        </html>
      `,
    });

    if (error) {
      console.error('Resend error:', error);
      throw new Error(error.message);
    }

    return { success: true, id: data?.id };
  } catch (error) {
    console.error('Send OTP error:', error);
    throw error;
  }
}