---
name: Bug report - embedstyle Bug
about: This bug report is for tracking the TypeError Cannot read property 'embedstyle'
  of undefined weeoe ONLY, Please do not use it for anything else.
title: 'TypeError: Cannot read property ''embedstyle'' of undefined'
labels: TypeError
assignees: ZyC0R3

---

**Please ensure you follow the Below Steps fully.**
1. Make sure you have set up a webhook channel on your server. 
    * You can set up debugging Webhooks using the following steps
        https://github.com/ZyC0R3/RitaBot#troubleshooting
2. Restart All Dyno's in Heroku
    *  Go to https://dashboard.heroku.com/apps and select your bot.
    *  In the top right of the page select "More" and then "Restart all dynos"
3. Once this is done, And your bot is back online, run the following commands on your discord server
    * !t settings dbfix
    * !t settings updatedb
**Note: They need to be run in the correct order.** 
4. Test your bot now, do you still get the same error.

**IF THIS HAS NOT WORKED THEN PLEASE PROVIDE  A FULL LOG**

1. Restart All Dyno's in Heroku
    * Go to https://dashboard.heroku.com/apps and select your bot.
    * In the top right of the page select "More" and then "Restart all dynos"
2. Go to your log PAge in Heroku
    * Go to https://dashboard.heroku.com/apps and select your bot.
    * In the top right of the page select "More" and then "View Logs"
    **Try and opne this page as soon as you can after restarting your bot**
    * Paste Logs below or with Pastebin Link.

**Example *(Delete content of this template and paste your own log, This has been shortened, yours will be much longer)***

```
2021-01-22T01:56:40.812434+00:00 heroku[worker.1]: Restarting
2021-01-22T01:56:40.814498+00:00 heroku[worker.1]: State changed from up to starting
2021-01-22T01:56:42.496863+00:00 heroku[worker.1]: Stopping all processes with SIGTERM
2021-01-22T01:56:42.656555+00:00 heroku[worker.1]: Process exited with status 143
2021-01-22T01:56:43.886628+00:00 heroku[worker.1]: Starting process with command `node src/bot.js`
2021-01-22T01:56:44.471057+00:00 heroku[worker.1]: State changed from starting to up
2021-01-22T01:56:46.546377+00:00 app[worker.1]: Executing (default): SELECT 1+1 AS result
2021-01-22T01:56:46.905456+00:00 app[worker.1]: ----------------------------------------
2021-01-22T01:56:46.905499+00:00 app[worker.1]: @RITA Bot is now online
2021-01-22T01:56:46.905499+00:00 app[worker.1]: V.1.2.1-7 | ID: 693296000008374225
2021-01-22T01:56:46.905500+00:00 app[worker.1]: Made by: Collaboration
2021-01-22T01:56:46.905500+00:00 app[worker.1]: ----------------------------------------
2021-01-22T01:56:46.911505+00:00 app[worker.1]: Shard#0:  1 / 1 online - 0 guilds, 0 channels, 0 users
2021-01-22T01:56:46.912930+00:00 app[worker.1]: ----------------------------------------
2021-01-22T01:56:46.912930+00:00 app[worker.1]: All shards are online, running intervals
2021-01-22T01:56:46.912930+00:00 app[worker.1]: ----------------------------------------
2021-01-22T01:56:46.923688+00:00 app[worker.1]: Executing (default): CREATE TABLE IF NOT EXISTS "servers";
2021-01-22T01:56:46.934117+00:00 app[worker.1]: Executing (default): CREATE TABLE IF NOT EXISTS "tasks";
2021-01-22T01:56:46.938663+00:00 app[worker.1]: Executing (default): INSERT INTO "servers";
2021-01-22T01:56:47.096353+00:00 app[worker.1]: Rita Managment Server - 545000870105000000
2021-01-22T01:57:15.459951+00:00 app[worker.1]: Executing (default): SELECT;
2021-01-22T01:57:16.146064+00:00 app[worker.1]: Guild ID from message
2021-01-22T01:57:16.146181+00:00 app[worker.1]: Raw = 545700870105000000
2021-01-22T01:57:16.146276+00:00 app[worker.1]: Const = 545700870105000000
2021-01-22T01:57:16.146324+00:00 app[worker.1]: ---------------------
2021-01-22T01:57:16.146461+00:00 app[worker.1]: db.set Stage 1 = 
2021-01-22T01:57:16.147222+00:00 app[worker.1]: db.set Stage 2 = 
2021-01-22T01:57:16.159915+00:00 app[worker.1]: Executing (default): select * from (select embedstyle as "embedstyle" from servers where id = '545700870105000000') as table1
2021-01-22T01:57:16.181719+00:00 app[worker.1]: Guild ID from message
2021-01-22T01:57:16.181811+00:00 app[worker.1]: Raw = 545700870105000000
2021-01-22T01:57:16.181878+00:00 app[worker.1]: Const = 545700870105000000
2021-01-22T01:57:16.181948+00:00 app[worker.1]: ---------------------
2021-01-22T01:57:16.182026+00:00 app[worker.1]: db.set Stage 1 = off
2021-01-22T01:57:16.182341+00:00 app[worker.1]: db.set Stage 3 = off
2021-01-22T01:57:16.182397+00:00 app[worker.1]: db.set Stage 4 = off
2021-01-22T01:57:16.190281+00:00 app[worker.1]: Executing (default): select * from (select embedstyle as "embedstyle" from servers where id = '545700870105000000') as table1
```
