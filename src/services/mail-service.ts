import {UserModel} from "../models/User/User";
import {transporter} from "../Adapters/mail.adapter";

export const mailService = {
    async sendMailConfirmation(user: UserModel) {
        let url = `https://somesite.com/confirm-email?code=${user.emailConfirmation.confirmationCode}`
        console.log(user.accountData.email)
        let info = await transporter.sendMail({
            from: 'Volodia',
            to: user.accountData.email,
            subject: "Confirm your content",
            text: "Confirm your account",
            html: `<a href=${url}>${url}</a>`
        });
        console.log(info)
    }
}
