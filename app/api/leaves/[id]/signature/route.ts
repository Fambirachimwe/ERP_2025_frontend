import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function POST(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const token = await getToken({
            req: request,
            secret: process.env.AUTH_SECRET
        });

        if (!token) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const formData = await request.formData();

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/leaves/${params.id}/signature`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token.accessToken}`,
            },
            body: formData,
        });

        if (!response.ok) {
            throw new Error("Failed to upload signature");
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error("Signature upload error:", error);
        return NextResponse.json(
            { message: "Error uploading signature" },
            { status: 500 }
        );
    }
} 