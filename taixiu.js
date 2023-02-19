const Discord = require('discord.js');
const client = new Discord.Client();
const guildId = '1'; // ID của Guild A
const roleId = '1995'; // ID của role trong Guild A
const ownerId = '1998'; // ID của chủ sở hữu guild
const joinCommand = '!joinguild'; // Lệnh để tham gia vào Guild A

client.on('message', async message => {
  if (message.content.toLowerCase() === joinCommand.toLowerCase()) {
    // Nếu member nhập lệnh "!joinguild"
    const filter = m => m.author.id === message.author.id;
    const options = { max: 1, time: 60000, errors: ['time'] };
    // Tạo form để nhập thông tin
    message.channel.send('Vui lòng nhập tên của bạn: ');
    const name = (await message.channel.awaitMessages(filter, options)).first().content;
    message.channel.send('Vui lòng nhập tuổi của bạn: ');
    const age = (await message.channel.awaitMessages(filter, options)).first().content;

    // Tạo Embed để gửi tin nhắn tới chủ sở hữu guild
    const embed = new Discord.MessageEmbed()
      .setTitle('Thông tin đăng ký')
      .addField('Tên', name)
      .addField('Tuổi', age)
      .setTimestamp();
    const owner = message.guild.members.cache.get(ownerId);
    owner.send(embed)
      .then(msg => {
        msg.react('✅'); // Thêm emoji cho tin nhắn
        msg.react('❌');
        const filter = (reaction, user) => {
          return ['✅', '❌'].includes(reaction.emoji.name) && user.id === ownerId;
        };
        const collector = msg.createReactionCollector(filter, { max: 1, time: 60000 });
        collector.on('collect', (reaction, user) => {
          if (reaction.emoji.name === '✅') {
            // Nếu chủ guild chọn ✅ thì member sẽ được thêm vào guild và được thêm role
            const member = message.member;
            const guild = client.guilds.cache.get(guildId);
            guild.members.add(member)
              .then(() => {
                const role = guild.roles.cache.get(roleId);
                member.roles.add(role);
                message.channel.send(`Chúc mừng, bạn đã được thêm vào guild ${guild.name}!`);
              })
              .catch(error => {
                console.error(error);
                message.channel.send('Có lỗi xảy ra khi thêm bạn vào guild. Vui lòng thử lại sau.');
              });
          } else {
            // Nếu chủ guild chọn ❌ thì không thêm member vào guild
            message.channel.send('Đăng ký của bạn đã bị từ chối.');
          }
        });
      })
      .catch(error => {
        console.error(error);
        message.channel.send('Có lỗi xảy ra khi gửi tin nhắn tới chủ guild. Vui lòng thử lại sau.');
      });
  }
});

client.login('YOUR_DISCORD_BOT_TOKEN');
