const Discord = require("discord.js")
const vcroledb = require("quick.db")
require("dotenv").config()

const client = new Discord.Client()

client.once ("ready", () => {
	console.log("Bot Đã Chạy"),
	(function startUpdatingStatus () {
		client.user.setActivity(`Học Viện Chiến Đội Runeterra`, { type: 'WATCHING' }).catch(console.error) // update status
		setTimeout(() => startUpdatingStatus(), 3600000) // tinh chỉnh thời gian
	})()
})

client.login(process.env.bottoken)

client.on ("message", message => {

	if (!message.content.startsWith("^")) return // Lệnh / Prefix

	const args = message.content.slice(1).split(" ")
	const command = args.shift()


	if (command=="vcrole") {
		
		// Lấy ID ROLE
		var roleID

		if (args[0] == undefined) roleID = "not given"
		else if (args[0] == "clear") roleID = "clear"
		else if (args[0].startsWith("<@&") && args[0].endsWith(">") && args[0].length==22) {
			// Lấy ID được tags
			roleID = args[0].substring(3,21)
		} else if (args[0].length==18) {
			// Sử dụng Role ID
			roleID = args[0]
		}
		
		// Nhận channel/guild id
		let argLoc = args[1]
		if (argLoc==undefined) argLoc = "not given"
		if (argLoc.length==18) {
			// a voice channel id was specified, use this
			locType = "vc"
			locID = argLoc
		} else {
			// không có id kênh nào được chỉ định, hãy sử dụng id guild 
			locType = "guild"
			locID = message.guild.id
		}

		if (roleID=="clear") specifiedRole = message.guild.roles.cache.get(vcroledb.get(locID))
		else specifiedRole = message.guild.roles.cache.get(roleID)
		const specifiedVC = client.channels.cache.get(args[1])
	
		// bắt các lỗi có thể xảy ra với một thông báo lỗi có thể đọc được
		if (roleID == "not given") result = {success: false, reason: "Không tìm thấy role."}
		else if (specifiedRole == undefined) result = {success: false, reason: "Role không tồn tại."}
		else if (specifiedRole.guild.id != message.guild.id) result = {success: false, reason: "Role đó không thuộc máy chủ này."}
		else if (message.guild.me.roles.highest.comparePositionTo(specifiedRole) <= 0) result = {success: false, reason: "Role đó cao hơn role của bot."}
		else if (!message.guild.me.hasPermission(["MANAGE_ROLES", "VIEW_CHANNEL"])) result = {success: false, reason: "Bot không có quyền thực hiện (quản lý vai trò và xem kênh)."}
		else if (!message.member.hasPermission("MANAGE_ROLES")) result = {success: false, reason: "Bạn không đủ quyền để thực hiện lệnh này."}
		else if (locType=="vc") {
			if (specifiedVC == undefined) result = {success: false, reason: "Kênh thoại được chỉ định không tồn tại."}
			else if (specifiedVC.guild.id != message.guild.id) result = {success: false, reason: "Kênh thoại được chỉ định không ở máy chủ này."}
			else if (specifiedVC.type != "voice") result = {success: false, reason: "Kênh được chỉ định khng phải kênh thoại."}
			else result = {success: true}
		}
		else result = {success: true}


		if (result.success) {

			// lưu trữ thông tin đã cho và cho người dùng biết là đã thành công 

			if (roleID=="clear") {
				vcroledb.delete(locID)
				resultMsg = `Role kênh thoại đã được xóa thành công`
			} else {
				vcroledb.set(locID, roleID)
				resultMsg = `Role kênh thoại được đặt thành \`${specifiedRole.name}\``
			}
		
			if (locType == "vc") resultMsg = resultMsg.concat(` cho kênh \`${specifiedVC.name}\``)
			else if (locType == "guild") resultMsg = resultMsg.concat(` cho máy chủ \`${message.guild.name}\``)
			message.channel.send(resultMsg)
			
		} else {
			// Lý do setup thất bại
			message.channel.send(`Đặt vai trò không thành công vì lý do sau: ${result.reason}`)
		}

	} else if (command == "help") {
		message.channel.send({ embed: {
			title: 'Support?',
			timestamp: new Date(),
			thumbnail: {
				url: 'https://i.redd.it/ry5ppxkf19f41.gif',
			},
			description: 'Lệnh Mật \n\n**^vcrole @role [ID Kênh]** Set role cho người ở trong phòng thoại đó , out phòng là mất role \n\n **^vcrole clear [ID Kênh]** : Xóa role trong voice channel',
			fields: [
				{	
					name: 'Support Server',
					value: '[Invite](https://discord.gg/bNcZjFe)',
					inline: true
				}
				//{
				//	name: 'Bugs & Suggestions',
				//	value: '',
				//	inline: true
				//},
				//{
				//	name: 'Vote',
				//	value: '',
				//	inline: true
				//},
				//{
				//	name: 'Source Code',
				//	value: '[GitHub](https://github.com/socktow)',
				//	inline: true
				//}
			],
			footer: {
				text: 'Cộng Đồng Huyền Thoại runeterra',
				icon_url: 'https://img.icons8.com/plasticine/452/legends-of-runeterra.png',
			}
			,
			color: message.guild.me.displayHexColor
		}})
	}

})

// phát hiện khi thành viên tham gia hoặc rời khỏi kênh thoại và giao cho họ vai trò nếu có
client.on("voiceStateUpdate", (oldState, newState) => {

	if (oldState.member.user.bot) return

	if (oldState.channelID!=null && newState.channelID==null) {
		join = false
		leave = true
	}
	else if (oldState.channelID==null && newState.channelID!=null) {
		join = true
		leave = false
	} else if (oldState.channelID!=null && newState.channelID!=null && oldState.channelID!=newState.channelID) {
		join = true
		leave = true
	}
	else return


	if (leave) {
		const channel = oldState.channel
		
		if (vcroledb.has(channel.id)) {
			// sử dụng một địa điểm của channel
			newState.member.roles.remove (
				channel.guild.roles.cache.get (
					vcroledb.get(channel.id)
				)
			)
		}
	
		if (vcroledb.has(channel.guild.id)) {
			// sử dụng một địa điểm của guild
			newState.member.roles.remove(
				channel.guild.roles.cache.get(
					vcroledb.get(channel.guild.id)
				)
			)	
		}
	}

	if (join) {
		const channel = newState.channel

		if (vcroledb.has(channel.id)) {
			// sử dụng một địa điểm của channel
			newState.member.roles.add (
				channel.guild.roles.cache.get (
					vcroledb.get(channel.id)
				)
			)
		}
	
		if (vcroledb.has(channel.guild.id)) {
			// sử dụng một địa điểm của guild
			newState.member.roles.add (
				channel.guild.roles.cache.get (
					vcroledb.get(channel.guild.id)
					)
				)
		}
	}
})
