import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import prisma from '@/lib/prisma'
import { authOptions } from '@/lib/auth'

export async function PUT(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions)
        if (!session) {
            return new NextResponse('Unauthorized', { status: 401 })
        }

        const leave = await prisma.leave.findUnique({
            where: { id: params.id },
        })

        if (!leave) {
            return new NextResponse('Leave not found', { status: 404 })
        }

        if (leave.supervisorId !== session.user.id) {
            return new NextResponse('Unauthorized', { status: 403 })
        }

        const updatedLeave = await prisma.leave.update({
            where: { id: params.id },
            data: {
                status: 'DISAPPROVED',
                approvedAt: new Date(),
                approvedBy: session.user.id,
            },
        })

        return NextResponse.json(updatedLeave)
    } catch (error) {
        console.error('[LEAVE_DISAPPROVE]', error)
        return new NextResponse('Internal error', { status: 500 })
    }
} 