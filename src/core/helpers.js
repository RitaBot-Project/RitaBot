// -----------------
// Global variables
// -----------------

// Codebeat:disable[LOC,ABC,BLOCK_NESTING,ARITY]
/* eslint-disable consistent-return */
const logger = require("./logger");

// --------------------------------------
// Helper Functions & Buffer end checker
// --------------------------------------

exports.bufferEnd = function bufferEnd (arrOriginal, arrFinal)
{

   if (arrOriginal.length === arrFinal.length)
   {

      return true;

   }
   return false;

};

// ----------------------
// Check user permission
// ----------------------

exports.checkPerm = function checkPerm (member, channel, perm)
{

   return channel.permissionsFor(member).has(perm);

};

// ------------------------------------
// Get key name of object by its value
// ------------------------------------

exports.getKeyByValue = function getKeyByValue (object, value)
{

   return Object.keys(object).find((key) => object[key] === value);

};

// -----------------------------
// Remove duplicates from array
// -----------------------------

exports.removeDupes = function removeDupes (array)
{

   return Array.from(new Set(array));

};

// ------------------------------
// Replace all matches in string
// ------------------------------

exports.replaceAll = function replaceAll (str, search, replacement)
{

   return str.replace(
      new RegExp(
         search,
         "g"
      ),
      replacement
   );

};

// ---------------------------
// Sort array by specific key
// ---------------------------

exports.sortByKey = function sortByKey (array, key)
{

   return array.sort(function sort (a, b)
   {

      const x = a[key];
      const y = b[key];
      return x < y ?
         -1 :
         x > y ?
            1 :
            0;

   });

};

// -----------------------------------
// Split string to array if not array
// -----------------------------------

exports.arraySplit = function arraySplit (input, sep)
{

   if (input.constructor === Array && input.length > 0)
   {

      return input;

   }
   return input.split(sep);

};

// -----------------------
// Split string to chunks
// -----------------------

exports.chunkString = function chunkString (str, len)
{

   const _size = Math.ceil(str.length / len);
   const _ret = new Array(_size);
   let _offset = null;

   for (let _i = 0; _i < _size; _i += 1)
   {

      _offset = _i * len;
      _ret[_i] = str.substring(
         _offset,
         _offset + len
      );

   }

   return _ret;

};

// ----------------------------------
// Get sum of array values (numbers)
// ----------------------------------

exports.arraySum = function arraySum (array)
{

   return array.reduce(
      (a, b) => a + b,
      0
   );

};

// -----------------------
// Get Highest Role Color
// -----------------------

exports.getRoleColor = function getRoleColor (member)
{

   if (member && member.highestRole && member.highestRole.color)
   {

      return member.highestRole.color;

   }
   return null;

};

// ---------
// Get user
// ---------

exports.getUser = function getUser (client, userID, cb)
{

   const user = client.users.cache.get(userID);

   if (user)
   {

      return cb(user);

   }

   // User not in cache, fetch 'em

   client.users.fetch(userID).then(cb).
      catch((err) =>
      {

         cb(false);
         return logger(
            "error",
            err
         );

      });

};

// ------------
// Get channel
// ------------

exports.getChannel = function getChannel (client, channelID, userID, cb)
{

   const channel = client.channels.cache.get(channelID);

   if (channel)
   {

      return cb(channel);

   }

   // Not in cache, create DM

   if (userID)
   {

      module.exports.getUser(
         client,
         userID,
         (user) =>
         {

            user.createDM().then(cb).
               catch((err) =>
               {

                  cb(false);
                  return logger(
                     "error",
                     err
                  );

               });

         }
      );

   }

};

// ------------
// Get message
// ------------

exports.getMessage = function getMessage (client, messageID, channelID, userID, cb)
{

   module.exports.getChannel(
      client,
      channelID,
      userID,
      (channel) =>
      {

         const message = channel.messages.cache.get(messageID);

         if (message)
         {

            return cb(message);

         }

         // Message not in channel cache

         channel.messages.fetch(messageID).then(cb).
            catch((err) => cb(
               null,
               err
            ));

      }
   );

};
