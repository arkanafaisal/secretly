import prisma from "../config/prisma.js"


export async function getUserById({ id }) {
    const user = await prisma.user.findUnique({
        where: { id },
        select: {
            username: true,
            email: true,
            bio: true,
            publicId: true,
            avatarIndex: true,
            allowMessages: true,
        }
    })
    return user
}

export async function updateUserField({ id, field, value }) {
    try {
        const result = await prisma.user.update({
          where: { id },
          data: { [field]: value },
          select: { publicId: true, [field]: true }
        })
        return result[field]
        
    } catch (error) {
        if(error.code === "P2025"){throw new Error("not found")}
        if(error.code === "P2002"){throw new Error("duplicate")}
        throw error
    }
}

export async function getUserByPublicId({publicId}) {
    const user = await prisma.user.findUnique({
        where: { publicId },
        select: { username: true, avatarIndex: true, bio: true, allowMessages: true }
    })
    return user
}

export async function getPasswordById({ id }) {
    const user = await prisma.user.findUnique({
        where: { id },
        select: { password: true }
    })
    return user?.password
}

export async function updatePassword({ id, password }) {
    try {
        await prisma.user.update({
            where: { id },
            data: { password },
            select: { id: true }
        })
    } catch (error) {
        if(error.code === "P2025"){throw new Error("not found")}
        throw error
    }
}

export async function checkUsedEmail({ email }) {
    const user = await prisma.user.findUnique({
        where: { email },
        select: { id: true }
    })
    return user?.id
}
