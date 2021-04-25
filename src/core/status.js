// ------------------
// Update Bot Status
// ------------------

module.exports = function(bot, status, config, writable = true)
{
   const activevar = [`ritabot.gg | !tr help`, `for messages to translate | ritabot.gg`, "messages to translate | ritabot.gg", `!tr help commands | ritabot.gg`, "translations | ritabot.gg", `v.${config.version} | ritabot.gg`, `!tr help modules | ritabot.gg` ];
   const statusvar = ["PLAYING", "WATCHING", "LISTENING", "WATCHING", "WATCHING", "PLAYING", "WATCHING"];
   const statusMap =
   {
      "online": function()
      {
         bot.setPresence({
            status: "online",
            game: {
               name: activevar[0]
            } //run this on stratup

         });
         setInterval(function() //every 20 seconds generate a random number and update status to that
         {
            var actID = Math.floor(Math.random() * 6);
            bot.setPresence({
               status: "online",
               game: {
                  name: activevar[actID],
                  type: statusvar[actID]
               }
            });
         }, 20000);
         /*const index = Math.floor(Math.random() * (activities_list.length - 1) + 1);
         bot.setPresence({
            status: "online",
            game: {
               name: "ritabot.gg | " + config.translateCmdShort + " help" //V." + config.version
            }
         });*/
      },

      "busy": function()
      {
         bot.setPresence({
            status: "dnd"
         });
      },

      "free": function()
      {
         bot.setPresence({
            status: "online"
         });
      }
   };

   //if (status && statusMap.hasOwnProperty(status) && writable)
   if (Object.prototype.hasOwnProperty.call(status && statusMap,status) && writable)
   {
      return statusMap[status]();
   }
};
