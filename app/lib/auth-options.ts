import { AuthOptions } from "next-auth";
import { JWT } from "next-auth/jwt";
import CognitoProvider from "next-auth/providers/cognito";

declare module "next-auth/jwt" {
    interface JWT {
        id_token: string;
        provider: string;
        refresh_token: string;
        accessTokenExpires: number;
        error: string;
    }
}

export const authOptions: AuthOptions = {
    providers: [
        CognitoProvider({
            clientId: process.env.COGNITO_CLIENT_ID,
            clientSecret: process.env.COGNITO_CLIENT_SECRET,
            issuer: process.env.COGNITO_ISSUER,
            checks: "nonce",
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
        async jwt({ token, user, account, profile }) {
            if (account) {
                token.id_token = account.id_token!;
                token.provider = account.provider!;
                token.refresh_token = account.refresh_token!;
            }
            return token;
        },
        async session({ session, token }) {
            session.user = {
                ...session.user,
                id_token: token.id_token,
            };
            session.error = token.error;

            console.log("id_token", token.id_token);

            return session;
        },
    },
    events: {
        async signIn({ user, account, profile }) {
            console.log(user);
            console.log(account);
            console.log("Sign in", profile);
            if (account) {
                try {
                    // const status = await signIn(account.id_token!);
                    // console.log("Sign in status", status);
                } catch (e) {
                    console.error((e as any).message);
                }
            }
        },
        async signOut({ token }: { token: JWT }) {
            console.log("Sign out", token);
        },
    },
};
