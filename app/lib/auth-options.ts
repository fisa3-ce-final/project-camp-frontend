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

async function refreshAccessToken(token: JWT) {
    try {
        console.log("Refreshing access token");
        const response = await fetch(
            process.env.COGNITO_DOMAIN + "/oauth2/token",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: new URLSearchParams({
                    client_id: process.env.COGNITO_CLIENT_ID ?? "",
                    client_secret: process.env.COGNITO_CLIENT_SECRET ?? "",
                    grant_type: "refresh_token",
                    refresh_token: token.refresh_token,
                }),
                cache: "no-store",
            }
        );

        const tokensOrError = await response.json();
        console.log("tokensOrError", tokensOrError);

        if (!response.ok) throw tokensOrError;

        const newTokens = tokensOrError as {
            id_token: string;
            access_token: string;
            expires_in: number;
            refresh_token?: string;
        };

        token.id_token = newTokens.id_token;
        token.access_token = newTokens.access_token;
        token.accessTokenExpires = Date.now() + newTokens.expires_in * 1000;

        // Some providers only issue refresh tokens once, so preserve if we did not get a new one
        if (newTokens.refresh_token)
            token.refresh_token = newTokens.refresh_token;

        console.log("Id token refreshed", token);

        return token;
    } catch (error) {
        console.log(error);

        return {
            ...token,
            error: "RefreshAccessTokenError",
        };
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

                token.accessTokenExpires = account.expires_at! * 1000;
            }

            if (Date.now() < token.accessTokenExpires) {
                return token;
            }

            console.log("refreshing");

            return refreshAccessToken(token);
        },
        async session({ session, token }) {
            session.user = {
                ...session.user,
                id_token: token.id_token,
            };
            session.error = token.error;

            // console.log("id_token", token.id_token);

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
                    const res = await fetch(process.env.BACKEND_URL + "/user", {
                        method: "POST",
                        headers: new Headers({
                            Authorization: `Bearer ${account.id_token}`,
                            "Content-Type": "application/json",
                        }),
                        body: JSON.stringify({
                            provider: account.provider,
                        }),
                        cache: "no-store",
                    });
                    res.text().then(console.log);
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
