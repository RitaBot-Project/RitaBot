// -----------------
// Global variables
// -----------------

// Codebeat:disable[LOC,ABC,BLOCK_NESTING,ARITY]
/* eslint-disable sort-keys */
/* eslint-disable no-unused-vars */
const autoTranslate = require("./auto");
const Sequelize = require("sequelize");
const logger = require("./logger");
const Op = Sequelize.Op;
let dbNewPrefix = "";
const server_obj = {};
exports.server_obj = server_obj;

// ----------------------
// Database Auth Process
// ----------------------

console.log("DEBUG: Pre Stage Database Auth Process");
const db = process.env.DATABASE_URL.endsWith(".db") ?
   new Sequelize({
      "dialect": "sqlite",
      "dialectOptions": {
         "ssl": {
            "require": true,
            "rejectUnauthorized": false
         }
      },
      "storage": process.env.DATABASE_URL
   }) :
   new Sequelize(
      process.env.DATABASE_URL,
      {
         "logging": console.log,
         "dialectOptions": {
            "ssl": {
               "require": true,
               "rejectUnauthorized": false
            }
         }
      // Logging: null,
      }
   );

db.
   authenticate().
   then(() =>
   {

      logger(
         "dev",
         "Successfully connected to database"
      );

   }).
   catch((err) =>
   {

      logger(
         "error",
         err
      );

   });

// ---------------------------------
// Database stats table definition
// ---------------------------------

console.log("DEBUG: Pre Stage Database stats table definition");
const Stats = db.define(
   "stats",
   {
      "id": {
         "type": Sequelize.STRING(32),
         "primaryKey": true,
         "unique": true,
         "allowNull": false
      },
      "message": {
         "type": Sequelize.INTEGER,
         "defaultValue": 0
      },
      "translation": {
         "type": Sequelize.INTEGER,
         "defaultValue": 0
      },
      "embedon": {
         "type": Sequelize.INTEGER,
         "defaultValue": 0
      },
      "embedoff": {
         "type": Sequelize.INTEGER,
         "defaultValue": 0
      },
      "images": {
         "type": Sequelize.INTEGER,
         "defaultValue": 0
      },
      "gif": {
         "type": Sequelize.INTEGER,
         "defaultValue": 0
      },
      "react": {
         "type": Sequelize.INTEGER,
         "defaultValue": 0
      }
   }
);

// ---------------------------------
// Database server table definition
// ---------------------------------

console.log("DEBUG: Pre Stage Database server table definition");
const Servers = db.define(
   "servers",
   {
      "id": {
         "type": Sequelize.STRING(32),
         "primaryKey": true,
         "unique": true,
         "allowNull": false
      },
      "prefix": {
         "type": Sequelize.STRING(32),
         "defaultValue": "!tr"
      },
      "lang": {
         "type": Sequelize.STRING(8),
         "defaultValue": "en"
      },
      "count": {
         "type": Sequelize.INTEGER,
         "defaultValue": 0
      },
      "active": {
         "type": Sequelize.BOOLEAN,
         "defaultValue": true
      },
      "embedstyle": {
         "type": Sequelize.STRING(8),
         "defaultValue": "on"
      },
      "bot2botstyle": {
         "type": Sequelize.STRING(8),
         "defaultValue": "off"
      },
      "webhookid": Sequelize.STRING(32),
      "webhooktoken": Sequelize.STRING(255),
      "webhookactive": {
         "type": Sequelize.BOOLEAN,
         "defaultValue": false
      }
   }
);

// --------------------------------
// Database tasks table definition
// --------------------------------

console.log("DEBUG: Pre Stage Database tasks table definition");
const Tasks = db.define(
   "tasks",
   {
      "origin": Sequelize.STRING(32),
      "dest": Sequelize.STRING(32),
      "reply": Sequelize.STRING(32),
      "server": Sequelize.STRING(32),
      "active": {
         "type": Sequelize.BOOLEAN,
         "defaultValue": true
      },
      "LangTo": {
         "type": Sequelize.STRING(8),
         "defaultValue": "en"
      },
      "LangFrom": {
         "type": Sequelize.STRING(8),
         "defaultValue": "en"
      }
   },
   {
      "indexes": [
         {
            "unique": true,
            "name": "ux_index_1",
            "fields": [
               "origin",
               "dest",
               "LangTo",
               "LangFrom"
            ]
         }
      ]
   }
);

// -------------------
// Init/create tables
// -------------------

// eslint-disable-next-line require-await
exports.initializeDatabase = async function initializeDatabase (client)
{

   console.log("DEBUG: Stage Init/create tables - Pre Sync");
   db.sync({"logging": console.log}).then(async () =>
   {

      Stats.upsert({"id": "bot"});
      await this.updateColumns();
      Servers.upsert({"id": "bot",
         "lang": "en"});
      console.log("DEBUG: New columns should be added Before this point.");
      db.getQueryInterface().removeIndex(
         "tasks",
         "tasks_origin_dest"
      );
      const guilds = client.guilds.cache.array().length;
      const guildsArray = client.guilds.cache.array();
      let i = 0;
      for (i = 0; i < guilds; i += 1)
      {

         const guild = guildsArray[i];
         const guildID = guild.id;
         Stats.upsert({"id": guildID});
         Servers.findAll({"where": {"id": guildID}}).then((projects) =>
         {

            if (projects.length === 0)
            {

               console.log("DEBUG: Add Server");
               Servers.upsert({"id": guildID,
                  "lang": "en"});
               Stats.upsert({"id": guildID});

            }

         });

      }
      console.log("DEBUG: Stage Init/create tables - Pre servers FindAll");
      const serversFindAll = await Servers.findAll();
      // {
      for (let i = 0; i < serversFindAll.length; i += 1)
      {

         // eslint-disable-next-line prefer-const
         let guild_id = serversFindAll[i].id;
         // eslint-disable-next-line eqeqeq
         if (guild_id != "bot")
         {

            server_obj[guild_id] = {"db": serversFindAll[i]};

         }

      }
      console.log("DEBUG: Stage Init/create tables - Pre guildClient");
      const guildClient = Array.from(client.guilds.cache.values());
      for (let i = 0; i < guildClient.length; i += 1)
      {

         const guild = guildClient[i];
         server_obj[guild.id].guild = guild;
         server_obj[guild.id].size = guild.memberCount;
         if (!server_obj.size)
         {

            server_obj.size = 0;

         }
         server_obj.size += guild.memberCount;

      }
      console.log("----------------------------------------\nDatabase fully initialized.\n----------------------------------------");
      // });

   });

};

// -----------------------
// Add Server to Database
// -----------------------

exports.addServer = async function addServer (id, lang)
{

   console.log("DEBUG: Stage Add Server to Database");
   server_obj[id] = {
      "db": {
         "embedstyle": "on",
         "bot2botstyle": "off",
         id,
         "webhookid": null,
         "webhooktoken": null,
         "prefix": "!tr"
      }
   };
   await Servers.findAll({"where": {id}}).then((server) =>
   {

      if (server.length === 0)
      {

         Servers.create({
            id,
            lang,
            "prefix": "!tr"
         });
         Stats.create({
            id
         });

      }

   });

};

// ------------------
// Deactivate Server
// ------------------

exports.removeServer = function removeServer (id)
{

   console.log("DEBUG: Stage Deactivate Server");
   return Servers.update(
      {"active": false},
      {"where": {id}}
   );

};

// -------------------
// Update Server Lang
// -------------------

exports.updateServerLang = function updateServerLang (id, lang, _cb)
{

   console.log("DEBUG: Stage Update Server Lang");
   return Servers.update(
      {lang},
      {"where": {id}}
   ).then(function update ()
   {

      _cb();

   });

};

// -------------------------------
// Update Embedded Variable in DB
// -------------------------------

exports.updateEmbedVar = function updateEmbedVar (id, embedstyle, _cb)
{

   console.log("DEBUG: Stage Update Embedded Variable in DB");
   server_obj[id].db.embedstyle = embedstyle;
   return Servers.update(
      {embedstyle},
      {"where": {id}}
   ).then(function update ()
   {

      _cb();

   });

};

// ------------------------------
// Update Bot2Bot Variable In DB
// ------------------------------

exports.updateBot2BotVar = function updateBot2BotVar (id, bot2botstyle, _cb)
{

   console.log("DEBUG: Stage Update Bot2Bot Variable In DB");
   server_obj[id].db.bot2botstyle = bot2botstyle;
   return Servers.update(
      {bot2botstyle},
      {"where": {id}}
   ).then(function update ()
   {

      _cb();

   });

};

// -----------------------------------------------
// Update webhookID & webhookToken Variable In DB
// -----------------------------------------------

exports.updateWebhookVar = function updateWebhookVar (id, webhookid, webhooktoken, webhookactive, _cb)
{

   console.log("DEBUG: Stage Update webhookID & webhookToken Variable In DB");

   return Servers.update(
      {webhookid,
         webhooktoken,
         webhookactive},
      {"where": {id}}
   ).then(function update ()
   {

      _cb();

   });

};

// -------------------------
// Deactivate debug Webhook
// -------------------------

exports.removeWebhook = function removeWebhook (id, _cb)
{

   console.log("DEBUG: Stage Deactivate debug Webhook");
   return Servers.update(
      {"webhookactive": false},
      {"where": {id}}
   ).then(function update ()
   {

      _cb();

   });

};

// --------------
// Update prefix
// --------------

exports.updatePrefix = function updatePrefix (id, prefix, _cb)
{

   console.log("DEBUG: Stage Update prefix");
   dbNewPrefix = prefix;
   server_obj[id].db.prefix = dbNewPrefix;
   return Servers.update(
      {prefix},
      {"where": {id}}
   ).then(function update ()
   {

      _cb();

   });

};

// -----------------------------
// Add Missing Variable Columns
// -----------------------------

exports.updateColumns = async function updateColumns ()
{

   console.log("DEBUG: Stage Add Missing Variable Columns");
   // Very sloppy code, neew to find a better fix.
   await db.getQueryInterface().describeTable("servers").
      then((tableDefinition) =>
      {

         if (!tableDefinition.prefix)
         {

            console.log("DEBUG:-------------> Adding prefix column");
            db.getQueryInterface().addColumn(
               "servers",
               "prefix",
               {"type": Sequelize.STRING(32),
                  "defaultValue": "!tr"}
            );

         }
         if (!tableDefinition.embedstyle)
         {

            console.log("DEBUG:-------------> Adding embedstyle column");
            db.getQueryInterface().addColumn(
               "servers",
               "embedstyle",
               {"type": Sequelize.STRING(8),
                  "defaultValue": "on"}
            );

         }
         if (!tableDefinition.bot2botstyle)
         {

            console.log("DEBUG:-------------> Adding bot2botstyle column");
            db.getQueryInterface().addColumn(
               "servers",
               "bot2botstyle",
               {"type": Sequelize.STRING(8),
                  "defaultValue": "off"}
            );

         }
         if (!tableDefinition.webhookid)
         {

            console.log("DEBUG:-------------> Adding webhookid column");
            db.getQueryInterface().addColumn(
               "servers",
               "webhookid",
               {"type": Sequelize.STRING(32)}
            );

         }
         if (!tableDefinition.webhooktoken)
         {

            console.log("DEBUG:-------------> Adding webhooktoken column");
            db.getQueryInterface().addColumn(
               "servers",
               "webhooktoken",
               {"type": Sequelize.STRING(255)}
            );

         }
         if (!tableDefinition.webhookactive)
         {

            console.log("DEBUG:-------------> Adding webhookactive column");
            db.getQueryInterface().addColumn(
               "servers",
               "webhookactive",
               {"type": Sequelize.BOOLEAN,
                  "defaultValue": false}
            );

         }

      });

   return console.log("DEBUG: All New Columns Added");

};

// ------------------
// Get Channel Tasks
// ------------------

// eslint-disable-next-line consistent-return
exports.channelTasks = function channelTasks (data)
{

   console.log("DEBUG: Stage Get Channel Tasks");
   let id = data.message.channel.id;
   if (data.message.channel.type === "dm")
   {

      id = `@${data.message.author.id}`;

   }
   try
   {

      // eslint-disable-next-line no-unused-vars
      const taskList = Tasks.findAll({"where": {"origin": id,
         "active": true}}).then(function res (result)
      {

         data.rows = result;
         return autoTranslate(data);

      });

   }
   catch (e)
   {

      logger(
         "error",
         e
      );
      data.err = e;
      return autoTranslate(data);

   }

};

// ------------------------------
// Get tasks for channel or user
// ------------------------------

exports.getTasks = function getTasks (origin, dest, cb)
{

   console.log("DEBUG: Stage Get tasks for channel or user");
   if (dest === "me")
   {

      return Tasks.findAll(
         {"where": {origin,
            dest}},
         {"raw": true}
      ).then(function res (result, err)
      {

         cb(
            err,
            result
         );

      });

   }
   return Tasks.findAll(
      {"where": {origin}},
      {"raw": true}
   ).then(function res (result, err)
   {

      cb(
         err,
         result
      );

   });

};

// --------------------------------
// Check if dest is found in tasks
// --------------------------------

exports.checkTask = function checkTask (origin, dest, cb)
{

   console.log("DEBUG: Stage Check if dest is found in tasks");
   if (dest === "all")
   {

      return Tasks.findAll(
         {"where": {origin}},
         {"raw": true}
      ).then(function res (result, err)
      {

         cb(
            err,
            result
         );

      });

   }
   return Tasks.findAll(
      {"where": {origin,
         dest}},
      {"raw": true}
   ).then(function res (result, err)
   {

      cb(
         err,
         result
      );

   });

};

// --------------------
// Remove Channel Task
// --------------------

exports.removeTask = function removeTask (origin, dest, cb)
{

   console.log("DEBUG: Stage Remove Channel Task");
   if (dest === "all")
   {

      console.log("DEBUG: removeTask() - all");
      return Tasks.destroy({"where": {[Op.or]: [
         {origin},
         {"dest": origin}
      ]}}).then(function error (err, result)
      {

         cb(
            null,
            result
         );

      });

   }
   return Tasks.destroy({"where": {[Op.or]: [
      {origin,
         dest},
      {"origin": dest,
         "dest": origin}
   ]}}).then(function error (err, result)
   {

      cb(
         null,
         result
      );

   });

};

// ---------------
// Get Task Count
// ---------------

exports.getTasksCount = function getTasksCount (origin, cb)
{

   console.log("DEBUG: Get Task Count");
   return Tasks.count({"where": {origin}}).then((c) =>
   {

      cb(
         "",
         c
      );

   });

};

// ------------------
// Get Servers Count
// ------------------

exports.getServersCount = function getServersCount ()
{

   console.log("DEBUG: Stage Get Servers Count");
   return server_obj.length();

};

// ---------
// Add Task
// ---------

exports.addTask = function addTask (task)
{

   console.log("DEBUG: Stage Add Task");
   task.dest.forEach((dest) =>
   {

      Tasks.upsert({
         "origin": task.origin,
         dest,
         "reply": task.reply,
         "server": task.server,
         "active": true,
         "LangTo": task.to,
         "LangFrom": task.from
      }).then(() =>
      {

         logger(
            "dev",
            "Task added successfully."
         );

      }).
         catch((err) =>
         {

            logger(
               "error",
               err,
               "command",
               task.server
            );

         });

   });

};

// -------------
// Update stats
// -------------

// Increase the count in Servers table
exports.increaseServersCount = function increaseServersCount (id)
{

   console.log("DEBUG: Stage Update count in Servers table");
   return Servers.increment(
      "count",
      {"where": {id}}
   );

};

exports.increaseStatsCount = function increaseStatsCount (col, id)
{

   console.log("DEBUG: Stage Update counts in stats table");
   return Stats.increment(
      col,
      {"where": {id}}
   );

};

// --------------
// Get bot stats
// --------------

exports.getStats = function getStats (callback)
{

   console.log("DEBUG: Stage Get bot stats");
   return db.query(
      `select * from (select sum(count) as "totalCount", ` +
  `count(id)-1 as "totalServers" from servers) as table1, ` +
  `(select count(id)-1 as "activeSrv" from servers where active = TRUE) as table2, ` +
  `(select lang as "botLang" from servers where id = 'bot') as table3, ` +
  `(select count(distinct origin) as "activeTasks" ` +
  `from tasks where active = TRUE) as table4, ` +
  `(select count(distinct origin) as "activeUserTasks" ` +
  `from tasks where active = TRUE and origin like '@%') as table5,` +
  `(select message as "message" from stats where id = 'bot') as table6,` +
  `(select translation as "translation" from stats where id = 'bot') as table7,` +
  `(select embedon as "embedon" from stats where id = 'bot') as table8,` +
  `(select embedoff as "embedoff" from stats where id = 'bot') as table9, ` +
  `(select images as "images" from stats where id = 'bot') as table10, ` +
  `(select react as "react" from stats where id = 'bot') as table11, ` +
  `(select gif as "gif" from stats where id = 'bot') as table12;`,
      {"type": Sequelize.QueryTypes.SELECT}
   ).
      then(
         (result) => callback(result),
         (err) => logger(
            "error",
            `${err}\nQuery: ${err.sql}`,
            "db"
         )
      );

};

// ----------------
// Get server info
// ----------------

exports.getServerInfo = function getServerInfo (id, callback)
{

   console.log("DEBUG: Stage Get server info");
   return db.query(`select * from (select count as "count",` +
   `lang as "lang" from servers where id = ?) as table1,` +
   `(select count(distinct origin) as "activeTasks"` +
   `from tasks where server = ?) as table2,` +
   `(select count(distinct origin) as "activeUserTasks"` +
   `from tasks where origin like '@%' and server = ?) as table3, ` +
   `(select embedstyle as "embedstyle" from servers where id = ?) as table4, ` +
   `(select bot2botstyle as "bot2botstyle" from servers where id = ?) as table5, ` +
   `(select webhookactive as "webhookactive" from servers where id = ?) as table6,` +
   `(select webhookid as "webhookid" from servers where id = ?) as table7,` +
   `(select webhooktoken as "webhooktoken" from servers where id = ?) as table8,` +
   `(select prefix as "prefix" from servers where id = ?) as table9,` +
   `(select message as "message" from stats where id = ?) as table10,` +
   `(select translation as "translation" from stats where id = ?) as table11,` +
   `(select embedon as "embedon" from stats where id = ?) as table12, ` +
   `(select embedoff as "embedoff" from stats where id = ?) as table13, ` +
   `(select images as "images" from stats where id = ?) as table14, ` +
   `(select react as "react" from stats where id = ?) as table15, ` +
   `(select gif as "gif" from stats where id = ?) as table16;`, {"replacements": [ id, id, id, id, id, id, id, id, id, id, id, id, id, id, id, id],
      "type": db.QueryTypes.SELECT}).
      then(
         (result) => callback(result),
         (err) => this.updateColumns()
      );

};

// ---------
// Close DB
// ---------

exports.close = function close ()
{

   console.log("DEBUG: Stage Close DB");
   return db.close();

};
