import config from "../../config";



export const getForgotPasswordHtml = (token: string) => {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Reset Request</title>
    <style>
        body, table, td, div, p { font-family: Arial, sans-serif; }
    </style>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f4f4;">
    <table role="presentation" align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse;">
        <tr>
            <td align="center" style="padding: 40px 0 30px 0;">
                <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="600" style="border-collapse: collapse; border: 1px solid #cccccc; border-radius: 8px; background-color: #ffffff;">
                    <tr>
                        <td align="center" style="padding: 40px 0 30px 0; background-color: #007BFF; color: #ffffff; border-radius: 8px 8px 0 0;">
                            <h2>PH Health Care</h2>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 30px 30px 20px 30px; text-align: center;">
                            <p style="margin: 0; font-size: 16px; line-height: 24px; color: #333333;">Hello,</p>
                            <p style="margin: 20px 0 30px 0; font-size: 16px; line-height: 24px; color: #333333;">We received a request to reset your password. Click the button below to set a new one.</p>
                            <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="border-collapse: collapse;">
                                <tr>
                                    <td align="center" style="border-radius: 5px; background-color: #007BFF;">
                                        <a href="${
                                          config.frontend_url
                                        }/reset-password?token${token}" target="_blank" style="font-size: 16px; font-weight: bold; text-decoration: none; color: #ffffff; background-color: #007BFF; padding: 12px 25px; border-radius: 5px; border: 1px solid #007BFF; display: inline-block;">Reset Password</a>
                                    </td>
                                </tr>
                            </table>
                            <p style="margin-top: 30px; font-size: 14px; line-height: 20px; color: #888888;">If you did not request a password reset, you can safely ignore this email. This link will expire in 5 minutes for security purposes.</p>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 30px; text-align: center; font-size: 12px; color: #888888; border-radius: 0 0 8px 8px;">
                            <p style="margin: 0;">&copy; ${new Date().getFullYear()} PH Health Care. All rights reserved.</p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>`
}
