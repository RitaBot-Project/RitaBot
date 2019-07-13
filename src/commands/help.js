const botSend = require("../core/send");
const auth = require("../core/auth");

// ------------------------------
// Bot Help / Command List
// ------------------------------

module.exports = function(data)
{
   data.color = "info";

   // ------------------------------
   // Detect if help is needed for specific command
   // ------------------------------

   var getHelpWith = "basics";

   if (data.cmd.params)
   {
      const cleanParam = data.cmd.params.toLocaleLowerCase().trim();
      getHelpWith = cleanParam;
   }

   data.text = helpMessage(data.config, data.bot.username, getHelpWith);

   return botSend(data);
};

// ------------------------------
// Help Section
// ------------------------------

const helpSection = function(data)
{
   var section =
      `${data.icon}  **[${data.title}](${data.link})**\n\n`
      //`\`${data.cmd} help ${data.help}\`\n\n`
      //"\n```cpp\n" +
      //`Command: "` +
      //`${data.cmd} ${data.cmd} ${data.args}"\n\n` +
      //`Example: "` +
      //`${data.cmd} ${data.cmd} ${data.example}"\n` +
      //`Help: "` +
      //`${data.cmd} help ${data.help}"` +
      //"\n```\n"
   ;

   return section;
};

// ------------------------------
// Help Text
// ------------------------------

const helpMessage = function(config, botname, param)
{
   // ------------------------------
   // Bot Info
   // ------------------------------

   const cmd = config.translateCmdShort;

   const info =
   `**${botname} Bot - v.${config.version}**\n` +
   `Translates Discord messages (based on \`Google API\`).\n\n`;

   // ------------------------------
   // Support & Donations
   // ------------------------------

   var donation = "";
   if (auth.donation && auth.donation.length > 5)
   {
      donation =
         "Like this bot? [Support the developer!](" + auth.donation + ")";
   }

   // ------------------------------
   // Help Basics
   // ------------------------------

   const basics =
   helpSection({
      config: config,
      title: "Translate by Reacting",
      link: "https://github.com/ZyC0R3/Rita/Translate-with-Emoji-Reaction",
      icon: ":flag_white:",
      cmd: null,
      help: "react",
      args: null,
      example: "!t help react for examples"
   }) +
   helpSection({
      config: config,
      title: "Translate Custom Text",
      link: "https://github.com/ZyC0R3/Rita/Translate-Custom-Text",
      icon: ":abc:",
      cmd: "this",
      help: "custom",
      args: "to [lang] from [lang]: [msg]",
      example: "to french from english: hello"
   }) +
   helpSection({
      config: config,
      title: "Translate Last Message",
      link: "https://github.com/ZyC0R3/Rita/Translate-Last-Message",
      icon: ":arrow_double_up:",
      cmd: "last",
      help: "last",
      args: "[count] from [lang] to [lang]",
      example: "3 from german to spanish"
   }) +
   helpSection({
      config: config,
      title: "Translate Channel (Automatic)",
      link: "https://github.com/ZyC0R3/Rita/Translate-Channel-Automatic",
      icon: ":hash:",
      cmd: "channel",
      help: "auto",
      args: "from [lang] to [lang] for [@/#]",
      example: "from hebrew to arabic for me"
   }) +
   helpSection({
      config: config,
      title: "Stats",
      link: "https://github.com/ZyC0R3/Rita/wiki/Get-Statistics",
      icon: ":bar_chart:",
      cmd: "stats",
      help: "misc",
      args: "stats [server/global]",
      example: ""
   }) +
   helpSection({
      config: config,
      title: "Settings",
      link: "https://github.com/ZyC0R3/Rita/wiki/Settings",
      icon: ":gear:",
      cmd: "settings",
      help: "settings",
      args: "setLang to [lang]",
      example: "setLang to italian"
   }) +
   helpSection({
      config: config,
      title: "Report Bugs / Request Features",
      link: "https://github.com/ZyC0R3/Rita/issues",
      icon: ":raising_hand::skin-tone-3:"
   }) +
   donation;

   // ------------------------------
   // Last Message (last)
   // ------------------------------

   const last =
   `__**Translate Last Message(s)**__\n\n` +
   `Translates last message chain(s) in channel. A chain is a collection of ` +
   `messages by the same author, to keep things simple.\n` +
   "```md\n" +

   `# Command\n` +
   `> ${cmd} last \n` +
   `> ${cmd} last [n] to [lang] from [lang] \n\n` +

   `# Parameters\n` +
   `> to [lang] - defaults to server default language\n` +
   `> to [lang, lang, ...] - translates to multiple languages\n` +
   `> from [lang] - defaults to automatic detection\n` +
   `> [n] - number of chains to translate, default is 1\n` +
   `> [-n] - negative number means only one chain is translated\n\n` +

   `# Examples\n` +
   `* ${cmd} last 2 \n` +
   `* ${cmd} last to english \n` +
   `* ${cmd} last to english, german, french \n` +
   `* ${cmd} last -6 to english from german` +
   "```";

   // ------------------------------
   // Flag Emoji Reaction
   // ------------------------------

   const react =
   `__**Translate by reaction**__\n\n` +
   `Translates a message in the server when you react to it with a ` +
   `flag emoji. For example: :flag_ca:, :flag_it:, :flag_eg:, :flag_jp:`;

   // ------------------------------
   // Custom message (this)
   // ------------------------------

   const custom =
   `__**Translate Custom Message**__\n\n` +
   `Translates a custom message entered by user.\n` +
   "```md\n" +

   `# Command\n` +
   `> ${cmd} this: [msg] \n` +
   `> ${cmd} this to [lang] from [lang]: [msg] \n\n` +

   `# Parameters\n` +
   `> to [lang] - defaults to server default language\n` +
   `> to [lang, lang, ...] - translates to multiple languages\n` +
   `> from [lang] - defaults to automatic detection\n\n` +

   `# Examples\n` +
   `* ${cmd} this: bonjour \n` +
   `* ${cmd} this to spanish: hello world \n` +
   `* ${cmd} this to arabic, hebrew: I love you \n` +
   `* ${cmd} this to de from en: how are you? \n` +
   "```";

   // ------------------------------
   // Auto translate (channel)
   // ------------------------------

   const auto =
   `__**Auto Translate Channels/Users**__\n\n` +
   `Automatically translates any new messages in channel and forwards them ` +
   `to you. Admins/mods can set forwarding to other channels or users in ` +
   `server. Messages in forwarded channels will also be sent back to origin*.` +
   "```md\n" +

   `# Command\n` +
   `> ${cmd} channel \n` +
   `> ${cmd} channel to [lang] from [lang] for [me/@/#] \n` +
   `> ${cmd} stop for [me/@/#] \n\n` +

   `# Parameters\n` +
   `> to [lang] - defaults to server default language\n` +
   `> from [lang] -  language to translate from \n` +
   `> for [me/@/#] - defaults to "me", admins can use mentions \n\n` +

   `# Examples\n` +
   `* ${cmd} channel to english from chinese \n` +
   `* ${cmd} channel to en from de for #englishChannel \n` +
   `* ${cmd} channel to de from en for @steve \n` +
   `* ${cmd} channel to en from ru for #ch1, #ch2, #usr1 \n` +
   "```" +
   "\n* Translated messages that are forwarded to users include a special id " +
   "for replying. Simply copy the code and paste into DM window before your " +
   "message to send a response, example: `XX123: your message here`.";

   // ------------------------------
   // Auto translate (stop)
   // ------------------------------

   const stop =
   `__**Stop Auto Translation**__\n\n` +
   `Terminates auto-translation of channel for you. ` +
   `Admins/mods can stop for other channels or users in server.` +
   "```md\n" +

   `# Command\n` +
   `> ${cmd} stop \n` +
   `> ${cmd} stop for [me/@/#/all] \n\n` +

   `# Parameters\n` +
   `> for [me/@/#/all] - defaults to "me" \n\n` +

   `# Examples\n` +
   `* ${cmd} stop \n` +
   `* ${cmd} stop for me \n` +
   `* ${cmd} stop for @usr1 \n` +
   `* ${cmd} stop for #ch1 \n` +
   `* ${cmd} stop for all \n` +
   "```";

   // ------------------------------
   // Misc
   // ------------------------------

   const misc =
   `__**Miscellaneous Commands**__\n\n` +
   "```md\n" +

   `# Help\n` +
   `> ${cmd} help\n` +
   `> ${cmd} help [command]\n\n` +

   `# Statistics\n` +
   `> ${cmd} version \n` +
   `> ${cmd} stats \n` +
   `> ${cmd} stats global \n` +
   `> ${cmd} stats server \n\n` +

   `# Links\n` +
   `> ${cmd} invite\n\n` +

   `# Supported Languages\n` +
   `> ${cmd} list\n` +
   "```";

   // ------------------------------
   // Settings
   // ------------------------------

   const settings =
   `__**Settings**__\n\n` +
   `These commands are available only to admins in server channels.` +
   "```md\n" +

   `# Set default server language\n` +
   `> ${cmd} settings setLang to [lang]\n\n` +

   `# Disconnect bot from server\n` +
   `> ${cmd} settings disconnect \n` +
   "```";

   // ------------------------------
   // Proccess result
   // ------------------------------

   const paramMap =
   {
      "basics": info + basics,
      "custom": custom,
      "react": react,
      "last": last,
      "auto": auto,
      "stop": stop,
      "misc": misc,
      "settings": settings
   };

   if (paramMap.hasOwnProperty(param))
   {
      return paramMap[param];
   }

   return paramMap.basics;
};
