declare global {
    namespace NodeJS {
        interface ProcessEnv {
            DISCORD_APP_ID: string;
            DISCORD_TOKEN: string;
        }
    }
}

export {}