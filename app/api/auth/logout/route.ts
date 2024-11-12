import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        console.log("logout", process.env.NEXT_PUBLIC_HOST);
        const logoutUrl = `${process.env.COGNITO_DOMAIN}/logout?client_id=${
            process.env.COGNITO_CLIENT_ID
        }&logout_uri=${encodeURIComponent(process.env.NEXT_PUBLIC_HOST!)}`;
        console.log("logout");
        return NextResponse.redirect(logoutUrl);
    } catch (error) {
        console.error(error);
        return new NextResponse(
            error instanceof Error
                ? error.message
                : "An unknown error occurred",
            {
                status:
                    error instanceof Error ? (error as any).status || 400 : 400,
            }
        );
    }
}
