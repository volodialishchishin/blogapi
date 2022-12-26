import {UserModel} from "../models/User/User";
import {transporter} from "../Adapters/mail.adapter";
import {v4} from 'uuid'

export const mailService = {
    async sendMailConfirmation(user: UserModel, resend:boolean = false) {
        let url = `https://somesite.com/confirm-email?code=${resend?v4():user.emailConfirmation.confirmationCode}`
        let info = await transporter.sendMail({
            from: 'Volodia',
            to: user.accountData.email,
            subject: "Confirm your content",
            text: "Confirm your account",
            html: `<a href=${url}>${url}</a>`
        });
    }
}