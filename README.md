## RITA (beta)
Translation bot built using `discord.js` and `Google Translate API`.

![GitHub package.json version](https://img.shields.io/github/package-json/v/ZyC0R3/Rita?style=plastic)
![GitHub last commit](https://img.shields.io/github/last-commit/ZyC0R3/Rita.svg?style=plastic)
![GitHub](https://img.shields.io/github/license/ZyC0R3/Rita.svg?style=plastic)
![GitHub issues](https://img.shields.io/github/issues-raw/ZyC0R3/Rita.svg?style=plastic)
[![invite](https://img.shields.io/badge/Discord_Support-JOIN-7289DA.svg?style=plastic&)](https://discordapp.com/invite/mgNR64R)


#### Current Test Branch
![GitHub package.json version (branch)](https://img.shields.io/github/package-json/v/ZyC0R3/Rita/test-branch?style=plastic)

## Coming Soon!
01. Local Installation Support Section.
02. Error Message Support Section.
03. Single Image with no Text forwarder.
04. Auto Reverse transaltion for the auto function.


## Table of Contents

01. [Features](#features)
02. [Usage](#usage)
03. [New Bot (RECOMMENDED)](#new-bot)
04. [Existing Bot Migration (EXPERIMENTAL)](#existing-bot-migration)
05. [Heroku Database Support](#database)
06. [Local Installation Support](#local)
07. [Troubleshooting](#troubleshooting)
08. [Error Messages](#errors)
09. [Commands](#commands)
10. [Credits & License](#credits-&-license)
11. [Design Team](#design-team)

## <a name="features"></a>Features
* Translate custom messages
* Translate messages by reacting with flag emoji
* Translate last message(s) in channel
* Translate to multiple languages at once
* Automatic translation of channels with option to forward translations to users or seperate channels.
* Supports 100+ languages

## <a name=""></a>Usage
* Cerate your own with the instructions below.
* Write `!translate help` or `!t help` for a list of commands.


**If you are looking to set up a New Bot then follow the instruction below, If you already have a Heroku Bot Using C-3P0 then Scroll down for instruction on how to migrate your translation settings.**


## <a name="new-bot"></a>New Bot (RECOMMENDED)

**To deploy a free translation bot that you can add to your discord server, follow these easy steps.**


#### 1. Fork this repo.
* If you don't yet have a github account, [create one](https://github.com/join)! It's free and easy.
* Use the button in the upper righthand side of this page to fork the repo so that it will be associated with your github account.

#### 2. Create a new [Discord App](https://discordapp.com/developers/applications/me/create)
* Give app a friendly name and click the **Create App** button
  * I like the name **C-3PO**, but feel free to pick something different if you fear George Lucas's wrath. Maybe **C-4PO**
* Take note of the app **CLIENT ID**, you will need it later
* Scroll down to the **Bot** section
* Click the **Create a Bot User** button
* Click the **Yes, do it!** button
* Copy the bot's **TOKEN**, you will need it later

#### 3. Create a [Heroku account](https://id.heroku.com/signup/login) (It's free!)
* Create a new app. It's name must be unique and composed of all lowercase letters and dashes. Something like `yourname-discordbot` is fine
* Under **Deployment Method** select Github. Connect to your Github account and search for this repo by name.
* Scroll down to the manual deploy section, and select the **1.1.5** branch. Click deploy branch, and wait for the successfully deployed message.
* Go to the **Resources** tab and look for the addons section. Search 'Postgres', and add a 'Hobby Dev - Free' version of Heroku Postgres. This will be automatically attached as your bot's database.
* Go to the **Settings** tab. Click to reveal Config Variables, then add a new one. The key will be **DISCORD_TOKEN**, and the value will be your discord bot's token that you copied earlier.
* Go to the **Overview** tab and click configure dynos. Turn off the default `web npm start` dyno and turn on the `worker node src/bot.js` dyno. Your bot will now be up and running!

#### 4. Invite your bot to your server and configure it!
* Replace the CLIENTID string in the following url with your own apps client id: https://discordapp.com/oauth2/authorize?&client_id=CLIENTID&scope=bot&permissions=8
* Visit the resulting url and add your bot to any server where you have admin privileges.
* Once added, your bot should show up more or less instantaneously. Type `!t help` within the discord chat for more details on how to use it. Happy translating!

## <a name="existing-bot-migration"></a>Existing Bot Migration (EXPERIMENTAL)
**If you already have a Heroku Bot Using C-3P0**

#### 1. Checklist
* Make sure you have completed the following steps before attempting to migrate translation settings.
1. You have an already up and running C-3P0 Bot.
2. You are using Heroku to run the old version.
3. Make sure you do not disable, reset or delete your database (preferably Postgres from Heroku)

#### 2. Migrate
* Go to Heroku and click your app of C-3PO, once you have direct yourself to the deploy section. Once at the deploy section fork this project ( https://github.com/ZyC0R3/Rita ) and name it whatever you like.  
* Go back to the deploy section in Heroku and scroll down until you see the current fork your C-3PO bot is running off of, next to it there should be a button saying "Disconnect" click that and then click search on repositories.
* Click your fork of this project and wait for it to load. Once that is completed you need to deploy the '1.1.5' version of the bot.
* Wait for it to finish deploying and you should be good to go. Turn on your worker dyno (if it was not already) and make sure your DISCORD_TOKEN is connected in the variables section in Settings. All data from your previous C-3PO bot should be saved in the database of Postgres as long as you do not delete it and will connect to all the previous channel translation connections. Happy Translating!


## <a name="database"></a>Heroku Database Support
Sometimes you need to edit the Database manually, This is not something you should be playing around with unless you really know what you are doing.

#### 1. Checklist
1. Know that you are doing, if you don't then **don't** touch the DB. Simple.
2. Download and Install [Postgres Admin 4](https://www.postgresql.org/ftp/pgadmin/pgadmin4/v4.10/), This guide will be for Windows, but it shouldn't be much different for any other OS.
3. Locate your credentials for you Heroku Database, Log in to **Heroku** > Select your **App** > Click **Resources** > Click **Heroku Postgres** > Click **Settings** > Click **View Credentials** (*Note: Heroku rotates credentials periodically and updates applications where this database is attached.*)

#### 2. Connect
For a fresh install of pgAdmin, the dashboard likely contains only one server. This is your local server, Ignore this.
1. Right click server(s) > create > server …
2. Fill out the following:
  * **Name:** This is solely for you. Name it whatever you want, I chose ‘Heroku-Run — On’

*Under the connection tab:*
  * **Hostname/Address:** This is the host credential you located in Step 3. It should look like \*\*-\*\*-\*\*...amazonaws.com
  * **Port:** Keep the port at 5432, unless your credentials list otherwise
  * **Maintenance databaseL** This is the database field located in Step 3.
  * **Username:**  This is the user field in the credentials
  * **Password:** The password field located in Step 3. I highly advise checking save password so that you don’t have to copypasta this every time you want to connect.
  * In the **SSL Tab**, mark SSL mode as require

At this point, if we were to hit ‘save’ (please don’t), something very strange would happen. You’d see hundreds if not thousands of databases appear in pgAdmin. This has to do with how Heroku configures their servers. You’ll still only have access to your specific database, not those of others. In order to avoid parsing so many databases, we have to white list only those databases we care about.

3. Go to the **Advanced** tab and under db restriction copy the database name (it’s the same value as the **Maintenance Database** field filled earlier).
4. Click Save/Connect and you are done. Edit away.

## <a name="local"></a>Local Installation Support
The bot can also be run locally without Heroku. The local setup requires more steps since the database needs to be setup and the development tools need be installed. Start with the steps 1 and 2 in the description [New Bot (RECOMMENDED)](#new-bot) and continue as follows:

#### 3. Create a local database
Any Database that runs with SQL Sequelize ('https://sequelize.org/master/') can be used. My recommendation is to use the [SQL Lite](https://www.sqlite.org/index.html) database since the setup is fast and access is easy. Copy the connection details to the database for the next step. Example: The connection to a sqlite database with the name *database.db* stored at the same level of this README file would be *./database.db*.

#### 4. Create a new .env File
Copy the existing **.env.example** file and name it **.env**. Edit the Values of **DISCORD_TOKEN**, **DISCORD_BOT_OWNER_ID** and the **DATABASE_URL** according to the values that you copied earlier.

#### 5. Install nodejs
Install nodejs ('https://nodejs.org/en/').  

#### 6. Run and start the bot
Run `npm install -g gulp` in your console to install gulp. Build the bot code using `npm build` and run the bot with `npm start`. 

#### 7. Invite your bot to your server and configure it!
See step 4 in the description [New Bot (RECOMMENDED)](#new-bot).

## <a name="troubleshooting"></a>Troubleshooting
* You can set up debugging Webhooks using the following steps
    1. Create a new channel on your server to receive the Webhooks, let's say `#Webhooks`.
    2. Go to Server Settings -> Webhooks -> Create Webhook. Select the `#Webhooks` channel, then copy the Webhook's URL. It will look something like `https://discordapp.com/api/webhooks/012345678901234567/VCj9yOOtJF9VCm-BU2F9xrbnoWD5gBZZ-UU1mZHcxi5VLgr3bPb9NanRJM8YD9cpBisL`
    3. In the **Settings** tab of your Heroku app add the following Config Variables (values extracted from your URL):
        * **DISCORD_DEBUG_WEBHOOK_ID** : 012345678901234567
        * **DISCORD_DEBUG_WEBHOOK_TOKEN** : VCj9yOOtJF9VCm-BU2F9xrbnoWD5gBZZ-UU1mZHcxi5VLgr3bPb9NanRJM8YD9cpBisL
    4. Restart your app's `worker node src/bot.js` dyno, and you will begin to receive debugging messages in your `#Webhooks` channel.
* If your bot in unresponsive, the first thing to check is Heroku. Log in and manually restart the `worker node src/bot.js` dyno.
* For further troubleshooting, it's helpful to install the Heroku command line interface. Once installed you can login from a terminal with `heroku login` and check your apps logs with `heroku logs --tail -a <your-app-name>`
* If you are unable to solve a problem yourself, report it with as much detail as possible in this repo's issue tracker.

## <a name="errors"></a>Error Messages
This section/feature is being Created, Check back soon or join the support discord.


## <a name="commands"></a>Commands
* [Translate Custom Text](https://github.com/ZyC0R3/Rita/wiki/Translate-Custom-Message)
* [Translate by Reaction](https://github.com/ZyC0R3/Rita/wiki/Translate-by-Reacting)
* [Translate Last Message](https://github.com/ZyC0R3/Rita/wiki/Translate-Last-Message)
* [Translate Channel](https://github.com/ZyC0R3/Rita/wiki/Translate-Channel-Automatic)
* [Settings](https://github.com/ZyC0R3/Rita/wiki/Settings)
* [Misc. Commands](https://github.com/ZyC0R3/Rita/wiki/Misc.-Commands)

## <a name="credits-&-license"></a>Credits & License

This project was originally released by Aziz under the MIT license. He chose to take the project private/commercial at version 0.4.2 Beta. Bobby Johnson forked the project and renamed it Louie after his dog. AlooAkbar forked Louie and added the necessary modifications for simple and free deployment of the bot using Heroku. ZyC0R3 Picked up the fork and as part of a team fixed over 200 errors and brought it in to the modern age, All would like to thank Aziz for his hard work and making these early versions OSS so that others may learn and build on his hard work to share with the community.

## <a name="design-team"></a>Design Team
* Zycore / [ZyC0R3](https://github.com/ZyC0R3)
* Artanis / [ArtanisTheOne](https://github.com/ArtanisTheOne)
* Balthazar / [Jshep89](https://github.com/JShep89)
* Z3US / [cyberlooper](https://github.com/cyberlooper)
* Maddious / [MadIndex](https://github.com/MadIndex)
* defqon.1 / [wdaniel1985](https://github.com/wdaniel1985)

Released under MIT license.
