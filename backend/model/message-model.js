import prisma from "../config/prisma.js";



export async function create({ publicId, message, hint }) {
    try {
        const { userId } = await prisma.message.create({
            data: {
                message,
                hint: hint?? undefined,
                user: { connect: {publicId} },
                select: { userId: true }
            }
        })
        return userId
        
    } catch (error) {
        if(error.code === "P2003"){throw new Error("user not found")}
        throw error
    }
}

export async function getMyMessages({ userId, query: { sort, read, starred } }) {
    const messages = await prisma.message.findMany({
        where: {
            userId,
            ...(read !== undefined && {read: read === "true"}),
            ...(starred !== undefined && {starred: starred === "true"})
        },
        select: {
            id: true,
            hint: true,
            message: true,
            read: true,
            starred: true
        },
        orderBy: {
            createdAt: sort === "oldest"? "asc" : "desc"
        }
    })
    return messages
}

export async function patch({ id, userId, read, starred }) {
    try {
        const message = await prisma.message.update({
            where: { id, userId },
            data: {
                ...(read !== undefined && { read }),
                ...(starred !== undefined && { starred })
            },
            select: { id: true, read: true, starred: true }
        })
        return message

    } catch (error) {
        if(error.code === "P2025"){throw new Error("not found")}
        throw error
    }
}

export async function remove({ id, userId }) {
    try {
        const message = await prisma.message.delete({ where: { id, userId } })
        return message     
    } catch (error) {
        if(error.code === "P2025"){throw new Error("not found")}
        throw error
    }
}