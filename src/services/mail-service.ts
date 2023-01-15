import {UserModel} from "../models/User/User";
import {transporter} from "../Adapters/mail.adapter";
import {v4} from 'uuid'

export const mailService = {
    async sendMailConfirmation(user: UserModel, resend:boolean = false,newCode:string='') {
        console.log(user)
        let url = `https://somesite.com/confirm-email?code=${resend?newCode:user.emailConfirmation.confirmationCode}`

        console.log(url)
        let info = await transporter.sendMail({
            from: 'Volodia',
            to: user.accountData.email,
            subject: "Confirm your content",
            text: "Confirm your account",
            html: `<a href=${url}>${url}</a>`
        });

    },
    async sendRecoveryPasswordCode(user: UserModel, resend:boolean = false,newCode:string='') {
        console.log(user)
        let url = `https://somesite.com/confirm-email?recoveryCode=${resend?newCode:user.emailConfirmation.confirmationCode}`

        console.log(url)
        let info = await transporter.sendMail({
            from: 'Volodia',
            to: user.accountData.email,
            subject: "Confirm your content",
            text: "Confirm your account",
            html: `<a href=${url}>${url}</a>`
        });

    }
}
