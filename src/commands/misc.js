// -----------------
// Global variables
// -----------------

// codebeat:disable[LOC,ABC,BLOCK_NESTING,ARITY]
/*eslint-disable no-irregular-whitespace*/
const botSend = require("../core/send");
const auth = require("../core/auth");
const fn = require("../core/helpers");
const logger = require("../core/logger");
const stripIndent = require("common-tags").stripIndent;
const oneLine = require("common-tags").oneLine;
const secConverter = require("seconds-converter");

// ------------
// Invite Link
// ------------

exports.invite = function(data)
{
   data.color = "info";
   data.text = `Invite ${data.bot} `;
   data.text += `\`v${data.config.version}\` to your server\n\n`;
   data.text += `${auth.invite}`;
   data.footer = {
      text:
         "Requires VIEW, SEND, REACT, EMBED, ATTACH and MENTION permissions.\n"
   };

   // -------------
   // Send message
   // -------------

   return botSend(data);
};

// -----------------------
// Get info on all shards
// -----------------------

exports.shards = function(data)
{
   if (!data.message.author.id === data.config.owner)
   {
      return;
   }

   // ---------------
   // Get shard info
   // ---------------

   const shard = data.message.client.shard;

   if (!shard)
   {
      // ---------------
      // Render message
      // ---------------

      data.title = "Shards Info";

      data.footer = {
         text: "Single Process - No Sharding Manager"
      };

      data.color = "info";

      data.text = "​\n" + oneLine`
         :bar_chart:  ​
         **${data.message.client.guilds.size}**  guilds  ·  ​
         **${data.message.client.channels.size}**  channels  ·  ​
         **${data.message.client.users.size}**  users
      ` + "\n​";

      // -------------
      // Send message
      // -------------

      return botSend(data);
   }

   // --------------------------
   // Get proccess/shard uptime
   // --------------------------

   const shardErr = function(err)
   {
      return logger("error", err, "shardFetch");
   };

   shard.fetchClientValues("guilds.size").then(guildsSize =>
   {
      shard.fetchClientValues("channels.size").then(channelsSize =>
      {
         shard.fetchClientValues("users.size").then(usersSize =>
         {
            const output = [];

            for (let i = 0; i < shard.count; ++i)
            {
               output.push({
                  name: `:pager: - Shard #${i}`,
                  inline: true,
                  value: stripIndent`
                     ​
                     **\`${guildsSize[i]}\`** guilds

                     **\`${channelsSize[i]}\`** channels

                     **\`${usersSize[i]}\`** users
                     ​
                  `
               });
            }

            // ---------------
            // Render message
            // ---------------

            data.title = "Shards Info";

            data.text = "​\n" + oneLine`
               :bar_chart:   Total:  ​
               **${shard.count}**  shards  ·  ​
               **${fn.arraySum(guildsSize)}**  guilds  ·  ​
               **${fn.arraySum(channelsSize)}**  channels  ·  ​
               **${fn.arraySum(usersSize)}**  users
            ` + "\n​";

            data.color = "info";

            data.fields = output;

            // -------------
            // Send message
            // -------------

            botSend(data);

            // -------------
            // catch errors
            // -------------
         }).catch(shardErr);
      }).catch(shardErr);
   }).catch(shardErr);
};

// ----------------------
// Current proccess info
// ----------------------

exports.proc = function(data)
{
   if (!data.message.author.id === data.config.owner)
   {
      return;
   }

   // ------------------
   // Get proccess data
   // ------------------

   const title = `**\`${process.title}\`** `;
   const pid = `**\`#${process.pid}\`** `;
   const platform = `**\`${process.platform}\`** `;

   // ---------------
   // Get shard info
   // ---------------

   let shard = data.message.client.shard;

   if (!shard)
   {
      shard = {
         id: 0,
         count: 1
      };
   }

   // -----------------------
   // Byte formatter (mb/gb)
   // -----------------------

   const byteFormat = function(bytes)
   {
      if (bytes > 750000000)
      {
         const gb = bytes / 1000 / 1000 / 1000;
         return gb.toFixed(3) + " gb";
      }

      const mb = bytes / 1000 / 1000;
      return mb.toFixed(2) + " mb";
   };

   // -----------------
   // Get memory usage
   // -----------------

   const memory = process.memoryUsage();
   const memoryFormat = oneLine`
      **\`${byteFormat(memory.rss)}\`** \`rss\` ·
      **\`${byteFormat(memory.heapUsed)}\`**\`/\`
      **\`${byteFormat(memory.heapTotal)}\`** \`heap\` ·
      **\`${byteFormat(memory.external)}\`** \`external\`
   `;

   // --------------
   // Get CPU usage
   // --------------

   const cpu = process.cpuUsage();

   // --------------------------
   // Get proccess/shard uptime
   // --------------------------

   const procUptime = secConverter(Math.round(process.uptime()), "sec");

   const shardUptime = secConverter(data.message.client.uptime);

   const uptimeFormat = function(uptime)
   {
      return oneLine`
         **\`${uptime.days}\`** days
         **\`${uptime.hours}:${uptime.minutes}:${uptime.seconds}\`**
      `;
   };

   // ---------------
   // Render message
   // ---------------

   data.text = stripIndent`
      :robot:  Process:  ${title + pid + platform}

      :control_knobs:  RAM:  ${memoryFormat}

      :control_knobs:  CPU:  **\`${cpu}%\`**

      :stopwatch:  Proc Uptime:  ${uptimeFormat(procUptime)}

      :stopwatch:  Shard Uptime:  ${uptimeFormat(shardUptime)}

      :pager:  Current Shard:  **\`${shard.id + 1} / ${shard.count}\`**
   `;

   // -------------
   // Send message
   // -------------

   botSend(data);
};

// --------------
// Get CPU Usage
// --------------

const cpuUsage = function()
{
   function secNSec2ms (secNSec)
   {
      return secNSec[0] * 1000 + secNSec[1] / 1000000;
   }

   var startTime = process.hrtime();
   var startUsage = process.cpuUsage();

   // spin the CPU for 500 milliseconds

   var now = Date.now();
   while (Date.now() - now < 500)
   {
      //do nothing
   }

   var elapTime = process.hrtime(startTime);
   var elapUsage = process.cpuUsage(startUsage);
   var elapTimeMS = secNSec2ms(elapTime);
   var elapUserMS = secNSec2ms(elapUsage.user);
   var elapSystMS = secNSec2ms(elapUsage.system);
   var cpuPercent = Math.round(100 * (elapUserMS + elapSystMS) / elapTimeMS);

   return cpuPercent;
};
