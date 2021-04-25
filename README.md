<p align="center"><a href="https://ritabot.gg/"><img src="https://media3.giphy.com/media/YO4a0qsdVX3Gq3darL/giphy.gif" data-canonical-src="https://media3.giphy.com/media/YO4a0qsdVX3Gq3darL/giphy.gif" width="175" height="175" href="https://ritabot.gg/"></a></p>
<h1 align="center">Rita</h1>
<p align="center">Breaking the language barrier for free.</p>

------

<p align="center">
<img src="https://img.shields.io/github/package-json/v/ZyC0R3/RitaBot?label=Stable%20Version"> <a href="https://discordapp.com/invite/mgNR64R"><img src="https://img.shields.io/badge/Discord_Support-JOIN-7289DA.svg?"></a><a href="https://opensource.org/licenses/MIT"> <img src="https://img.shields.io/github/license/ZyC0R3/RitaBot.svg"> </a> <a href="https://github.com/Zyc0r3/RitaBot/tree/test-branch-1.3.0/"><img src="https://img.shields.io/github/package-json/v/ZyC0R3/RitaBot/test-branch?label=Test%20Version"></a> <a href="https://github.com/Zyc0r3/RitaBOt/stargazers/"> <img src="https://img.shields.io/github/stars/Zyc0r3/RitaBot" href="https://github.com/Zyc0r3/RitaBot/stargazers"> </a>
 <img src="https://img.shields.io/github/checks-status/Zyc0r3/RitaBot/ed616d5df0c63cfde954b4ea36fbab13c1ad86a6?label=build"> <a href="https://github.com/Zyc0r3/RitaBot/fork"> <img src="https://img.shields.io/badge/dynamic/json?color=success&label=forks&query=forks&url=https%3A%2F%2Fapi.github.com%2Frepos%2FZyc0r3%2FRitaBot"> </a>
</p><br/><br/>
<p align="center"> 
<img alt="open collective badge" src="https://opencollective.com/ritabot-project/tiers/supporter/badge.svg?label=Supporter&color=brightgreen" />
<img alt="open collective badge" src="https://opencollective.com/ritabot-project/tiers/sponsor/badge.svg?label=Sponsor&color=brightgreen" />
<img alt="open collective badge" src="https://opencollective.com/ritabot-project/tiers/backer/badge.svg?label=Backer&color=brightgreen" />
</p><br/><br/>


<p align="center">An open-source, free Discord Translator Bot built using <strong>google-translate-api</strong> and <strong>Discord.js</strong>.</p>

![Rita Translator Diagram](https://storage.pixteller.com/designs/designs-images/2021-02-03/05/poster-simple-quote-1-601a17471d0b6.png)

##### If you like what we are doing, please [star](https://github.com/Zyc0r3/RitaBot/stargazers) our repo using the top-right star icon




## :book: Table of Contents

*Please note some of these links direct you towards our website*
<details>
<summary></strong>Click to expand contents</strong></summary>

* [Setting up Rita](#new-bot)
* [Setting up Rita locally](#local)
* [How to Update your Bot](#update)
* [Coming Soon](#soon)
  * [Heroku Database Support](https://ritabot.gg/dbsupport/)
  * [Setup on a Raspberry Pi](https://ritabot.gg/raspberry-pi/)
  * [Whats New with Rita](https://ritabot.gg/whats-new/)
  * [Features](https://ritabot.gg/features)
  * [Usage](https://ritabot.gg/usage/)
  * [How to Update your Database Manually](https://ritabot.gg/dbsupport/)
  * [C-3PO to RITA Bot Migration](https://ritabot.gg/migration/)
  * [Webhook Log Setup](https://ritabot.gg/troubleshooting)
  * [Common Issues](https://ritabot.gg/common-issues)
  * [Command Wiki](https://ritabot.gg/wiki)
    * [Supporters](#supporters)
    * [Credits & License](#credits-&-license)
    * [Design Team](#design-team)
    * [About Us](#history)
</details>

------

## <a name="new-bot"></a>:computer: Setting up Rita Translator on Heroku

<p align="center">
<img src="https://github-images.s3.amazonaws.com/help/bootcamp/Bootcamp-Fork.png">
</p><br/><br/>

#### 1. Fork this repository.
* If you don't yet have a Github account, [create one](https://github.com/join)! It's free and easy.
* Click [here](https://github.com/ZyC0R3/RitaBot/fork) or use the button in the upper righthand side of this page to fork the repository so that it will be associated with your Github account.


* Please ***star our project*** if you like it using the top-right Star icon. Every star helps us! 
<p align="center">
<img src="https://ritabot.gg/assets/images/star.png" href="https://github.com/RitaBot-Project/RitaBot/stargazers">
</p><br/><br/>

#### 2. Create a new [Discord Application](https://discordapp.com/developers/applications) in the Discord Developer Portal
* Give app a friendly name and click the **Create App** button
  * I like the name **C-3PO**, but feel free to pick something different if you fear George Lucas's wrath. Maybe **C-4PO**
* Take note of the app **CLIENT ID**, you will need it later
* Scroll down to the **Bot** section
* Click the **Create a Bot User** button
* Click the **Yes, do it!** button
* Copy the bot's **TOKEN**, you will need it later

#### 3. Create a [Heroku account](https://id.heroku.com/signup/login) (It's free!)
* Create a new app. It's name must be unique and composed of all lowercase letters and dashes. Something like `yourname-discordbot` is fine
* Under **Deployment Method** select Github. Connect to your Github account and search for this repository by name.
* Scroll down to the manual deploy section, and select the **Master** branch. Click deploy branch, and wait for the successfully deployed message.

* Go to the **Resources** tab and look for the addons section. Search 'Postgres', and add a 'Hobby Dev - Free' version of Heroku Postgres. This will be automatically attached as your bot's database.
* Go to the **Settings** tab. Click to reveal Config Variables, then add then add the following:
  * **KEY:** =  DISCORD_TOKEN
    * **Value:** = Your discord bot's token that you copied earlier.
  * **KEY:** =  NODE_MODULES_CACHE
     * **Value:** = false
    * *This is to ensure that when the bot updates it does not use any old Dependencies that Heroku has stored and gets fresh ones from the package.json file*
* Go to the **Overview** tab and click configure dynos. Turn off the default `web npm start` dyno and turn on the `worker node src/bot.js` dyno. Your bot will now be up and running!


###### **Make sure that you have added the `Heroku Postgres` Addon in the Resources Tab of Heroku or else your bot shall not run!**

* *If you have any issues running your bot join our [Discord Server](https://discord.gg/invite/mgNR64R)*
#### 4. Invite your bot to your server and configure it!
* Replace the CLIENTID string in the following URL with your own apps client id from Step 2: 
    *  **https://discordapp.com/oauth2/authorize?&client_id=CLIENTID&scope=bot&permissions=8**
    
* Visit the resulting URL and add your bot to any server where you have admin privileges.
  * Once added, your bot should show up as online, **now go back to [Heroku](https://heroku.com/) and go to the "Deploy" section, scroll down to "Manual Deploy" and deploy the *master* branch. Once finished deploying type in `!t settings dbfix`, `!t settings updatedb` and`!t embed on` or `!t embed off` in chat and you are good to go!**
    * Your bot is now setup and ready for any translation you have for it to do. Use the commands `!t help` and `!t help modules` to learn more about the commands Rita has!
  

* **Important Note**
 * The `!t embed` command is changeable whenever you like. It simply decides wether you would like translations to be sent as Webhooks (more user-like, profile picture) or embed (bot sends message with anembed message contintaining user profile picture.)

------

## <a name="update"></a>:floppy_disk: How to Update to Stable Branch on Heroku
#### 1. Checklist
* You must have a bot already running on your server, if not then refer to [Setting up a New Bot](#new-bot)

#### 2. Make a Pull Request to your Fork from this Repo
* Complete a Pull Request from the master Branch of ZyC0R3/Rita to your master branch. 
  * Detailed instructions with example can be found **[here](https://www.sitepoint.com/quick-tip-sync-your-fork-with-the-original-without-the-cli/)**


#### 3. Deploy Updated Fork in Heroku
* Log in to your Heroku account.
* Select the bot you made in Step 3 of [Setting up a New Bot](#new-bot)
* Under **Deployment Method** make sure you have Github selected, ensure **Connect to GitHub** has the correct repository selected, Scroll down to the "Manual deploY" section, and select the **master** branch. Click deploy branch, and wait for the successfully deployed message.

#### 4. Updating Database

* Once the bot has been deployed with the successfully updated fork you are all done.
------

## <a name="local"></a>:desktop_computer: Running Rita Locally

*The bot can also be run locally on a device. The local setup requires more steps since the database needs to be setup and the development tools need be installed. Please note that for the bot to continue running 24/7, the process of `node src/bot.js` should always remain online and thus your PC/hosting device must remain online too*

#### 1. Create a local database
Any Database that runs with [SQL Sequelize](https://sequelize.org/master/) can be used. My recommendation is to use the [SQL Lite](https://www.sqlite.org/index.html) database since the setup is fast and access is easy. Copy the connection details to the database for the next step. Example: The connection to a sqlite database with the name *`database.db`* stored at the same level of this README file would be *`./database.db`*.

#### 2. Install necessary software
Install [node.js](https://nodejs.org/en/) and make sure you have [Git](https://git-scm.com/downloads) and [npm](https://www.npmjs.com/get-npm) installed

#### 4. Install the bot
* Run **```git clone https://github.com/Zyc0r3/RitaBot```**
* Download dependencies using **`npm install`**

#### 5. Create a new .env File
Rename the existing **.env.example** file and name it **.env**. Edit the Values of **DISCORD_TOKEN**, and the **DATABASE_URL** according to the values that you in [Step 2 of "Setting Up a New Bot"](#new-bot) .
  * DATABASE_URL needs to be the path to the database file (if you set **`DATABASE_URL`** to any of these values: `./database.db`, `C:/FOLDER/ok.db`, `../random.db` they will all work because they lead to a directory in which SQLite then creates the `.db` file )
    * Example -  `DATABASE_URL` = `C:\Admin\Rita_Development\test.db`

#### 5. Invite your bot to your server and configure it!
* Replace the **CLIENTID** string in the following URL with your own apps client id: https://discordapp.com/oauth2/authorize?&client_id=**CLIENTID**&scope=bot&permissions=8
  * Visit the resulting URL and add your bot to any server where you have admin privileges.

* Once added, your bot should show up as online. 
  * Your bot is now setup and ready for any translation you have for it to do. Use the commands `!t help` and `!t help modules` to learn more about the commands Rita has!

## <a name="database"></a>Heroku Database Support
Sometimes you need to edit the Database manually, This is not something you should be playing around with unless you really know what you are doing.

#### 1. Checklist
1. Know that you are doing, if you don't then **don't** touch the DB. Simple.
2. Download and Install Postgres Admin 4, Located [Here](https://www.pgadmin.org/download/) or [Here](https://www.postgresql.org/ftp/pgadmin/pgadmin4/). *This guide will be for Windows, but it shouldn't be much different for any other OS.*
3. Locate your credentials for you Heroku Database, Log in to **Heroku** > Select your **App** > Click **Resources** > Click **Heroku Postgres** > Click **Settings** > Click **View Credentials** (*Note: Heroku rotates credentials periodically and updates applications where this database is attached.*)

#### 2. Connect
For a fresh install of pgAdmin, the dashboard likely contains only one server. This is your local server, Ignore this.
1. Right click server(s) > create > server …
2. Fill out the following:
  * **Name:** This is solely for you. Name it whatever you want, I chose ‘Heroku-Run — On’

*Under the connection tab:*
  * **Hostname/Address:** This is the host credential you located in Step 3. It should look like \*\*-\*\*-\*\*...amazonaws.com
  * **Port:** Keep the port at 5432, unless your credentials list otherwise
  * **Maintenance database** This is the database name in the credentials
  * **Username:**  This is the user field in the credentials
  * **Password:** The password field located in Step 3. I highly advise checking save password so that you don’t have to copypasta this every time you want to connect.
  * In the **SSL Tab**, mark SSL mode as require

At this point, if we were to hit ‘save’ (please don’t), something very strange would happen. You’d see hundreds if not thousands of databases appear in pgAdmin. This has to do with how Heroku configures their servers. You’ll still only have access to your specific database, not those of others. In order to avoid parsing so many databases, we have to white list only those databases we care about.

1. Go to the **Advanced** tab and under db restriction copy the database name (it’s the same value as the **Maintenance Database** field filled earlier).
2. Click Save/Connect and you are done. Edit away.
------
### <a name="soon"></a>:bulb: Coming Soon!

01. Error Message Support Section.
02. Auto Reverse translation for the auto function.
03. `!t tasks #TargetChannel` Implementation.
04. Introduction of a Streamlined Command Handler. (This will be done as a New Project)
05. Update to Discord.js V12 (V1.3.0)
06. Allow Bot Translation (V1.3.0)
07. Webhooks (`!t embed off` version) using Nickname instead of Username (1.3.0) 
08. Check what language translation requests are orignally in to stop unnecessary translations and to make automatic-same channel translation ethical (1.3.0)
09. Discord slash commands introduction

------

### <a name="supporters"></a> :clap: Supporters

[![Stargazers repo roster for @Zyc0r3/RitaBot](https://reporoster.com/stars/RitaBot-Project/RitaBot)](https://github.com/RitaBot-Project/RitaBot/stargazers)
[![Forkers repo roster for @Zyc0r3/RitaBot](https://reporoster.com/forks/RitaBot-Project/RitaBot)](https://github.com/RitaBot-Project/RitaBot/network/members)

------


### <a name="credits-&-license"></a>:star_struck: Credits & License

This project was originally released by Aziz under the MIT license. He chose to take the project private/commercial at version 0.4.2 Beta. Bobby Johnson forked the project and renamed it Louie after his dog. AlooAkbar forked Louie and added the necessary modifications for simple and free deployment of the bot using Heroku. ZyC0R3 Picked up the fork and as part of a team fixed over 200 errors and brought it in to the modern age, All would like to thank Aziz for his hard work and making these early versions OSS so that others may learn and build on his hard work to share with the community.

------

### <a name="design-team"></a>:sunglasses: Design Team
* Zycore / [ZyC0R3](https://github.com/ZyC0R3)
* Artanis / [ArtanisTheOne](https://github.com/ArtanisTheOne)
* Balthazar / [Jshep89](https://github.com/JShep89)
* Z3US / [cyberlooper](https://github.com/cyberlooper)
* Maddious / [MadIndex](https://github.com/MadIndex)
* defqon.1 / [wdaniel1985](https://github.com/wdaniel1985)

------

### <a name="history"></a>:yum: What is Rita and who are we?

*Rita is the culmination of many things, it started with a mobile game, a community of gamers, a discord server of different languages and a desire to all be understood. She is a Real-Time Translator Bot for use on Discord, Hosted using Heroku and Local Devices and Completly **100%** Free. She is maintained by a small group of users, each with different backgrounds and some learning as we go.*

------

#### :world_map: Why did you make Rita?

*The mobile game itself would get old, fast. The community around it, however, is what kept us going. The one downside was we didn't all speak the same language. The game we played translated our conversations for us but Discord didn't, so the server admins used a  translation bot called C-3P0. This introduction is the start of the story.*

------

#### :rocket: The history of Rita?

*There are loads of different translation bots out there, some are amazing, some are expensive, some are free but have limits, and others are just rubbish. C-3P0 checked all these boxes.*

*Originally called discord-translator and made by Aziz, then forked By NotMyself and renamed Louie, forked again By AlooAkbar and renamed C-3P0, its code was neglected, not maintained, left outdated and iterations made private for commercial gains.*

------

#### :star2: Why Rita and what does it stand for?

*I and a group of fellow C-3P0 users decided that collectively we could do better, plagued with crashes, API changes, relentless bugs and issues, the drive to make something better was born. Vast changes were made, many hours were spent and now the Rita you now was brought to life.*

*Rita's history and various iterations each added something extra, it just needed to be brought together and molded, molded into something amazing, moulded into Rita. The Real-Time Interchangeable Translating Assistant.*

------
###### *There you have it, the story, dramatised and electrified for effect, but all true, of how Rita was born.*



***Released under MIT license.***
