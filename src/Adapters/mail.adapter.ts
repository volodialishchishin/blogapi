import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
    service: "gmail",

    auth: {
        user: "lishchishin.volodya@gmail.com",
        pass: "ucjtjhwcsggaxwly",
    },
});


