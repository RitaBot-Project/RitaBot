## 1.3.0 - Unreleased & EXPERIMENTAL
* EXPERIMENTAL version of RITA - Not safe for normal use.
* Discord.js update from V11 to V12
* All feature in previous versions are included however core functions are faulty and may cause DB issues. 
  * Updating to this version may corrupt your DB, Do not do this unless you have backed it up. 

## 1.2.2 - Test Branch

## 1.2.1 
* New commands added (embed, bot2bot, settings updatedb)
  * embed command allows you to change the type of message that is sent to the translation channel, in embed format or standard text. Standard text shows the users avatar and name instead of the bot.
  * bot2bot allows for messages sent from other bots, in non embedded format to be translated as well. (Due to limitation this has been implimented but is disabled for now)
  * As the new variables above are stored in the DB, they need new Columns to be added, as such updatedb will complete these actions.
* Major code changes, new code implementations will change the DB and produce errors on first build, but this is a safe version to update to. Follow the below instructions.
  * Step 1: Make a pull request and update from **Master** branch. 
    * Once you update the bot and it initializes you WILL get a db error, this is normal. (we are working on suppressing these)
  * Step 2: `!t settings updatedb`
    * This will throw another error but it will build the missing columns.
    * The default value for embed is on and botbot is off.
    * Running this multiple times will cause error to be posted to webhook chan, this is a "Value exists" error. Preventing you from destroying the DB
  * Step 3: Completed, and now working.
    * Once you have completed Step 2, the bot will have come online, but it wont have fully Initialised. 
    * To prevent a never ending loop of errors, the VERY FIRST message or command sent on the server will Initialise the DB fully. Meaning you will have to send that message again.
      * Please Note Due to [Automatic dyno restarts](https://devcenter.heroku.com/articles/dynos#automatic-dyno-restarts) the first message after each restart will share the same behaviour as above.
* Added in command triggers and command deletion to clean up command channels.
* Custom Emoji's are now supported and will be sent with the translated message correctly, with the exception of a few languages.
* DM Translation have been disabled as it has been identified they never worked as intended. they will be re-introduced in a later update.
* Various Security vulnerabilities fixed.
* Dev Dependencies core to this bot, the `google-transalte-api` & `google-transalte-token` & `gulp-watch`have been updated
* `eslint` has been replaced with `babel-eslint`
* `!t settings updatebot` Has been **DISABLED** - This is not needed as of yet and with the similarities to the `!t settings updatedb` command it may cause issues.
* Deploy with Heroku Setup and integration. 
 
## 1.2.0
* No Code changes, just URL updates for New name of Bot
* Published to NPM
* Non code changes will be appended with Version-\*\* from now on.
* Various Spelling mistakes in ReadMe have been corrected.
* Dev Dependencies core to this bot, the `google-transalte-api` & `google-transalte-token` have been updated
* Setup on a Raspberry Pi instruction Section added.
* gulp-watch updated dependencies. (*Moved to Local Repo as it was out-of-date and full of Security Issues.*)
* Patch for Chinese language support.
* Various Security vulnerabilities fixed.
* Various commands re-activated.

## 1.1.8
* Various Security vulnerabilities fixed.
* Various Spelling mistakes in ReadMe have been corrected.
* Dev Dependencies core to this bot, the google-transalte-api & google-transalte-token have been updated

## 1.1.7
* Setup on a Raspberry Pi Section.
* gulp-watch updated dependancies.
* Patch for Chinese language support.
* Various Security vulnerabilites fixed.
* Various commands re-activated.

## 1.1.6
* Dependancy Updates
* Updated ReadMe with Local Installation Support Section.
* Images can now be sent in chat without the need for accompanying text.
* All Heroku Build Warnings have been fixed.
* The bot now responds when you change the server language.
* Translation to user Via DM is now working again.
* Stop command no longer crashes the bot.

## 1.1.5
* Core Changed with minor Gulp Updates
* Changes to the approved length of Server ID's as Discord API has changed.
* Updated Readme for Database Connection Support

## 1.1.4
* Dependancy Updates

## 1.1.3
* Dependancy Updates
  * "gulp-eslint": "^6.0.0" from "^4.0.2"
  * "eslint": "^6.0.1" from "4.19.1"
* Help File Updates

## 1.1.0
* .eslintrc.json Fixes
* Dependancy Updates
  * Changed "google-translate-token" from @vitalets/google-translate-token to "github:ZyC0R3/google-translate-token"

## 1.0.0
* First Build
