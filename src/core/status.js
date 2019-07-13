// ------------------
// Update Bot Status
// ------------------

module.exports = function(bot, status, channel, writable = true)
{
   const statusMap =
   {
      "online": function()
      {
         bot.setPresence({
            status: "online",
            game: {
               name: "!t help / !translate help V1.1.0"
            }
         });
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

   if (status && statusMap.hasOwnProperty(status) && writable)
   {
      return statusMap[status]();
   }
};
