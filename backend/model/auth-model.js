import prisma from "../config/prisma.js"


export async function register(user) {
    try {
        const {password, ...safeUser} = await prisma.user.create({ data: user })
        return safeUser
    } catch (error) {
        if(error.code === "P2002"){throw new Error("duplicate")}
        throw error
    }
}

export async function getUserByUsername({ username }) {
    const user = await prisma.user.findUnique({ where: { username } })
    return user
}


export async function validateUserById({ id }) {
    const user = await prisma.user.findUnique({
        where: { id },
        select: {id: true}
    })        
    return user?.id
}

export async function updateEmail({ id, email }) {
    try {
        const { id: id2 } = await prisma.user.update({
            where: { id },
            data: { email },
            select: { id: true }
        })
        return id2
    } catch (error) {
        if(error.code === "P2025"){throw new Error("not found")}
        if(error.code === "P2002"){throw new Error("duplicate")}
        throw error
    }
}

export async function updatePassword({ email, password }) {
    try {
        const { id } = await prisma.user.update({
            where: { email },
            data: { password },
            select: { id: true }
        })
        return id
    } catch (error) {
        if(error.code === "P2025"){throw new Error("not found")}
        throw error
    }
}