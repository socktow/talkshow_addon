const slotItems = [
"<:tom:878997284480770098>", 
"<:nai:878997284312977509>", 
"<:ga:878997284661108737>", 
"<:ca:878997284669505556>", 
"<:bau:878997284476567703>",
"<:cua:878997284686270465>"];

const { MessageEmbed } = require('discord.js');
function makeid() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  
    for (var i = 0; i < 5; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));
  
    return text;
  }

module.exports = {
  
        name:"baucua",
        aliases: ["baucua","bc"],
        category: "economy",
        description: "baucua",
        usage: "baucua",
        accessableby: ""
    ,
    run: async (bot, message, args) => {

      if(!message.member.hasPermission("MANAGE_MESSAGES")) return message.reply("Bạn không phải host sòng.").then(message=>message.delete({timeout:"5000"}));
      if(!message.guild.me.hasPermission("MANAGE_MESSAGES")) return message.reply("Tui không có quyền chỉnh sửa tin nhắn.").then(message=>message.delete({timeout:"5000"}));

    let user = message.author;
    let money = parseInt(args[0]);
    let win = false;

    let number = []
    for (let i = 0; i < 3; i++) { number[i] = Math.floor(Math.random() * slotItems.length); }

    if (number[0] == number[1] && number[1] == number[2])  { 
        money *= 9
        win = true;
    } else if (number[0] == number[1] || number[0] == number[2] || number[1] == number[2]) { 
        money *= 3
        win = true;
    }

    if (win) {
        let slotsEmbed1 = new MessageEmbed()
            .setDescription(`${slotItems[number[0]]}  ${slotItems[number[1]]}  ${slotItems[number[2]]}`)
            .setColor("GREEN")
        message.channel.send(`<a:x_welcome1:877909689390747678><a:x_welcome2:877909764372332554> các con nghiện ! Sẵn sàng chưa nào`)
        //roll 1
        .then((msg) => {
          setTimeout(function() {
              msg.edit(`<a:uu:877908961553158154> <a:uu:877908961553158154> <a:uu:877908961553158154>`);
            }, 3000);
         // roll 1
          setTimeout(function() {
          msg.edit(`${slotItems[number[0]]} <a:uu:877908961553158154> <a:uu:877908961553158154>`);
        }, 6000);
        // roll ra 2
        setTimeout(function() {
          msg.edit(`${slotItems[number[0]]} ${slotItems[number[1]]} <a:uu:877908961553158154>`);
        }, 9000);
        // roll ra 3
        setTimeout(function() {
          msg.edit(`${slotItems[number[0]]} ${slotItems[number[1]]} ${slotItems[number[2]]}`);
        }, 12000);
      })
      message.channel.send(`**Bỏ cái tay ra nghennnnnn**`)
          .then((msg) => {
          setTimeout(function() {
              msg.edit(`**Lắc Nè Quý Zị**`);
            }, 3000);
          setTimeout(function() {
              msg.edit(`**Gòy xong , chung tiền chung tiền**`);
            }, 12000)})
    } else {
        let slotsEmbed = new MessageEmbed()
            .setDescription(`${slotItems[number[0]]}  ${slotItems[number[1]]}  ${slotItems[number[2]]}`)
            .setColor("GREEN")
        message.channel.send(`<a:x_welcome1:877909689390747678><a:x_welcome2:877909764372332554> các con nghiện ! Sẵn sàng chưa nào`)
        //roll 1
        .then((msg) => {
            setTimeout(function() {
                msg.edit(`<a:uu:877908961553158154> <a:uu:877908961553158154> <a:uu:877908961553158154>`);
              }, 3000);
           // roll 1
            setTimeout(function() {
            msg.edit(`${slotItems[number[0]]} <a:uu:877908961553158154> <a:uu:877908961553158154>`);
          }, 7000);
          // roll ra 2
          setTimeout(function() {
            msg.edit(`${slotItems[number[0]]} ${slotItems[number[1]]} <a:uu:877908961553158154>`);
          }, 12000);
          // roll ra 3
          setTimeout(function() {
            msg.edit(`${slotItems[number[0]]} ${slotItems[number[1]]} ${slotItems[number[2]]}`);
          }, 15000);
        })
        message.channel.send(`**Bỏ cái tay ra nghennnnnn**`)
            .then((msg) => {
            setTimeout(function() {
                msg.edit(`**Lắc Nè Quý Zị**`);
              }, 7000);
            setTimeout(function() {
                msg.edit(`**Gòy xong , chung tiền chung tiền**`);
              }, 15000)})

    }

}
}
