// -----------------
// Global variables
// -----------------

// Codebeat:disable[LOC,ABC,BLOCK_NESTING,ARITY]


// -------------
// Command Code
// -------------

module.exports = function run (data)
{

   const user = data.message.mentions.users.first();
   // If we have a user mentioned
   if (user)
   {

      // Now we get the member from the user
      const member = data.message.guild.members.get(user);
      // If the member is in the guild
      if (member)
      {


         /**
     * Kick the member
     * Make sure you run this on a member, not a user!
     * There are big differences between a user and a member
     */
         data.message.guild.members.
            kick("Optional reason that will display in the audit logs").
            then(() =>
            {

               // We let the message author know we were able to kick the person
               data.message.channel.send(`Successfully kicked ${user.tag}`);

            }).
            catch((err) =>
            {

               // An error happened
               // This is generally due to the bot not being able to kick the member,
               // Either due to missing permissions or role hierarchy
               data.message.channel.send("I was unable to kick the member");
               // Log the error
               console.error(err);

            });

      }
      else
      {

         // The mentioned user isn't in this guild
         data.message.channel.send("That user isn't in this guild!");

      }
      // Otherwise, if no user was mentioned

   }
   else
   {

      data.message.channel.send("You didn't mention the user to kick!");

   }

};
