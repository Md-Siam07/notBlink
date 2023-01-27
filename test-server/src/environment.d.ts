/// <reference path="../node_modules/@types/node/process.d.ts" />

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      readonly PORT: string;
      readonly HOST: string;
      readonly MONGODB_URL: string;
      readonly AUTH_SERVICE: string;
      readonly MINIO_ACCESS_KEY: string;
      readonly MINIO_SECRET_KEY: string;
    }
  }
}

export {};
