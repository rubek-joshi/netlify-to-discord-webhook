import { fastifyEnv } from "@fastify/env";
import fastify from "./app";

declare module "fastify" {
  interface FastifyInstance {
    config: {
      WEBHOOK_SECRET: string;
      DISCORD_WEBHOOK_URL: string;
    };
  }
}

const schema = {
  type: "object",
  required: ["WEBHOOK_SECRET", "DISCORD_WEBHOOK_URL"],
  properties: {
    WEBHOOK_SECRET: { type: "string" },
    DISCORD_WEBHOOK_URL: { type: "string" },
  },
};

const start = async () => {
  try {
    await fastify
      .register(fastifyEnv, { schema, dotenv: true })
      .listen({ port: 3000 });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
