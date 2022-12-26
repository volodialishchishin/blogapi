
export type UserModel = {
    accountData:{
        login:string
        email:string
        createdAt:string
        password:string
        passwordSalt:string,
    }
    id:string
    emailConfirmation:{
        confirmationCode: string,
        confirmationDate:Date,
        isConfirmed:boolean
    }

}
