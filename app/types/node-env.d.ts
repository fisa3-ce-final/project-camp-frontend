declare namespace NodeJS {
    export interface ProcessEnv {
        NEXTAUTH_SECRET: string;
        COGNITO_CLIENT_ID: string;
        COGNITO_CLIENT_SECRET: string;
        COGNITO_ISSUER: string;
    }
}
