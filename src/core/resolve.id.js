// -----------------
// Global variables
// -----------------

// Codebeat:disable[LOC,ABC,BLOCK_NESTING,ARITY]
/* eslint-disable sort-keys */
/* eslint-disable default-param-last */

// -----------
// ID Helpers
// -----------

exports.idPrefix = function idPrefix (id)
{

   const regex = (/[@&#]+/gm);
   const prefix = regex.exec(id);

   if (prefix)
   {

      return prefix[0];

   }
   return null;

};

exports.idPure = function idPure (id)
{

   if (module.exports.idPrefix(id))
   {

      const prefixLen = module.exports.idPrefix(id).length;
      return id.substring(prefixLen);

   }
   return id;

};

exports.getChName = function getChName (channel)
{

   if (channel.type === "dm")
   {

      return channel.recipient.username;

   }
   return channel.name;

};

// ----------------------------------------------------------
// Convert IDs to prefixed names (for google-translate link)
// ----------------------------------------------------------

exports.idConvert = function idConvert (string, client, guild)
{

   const regex = (/<([@#]&?\d*)>/gm);
   const output = string.replace(
      regex,
      function res (match, contents)
      {

         return module.exports.main(
            client,
            contents,
            "prefixedName",
            guild
         );

      }
   );
   return output;

};

// ------------
// ID Resolver
// ------------

exports.main = function main (client, id, output = null, guild)
{

   const resolved = {
      id,
      "name": null,
      "obj": null,
      "prefix": module.exports.idPrefix(id),
      "pure": module.exports.idPure(id)
   };

   const prefixMap =
   {
      "@" ()
      {

         resolved.obj = client.users.cache.get(resolved.pure);
         resolved.name = resolved.obj.username;

      },
      "@&" ()
      {

         resolved.name = "@group";
         if (guild)
         {

            resolved.obj = guild.roles.cache.get(resolved.pure);
            resolved.name = resolved.obj.name;

         }

      },
      "#" ()
      {

         resolved.obj = client.channels.get(resolved.pure);
         resolved.name = module.exports.getChName(resolved.obj);

      }
   };

   if (Object.prototype.hasOwnProperty.call(
      resolved.prefix && prefixMap,
      resolved.prefix
   ))
   {

      prefixMap[resolved.prefix]();

   }
   else
   {

      resolved.obj = client.channels.get(id);
      resolved.name = module.exports.getChName(resolved.obj);
      resolved.prefix = "#";

   }

   const idOutputMap =
   {
      "name" ()
      {

         return resolved.name;

      },
      "prefixed" ()
      {

         return resolved.prefix + resolved.pure;

      },
      "prefixedName" ()
      {

         return resolved.prefix + resolved.name;

      },
      "type" ()
      {

         return resolved.prefix;

      }
   };

   if (Object.prototype.hasOwnProperty.call(
      output && idOutputMap,
      output
   ))
   {

      return idOutputMap[output]();

   }
   return resolved.obj;

};
