import { WebhookClient } from "discord.js";
import Fastify from "fastify";
import { verify } from "jsonwebtoken";

const fastify = Fastify({ logger: true });

interface NetlifyEventBody {
  id: string;
  site_id: string;
  build_id: string;
  state: NetlifyStates;
  name: string;
  url: string;
  ssl_url: string;
  admin_url: string;
  deploy_url: string;
  deploy_ssl_url: string;
  error_message?: string;
  branch: string;
}

enum Colors {
  GREEN = 0x238823,
  YELLOW = 0xffbf00,
  RED = 0xd2222d,
  BLUE = 0x008ce4,
}

// enum to reference netlify states consistently
enum NetlifyStates {
  BUILDING = "building",
  READY = "ready",
  ERROR = "error",
}

// maps a build state to messaging above
// the embedded message
enum ContentMapping {
  "building" = "There is a new deploy in process for",
  "ready" = "Successful deploy of",
  "error" = "Deploy did not complete for",
}

// maps a build state to a color for the sidebar
// styling of the embedded message
enum ColorMapping {
  "building" = Colors.YELLOW,
  "ready" = Colors.GREEN,
  "error" = Colors.RED,
}

// maps a build state to some verbiage
enum TitleMapping {
  "building" = "Visit the build log",
  "ready" = "Visit the changes live",
  "error" = "Visit the build log",
}

// utility function to get value from enum
// avoiding runtime errors
const getValueByKey = (enumerated: any, key: string): string | undefined => {
  return enumerated[key] ?? undefined;
};

const generateMessage = (body: NetlifyEventBody) => {
  const buildLogUrl = `${body.admin_url}/deploys/${body.id}`;
  const buildLogDescription = `Or check out the [build log](${buildLogUrl})`;
  return {
    content: `${getValueByKey(ContentMapping, body.state)} *${body.name}*`,
    embeds: [
      {
        color: Number(getValueByKey(ColorMapping, body.state)) || undefined,
        title: getValueByKey(TitleMapping, body.state),
        url: body.state === NetlifyStates.READY ? body.url : buildLogUrl,
        description:
          body.state === NetlifyStates.READY ? buildLogDescription : "",
        timestamp: new Date().toDateString(),
        footer: {
          text: `Using git branch ${body.branch}`,
        },
      },
    ],
  };
};

// Declare a route
fastify.get("/healthz", async (request, reply) => {
  reply.code(200).send({ message: "Breathing..." });
});

fastify.post("/netlify-hook", async (request, reply) => {
  try {
    verify(
      request.headers["x-webhook-signature"]?.toString() ?? "",
      process.env.WEBHOOK_SECRET || "",
      { algorithms: ["HS256"] }
    );
  } catch (error) {
    console.log(error);

    fastify.Sentry.captureMessage("Unable to verify secret key");
    reply.code(200).send({ err: "Unable to verify secret key" });
  }

  try {
    const webhookClient = new WebhookClient({
      url: fastify.config.DISCORD_WEBHOOK_URL,
    });

    const { content, embeds } = generateMessage(
      JSON.parse(JSON.stringify(request.body as NetlifyEventBody))
    );

    webhookClient.send({ content, embeds });

    reply.code(200).send({ message: "Success" });
  } catch (error) {
    fastify.Sentry.captureMessage("Unable to send via discord webhook client");

    reply.code(200).send({ err: "Unable to send via discord webhook client" });
  }
});

export default fastify;
