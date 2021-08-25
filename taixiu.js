const slotItems = [
  "<:1:879665246556545086>", 
  "<:2:879665246808191016>", 
  "<:3:879665246506205186>", 
  "<:4:879665246569115649>", 
  "<:5:879665246686568469>",
  "<:6:879665246376185887>"
];

  module.exports = {
    
          name:"taixiu",
          aliases: ["taixiu","tx"],
          category: "economy",
          description: "taixiu",
          usage: "taixiu",
          accessableby: ""
      ,

      run: async (bot, message, args) => {
  
      if(!message.member.hasPermission("MANAGE_MESSAGES")) 
      return message.reply("Bạn không phải host sòng.").then(message=>message.delete({timeout:"5000"}));

      if(!message.guild.me.hasPermission("MANAGE_MESSAGES")) 
      return message.reply("Tui không có quyền chỉnh sửa tin nhắn.").then(message=>message.delete({timeout:"5000"}));

      let user = message.author;

      let number = []
      for (let i = 0; i < 3; i++) { number[i] = Math.floor(Math.random() * slotItems.length); }

      message.channel.send(` các con nghiện ! Sẵn sàng chưa nào`)
        
          //Bắt đầu roll
          .then((msg) => {
            setTimeout(function() {
                msg.edit(`<a:z1:879671558749167626> <a:z1:879671558749167626> <a:z1:879671558749167626>`);
              }, 3000);
           // roll 1
            setTimeout(function() {
            msg.edit(`${slotItems[number[0]]} <a:z1:879671558749167626> <a:z1:879671558749167626>`);
          }, 6000);
          // roll ra 2
          setTimeout(function() {
            msg.edit(`${slotItems[number[0]]} ${slotItems[number[1]]} <a:z1:879671558749167626>`);
          }, 9000);
          // roll ra 3
          setTimeout(function() {
            msg.edit(`${slotItems[number[0]]} ${slotItems[number[1]]} ${slotItems[number[2]]}`);
          }, 12000);
        })
        
        //laysum 
        const sum = slotItems.reduce((result, item) => {
          const _number = item.match(/[1-6]/g);
          return result + parseInt(_number[0], 10);
      }, 0)
        
        // MESSAGE BẮT ĐẦU - KẾT THÚC
        message.channel.send(`**Bỏ cái tay ra nghennnnnn** `)
            .then((msg) => {
            setTimeout(function() {
                msg.edit(`**Lắc Nè Quý Zị**`);
              }, 3000);
            setTimeout(function() {
                msg.edit(`**Tổng** : ${sum}`);
              }, 12000)})
  
  }
  }
