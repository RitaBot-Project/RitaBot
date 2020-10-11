// -----------------
// Global variables
// -----------------

// codebeat:disable[LOC,ABC,BLOCK_NESTING,ARITY]

// -----------
// ID Helpers
// -----------

exports.idPrefix = function(id)
{
   const regex = (/[@&#]+/gm);
   var prefix = regex.exec(id);

   if (prefix)
   {
      return prefix[0];
   }
   return null;
};

exports.idPure = function(id)
{
   if (module.exports.idPrefix(id))
   {
      const prefixLen = module.exports.idPrefix(id).length;
      return id.substring(prefixLen);
   }
   return id;
};

exports.getChName = function(channel)
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

exports.idConvert = function(string, client, guild)
{
   const regex = (/<([@#]&?\d*)>/gm);
   const output = string.replace(regex, function(match, contents)
   {
      return module.exports.main(client, contents, "prefixedName", guild);
   });
   return output;
};

// ------------
// ID Resolver
// ------------

exports.main = function(client, id, output = null, guild)
{
   var resolved = {
      id: id,
      prefix: module.exports.idPrefix(id),
      pure: module.exports.idPure(id),
      name: null,
      obj: null
   };

   const prefixMap =
   {
      "@": function()
      {
         resolved.obj = client.users.get(resolved.pure);
         resolved.name = resolved.obj.username;
      },
      "@&": function()
      {
         resolved.name = "@group";
         if (guild)
         {
            resolved.obj = guild.roles.get(resolved.pure);
            resolved.name = resolved.obj.name;
         }
      },
      "#": function()
      {
         resolved.obj = client.channels.get(resolved.pure);
         resolved.name = module.exports.getChName(resolved.obj);
      }
   };

   if (Object.prototype.hasOwnProperty.call(resolved.prefix && prefixMap,resolved.prefix))
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
      "name": function()
      {
         return resolved.name;
      },
      "prefixed": function()
      {
         return resolved.prefix + resolved.pure;
      },
      "prefixedName": function()
      {
         return resolved.prefix + resolved.name;
      },
      "type": function()
      {
         return resolved.prefix;
      }
   };

   if (Object.prototype.hasOwnProperty.call(output && idOutputMap,output))
   {
      return idOutputMap[output]();
   }
   return resolved.obj;
};
