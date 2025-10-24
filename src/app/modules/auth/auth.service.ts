import { UserStatus } from "@prisma/client"
import { prisma } from "../../shared/prisma"
import { compare } from "bcryptjs"

const login = async(payload: {email: string, password: string}) => {
    const user = await prisma.user.findUniqueOrThrow({
        where: {
            email: payload.email,
            status: UserStatus.ACTIVE
        }
    })

    const isPasswordMatched = await compare(payload.password, user.password)

    if(!isPasswordMatched) {
        throw new Error("Password Didn't matched");
    }

    
}

export const AuthServices = {
    login
}