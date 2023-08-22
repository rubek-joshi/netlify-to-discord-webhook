# netlify-to-discord-webhook
The middleman to allow Netlify POST webhook to send message to Discord webhook

## Getting started
1. Create a free web service in Render.
2. Create a Discord Webhook and copy its webhook url:

    ![image](https://github.com/rubek-joshi/netlify-to-discord-webhook/assets/33681318/10272d0b-9e4b-4702-81ab-bf3871ebb44a)
3. Add your deploy notifications in Netlify:

    ![image](https://github.com/rubek-joshi/netlify-to-discord-webhook/assets/33681318/10e4e491-56c3-4e8c-8d8c-88be56986ccb)
4. Configure your deploy notifications in Netlify:

   ![image](https://github.com/rubek-joshi/netlify-to-discord-webhook/assets/33681318/65a38efa-ad3f-41e9-9a52-fda85f60a1af)

5. Add the following environment variables:

   ![image](https://github.com/rubek-joshi/netlify-to-discord-webhook/assets/33681318/9f9d61fb-ed7f-401a-a5de-066d66f6f182)
6. Set build command in Render as `yarn && yarn build` or `npm i && npm run build`.
7. Set health check plan in Render:

   ![image](https://github.com/rubek-joshi/netlify-to-discord-webhook/assets/33681318/77825267-e6c6-4791-9ab8-9e3c4abaff87)
8. Create a free account on [Cron Job](https://cron-job.org/en/).
9. Click on CREATE CRONJOB button:

   ![image](https://github.com/rubek-joshi/netlify-to-discord-webhook/assets/33681318/959f46c1-6ccb-4717-bb39-5a0d1dc0c87c)
10. Set any title you like and enter your /healthz endpoint in URL. Set schedule to every 10 minutes:

     ![image](https://github.com/rubek-joshi/netlify-to-discord-webhook/assets/33681318/7cbf5280-3f60-4641-9245-1c523fe88ea5)

11. Click on TEST RUN and once it's success, click on SAVE. This will ensure your service stays awake.
12. Pat yourself in the back.
