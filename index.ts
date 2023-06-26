import { fastifyEnv } from "@fastify/env";
import fastifySentry from "@immobiliarelabs/fastify-sentry";
import fastify from "./app";

declare module "fastify" {
  interface FastifyInstance {
    config: {
      WEBHOOK_SECRET: string;
      DISCORD_WEBHOOK_URL: string;
      SENTRY_DSN: string;
    };
  }
}

const schema = {
  type: "object",
  required: ["WEBHOOK_SECRET", "DISCORD_WEBHOOK_URL", "SENTRY_DSN"],
  properties: {
    WEBHOOK_SECRET: { type: "string" },
    DISCORD_WEBHOOK_URL: { type: "string" },
    SENTRY_DSN: { type: "string" },
  },
};

const start = async () => {
  try {
    await fastify.register(fastifyEnv, { schema, dotenv: true });

    await fastify
      .register(fastifySentry, { dsn: fastify.config.SENTRY_DSN })
      .listen({
        host: "RENDER" in process.env ? "0.0.0.0" : "localhost",
        port: 3000,
      });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
