const { create, Client } = require('@open-wa/wa-automate')
const figlet = require('figlet')
const options = require('./utils/options')
const { color, messageLog } = require('./utils')
const HandleMsg = require('./HandleMsg')

const start = (kaguya = new Client()) => {
    console.log(color(figlet.textSync('----------------', { horizontalLayout: 'default' })))
    console.log(color(figlet.textSync('HIZKIA', { font: 'Fire Font-k', horizontalLayout: 'default' })))
    console.log(color(figlet.textSync('----------------', { horizontalLayout: 'default' })))
    console.log(color('[DEV]'), color('Tanaka9531', 'yellow'))
    console.log(color('[~>>]'), color('BOT Started!', 'green'))

    // Mempertahankan sesi agar tetap nyala
    kaguya.onStateChanged((state) => {
        console.log(color('[~>>]', 'red'), state)
        if (state === 'CONFLICT' || state === 'UNLAUNCHED') kaguya.forceRefocus()
    })

    // ketika bot diinvite ke dalam group
    kaguya.onAddedToGroup(async (chat) => {
	const groups = await kaguya.getAllGroups()
	// kondisi ketika batas group bot telah tercapai,ubah di file settings/setting.json
	if (groups.length > groupLimit) {
	await kaguya.sendText(chat.id, `Gomennasai, Grup Bot Full\nMax Group is: ${groupLimit}`).then(() => {
	      kaguya.leaveGroup(chat.id)
	      kaguya.deleteChat(chat.id)
	  }) 
	} else {
	// kondisi ketika batas member group belum tercapai, ubah di file settings/setting.json
	    if (chat.groupMetadata.participants.length < memberLimit) {
	    await kaguya.sendText(chat.id, `Gomennasai, Member Pada Grup Terlalu Dedikit Mainimal ${memberLimit} Orang`).then(() => {
	      kaguya.leaveGroup(chat.id)
	      kaguya.deleteChat(chat.id)
	    })
	    } else {
        await kaguya.simulateTyping(chat.id, true).then(async () => {
          await kaguya.sendText(chat.id, `Hai minna~, Watashi no namae wa Shinomiya Kaguya desu Hajimemashite`)
        })
	    }
	}
    })

    // ketika seseorang masuk/keluar dari group
    kaguya.onGlobalParicipantsChanged(async (event) => {
        const host = await kaguya.getHostNumber() + '@c.us'
		const welcome = JSON.parse(fs.readFileSync('./settings/welcome.json'))
		const isWelcome = welcome.includes(event.chat)
		let profile = await kaguya.getProfilePicFromServer(event.who)
		if (profile == '' || profile == undefined) profile = 'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcTQcODjk7AcA4wb_9OLzoeAdpGwmkJqOYxEBA&usqp=CAU'
        // kondisi ketika seseorang diinvite/join group lewat link
        if (event.action === 'add' && event.who !== host && isWelcome) {
		  //await kaguya.sendFileFromUrl(event.chat, profile, 'profile.jpg', '')
            await kaguya.sendTextWithMentions(event.chat, `Hai, Watashi no namae wa Shinomiya Kaguya desu Hajimemashite @${event.who.replace('@c.us', '')}`)
        }
        // kondisi ketika seseorang dikick/keluar dari group
        if (event.action === 'remove' && event.who !== host) {
		 //await kaguya.sendFileFromUrl(event.chat, profile, 'profile.jpg', '')
            await kaguya.sendTextWithMentions(event.chat, `Sayonara, @${event.who.replace('@c.us', '')}`)
        }
    })

    kaguya.onIncomingCall(async (callData) => {
        // ketika seseorang menelpon nomor bot akan mengirim pesan
        await kaguya.sendText(callData.peerJid, 'Gomennasai, Saya akan Block Anda Karena Menephone Saya Jika Ada Sesuatu TanyaKan Pada Nomor Ini\n 0816243737')
        .then(async () => {
            // bot akan memblock nomor itu
            await kaguya.contactBlock(callData.peerJid)
        })
    })

    // ketika seseorang mengirim pesan
    kaguya.onMessage(async (message) => {
        kaguya.getAmountOfLoadedMessages() // menghapus pesan cache jika sudah 3000 pesan.
            .then((msg) => {
                if (msg >= 3000) {
                    console.log('[kaguya]', color(`Loaded Message Reach ${msg}, cuting message cache...`, 'yellow'))
                    kaguya.cutMsgCache()
                }
            })
        HandleMsg(kaguya, message)    
    
    })
	
    // Message log for analytic
    kaguya.onAnyMessage((anal) => { 
        messageLog(anal.fromMe, anal.type)
    })
}

//create session
create(options(true, start))
    .then((kaguya) => start(kaguya))
    .catch((err) => new Error(err))
