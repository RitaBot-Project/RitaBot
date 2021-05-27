Firstly, thank you for wanting to contribute to this project, here are a few guidelines to follow to keep this organized and consistent.

## Requirements

* You need to have a good understanding of the `Discord API` and its limitations.
* Experience with `discord.js` which is the main library used by translator bot.
* Understanding of the `Google Translate API`  
  * Our Clone is used and can be found here: https://github.com/RitaBot-Project/google-translate-api
* Elegant and well-commented code.
* Meaningful commit/pull-req descriptions.

## Contributing code to RITA (Real-Time Intergalactic Translating Assistant)

* You must make your own clone/fork of the bot for development/testing.
* Use `gulp watch` during development for auto linting and building.  
  * Our Clone is used and can be found here: https://github.com/RitaBot-Project/gulp-watch
* Your code has to follow the **ESLint - All** rules found in `.eslintrc.json`.
* New commands must be created in the `src/commands/` folder in a new file.
* Make sure that your code does not break any functionality.
* Run extensive live tests on your Discord server.
* Create error handling and bind errors with the webhook logger.

Once you're certain the code is valid, then you can submit a pull request with your changes for review.
