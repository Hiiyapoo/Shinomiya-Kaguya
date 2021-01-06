require('dotenv').config()
const { decryptMedia } = require('@open-wa/wa-automate')

const moment = require('moment-timezone')
moment.tz.setDefault('Asia/Jakarta').locale('id')
const axios = require('axios')
const yts = require('yt-search')
const translatte = require('translatte')
const fetch = require('node-fetch')
const imageToBase64 = require('image-to-base64')
const bent = require('bent')
const Math_js = require('mathjs')
const google = require('google-it')
const appRoot = require('app-root-path')
const { getStickerMaker } = require('./lib/ttp')
const quotedd = require('./lib/quote')
const { sleep } = require('./lib/kaguyaapi')
const qanimedd = require('./lib/qanime')
const pintar = require('./lib/hoki')
const kehokian = require('./lib/cerdas')
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const db_group = new FileSync(appRoot+'/lib/data/group.json')
const db = low(db_group)
db.defaults({ group: []}).write()

const { 
    removeBackgroundFromImageBase64
} = require('remove.bg')

const {
    exec,
	spawn
} = require('child_process')

const { 
    menuId, 
    cekResi, 
    urlShortener, 
    meme,
    getLocationData,
    images,
    resep,
    cariKasar,
	kaguyaapi,
    Kaguyapoi
} = require('./lib')

const { 
    msgFilter, 
    color, 
    processTime, 
    isUrl,
	download
} = require('./utils')

const { uploadImages } = require('./utils/fetcher')

const fs = require('fs-extra')
const banned = JSON.parse(fs.readFileSync('./settings/banned.json'))
const ngegas = JSON.parse(fs.readFileSync('./settings/ngegas.json'))
const simi = JSON.parse(fs.readFileSync('./settings/simi.json'))
const setting = JSON.parse(fs.readFileSync('./settings/setting.json'))
const afk = JSON.parse(fs.readFileSync('./lib/data/afk.json'))
const welcome = JSON.parse(fs.readFileSync('./settings/welcome.json'))
const nsfwgrp = JSON.parse(fs.readFileSync('./lib/nsfw.json'))
const msgLimit = JSON.parse(fs.readFileSync('./lib/data/msgLimit.json'))
const adminNumber = JSON.parse(fs.readFileSync('./lib/admin.json'))
const pendaftar = JSON.parse(fs.readFileSync('./lib/data/user.json'))
const limit = JSON.parse(fs.readFileSync('./lib/data/limit.json'))

let { 
    ownerNumber,
    limitCount,	
    groupLimit, 
    memberLimit,
    prefix
} = setting

const {
    apiNoBg
} = JSON.parse(fs.readFileSync('./settings/api.json'))

function formatin(duit){
    let	reverse = duit.toString().split('').reverse().join('');
    let ribuan = reverse.match(/\d{1,3}/g);
    ribuan = ribuan.join('.').split('').reverse().join('');
    return ribuan;
}

const inArray = (needle, haystack) => {
    let length = haystack.length;
    for(let i = 0; i < length; i++) {
        if(haystack[i].id == needle) return i;
    }
    return false;
}

module.exports = HandleMsg = async (kaguya, message) => {
    try {
        const { type, id, from, t, sender, isGroupMsg, chat, chatId, caption, isMedia, mimetype, quotedMsg, author, quotedMsgObj, mentionedJidList } = message
        let { body } = message
        var { name, formattedTitle } = chat
        let { pushname, verifiedName, formattedName } = sender
        pushname = pushname || verifiedName || formattedName // verifiedName is the name of someone who uses a business account
        const botNumber = await kaguya.getHostNumber() + '@c.us'
        const groupId = isGroupMsg ? chat.groupMetadata.id : ''
        const groupAdmins = isGroupMsg ? await kaguya.getGroupAdmins(groupId) : ''
        const isGroupAdmins = groupAdmins.includes(sender.id) || false
		const chats = (type === 'chat') ? body : (type === 'image' || type === 'video') ? caption : ''
		const pengirim = sender.id
        const time = moment(t * 1000).format('DD/MM HH:mm:ss')
        const tgl = moment(t * 1000).format('DD/MMMM/YYYY')
		const jam = moment().utcOffset('+0800').format('HH:mm')
        const isBotGroupAdmins = groupAdmins.includes(botNumber) || false
        const isPrivate = sender.id === chat.contact.id
		
        // Bot Prefix
        body = (type === 'chat' && body.startsWith(prefix)) ? body : ((type === 'image' && caption || type === 'video' && caption) && caption.startsWith(prefix)) ? caption : ''
        const command = body.slice(1).trim().split(/ +/).shift().toLowerCase()
        const arg = body.trim().substring(body.indexOf(' ') + 1)
        const args = body.trim().split(/ +/).slice(1)
		const argx = chats.slice(0).trim().split(/ +/).shift().toLowerCase()
        const isCmd = body.startsWith(prefix) 
        const uaOverride = process.env.UserAgent
        const url = args.length !== 0 ? args[0] : ''
        const isQuotedImage = quotedMsg && quotedMsg.type === 'image'
	    const isQuotedVideo = quotedMsg && quotedMsg.type === 'video'
		
		// [IDENTIFY]
        const serial = sender.id
        const SN = GenerateSerialNumber("000000000000000000000000")
        const ownerNumber = "62816243737@c.us"
        const isAfk = afk.includes(sender.id)
        const isSimi = simi.includes(chatId)
        const isAdmin = adminNumber.includes(sender.id)
		const isOwnerBot = ownerNumber.includes(pengirim)
		const isOwner = ownerNumber.includes(pengirim)
        const isBanned = banned.includes(pengirim)
		const isNgegas = ngegas.includes(chatId)
        const isKasar = await cariKasar(chats)

        // [BETA] Avoid Spam Message
        //if (isCmd && msgFilter.isFiltered(from) && !isGroupMsg) { return console.log(color('[SPAM]', 'red'), color(moment(t * 1000).format('DD/MM/YY HH:mm:ss'), 'yellow'), color(`${command} [${args.length}]`), 'from', color(pushname)) }
        //if (isCmd && msgFilter.isFiltered(from) && isGroupMsg) { return console.log(color('[SPAM]', 'red'), color(moment(t * 1000).format('DD/MM/YY HH:mm:ss'), 'yellow'), color(`${command} [${args.length}]`), 'from', color(pushname), 'in', color(name || formattedTitle)) }

        if(!isCmd && isKasar && isGroupMsg) { console.log(color('[BADW]', 'orange'), color(moment(t * 1000).format('DD/MM/YY HH:mm:ss'), 'yellow'), color(`${argx}`), 'from', color(pushname), 'in', color(name || formattedTitle)) }
        if (isCmd && !isGroupMsg) { console.log(color('[EXEC]'), color(moment(t * 1000).format('DD/MM/YY HH:mm:ss'), 'yellow'), color(`${command} [${args.length}]`), 'from', color(pushname)) }
        if (isCmd && isGroupMsg) { console.log(color('[EXEC]'), color(moment(t * 1000).format('DD/MM/YY HH:mm:ss'), 'yellow'), color(`${command} [${args.length}]`), 'from', color(pushname), 'in', color(name || formattedTitle)) }

        // [BETA] Avoid Spam Message
        msgFilter.addFilter(from)
	
	     //[AUTO READ] Auto read message 
	     kaguya.sendSeen(chatId)

        // FUNCTION
        // Serial Number Generator
        function GenerateRandomNumber(min,max){
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }
        // Generates a random alphanumberic character
        function GenerateRandomChar() {
            var chars = "1234567890ABCDEFGIJKLMNOPQRSTUVWXYZ";
            var randomNumber = GenerateRandomNumber(0,chars.length - 1);
            return chars[randomNumber];
        }
        // Generates a Serial Number, based on a certain mask
        function GenerateSerialNumber(mask){
            var serialNumber = "";
            if(mask != null){
                for(var i=0; i < mask.length; i++){
                    var maskChar = mask[i];
                    serialNumber += maskChar == "0" ? GenerateRandomChar() : maskChar;
                }
            }
            return serialNumber;
        }
        
        var nmr = sender.id
        var obj = pendaftar.some((val) => {
            return val.id === nmr
        })
        var cekage = pendaftar.some((val) => {
            return val.id === nmr && val.umur >= 18
        })

        function monospace(string) {
            return '```' + string + '```'
        }


        function isReg(obj){
            if (obj === true){
                return false
            } else {     
                return kaguya.reply(from, `Kamu belum terdaftar sebagai Teman Kaguya\nuntuk mendaftar kirim ${prefix}daftar |nama|umur\n\ncontoh format: ${prefix}daftar |kaguya|17\n\ncukup gunakan nama depan/panggilan saja`, id) //if user is not registered
            }
        }

        function cekumur(obj){
            if (obj === true){
                return false
            } else {
                return kaguya.reply(from, `Baka, ${pushname} Umur Kamu Belum Cukup Fitur Ini Untuk Umur 18 Keatas`, id) //if user is not registered
            }
        }

        // FUNCTION DAFTAR! NEXT UPDATE
        function monospace(string) {
            return '```' + string + '```'
        }

        // Serial Number Generator
        function GenerateRandomNumber(min,max){
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }
        // Generates a random alphanumberic character
        function GenerateRandomChar() {
            var chars = "1234567890ABCDEFGIJKLMNOPQRSTUVWXYZ";
            var randomNumber = GenerateRandomNumber(0,chars.length - 1);
            return chars[randomNumber];
        }
        // Generates a Serial Number, based on a certain mask
        function GenerateSerialNumber(mask){
            var serialNumber = "";
            if(mask != null){
                for(var i=0; i < mask.length; i++){
                    var maskChar = mask[i];
                    serialNumber += maskChar == "0" ? GenerateRandomChar() : maskChar;
                }
            }
            return serialNumber;
        }

		 // Kerang Menu
		const apakah = [
            'Ya',
            'Tidak',
            'Coba Ulangi'
            ]

        const bisakah = [
            'Bisa',
            'Tidak Bisa',
            'Coba Ulangi'
            ]

        const kapankah = [
            '1 Minggu lagi',
            '1 Bulan lagi',
            '1 Tahun lagi',
			'1 Abad lagi'
            ]

        const rate = [
            '100%',
            '95%',
            '90%',
            '85%',
            '80%',
            '75%',
            '70%',
            '65%',
            '60%',
            '55%',
            '50%',
            '45%',
            '40%',
            '35%',
            '30%',
            '25%',
            '20%',
            '15%',
            '10%',
            '5%'
            ]
			
        const errorurl = 'https://tinyurl.com/y8rzf4lr'

        //Limit Function		 
        function isMsgLimit(id){
            if (isAdmin) {return false;}
            let found = false;
            for (let i of msgLimit){
                if(i.id === id){
                    if (i.msg >= 8) {
                        found === true 
                        kaguya.reply(from, `*「 𝗔𝗡𝗧𝗜 𝗦𝗣𝗔𝗠 」*\nMaaf, akun anda kami blok karena SPAM, dan tidak bisa di UNBLOK!`, id)
                        kaguya.contactBlock(id)
                        banned.push(id)
                        fs.writeFileSync('./settings/banned.json', JSON.stringify(banned))
                        return true;
                    }else if(i.msg >= 8){
                        found === true
                        kaguya.reply(from, `*「 𝗔𝗡𝗧𝗜 𝗦𝗣𝗔𝗠 」*\nNomor anda terdeteksi spam!\nMohon tidak spam 5 pesan lagi atau nomor anda AUTO BLOK!`, id)
                        return true
                    }else{
                        found === true
                        return false;
                    }   
                }
            }
            if (found === false){
                let obj = {id: `${id}`, msg:1};
                msgLimit.push(obj);
                fs.writeFileSync('./lib/data/msgLimit.json',JSON.stringify(msgLimit));
                return false;
            }  
        }
function addMsgLimit(id){
            if (isAdmin) {return;}
            var found = false
            Object.keys(msgLimit).forEach((i) => {
                if(msgLimit[i].id == id){
                    found = i
                }
            })
            if (found !== false) {
                msgLimit[found].msg += 1;
                fs.writeFileSync('./lib/data/msgLimit.json',JSON.stringify(msgLimit));
            }
        }
function isLimit(id){
            if (isAdmin) {return false;}
            let found = false;
            for (let i of limit){
                if(i.id === id){
                    let limits = i.limit;
                    if (limits >= limitCount) {
                        found = true;
                        kaguya.reply(from, `Perintah BOT anda sudah mencapai batas, coba esok hari :)`, id)
                        return true;
                    }else{
                        limit
                        found = true;
                        return false;
                    }
                }
            }
            if (found === false){
                let obj = {id: `${id}`, limit:1};
                limit.push(obj);
                fs.writeFileSync('./lib/data/limit.json',JSON.stringify(limit));
                return false;
            }  
        }
function limitAdd (id) {
            if (isAdmin) {return;}
            var found = false;
            Object.keys(limit).forEach((i) => {
                if(limit[i].id == id){
                    found = i
                }
            })
            if (found !== false) {
                limit[found].limit += 1;
                fs.writeFileSync('./lib/data/limit.json',JSON.stringify(limit));
            }
        }

        // END HELPER FUNCTION

	    //chat
        if (chats == 'Bot'){
        kaguya.reply(from, 'Nama Ku Bukan Bot Tapi Kaguya' , id)
        }
        else if (chats == 'bot'){
        kaguya.reply(from, 'Nama Ku Bukan Bot Tapi Kaguya' , id)
        }
        else if (chats == 'kaguya'){
        kaguya.reply(from, 'Hai, dōshita no?' , id)
        }
        else if (chats == 'Kaguya'){
        kaguya.reply(from, 'Hai, dōshita no?' , id)
        }
        else if (chats == 'Kamu Bot Kan?'){
        kaguya.reply(from, 'Iya Emang Napa?' , id)
        }
        else if (chats == 'kamu bot kan?'){
        kaguya.reply(from, 'Iya Emang Napa?' , id)
        }
        else if (chats == 'Nama Kamu Siapa?'){
        kaguya.reply(from, 'Nama Ku Kaguya Salam Kenal Nama Kamu Siapa' , id)
        }
        else if (chats == 'nama kamu siapa?'){
        kaguya.reply(from, 'Nama Ku Kaguya Salam Kenal Nama Kamu Siapa' , id)
        }
        else if (chats == 'Kaguya intro'){
        kaguya.reply(from, 'Hai, Watashi no namae wa Shinomiya Kaguya desu Hajimemashite' , id)
        }
        else if (chats == 'kaguya intro'){
        kaguya.reply(from, 'Hai, Watashi no namae wa Shinomiya Kaguya desu Hajimemashite' , id)
        }
        else if (chats == 'Kaguya Intro'){
        kaguya.reply(from, 'Hai, Watashi no namae wa Shinomiya Kaguya desu Hajimemashite' , id)
        }
        else if (chats == 'Kaguya Cepat Perkenalan'){
        kaguya.reply(from, 'Hai, Watashi no namae wa Shinomiya Kaguya desu Hajimemashite' , id)
        }
        else if (chats == 'Assalamualaikum'){
        kaguya.reply(from, 'Walaikumsalam' , id)
        }
		else if (chats == 'Kaguya Jam Berapa Sekarang?'){
		kaguya.reply(from, `Sekarang Jam ${jam}`, id)
		}
		else if (chats == 'Kaguya Jam Brp Sekarang?'){
		kaguya.reply(from, `Sekarang Jam ${jam}`, id)
		}
		else if (chats == 'Kaguya Jam Brp Skrng?'){
		kaguya.reply(from, `Sekarang Jam ${jam}`, id)
		}
		else if (chats == 'kaguya jam brp sekarang?'){
		kaguya.reply(from, `Sekarang Jam ${jam}`, id)
		}
		else if (chats == 'kaguya jam brp skrng?'){
		kaguya.reply(from, `Sekarang Jam ${jam}`, id)
		}
		else if (chats == 'Kaguya Jam Brp Sekarang'){
		kaguya.reply(from, `Sekarang Jam ${jam}`, id)
		}
		else if (chats == 'kaguya jam brp sekarang'){
		kaguya.reply(from, `Sekarang Jam ${jam}`, id)
		}
		else if (chats == 'kaguya Tanggal Berapa Sekarang?'){
		kaguya.reply(from, `Sekarang Tanggal ${tgl}`, id)
		}
		else if (chats == 'kaguya tgl brp sekarang?'){
		kaguya.reply(from, `Sekarang Tanggal ${tgl}`, id)
		}
		else if (chats == 'Prefixnya Apa'){
		kaguya.reply(from, `Prefix Yang Di Gunakan Kaguya Ini ${prefix}`, id)
		}
		else if (chats == 'cekprefix'){
		kaguya.reply(from, `Prefix Yang Di Gunakan Kaguya Ini ${prefix}`, id)
		}
		else if (chats == 'Kaguya Prefixnya Apa?'){
		kaguya.reply(from, `Prefix Yang Di Gunakan Kaguya Ini ${prefix}`, id)
		}
		else if (chats == 'makasih'){
		kaguya.reply(from, 'Sama-Sama', id)
		}
		else if (chats == 'Makasih'){
		kaguya.reply(from, 'Sama-Sama', id)
		}
		else if (chats == 'MAKASIH'){
		kaguya.reply(from, 'Sama-Sama', id)
		}

	// Filter Banned People
        if (isBanned) {
            return console.log(color('[BAN]', 'red'), color(moment(t * 1000).format('DD/MM/YY HH:mm:ss'), 'yellow'), color(`${command} [${args.length}]`), 'from', color(pushname))
        }
        switch (command) {
        // Menu and TnC
        case 'speed':
        case 'ping':
            if(isReg(obj)) return
            if (isLimit(serial)) return kaguya.reply(from, `Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik ${prefix}limit Untuk Mengecek Kuota Limit Kamu`, id)
            if (isAfk) return await kaguya.reply(from, `Maaf ${pushname}, Kamu sedang afk! Ketik ${prefix}unafk untuk mematikan`,  id)
            await limitAdd(serial)
            await kaguya.sendText(from, `Pong!!!!\nSpeed: ${processTime(t, moment())} _Second_`)
            break
        case 'info':
            if(isReg(obj)) return
            if (isLimit(serial)) return kaguya.reply(from, `Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik ${prefix}limit Untuk Mengecek Kuota Limit Kamu`, id)
            if (isAfk) return await kaguya.reply(from, `Maaf ${pushname}, Kamu sedang afk! Ketik ${prefix}unafk untuk mematikan`,  id)
            await limitAdd(serial)
            await kaguya.sendText(from, menuId.textTnC())
            break
        case 'bahasa':
            if(isReg(obj)) return
            if (isLimit(serial)) return kaguya.reply(from, `Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik ${prefix}limit Untuk Mengecek Kuota Limit Kamu`, id)
            if (isAfk) return await kaguya.reply(from, `Maaf ${pushname}, Kamu sedang afk! Ketik ${prefix}unafk untuk mematikan`,  id)
            await limitAdd(serial)
            await kaguya.sendText(from, menuId.textbaha())
            break
        case 'baka':
            if(isReg(obj)) return
            if(cekumur(cekage)) return
            if (isLimit(serial)) return kaguya.reply(from, `Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik ${prefix}limit Untuk Mengecek Kuota Limit Kamu`, id)
            if (isAfk) return await kaguya.reply(from, `Maaf ${pushname}, Kamu sedang afk! Ketik ${prefix}unafk untuk mematikan`,  id)
            await limitAdd(serial)
            await kaguya.sendText(from, menuId.textnfws())
            break
        case 'list':
            if(isReg(obj)) return
            if (isLimit(serial)) return kaguya.reply(from, `Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik ${prefix}limit Untuk Mengecek Kuota Limit Kamu`, id)
            if (isAfk) return await kaguya.reply(from, `Maaf ${pushname}, Kamu sedang afk! Ketik ${prefix}unafk untuk mematikan`,  id)
            await limitAdd(serial)
            await kaguya.sendText(from, menuId.textlist())
            break
        case 'apaituhilih':
            if(isReg(obj)) return
            if (isAfk) return await kaguya.reply(from, `Maaf ${pushname}, Kamu sedang afk! Ketik ${prefix}unafk untuk mematikan`,  id)
            if (isLimit(serial)) return kaguya.reply(from, `Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik ${prefix}limit Untuk Mengecek Kuota Limit Kamu`, id)
            
            await limitAdd(serial)
            await kaguya.sendText(from, menuId.texthilix())
            break
        case 'listmeme':
            if(isReg(obj)) return
            if (isAfk) return await kaguya.reply(from, `Maaf ${pushname}, Kamu sedang afk! Ketik ${prefix}unafk untuk mematikan`,  id)
            if (isLimit(serial)) return kaguya.reply(from, `Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik ${prefix}limit Untuk Mengecek Kuota Limit Kamu`, id)
            
            await limitAdd(serial)
            await kaguya.sendText(from, menuId.textmex())
            break
        case 'menu':
        case 'help':
            if(isReg(obj)) return
            if (isLimit(serial)) return kaguya.reply(from, `Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik ${prefix}limit Untuk Mengecek Kuota Limit Kamu`, id)
            if (isAfk) return await kaguya.reply(from, `Maaf ${pushname}, Kamu sedang afk! Ketik ${prefix}unafk untuk mematikan`,  id)
            await limitAdd(serial)
            await kaguya.sendText(from, menuId.textMenu(pushname,jam,tgl))
            break
        case 'donate':
        case 'donasi':
            if(isReg(obj)) return
            if (isLimit(serial)) return kaguya.reply(from, `Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik ${prefix}limit Untuk Mengecek Kuota Limit Kamu`, id)
            await limitAdd(serial)
            await kaguya.sendText(from, menuId.textDonasi())
            break
        case 'setprefix':
            if (!isOwnerBot) return kaguya.reply(from, 'Siapa Yah..., Bukan Owner Juga Kok Nyuruh Ganti Prefix Kaguya', id)
            if (args.length !== 1) return kaguya.reply(from, `*Kirim Perintah ${prefix}setprefix [prefix baru]*. 
Contoh: ${prefix}setprefix #`, id)
            const pf = body.slice(11)
            setting.prefix = `${pf}`
            prefix = `${pf}`
            fs.writeFileSync('./settings/setting.json', JSON.stringify(setting, null, 2))
            kaguya.reply(from, `Change Prefix To ${pf} SUCCESS!`, id)
            break
        case 'setname':
            if (!isOwnerBot) return kaguya.reply(from, `Siapa nih, Bukan Owner Kaguya Kok Nyuruh Nyuruh`, id)
                const setnem = body.slice(9)
                await kaguya.setMyName(setnem)
                kaguya.sendTextWithMentions(from, `Makasih Owner Nama Barunya @${sender.id.replace('@c.us','')} 😘`)
            break
        case 'setstatus':
            if (!isOwnerBot) return kaguya.reply(from, `Siapa nih, Bukan Owner Kaguya Kok Nyuruh Nyuruh`, id)
                const setstat = body.slice(11)
                await kaguya.setMyStatus(setstat)
                kaguya.sendTextWithMentions(from, `Makasih Owner Status Barunya @${sender.id.replace('@c.us','')} 😘`)
            break
        case 'setprofilepic':
            if (!isOwnerBot) return kaguya.reply(from, `Perintah ini hanya bisa di gunakan oleh Owner Kaguya!`, id)
            if (isMedia) {
                const mediaData = await decryptMedia(message)
                const imageBase64 = `data:${mimetype};base64,${mediaData.toString('base64')}`
                await kaguya.setProfilePic(imageBase64)
                kaguya.sendTextWithMentions(`Makasih @${sender.id.replace('@c.us','')} Foto Profilenya 😘`)
            } else if (quotedMsg && quotedMsg.type == 'image') {
                const mediaData = await decryptMedia(quotedMsg)
                const imageBase64 = `data:${quotedMsg.mimetype};base64,${mediaData.toString('base64')}`
                await kaguya.setProfilePic(imageBase64)
                kaguya.sendTextWithMentions(from, `Makasih @${sender.id.replace('@c.us','')} Foto Profilenya 😘`)
            } else {
                kaguya.reply(from, `Wrong Format!\n⚠️ Harap Kirim Gambar Dengan ${prefix}setprofilepic`, id)
            }
            break
        case 'getpic':
            if (isAfk) return await kaguya.reply(from, `Maaf ${pushname}, Kamu sedang afk! Ketik ${prefix}unafk untuk mematikan`,  id)
            if (!isGroupMsg) return kaguya.reply(from, `Fitur ini hanya bisa di gunakan dalam group`, id)
            const texnugm = body.slice(8)
            const getnomber =  await kaguya.checkNumberStatus(texnugm)
            const useriq = getnomber.id.replace('@','') + '@c.us'
                try {
                    var jnck = await kaguya.getProfilePicFromServer(useriq)

                    kaguya.sendFileFromUrl(from, jnck, 'baka:).jpg', `Nih.. Onii-chan`, id)
                } catch {
                    kaguya.reply(from, `Tidak Ada Foto Profile!`, id)
                }
            break
        case 'ownerbot':
		case 'owner':
		case 'creator':
            await kaguya.sendContact(from, ownerNumber)
            .then(() => kaguya.sendText(from, 'Itu Nomor Owner-Sama'))
            break
        case 'kaguyagroup':
            kaguya.reply(from, `Link Group Kaguya : https://chat.whatsapp.com/I22u6ZlhA7a8btml5LvWLO\nJangan Lupa Join Ya Kak ${pushname} Btw Maaf Sepi Grupnya Karena Baru Buat hheheheh`, id)
            break
        case 'situsanime':
            if(isReg(obj)) return
            if (isLimit(serial)) return kaguya.reply(from, `Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik ${prefix}limit Untuk Mengecek Kuota Limit Kamu`, id)
            if (isAfk) return await kaguya.reply(from, `Maaf ${pushname}, Kamu sedang afk! Ketik ${prefix}unafk untuk mematikan`,  id)
            await limitAdd(serial)
            kaguya.reply(from, `Berikut Situs Yang Kaguya Ketahui!!
_____________

> Otakudesu
> Maxnime
> Meonime
> Samehadaku
> Oplovers
> Awsubs
> Animeku
> Animeboy
> AnimeIndo
> Drivenime
> Kusonime
> Nanime
> Riie
> Naruchiha
> Rymaru
> AnimersIndo
> Animebact
> AnimeKompi
> SubIndo
> Anime XXI
> Kurogaze
> AnimeYou
> Wibudesu
> Anitoki
> Anisubindo
> Nimegami
> Grogol.us
> Anime Nonton
> Akiranime
> Jouganime
> AnoBoy
> Mangaku
> Onnime
> Gomunime
> Anikyojin
> Animasu
_____________

Info Anime:
> Jurnalotaku
> Animelovers
> Dafunda
> Myanimelist
> Kaori Nusantara
_____________
Jika Ada Yang Ingin Di Tambahkan Beritahu Creator`, id)
            break
            case 'daftar':
              argz = body.trim().split('|')
                if (argz.length >= 2) {
                const nonye = sender.id
                const namanye = argz[1]
                const umurnye = argz[2]
                    if(isNaN(umurnye)) return await kaguya.reply(from, 'Umur harus berupa angka!!', id)
                    if(umurnye >= 40) return await kaguya.reply(from, 'Kamu terlalu tua, kembali lagi ke masa muda untuk menggunakan kaguya', id)
                    const jenenge = namanye.replace(' ','')
                    var ceknya = nonye
                        var obj = pendaftar.some((val) => {
                            return val.id === ceknya
                        })
                        if (obj === true){
                            return kaguya.reply(from, 'kamu sudah terdaftar', id) // BAKAL RESPON JIKA NO UDAH ADA
                        } else {
                            const mentah = await kaguya.checkNumberStatus(nonye) // PENDAFTARAN
                            const msg = monospace(`Pendaftaran berhasil pada\nTanggal: ${moment().format('DD/MM/YY HH:mm:ss')}
╭───「 *REGISTRASI* 」───
│++
│+[SN]: ${SN}
│+[Nama]: ${jenenge} [@${nonye.replace(/[@c.us]/g, '')}]
│+[Nomor]: wa.me/${nonye.replace('@c.us', '')}
│+[Umur]: ${umurnye}
│
╰───────────────────
Untuk menggunakan bot silahkan kirim ${prefix}menu
Total Pengguna yang telah terdaftar ${pendaftar.length}`)
                            const hasil = mentah.canReceiveMessage ? msg : false
                            if (!hasil) return kaguya.reply(from, 'Nomor WhatsApp tidak valid [ Tidak terdaftar di WhatsApp ]', id) 
                            {
                            const register = ({
                                id: mentah.id._serialized,
                                nama: jenenge,
                                umur: umurnye
                            })
                            pendaftar.push(register)
                            fs.writeFileSync('./lib/data/user.json', JSON.stringify(pendaftar)) // DATABASE
                                kaguya.sendTextWithMentions(from, hasil)
                            }
                        }
                    } else {
                        await kaguya.reply(from, `Format yang kamu masukkan salah, kirim ${prefix}daftar |nama|umur\n\ncontoh format: ${prefix}daftar |Tanaka|17\n\ncukup gunakan nama depan/panggilan saja`, id) //if user is not registered
                    }
                break
                case 'afk':
                    if(isReg(obj)) return
                    if (!isGroupMsg) return kaguya.reply(from, 'Perintah ini hanya bisa di gunakan dalam group!', id)
                    afk.push(sender.id)
                    fs.writeFileSync('./lib/data/afk.json', JSON.stringify(afk))
                    await kaguya.reply(from, `Berhasil, ${pushname} sekarang afk!`, id)
                   break
           case 'unafk':
            if(isReg(obj)) return
                if (!isGroupMsg) return kaguya.reply(from, 'Perintah ini hanya bisa di gunakan dalam group!', id)
               let afko = afk.indexOf(sender.id[0])
                afk.splice(afko, 1)
               fs.writeFileSync('./lib/data/afk.json', JSON.stringify(afk))
               return await kaguya.reply(from, `${pushname} telah mematikan afk!`, id)
               break
        case 'bugreport':
            if (args.length == 1) return kaguya.reply(from, `[❗] Kirim perintah *${prefix}bugreport [teks]*\ncontoh : *${prefix}bugreport Permisi Owner, Ada bug pada command ${prefix}otakudesu, Tolong diperbaiki*`, id)
            const bug = body.slice(11)
            if(!bug) return
            if(isGroupMsg){
                kaguya.sendText(ownerNumber, `*[BUG REPORT]*\n*WAKTU* : ${time}\nNO PENGIRIM : wa.me/${sender.id.match(/\d+/g)}\nGroup : ${formattedTitle}\n\n${bug}`, id)
                kaguya.reply(from, 'Masalah telah di laporkan ke creator-sama, laporan palsu/main2 tidak akan ditanggapi.' ,id)
            }else{
                kaguya.sendText(ownerNumber, `*[BUG REPORT]*\n*WAKTU* : ${time}\nNO PENGIRIM : wa.me/${sender.id.match(/\d+/g)}\nLaporan Bug: ${bug}`, id)
                kaguya.reply(from, 'Masalah telah di laporkan ke creator-sama, laporan palsu/main2 tidak akan ditanggapi.', id)
            }
            break
        case 'jamindo':
            if (isAfk) return await kaguya.reply(from, `Maaf ${pushname}, Kamu sedang afk! Ketik ${prefix}unafk untuk mematikan`,  id)
            if(isReg(obj)) return
            if (isLimit(serial)) return kaguya.reply(from, `Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik ${prefix}limit Untuk Mengecek Kuota Limit Kamu`, id)
            await kaguya.sendText(from, `Waktu Indonesia Barat: *${moment().utcOffset('+0700').format('HH:mm')}* WIB \nWaktu Indonesia Tengah: *${moment().utcOffset('+0800').format('HH:mm')}* WITA \nWaktu Indonesia Timur: *${moment().utcOffset('+0900').format('HH:mm')}* WIT`)
            await limitAdd(serial)
            break
        case 'Calendernow':
		case 'tanggalnow':
            if (isAfk) return await kaguya.reply(from, `Maaf ${pushname}, Kamu sedang afk! Ketik ${prefix}unafk untuk mematikan`,  id)
            if(isReg(obj)) return
            if (isLimit(serial)) return kaguya.reply(from, `Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik ${prefix}limit Untuk Mengecek Kuota Limit Kamu`, id)
            await kaguya.sendText(from, `Tanggal: ${tgl}`)
            await limitAdd(serial)
            break
         case 'profile':
            if (isAfk) return await kaguya.reply(from, `Maaf ${pushname}, Kamu sedang afk! Ketik ${prefix}unafk untuk mematikan`,  id)
            if (isGroupMsg) {
                if (!quotedMsg) {
                    var sts = await kaguya.getStatus(author)
                    var adm = isGroupAdmins
                    var donate = isOwnerBot
                    var ctt = await kaguya.getContact(author)
                    const { status } = sts
                    var found = false
                    Object.keys(pendaftar).forEach((i) => {
                        if(pendaftar[i].id == author){
                            found = i
                        }
                    })
                    if (found !== false) {
                        pendaftar[found].id = author;
                        var registe = '✔'
                    } else {
                        var registe = '❌'
                    }
                    if (ctt == null) {
                    return await kaguya.reply(from, `Nomor WhatsApp tidak valid [ Tidak terdaftar di WhatsApp ]`, id) 
                    } else {
                        const contact = ctt.pushname
                        const dpd = await kaguya.getProfilePicFromServer(author)
                    if (dpd == undefined) {
                        var pfp = errorurl
                        } else {
                            var pfp = dpd
                        } 
                    if (contact == undefined) {
                        var namae = '*Tidak Ada Nama*' 
                    } else {
                        var namae = contact
                    } 
                        await kaguya.sendContact(chatId, author)
                        kaguya.sendFileFromUrl(from, pfp, 'pfp.jpg', `*「 PROFILE 」*\n\n• *Username: ${namae}*\n• *User Info: ${status}*\n• *Admin Group: ${adm}*\n• *Owner Bot: ${donate}*\n• *Registered User :* ${registe}`)
                    }
				} else if (quotedMsg) {
                    var qmid = quotedMsgObj.sender.id
                    var namae = quotedMsgObj.sender.name
                    var sts = await kaguya.getStatus(qmid)
                    var ctt = await kaguya.getContact(qmid)
                    var adm = isGroupAdmins
                    var donate = isOwnerBot
                    const { status } = sts
                    Object.keys(pendaftar).forEach((i) => {
                        if(pendaftar[i].id == qmid){
                            found = i
                        }
                    })
                    if (found !== false) {
                        pendaftar[found].id = qmid;
                        var registe = '✔'
                    } else {
                        var registe = '❌'
                    }
                    if (ctt == null) {
                    return await kaguya.reply(from, `Nomor WhatsApp tidak valid [ Tidak terdaftar di WhatsApp ]`, id) 
                    } else {
                        const contact = ctt.pushname
                        const dpd = await kaguya.getProfilePicFromServer(qmid)
                    if (dpd == undefined) {
                        var pfp = errorurl
                        } else {
                            var pfp = dpd
                        } 
                    if (contact == undefined) {
                        var namae = '*Tidak Ada Nama*' 
                    } else {
                        var namae = contact
                    } 
                    await kaguya.sendContact(chatId, qmid)
                    kaguya.sendFileFromUrl(from, pfp, 'pfp.jpg', `*「 PROFILE 」*\n\n• *Username: ${namae}*\n• *User Info: ${status}*\n• *Admin Group: ${adm}*\n• *Owner Bot: ${donate}*\n• *Registered User :* ${registe}`)
                    }
                }
            }
            break
        case 'groupinfo' :
            if (isAfk) return await kaguya.reply(from, `Maaf ${pushname}, Kamu sedang afk! Ketik ${prefix}unafk untuk mematikan`,  id)
            if(isReg(obj)) return
            if (isLimit(serial)) return kaguya.reply(from, `Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik ${prefix}limit Untuk Mengecek Kuota Limit Kamu`, id)
            
            await limitAdd(serial)
            if (!isGroupMsg) return kaguya.reply(from, 'Perintah ini hanya bisa di gunakan dalam group!', message.id)
            var totalMem = chat.groupMetadata.participants.length
            var desc = chat.groupMetadata.desc
            var groupname = name
            var grouppic = await kaguya.getProfilePicFromServer(chat.id)
            if (grouppic == undefined) {
                 var pfp = errorurl
            } else {
                 var pfp = grouppic 
            }
            await kaguya.sendFileFromUrl(from, pfp, 'group.png', `*「 GROUP INFO 」*
*➸ *Name : ${groupname}* 
*➸ Members : ${totalMem}*
*➸ Group Description* 

${desc}`)
        break
		case 'grouplink':
            if(isReg(obj)) return
            if (isLimit(serial)) return kaguya.reply(from, `Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik ${prefix}limit Untuk Mengecek Kuota Limit Kamu`, id)
            if (isAfk) return await kaguya.reply(from, `Maaf ${pushname}, Kamu sedang afk! Ketik ${prefix}unafk untuk mematikan`,  id)
            await limitAdd(serial)
            if (!isBotGroupAdmins) return kaguya.reply(from, 'Perintah ini hanya bisa di gunakan ketika bot menjadi admin', id)
            if (isGroupMsg) {
                const inviteLink = await kaguya.getGroupInviteLink(groupId);
                kaguya.sendLinkWithAutoPreview(from, inviteLink, `\nGunakan *${prefix}revoke* untuk mereset Link group`)
            } else {
            	kaguya.reply(from, 'Perintah ini hanya bisa di gunakan dalam group!', id)
            }
            break
	        case "revoke":
            if(isReg(obj)) return
            if (isLimit(serial)) return kaguya.reply(from, `Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik ${prefix}limit Untuk Mengecek Kuota Limit Kamu`, id)
            if (isAfk) return await kaguya.reply(from, `Maaf ${pushname}, Kamu sedang afk! Ketik ${prefix}unafk untuk mematikan`,  id)
            await limitAdd(serial)
	        if (!isBotGroupAdmins) return kaguya.reply(from, 'Perintah ini hanya bisa di gunakan ketika bot menjadi admin', id)
            if (isBotGroupAdmins) {
                        kaguya
                            .revokeGroupInviteLink(from)
                            .then((res) => {
                                kaguya.reply(from, `Berhasil Revoke Grup Link gunakan *${prefix}grouplink* untuk mendapatkan group invite link yang terbaru`, id);
                            })
                            .catch((err) => {
                                console.log(`[ERR] ${err}`);
                            });
                    }
                    break
        case 'botstat':
            if(isReg(obj)) return
            if (isLimit(serial)) return kaguya.reply(from, `Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik ${prefix}limit Untuk Mengecek Kuota Limit Kamu`, id)
            if (isAfk) return await kaguya.reply(from, `Maaf ${pushname}, Kamu sedang afk! Ketik ${prefix}unafk untuk mematikan`,  id)
            await limitAdd(serial)
			{
            const loadedMsg = await kaguya.getAmountOfLoadedMessages()
            const chatIds = await kaguya.getAllChatIds()
            const groups = await kaguya.getAllGroups()
            kaguya.sendText(from, `Status :\n- *${loadedMsg}* Loaded Messages\n- *${groups.length}* Group Chats\n- *${chatIds.length - groups.length}* Personal Chats\n- *${chatIds.length}* Total Chats`)
            }        
     		break


        // Sticker Creator
        case 'sticker':
        case 'stiker':
            if (isAfk) return await kaguya.reply(from, `Maaf ${pushname}, Kamu sedang afk! Ketik ${prefix}unafk untuk mematikan`,  id)
            if(isReg(obj)) return
            if (isLimit(serial)) return kaguya.reply(from, `Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik ${prefix}limit Untuk Mengecek Kuota Limit Kamu`, id)
            
            await limitAdd(serial)
            if ((isMedia || isQuotedImage) && args.length === 0) {
                const encryptMedia = isQuotedImage ? quotedMsg : message
                const _mimetype = isQuotedImage ? quotedMsg.mimetype : mimetype
                const mediaData = await decryptMedia(encryptMedia, uaOverride)
                const imageBase64 = `data:${_mimetype};base64,${mediaData.toString('base64')}`
                kaguya.sendImageAsSticker(from, imageBase64)
                .then(() => {
                    kaguya.reply(from, 'Nih...')
                    console.log(`Sticker Processed for ${processTime(t, moment())} Second`)
                })
            } else if (args[0] === 'nobg') {
                if (isMedia || isQuotedImage) {
                    try {
                    var mediaData = await decryptMedia(message, uaOverride)
                    var imageBase64 = `data:${mimetype};base64,${mediaData.toString('base64')}`
                    var base64img = imageBase64
                    var outFile = './media/noBg.png'
		            // kamu dapat mengambil api key dari website remove.bg dan ubahnya difolder settings/api.json
                    var result = await removeBackgroundFromImageBase64({ base64img, apiKey: apiNoBg, size: 'auto', type: 'auto', outFile })
                    await fs.writeFile(outFile, result.base64img)
                    await kaguya.sendImageAsSticker(from, `data:${mimetype};base64,${result.base64img}`)
                    } catch(err) {
                    console.log(err)
	   	            await kaguya.reply(from, 'Maaf batas penggunaan hari ini sudah mencapai maksimal', id)
                    }
                }
            } else if (args.length === 1) {
                if (!isUrl(url)) { await kaguya.reply(from, 'Maaf, link yang kamu kirim tidak valid.', id) }
                kaguya.sendStickerfromUrl(from, url).then((r) => (!r && r !== undefined)
                    ? kaguya.sendText(from, 'Maaf, link yang kamu kirim tidak memuat gambar.')
                    : kaguya.reply(from, 'Nih...')).then(() => console.log(`Sticker Processed for ${processTime(t, moment())} Second`))
            } else {
                await kaguya.reply(from, `Tidak ada gambar! Untuk menggunakan ${prefix}sticker\n\n\nKirim gambar dengan caption\n${prefix}sticker <biasa>\n${prefix}sticker nobg <tanpa background>\n\natau Kirim pesan dengan\n${prefix}sticker <link_gambar>`, id)
            }
            break
        case 'stickergif':
        case 'stikergif':
            if(isReg(obj)) return
            if (isAfk) return await kaguya.reply(from, `Maaf ${pushname}, Kamu sedang afk! Ketik ${prefix}unafk untuk mematikan`,  id)
            if (isLimit(serial)) return kaguya.reply(from, `Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik ${prefix}limit Untuk Mengecek Kuota Limit Kamu`, id)
            await limitAdd(serial)
            if (isMedia || isQuotedVideo) {
                if (mimetype === 'video/mp4' && message.duration < 15 || mimetype === 'image/gif' && message.duration < 15) {
                    var mediaData = await decryptMedia(message, uaOverride)
                    kaguya.reply(from, '[WAIT] Sedang di proses⏳ silahkan tunggu ± 1 min!', id)
                    var filename = `./media/stickergif.${mimetype.split('/')[1]}`
                    await fs.writeFileSync(filename, mediaData)
                    await exec(`gify ${filename} ./media/stickergf.gif --fps=30 --scale=240:240`, async function (error, stdout, stderr) {
                        var gif = await fs.readFileSync('./media/stickergf.gif', { encoding: "base64" })
                        await kaguya.sendImageAsSticker(from, `data:image/gif;base64,${gif.toString('base64')}`)
                        .catch(() => {
                            kaguya.reply(from, 'Maaf filenya terlalu besar!', id)
                        })
                    })
                  } else {
                    kaguya.reply(from, `[❗] Kirim gif dengan caption ${prefix}stickergif max 15 sec!`, id)
                   }
                } else {
		    kaguya.reply(from, `[❗] Kirim gif dengan caption ${prefix}stickergif`, id)
	        }
            break
        case 'stikergiphy':
        case 'stickergiphy':
            if (isAfk) return await kaguya.reply(from, `Maaf ${pushname}, Kamu sedang afk! Ketik ${prefix}unafk untuk mematikan`,  id)
            if(isReg(obj)) return
            if (isLimit(serial)) return kaguya.reply(from, `Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik ${prefix}limit Untuk Mengecek Kuota Limit Kamu`, id)
            
            await limitAdd(serial)
            if (args.length !== 1) return kaguya.reply(from, `Maaf, format pesan salah.\nKetik pesan dengan ${prefix}stickergiphy <link_giphy>`, id)
            const isGiphy = url.match(new RegExp(/https?:\/\/(www\.)?giphy.com/, 'gi'))
            const isMediaGiphy = url.match(new RegExp(/https?:\/\/media.giphy.com\/media/, 'gi'))
            if (isGiphy) {
                const getGiphyCode = url.match(new RegExp(/(\/|\-)(?:.(?!(\/|\-)))+$/, 'gi'))
                if (!getGiphyCode) { return kaguya.reply(from, 'Gagal mengambil kode giphy', id) }
                const giphyCode = getGiphyCode[0].replace(/[-\/]/gi, '')
                const smallGifUrl = 'https://media.giphy.com/media/' + giphyCode + '/giphy-downsized.gif'
                kaguya.sendGiphyAsSticker(from, smallGifUrl).then(() => {
                    kaguya.reply(from, 'Here\'s your sticker')
                    console.log(`Sticker Processed for ${processTime(t, moment())} Second`)
                }).catch((err) => console.log(err))
            } else if (isMediaGiphy) {
                const gifUrl = url.match(new RegExp(/(giphy|source).(gif|mp4)/, 'gi'))
                if (!gifUrl) { return kaguya.reply(from, 'Gagal mengambil kode giphy', id) }
                const smallGifUrl = url.replace(gifUrl[0], 'giphy-downsized.gif')
                kaguya.sendGiphyAsSticker(from, smallGifUrl)
                .then(() => {
                    kaguya.reply(from, 'Here\'s your sticker')
                    console.log(`Sticker Processed for ${processTime(t, moment())} Second`)
                })
                .catch(() => {
                    kaguya.reply(from, `Ada yang error!`, id)
                })
            } else {
                await kaguya.reply(from, 'Maaf, command sticker giphy hanya bisa menggunakan link dari giphy.  [Giphy Only]', id)
            }
            break
        case 'ttp':
            if (isAfk) return await kaguya.reply(from, `Maaf ${pushname}, Kamu sedang afk! Ketik ${prefix}unafk untuk mematikan`,  id)
            if(isReg(obj)) return
            if (isLimit(serial)) return kaguya.reply(from, `Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik ${prefix}limit Untuk Mengecek Kuota Limit Kamu`, id)
            
            await limitAdd(serial)
                try
                {
                const string = body.toLowerCase().includes('#ttp') ? body.slice(5) : body.slice(5)
                if(args)
                {
                if(quotedMsgObj == null)
                {
                const gasMake = await getStickerMaker(string)
                if(gasMake.status == true)
                {
                try{
                await kaguya.sendImageAsSticker(from, gasMake.base64)
                }catch(err) {
                await kaguya.reply(from, 'Gagal membuat.', id)
                } 
                }else{
                await kaguya.reply(from, gasMake.reason, id)
                }
                }else if(quotedMsgObj != null){
                const gasMake = await ttp(quotedMsgObj.body)
                if(gasMake.status == true)
                {
                try{
                await kaguya.sendImageAsSticker(from, gasMake.base64)
                }catch(err) {
                await kaguya.reply(from, 'Gagal membuat.', id)
                } 
                }else{
                await kaguya.reply(from, gasMake.reason, id)
                }
                }
                }else{
                await kaguya.reply(from, 'Tidak boleh kosong.', id)
                }
                }catch(error)
                {
                console.log(error)
                }
             break
        case 'stickertoimg':
        case 'toimg':
        case 'stctoimg':
            if(isReg(obj)) return
            if (isAfk) return await kaguya.reply(from, `Maaf ${pushname}, Kamu sedang afk! Ketik ${prefix}unafk untuk mematikan`,  id)
            if (isLimit(serial)) return kaguya.reply(from, `Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik ${prefix}limit Untuk Mengecek Kuota Limit Kamu`, id)
            await limitAdd(serial)
            if (quotedMsg && quotedMsg.type == 'sticker') {
                const mediaData = await decryptMedia(quotedMsg)
                kaguya.reply(from, '[WAIT] Sedang di proses⏳ silahkan tunggu!', id)
                const imageBase64 = `data:${quotedMsg.mimetype};base64,${mediaData.toString('base64')}`
                await kaguya.sendFile(from, imageBase64, 'imagesticker.jpg', 'Nih . . .', id)
            } else if (!quotedMsg) return kaguya.reply(from, 'Mohon tag sticker yang ingin dijadikan gambar!', id)
            break
        case 'meme':
            if (isAfk) return await kaguya.reply(from, `Maaf ${pushname}, Kamu sedang afk! Ketik ${prefix}unafk untuk mematikan`,  id)
            if(isReg(obj)) return
            if (isLimit(serial)) return kaguya.reply(from, `Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik ${prefix}limit Untuk Mengecek Kuota Limit Kamu`, id)
            
            await limitAdd(serial)
            if ((isMedia || isQuotedImage) && args.length >= 2) {
                const top = arg.split('|')[0]
                const bottom = arg.split('|')[1]
                const encryptMedia = isQuotedImage ? quotedMsg : message
                const mediaData = await decryptMedia(encryptMedia, uaOverride)
                const getUrl = await uploadImages(mediaData, false)
                const ImageBase64 = await meme.custom(getUrl, top, bottom)
                kaguya.sendFile(from, ImageBase64, 'image.png', '', null, true)
                    .then(() => {
                        kaguya.reply(from, 'Ini makasih!',id)
                    })
                    .catch(() => {
                        kaguya.reply(from, 'Ada yang error!')
                    })
            } else {
                await kaguya.reply(from, `Tidak ada gambar! Silahkan kirim gambar dengan caption ${prefix}meme <teks_atas> | <teks_bawah>\ncontoh: ${prefix}meme teks atas | teks bawah`, id)
            }
            break
        case 'quotemaker':
            if(isReg(obj)) return
            if (isAfk) return await kaguya.reply(from, `Maaf ${pushname}, Kamu sedang afk! Ketik ${prefix}unafk untuk mematikan`,  id)
            if (isLimit(serial)) return kaguya.reply(from, `Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik ${prefix}limit Untuk Mengecek Kuota Limit Kamu`, id)
            
            await limitAdd(serial)
            const qmaker = body.trim().split('|')
            if (qmaker.length >= 3) {
                const quotes = qmaker[1]
                const author = qmaker[2]
                const theme = qmaker[3]
                kaguya.reply(from, 'Proses kak..', id)
                try {
                    const hasilqmaker = await images.quote(quotes, author, theme)
                    kaguya.sendFileFromUrl(from, `${hasilqmaker}`, '', 'Ini kak..', id)
                } catch {
                    kaguya.reply('Yahh proses gagal, kakak isinya sudah benar belum?..', id)
                }
            } else {
                kaguya.reply(from, `Pemakaian ${prefix}quotemaker |isi quote|author|theme\n\ncontoh: ${prefix}quotemaker |aku sayang kamu|-kaguya|random\n\nuntuk theme nya pakai random ya kak..`)
            }
            break
            case 'nulis2':
                if(isReg(obj)) return
                if (isLimit(serial)) return kaguya.reply(from, `Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik ${prefix}limit Untuk Mengecek Kuota Limit Kamu`, id)
                if (isAfk) return await kaguya.reply(from, `Maaf ${pushname}, Kamu sedang afk! Ketik ${prefix}unafk untuk mematikan`,  id)
                await limitAdd(serial)
                if (args.length == 0) return kaguya.reply(from, `Membuat bot menulis teks yang dikirim menjadi gambar\nPemakaian: ${prefix}nulis [teks]\n\ncontoh: ${prefix}nulis Shinomiya-Kaguya`, id)
                const nulis2q = body.slice(7)
                const nulis2p = await kaguyaapi.tulis2(nulis2q)
                await kaguya.sendImage(from, `${nulis2p}`, '', 'Nih...', id)
                .catch(() => {
                    kaguya.reply(from, 'Ada yang Error!', id)
                })
                break	
        case 'nulis':
            if(isReg(obj)) return
            if (isLimit(serial)) return kaguya.reply(from, `Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik ${prefix}limit Untuk Mengecek Kuota Limit Kamu`, id)
            if (isAfk) return await kaguya.reply(from, `Maaf ${pushname}, Kamu sedang afk! Ketik ${prefix}unafk untuk mematikan`,  id)
            await limitAdd(serial)
            if (args.length == 0) return kaguya.reply(from, `Membuat bot menulis teks yang dikirim menjadi gambar\nPemakaian: ${prefix}nulis [teks]\n\ncontoh: ${prefix}nulis Shinomiya-Kaguya`, id)
            const nulisq = body.slice(7)
            const nulisp = await kaguyaapi.tulis(nulisq)
            await kaguya.sendImage(from, `${nulisp}`, '', 'Nih...', id)
            .catch(() => {
                kaguya.reply(from, 'Ada yang Error!', id)
            })
            break			
        //Islam Command
        case 'listsurah':
            if (isAfk) return await kaguya.reply(from, `Maaf ${pushname}, Kamu sedang afk! Ketik ${prefix}unafk untuk mematikan`,  id)
            if(isReg(obj)) return
            if (isLimit(serial)) return kaguya.reply(from, `Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik ${prefix}limit Untuk Mengecek Kuota Limit Kamu`, id)
            
            await limitAdd(serial)
            try {
                axios.get('https://raw.githubusercontent.com/Arugaz/grabbed-results/main/islam/surah.json')
                .then((response) => {
                    let hehex = '╔══✪〘 List Surah 〙✪══\n'
                    for (let i = 0; i < response.data.data.length; i++) {
                        hehex += '╠➥ '
                        hehex += response.data.data[i].name.transliteration.id.toLowerCase() + '\n'
                            }
                        hehex += '╚═〘 *K A G U Y A  B O T* 〙'
                    kaguya.reply(from, hehex, id)
                })
            } catch(err) {
                kaguya.reply(from, err, id)
            }
            break
        case 'infosurah':
            if (isAfk) return await kaguya.reply(from, `Maaf ${pushname}, Kamu sedang afk! Ketik ${prefix}unafk untuk mematikan`,  id)
            if(isReg(obj)) return
            if (isLimit(serial)) return kaguya.reply(from, `Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik ${prefix}limit Untuk Mengecek Kuota Limit Kamu`, id)
            
            await limitAdd(serial)
            if (args.length == 0) return kaguya.reply(from, `*_${prefix}infosurah <nama surah>_*\nMenampilkan informasi lengkap mengenai surah tertentu. Contoh penggunan: ${prefix}infosurah al-baqarah`, message.id)
                var responseh = await axios.get('https://raw.githubusercontent.com/Arugaz/grabbed-results/main/islam/surah.json')
                var { data } = responseh.data
                var idx = data.findIndex(function(post, index) {
                  if((post.name.transliteration.id.toLowerCase() == args[0].toLowerCase())||(post.name.transliteration.en.toLowerCase() == args[0].toLowerCase()))
                    return true;
                });
                var pesan = ""
                pesan = pesan + "Nama : "+ data[idx].name.transliteration.id + "\n" + "Asma : " +data[idx].name.short+"\n"+"Arti : "+data[idx].name.translation.id+"\n"+"Jumlah ayat : "+data[idx].numberOfVerses+"\n"+"Nomor surah : "+data[idx].number+"\n"+"Jenis : "+data[idx].revelation.id+"\n"+"Keterangan : "+data[idx].tafsir.id
                kaguya.reply(from, pesan, message.id)
              break
        case 'surah':
            if (isAfk) return await kaguya.reply(from, `Maaf ${pushname}, Kamu sedang afk! Ketik ${prefix}unafk untuk mematikan`,  id)
            if(isReg(obj)) return
            if (isLimit(serial)) return kaguya.reply(from, `Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik ${prefix}limit Untuk Mengecek Kuota Limit Kamu`, id)
            
            await limitAdd(serial)
            if (args.length == 0) return kaguya.reply(from, `*_${prefix}surah <nama surah> <ayat>_*\nMenampilkan ayat Al-Quran tertentu beserta terjemahannya dalam bahasa Indonesia. Contoh penggunaan : ${prefix}surah al-baqarah 1\n\n*_${prefix}surah <nama surah> <ayat> en/id_*\nMenampilkan ayat Al-Quran tertentu beserta terjemahannya dalam bahasa Inggris / Indonesia. Contoh penggunaan : ${prefix}surah al-baqarah 1 id`, message.id)
                var responseh = await axios.get('https://raw.githubusercontent.com/Arugaz/grabbed-results/main/islam/surah.json')
                var { data } = responseh.data
                var idx = data.findIndex(function(post, index) {
                  if((post.name.transliteration.id.toLowerCase() == args[0].toLowerCase())||(post.name.transliteration.en.toLowerCase() == args[0].toLowerCase()))
                    return true;
                });
                nmr = data[idx].number
                if(!isNaN(nmr)) {
                  var responseh2 = await axios.get('https://api.quran.sutanlab.id/surah/'+nmr+"/"+args[1])
                  var {data} = responseh2.data
                  var last = function last(array, n) {
                    if (array == null) return void 0;
                    if (n == null) return array[array.length - 1];
                    return array.slice(Math.max(array.length - n, 0));
                  };
                  bhs = last(args)
                  pesan = ""
                  pesan = pesan + data.text.arab + "\n\n"
                  if(bhs == "en") {
                    pesan = pesan + data.translation.en
                  } else {
                    pesan = pesan + data.translation.id
                  }
                  pesan = pesan + "\n\n(Q.S. "+data.surah.name.transliteration.id+":"+args[1]+")"
                  kaguya.reply(from, pesan, message.id)
                }
              break
        case 'tafsir':
            if (isAfk) return await kaguya.reply(from, `Maaf ${pushname}, Kamu sedang afk! Ketik ${prefix}unafk untuk mematikan`,  id)
            if(isReg(obj)) return
            if (isLimit(serial)) return kaguya.reply(from, `Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik ${prefix}limit Untuk Mengecek Kuota Limit Kamu`, id)
            
            await limitAdd(serial)
            if (args.length == 0) return kaguya.reply(from, `*_${prefix}tafsir <nama surah> <ayat>_*\nMenampilkan ayat Al-Quran tertentu beserta terjemahan dan tafsirnya dalam bahasa Indonesia. Contoh penggunaan : ${prefix}tafsir al-baqarah 1`, message.id)
                var responsh = await axios.get('https://raw.githubusercontent.com/Arugaz/grabbed-results/main/islam/surah.json')
                var {data} = responsh.data
                var idx = data.findIndex(function(post, index) {
                  if((post.name.transliteration.id.toLowerCase() == args[0].toLowerCase())||(post.name.transliteration.en.toLowerCase() == args[0].toLowerCase()))
                    return true;
                });
                nmr = data[idx].number
                if(!isNaN(nmr)) {
                  var responsih = await axios.get('https://api.quran.sutanlab.id/surah/'+nmr+"/"+args[1])
                  var {data} = responsih.data
                  pesan = ""
                  pesan = pesan + "Tafsir Q.S. "+data.surah.name.transliteration.id+":"+args[1]+"\n\n"
                  pesan = pesan + data.text.arab + "\n\n"
                  pesan = pesan + "_" + data.translation.id + "_" + "\n\n" +data.tafsir.id.long
                  kaguya.reply(from, pesan, message.id)
              }
              break
        case 'alaudio':
            if (isAfk) return await kaguya.reply(from, `Maaf ${pushname}, Kamu sedang afk! Ketik ${prefix}unafk untuk mematikan`,  id)
            if(isReg(obj)) return
            if (isLimit(serial)) return kaguya.reply(from, `Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik ${prefix}limit Untuk Mengecek Kuota Limit Kamu`, id)
            
            await limitAdd(serial)
            if (args.length == 0) return kaguya.reply(from, `*_${prefix}ALaudio <nama surah>_*\nMenampilkan tautan dari audio surah tertentu. Contoh penggunaan : ${prefix}ALaudio al-fatihah\n\n*_${prefix}ALaudio <nama surah> <ayat>_*\nMengirim audio surah dan ayat tertentu beserta terjemahannya dalam bahasa Indonesia. Contoh penggunaan : ${prefix}ALaudio al-fatihah 1\n\n*_${prefix}ALaudio <nama surah> <ayat> en_*\nMengirim audio surah dan ayat tertentu beserta terjemahannya dalam bahasa Inggris. Contoh penggunaan : ${prefix}ALaudio al-fatihah 1 en`, message.id)
              ayat = "ayat"
              bhs = ""
                var responseh = await axios.get('https://raw.githubusercontent.com/Arugaz/grabbed-results/main/islam/surah.json')
                var surah = responseh.data
                var idx = surah.data.findIndex(function(post, index) {
                  if((post.name.transliteration.id.toLowerCase() == args[0].toLowerCase())||(post.name.transliteration.en.toLowerCase() == args[0].toLowerCase()))
                    return true;
                });
                nmr = surah.data[idx].number
                if(!isNaN(nmr)) {
                  if(args.length > 2) {
                    ayat = args[1]
                  }
                  if (args.length == 2) {
                    var last = function last(array, n) {
                      if (array == null) return void 0;
                      if (n == null) return array[array.length - 1];
                      return array.slice(Math.max(array.length - n, 0));
                    };
                    ayat = last(args)
                  } 
                  pesan = ""
                  if(isNaN(ayat)) {
                    var responsih2 = await axios.get('https://raw.githubusercontent.com/Arugaz/grabbed-results/main/islam/surah/'+nmr+'.json')
                    var {name, name_translations, number_of_ayah, number_of_surah,  recitations} = responsih2.data
                    pesan = pesan + "Audio Quran Surah ke-"+number_of_surah+" "+name+" ("+name_translations.ar+") "+ "dengan jumlah "+ number_of_ayah+" ayat\n"
                    pesan = pesan + "Dilantunkan oleh "+recitations[0].name+" : "+recitations[0].audio_url+"\n"
                    pesan = pesan + "Dilantunkan oleh "+recitations[1].name+" : "+recitations[1].audio_url+"\n"
                    pesan = pesan + "Dilantunkan oleh "+recitations[2].name+" : "+recitations[2].audio_url+"\n"
                    kaguya.reply(from, pesan, message.id)
                  } else {
                    var responsih2 = await axios.get('https://api.quran.sutanlab.id/surah/'+nmr+"/"+ayat)
                    var {data} = responsih2.data
                    var last = function last(array, n) {
                      if (array == null) return void 0;
                      if (n == null) return array[array.length - 1];
                      return array.slice(Math.max(array.length - n, 0));
                    };
                    bhs = last(args)
                    pesan = ""
                    pesan = pesan + data.text.arab + "\n\n"
                    if(bhs == "en") {
                      pesan = pesan + data.translation.en
                    } else {
                      pesan = pesan + data.translation.id
                    }
                    pesan = pesan + "\n\n(Q.S. "+data.surah.name.transliteration.id+":"+args[1]+")"
                    await kaguya.sendFileFromUrl(from, data.audio.secondary[0])
                    await kaguya.reply(from, pesan, message.id)
                  }
              }
              break
        case 'jsolat':
            if (isAfk) return await kaguya.reply(from, `Maaf ${pushname}, Kamu sedang afk! Ketik ${prefix}unafk untuk mematikan`,  id)
            if(isReg(obj)) return
            if (isLimit(serial)) return kaguya.reply(from, `Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik ${prefix}limit Untuk Mengecek Kuota Limit Kamu`, id)
            
            await limitAdd(serial)
            if (args.length == 0) return kaguya.reply(from, `Untuk melihat jadwal solat dari setiap daerah yang ada\nketik: ${prefix}jsolat [daerah]\n\nuntuk list daerah yang ada\nketik: ${prefix}daerah`, id)
            const solatx = body.slice(8)
            const solatj = await kaguyaapi.jadwaldaerah(solatx)
            await kaguya.reply(from, solatj, id)
            .catch(() => {
                kaguya.reply(from, 'Pastikan daerah kamu ada di list ya!', id)
            })
            break
        case 'daerah':
            if(isReg(obj)) return
            if (isAfk) return await kaguya.reply(from, `Maaf ${pushname}, Kamu sedang afk! Ketik ${prefix}unafk untuk mematikan`,  id)
            if (isLimit(serial)) return kaguya.reply(from, `Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik ${prefix}limit Untuk Mengecek Kuota Limit Kamu`, id)
            
            await limitAdd(serial)
            const daerahq = await kaguyaapi.daerah()
            await kaguya.reply(from, daerahq, id)
            .catch(() => {
                kaguya.reply(from, 'Ada yang Error!', id)
            })
            break
        //Media
        case 'ig':
        case 'instagram':
            if (isAfk) return await kaguya.reply(from, `Maaf ${pushname}, Kamu sedang afk! Ketik ${prefix}unafk untuk mematikan`,  id)
            if(isReg(obj)) return
            if (isLimit(serial)) return kaguya.reply(from, `Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik ${prefix}limit Untuk Mengecek Kuota Limit Kamu`, id)
            
            await limitAdd(serial)
            if (args.length !== 1) return kaguya.reply(from, 'Maaf, format pesan salah silahkan periksa menu. [Wrong Format]', id)
            if (!isUrl(url) && !url.includes('instagram.com')) return kaguya.reply(from, 'Maaf, link yang kamu kirim tidak valid. [Invalid Link]', id)
            await kaguya.reply(from, `_Scraping Metadata..._`, id)
            kaguyaapi.insta(url).then(async (data) => {
                if (data.type == 'GraphSidecar') {
                    if (data.image.length != 0) {
                        data.image.map((x) => kaguya.sendFileFromUrl(from, x, 'photo.jpg', '', null, null, true))
                            .then((serialized) => console.log(`Sukses Mengirim File dengan id: ${serialized} diproses selama ${processTime(t, moment())}`))
                            .catch((err) => console.error(err))
                    }
                    if (data.video.length != 0) {
                        data.video.map((x) => kaguya.sendFileFromUrl(from, x.videoUrl, 'video.jpg', '', null, null, true))
                            .then((serialized) => console.log(`Sukses Mengirim File dengan id: ${serialized} diproses selama ${processTime(t, moment())}`))
                            .catch((err) => console.error(err))
                    }
                } else if (data.type == 'GraphImage') {
                    kaguya.sendFileFromUrl(from, data.image, 'photo.jpg', '', null, null, true)
                        .then((serialized) => console.log(`Sukses Mengirim File dengan id: ${serialized} diproses selama ${processTime(t, moment())}`))
                        .catch((err) => console.error(err))
                } else if (data.type == 'GraphVideo') {
                    kaguya.sendFileFromUrl(from, data.video.videoUrl, 'video.mp4', '', null, null, true)
                        .then((serialized) => console.log(`Sukses Mengirim File dengan id: ${serialized} diproses selama ${processTime(t, moment())}`))
                        .catch((err) => console.error(err))
                }
            })
                .catch((err) => {
                    if (err === 'Not a video') { return kaguya.reply(from, 'Error, tidak ada video di link yang kamu kirim. [Invalid Link]', id) }
                    kaguya.reply(from, 'Error, user private atau link salah [Private or Invalid Link]', id)
                })
            break
		case 'joox':
            if(isReg(obj)) return
            if (isLimit(serial)) return kaguya.reply(from, `Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik ${prefix}limit Untuk Mengecek Kuota Limit Kamu`, id)
            if (isAfk) return await kaguya.reply(from, `Maaf ${pushname}, Kamu sedang afk! Ketik ${prefix}unafk untuk mematikan`,  id)
            await limitAdd(serial)
			const joox = await axios.get(`https://tobz-api.herokuapp.com/api/joox?q=${args}`)
			const {album, judul, mp3, thumb, dipublikasi} = await joox.data.result
			await kaguya.sendFileFromUrl(from, thumb, 'thumb.jpg', `*「 *JOOX* 」*\n•Judul: ${judul}\n•Album: ${album}\n•Dipublikasi: ${dipublikasi}\n\n*Mohon Tunggu Sebentar Kaguya Lagi Ngirim Lagunya*`, id)
			await kaguya.sendFileFromUrl(from, mp3, 'music.mp3', id)
			break
		case 'facebook':
		case 'fb':
            if (isAfk) return await kaguya.reply(from, `Maaf ${pushname}, Kamu sedang afk! Ketik ${prefix}unafk untuk mematikan`,  id)
            if(isReg(obj)) return
            if (isLimit(serial)) return kaguya.reply(from, `Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik ${prefix}limit Untuk Mengecek Kuota Limit Kamu`, id)
            
            await limitAdd(serial)
			const fb = await axios.get(`https://scrap.terhambar.com/fb?link=${args}`)
			const {title} = await fb.data.result
			const {sdQuality} = await fb.data.result.linkVideo
			await kaguya.sendFileFromUrl(from, sdQuality, 'sdQuality.mp4', `Judul: ${title}`, id)
			break
        case 'twt':
        case 'twitter':
            if (isAfk) return await kaguya.reply(from, `Maaf ${pushname}, Kamu sedang afk! Ketik ${prefix}unafk untuk mematikan`,  id)
            if(isReg(obj)) return
            if (isLimit(serial)) return kaguya.reply(from, `Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik ${prefix}limit Untuk Mengecek Kuota Limit Kamu`, id)
            
            await limitAdd(serial)
            if (args.length !== 1) return kaguya.reply(from, 'Maaf, format pesan salah silahkan Periksa kembali', id)
            if (!isUrl(url) & !url.includes('twitter.com') || url.includes('t.co')) return kaguya.reply(from, 'Maaf, url yang kamu kirim tidak valid. [Invalid Link]', id)
            await kaguya.reply(from, `_Scraping Metadata...`, id)
            kaguyaapi.tweet(url).then(async (data) => {
                if (data.type === 'video') {
                    const content = data.variants.filter(x => x.content_type !== 'application/x-mpegURL').sort((a, b) => b.bitrate - a.bitrate)
                    const result = await urlShortener(content[0].url)
                    console.log('Shortlink: ' + result)
                    await kaguya.sendFileFromUrl(from, content[0].url, 'video.mp4', `Link Download: ${result} \n\nProcessed for ${processTime(t, moment())} _Second_`, null, null, true)
                        .then((serialized) => console.log(`Sukses Mengirim File dengan id: ${serialized} diproses selama ${processTime(t, moment())}`))
                        .catch((err) => console.error(err))
                } else if (data.type === 'photo') {
                    for (let i = 0; i < data.variants.length; i++) {
                        await kaguya.sendFileFromUrl(from, data.variants[i], data.variants[i].split('/media/')[1], '', null, null, true)
                            .then((serialized) => console.log(`Sukses Mengirim File dengan id: ${serialized} diproses selama ${processTime(t, moment())}`))
                            .catch((err) => console.error(err))
                    }
                }
            })
                .catch(() => kaguya.sendText(from, 'Maaf, link tidak valid atau tidak ada media di link yang kamu kirim. [Invalid Link]'))
            break
        case 'ytmp3':
            if(isReg(obj)) return
            if (isAfk) return await kaguya.reply(from, `Maaf ${pushname}, Kamu sedang afk! Ketik ${prefix}unafk untuk mematikan`,  id)
            if (isLimit(serial)) return kaguya.reply(from, `Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik ${prefix}limit Untuk Mengecek Kuota Limit Kamu`, id)
            await limitAdd(serial)
            if (args.length == 0) return kaguya.reply(from, `Untuk mendownload lagu dari youtube\nketik: ${prefix}ytmp3 [link_yt]`, id)
            const linkmp3 = args[0].replace('https://youtu.be/','').replace('https://www.youtube.com/watch?v=','')
			kaguyaapi.ytmp3(`https://youtu.be/${linkmp3}`)
            .then(async(res) => {
				if (res.error) return kaguya.sendFileFromUrl(from, `${res.url}`, '', `${res.error}`)
                await kaguya.sendFileFromUrl(from, `${res.thumb}`, '', `*「 YOUTUBE MP3 」*\nJudul: ${res.title}\nFilesize: ${res.filesize}\nExt: ${res.ext}\n\n*Mohon Tunggu Sebentar ${pushname}, Kaguya Lagi Ngirim Audio*`, id)
                const mp3 = args[0].replace('https://youtu.be/','').replace('https://www.youtube.com/watch?v=','')
                kaguyaapi.ymp3(`https://youtu.be/${mp3}`)
                .then(async(res) => {
				await kaguya.sendFileFromUrl(from, `${res.getVideo}`, '', '', id)
				.catch(() => {
					console.log(err)
					kaguya.reply(from, `ERROR! COBA GUNAKAN LINK LAIN`, id)
				})
            })
        })	
        break
        case 'ytmp4':
            if(isReg(obj)) return
            if (isAfk) return await kaguya.reply(from, `Maaf ${pushname}, Kamu sedang afk! Ketik ${prefix}unafk untuk mematikan`,  id)
            if (isLimit(serial)) return kaguya.reply(from, `Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik ${prefix}limit Untuk Mengecek Kuota Limit Kamu`, id)
            await limitAdd(serial)
            if (args.length == 0) return kaguya.reply(from, `Untuk mendownload lagu dari youtube\nketik: ${prefix}ytmp4 [link_yt]`, id)
            const linkmp4 = args[0].replace('https://youtu.be/','').replace('https://www.youtube.com/watch?v=','')
			kaguyaapi.ytmp4(`https://youtu.be/${linkmp4}`)
            .then(async(res) => {
				if (res.error) return kaguya.sendFileFromUrl(from, `${res.url}`, '', `${res.error}`)
                await kaguya.sendFileFromUrl(from, `${res.thumb}`, '', `*「 YOUTUBE MP4 」*\nTitle: ${res.title}\nFilesize: ${res.filesize}\nResolution: ${res.resolution}\nExt: ${res.ext}\n*Mohon Tunggu Sebentar ${pushname}, Kaguya Lagi Ngirim Videonya*`, id)
                const mp4 = args[0].replace('https://youtu.be/','').replace('https://www.youtube.com/watch?v=','')
                kaguyaapi.ymp4(`https://youtu.be/${mp4}`)
                .then(async(res) => {
				await kaguya.sendFileFromUrl(from, `${res.getVideo}`, '', '', id)
				.catch(() => {
					console.log(err)
					kaguya.reply(from, `ERROR! COBA GUNAKAN LINK LAIN`, id)
				})
			})
        })	
        break
		//Primbon Menu
		case 'artinama':
            if (isAfk) return await kaguya.reply(from, `Maaf ${pushname}, Kamu sedang afk! Ketik ${prefix}unafk untuk mematikan`,  id)
            if(isReg(obj)) return
            if (isLimit(serial)) return kaguya.reply(from, `Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik ${prefix}limit Untuk Mengecek Kuota Limit Kamu`, id)
            
            await limitAdd(serial)
			if (args.length == 0) return kaguya.reply(from, `Untuk mengetahui arti nama seseorang\nketik ${prefix}artinama namakamu`, id)
            kaguyaapi.artinama(body.slice(10))
			.then(async(res) => {
				await kaguya.reply(from, `Arti : ${res}`, id)
			})
            break
        case 'fakeid':
            if (isAfk) return await kaguya.reply(from, `Maaf ${pushname}, Kamu sedang afk! Ketik ${prefix}unafk untuk mematikan`,  id)
            if(isReg(obj)) return
            if (isLimit(serial)) return kaguya.reply(from, `Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik ${prefix}limit Untuk Mengecek Kuota Limit Kamu`, id)
            
            await limitAdd(serial)
            const fakex = await kaguyaapi.fake()
            await kaguya.reply(from, fakex, id)
            .catch(() => {
                kaguya.reply(from, 'Ada yang Error!', id)
            })
            break
        case 'renungan':
            if (isAfk) return await kaguya.reply(from, `Maaf ${pushname}, Kamu sedang afk! Ketik ${prefix}unafk untuk mematikan`,  id)
            if(isReg(obj)) return
            if (isLimit(serial)) return kaguya.reply(from, `Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik ${prefix}limit Untuk Mengecek Kuota Limit Kamu`, id)
            
            await limitAdd(serial)
            const renux = await kaguyaapi.renungan()
            await kaguya.reply(from, renux, id)
            .catch(() => {
                kaguya.reply(from, 'Ada yang Error!', id)
            })
            break
        case 'gombal':
            if (isAfk) return await kaguya.reply(from, `Maaf ${pushname}, Kamu sedang afk! Ketik ${prefix}unafk untuk mematikan`,  id)
            if(isReg(obj)) return
            if (isLimit(serial)) return kaguya.reply(from, `Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik ${prefix}limit Untuk Mengecek Kuota Limit Kamu`, id)  
            await limitAdd(serial)
            const bucinx = await kaguyaapi.bucin()
            await kaguya.reply(from, bucinx, id)
            .catch(() => {
                kaguya.reply(from, 'Ada yang Error!', id)
            })
            break
        case 'gay':
            if (isAfk) return await kaguya.reply(from, `Maaf ${pushname}, Kamu sedang afk! Ketik ${prefix}unafk untuk mematikan`,  id)
            if(isReg(obj)) return
            if (isLimit(serial)) return kaguya.reply(from, `Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik ${prefix}limit Untuk Mengecek Kuota Limit Kamu`, id)  
            await limitAdd(serial)
            const gayx = await kaguyaapi.gay()
            await kaguya.reply(from, gayx, id)
            .catch(() => {
                kaguya.reply(from, 'Ada yang Error!', id)
            })
            break
        case 'jadwaltvnow':
            if (isAfk) return await kaguya.reply(from, `Maaf ${pushname}, Kamu sedang afk! Ketik ${prefix}unafk untuk mematikan`,  id)
            if(isReg(obj)) return
            if (isLimit(serial)) return kaguya.reply(from, `Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik ${prefix}limit Untuk Mengecek Kuota Limit Kamu`, id)  
            await limitAdd(serial)
            const tvx = await kaguyaapi.jadwalnow()
            await kaguya.reply(from, tvx, id)
            .catch(() => {
                kaguya.reply(from, 'Ada yang Error!', id)
            })
            break
		case 'alkitab':
            if(isReg(obj)) return
            if (isAfk) return await kaguya.reply(from, `Maaf ${pushname}, Kamu sedang afk! Ketik ${prefix}unafk untuk mematikan`,  id)
			if (args.length !== 0) return kaguya.reply(from, `Gomenassai, Mungkin Servernya Lagi Error`)
			kaguyaapi.Alkitab(args[0],args[1])
			.then(async(res) => {
				await kaguya.sendFileFromUrl(from, `${res.link}`, '', `${res.text}`, id)
			})
            break
            case 'jadwaltv':
                if (isAfk) return await kaguya.reply(from, `Maaf ${pushname}, Kamu sedang afk! Ketik ${prefix}unafk untuk mematikan`,  id)
                if(isReg(obj)) return
                const o = args.join(' ')
                if (!o) return await kaguya.reply(from, `Format salah! Silakan cek cara penggunaan di *${prefix}menu*.`, id)
                await kaguya.reply(from, `Mohon tunggu sebentar~`, id)
                kaguyaapi.Jadwaltv(o)
                    .then(async ({ result }) => {
                        let jatv = `-----[ *JADWAL-TV* ]-----`
                        for (let i = 0; i < result.length; i++) {
                            jatv +=  `\n\n${result[i]}\n=_=_=_=_=_=_=_=_=_=_=_=_=`
                        }
                        await kaguya.reply(from, jatv, id)
                    })
                break
            case 'alkitabs':
                if (isAfk) return await kaguya.reply(from, `Maaf ${pushname}, Kamu sedang afk! Ketik ${prefix}unafk untuk mematikan`,  id)
                if(isReg(obj)) return
                const q = args.join(' ')
                if (!q) return await kaguya.reply(from, `Format salah! Silakan cek cara penggunaan di *${prefix}menu*.`, id)
                await kaguya.reply(from, `Mohon tunggu sebentar~`, id)
                kaguyaapi.alkitabsearch(q)
                    .then(async ({ result }) => {
                        let alkitab = `-----[ *AL-KITAB* ]-----`
                        for (let i = 0; i < result.length; i++) {
                            alkitab +=  `\n\n➸ *Ayat*: ${result[i].ayat}\n➸ *Isi*: ${result[i].isi}\n➸ *Link*: ${result[i].link}\n\n=_=_=_=_=_=_=_=_=_=_=_=_=`
                        }
                        await kaguya.reply(from, alkitab, id)
                    })
                break
		case 'infogempa':
		case 'gempainfo':
            if (isAfk) return await kaguya.reply(from, `Maaf ${pushname}, Kamu sedang afk! Ketik ${prefix}unafk untuk mematikan`,  id)
            if(isReg(obj)) return
			if (args.length !== 0) return kaguya.reply(from, `Gomenassai, Mungkin Servernya Lagi Error`)
			kaguyaapi.gempux(args[0],args[1])
			.then(async(res) => {
				await kaguya.sendFileFromUrl(from, `${res.link}`, '', `${res.text}`, id)
			})
			break
		case 'tiktok':
            if (isAfk) return await kaguya.reply(from, `Maaf ${pushname}, Kamu sedang afk! Ketik ${prefix}unafk untuk mematikan`,  id)
            if(isReg(obj)) return
			if (args.length !== 1) return kaguya.reply(from, `Ada Yang Salah Coba Priksa Kembali Url Anda`)
			kaguyaapi.tik(args[0])
			.then(async(res) => {
				await kaguya.sendFileFromUrl(from, `${res}`, id)
			})
            break
        case 'cekzodiak':
            if (isAfk) return await kaguya.reply(from, `Maaf ${pushname}, Kamu sedang afk! Ketik ${prefix}unafk untuk mematikan`,  id)
            if (args.length !== 4) return kaguya.reply(from, `Untuk mengecek zodiak, gunakan ${prefix}cekzodiak nama tanggallahir bulanlahir tahunlahir\nContoh: ${prefix}cekzodiak fikri 13 06 2004`, id)
            const cek = await kaguyaapi.cekzodiak(args[0],args[1],args[2])
            await kaguya.reply(from, cek, id)
            .catch(() => {
                kaguya.reply(from, 'Ada yang Error!', id)
            })
            break
        case 'zodiak':
            if(isReg(obj)) return
            if (isAfk) return await kaguya.reply(from, `Maaf ${pushname}, Kamu sedang afk! Ketik ${prefix}unafk untuk mematikan`,  id)
            if (isLimit(serial)) return kaguya.reply(from, `Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik ${prefix}limit Untuk Mengecek Kuota Limit Kamu`, id)
            if (args.length === 0) return kaguya.reply(from, `Kirim perintah *${prefix}zodiak [zodiak kamu]*\nContoh : *${prefix}zodiak scorpio*`, id)
        try {
            const resp = await axios.get('https://melodicxt.herokuapp.com/api/ramalan-zodiak?query=' + body.slice(8) + '&apiKey=administrator')
            if (resp.data.error) return kaguya.reply(from, resp.data.error, id)
            const anm2 = `➸ Zodiak : ${resp.data.result.zodiak}\n➸ Ramalan : ${resp.data.result.ramalan}\n➸ Nomor Keberuntungan : ${resp.data.result.nomorKeberuntungan}\n➸ Keuangan : ${resp.data.result.Keuangan}\n➸ Asmara : ${resp.data.result.Asmara}`
            kaguya.reply(from, anm2, id)
            limitAdd(serial)
        } catch(err) {
            console.log(err)
               await kaguya.reply(from, 'Maaf batas penggunaan hari ini sudah mencapai maksimal', id)
        }
           break
        case 'cekjodoh2':
            if(isReg(obj)) return
            if (isAfk) return await kaguya.reply(from, `Maaf ${pushname}, Kamu sedang afk! Ketik ${prefix}unafk untuk mematikan`,  id)
            if (!isGroupMsg) return kaguya.reply(from, 'Perintah ini hanya bisa di gunakan dalam group!', id)
            if (isLimit(serial)) return kaguya.reply(from, `Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik ${prefix}limit Untuk Mengecek Kuota Limit Kamu`, id)
            if (args.length === 0) return kaguya.reply(from, `Kirim perintah *${prefix}ramalpasangan [kamu|pasangan]*\nContoh : *${prefix}ramalpasangan kaguya|Elaina*`, id)
            argz = body.trim().split('|')
            if (argz.length >= 2) {
            kaguya.reply(from, `[WAIT] Sedang di proses⏳ silahkan tunggu ± 1 min!`, id)
            const kamu = argz[0]
            const pacar = argz[1]
            const rpmn = rate[Math.floor(Math.random() * (rate.length))]
            const rpmn2 = rate[Math.floor(Math.random() * (rate.length))]
            const rpmn3 = rate[Math.floor(Math.random() * (rate.length))]
            const rpmn4 = rate[Math.floor(Math.random() * (rate.length))]
            const rpmn5 = rate[Math.floor(Math.random() * (rate.length))]
            const rpmn6 = rate[Math.floor(Math.random() * (rate.length))]
            const rjh2 = `*Hasil Pengamatan!*\nPasangan dengan nama ${kamu} dan ${pacar}\n\n➸ Cinta : ${rpmn}\n➸ Jodoh : ${rpmn2}\n➸ Kemiripan : ${rpmn3}\n➸ Kesukaan : ${rpmn4}\n➸ Kesamaan : ${rpmn5}\n➸ Kebucinan ${rpmn6}`
            kaguya.reply(from, rjh2, id)
            limitAdd(serial)
            } else {
            await kaguya.reply(from, 'Wrong Format!', id)
            }
            break
		case 'cekjodoh':
            if(isReg(obj)) return
            if (isAfk) return await kaguya.reply(from, `Maaf ${pushname}, Kamu sedang afk! Ketik ${prefix}unafk untuk mematikan`,  id)
            if (args.length !== 2) return kaguya.reply(from, `Untuk mengecek jodoh melalui nama\nketik: ${prefix}cekjodoh nama-kamu nama-pasangan\n\ncontoh: ${prefix}cekjodoh bagas siti\n\nhanya bisa pakai nama panggilan (satu kata)`, id)
			kaguyaapi.cekjodoh(args[0],args[1])
			.then(async(res) => {
				await kaguya.sendFileFromUrl(from, `${res.link}`, '', `${res.text}`, id)
			})
			break
			
        // Random Kata
        case 'fakta':
            if(isReg(obj)) return
            if (isLimit(serial)) return kaguya.reply(from, `Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik ${prefix}limit Untuk Mengecek Kuota Limit Kamu`, id)
            
            await limitAdd(serial)
            fetch('https://raw.githubusercontent.com/Arugaz/grabbed-results/main/random/faktaunix.txt')
            .then(res => res.text())
            .then(body => {
                let splitnix = body.split('\n')
                let randomnix = splitnix[Math.floor(Math.random() * splitnix.length)]
                kaguya.reply(from, randomnix, id)
            })
            .catch(() => {
                kaguya.reply(from, 'Ada yang Error!', id)
            })
            break
	    case 'motivasi':
            if(isReg(obj)) return
            if (isAfk) return await kaguya.reply(from, `Maaf ${pushname}, Kamu sedang afk! Ketik ${prefix}unafk untuk mematikan`,  id)
            if (isLimit(serial)) return kaguya.reply(from, `Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik ${prefix}limit Untuk Mengecek Kuota Limit Kamu`, id)
            
            await limitAdd(serial)
            fetch('https://raw.githubusercontent.com/VideFrelan/motivasi/main/motivasi.txt')
            .then(res => res.text())
            .then(body => {
                let splitmotivasi = body.split('\n')
                let randommotivasi = splitmotivasi[Math.floor(Math.random() * splitmotivasi.length)]
                kaguya.reply(from, randommotivasi, id)
            })
            .catch(() => {
            kaguya.reply(from, 'Ada yang Error!', id)
            })
            break
        case 'random' :
        case 'quote' :
            if(isReg(obj)) return
            if (isLimit(serial)) return kaguya.reply(from, `Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik ${prefix}limit Untuk Mengecek Kuota Limit Kamu`, id)
            if (isAfk) return await kaguya.reply(from, `Maaf ${pushname}, Kamu sedang afk! Ketik ${prefix}unafk untuk mematikan`,  id)
            await limitAdd(serial)
            if (!isGroupMsg) return kaguya.reply(from, 'Perintah ini hanya bisa di gunakan dalam group!', id)
            if (isLimit(serial)) return kaguya.reply(from, `Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik ${prefix}limit Untuk Mengecek Kuota Limit Kamu`, id)
            
            await limitAdd(serial)
            kaguya.sendText(from, quotedd())
            break
        case 'qanime' :
            if(isReg(obj)) return
            if (isLimit(serial)) return kaguya.reply(from, `Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik ${prefix}limit Untuk Mengecek Kuota Limit Kamu`, id)
            if (isAfk) return await kaguya.reply(from, `Maaf ${pushname}, Kamu sedang afk! Ketik ${prefix}unafk untuk mematikan`,  id)
            await limitAdd(serial)
            if (!isGroupMsg) return kaguya.reply(from, 'Perintah ini hanya bisa di gunakan dalam group!', id)
            if (isLimit(serial)) return kaguya.reply(from, `Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik ${prefix}limit Untuk Mengecek Kuota Limit Kamu`, id)
            
            await limitAdd(serial)
            kaguya.sendText(from, qanimedd())
            break
        case 'katabijak':
            if(isReg(obj)) return
            if (isLimit(serial)) return kaguya.reply(from, `Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik ${prefix}limit Untuk Mengecek Kuota Limit Kamu`, id)
            if (isAfk) return await kaguya.reply(from, `Maaf ${pushname}, Kamu sedang afk! Ketik ${prefix}unafk untuk mematikan`,  id)
            await limitAdd(serial)
            fetch('https://raw.githubusercontent.com/Arugaz/grabbed-results/main/random/katabijax.txt')
            .then(res => res.text())
            .then(body => {
                let splitbijak = body.split('\n')
                let randombijak = splitbijak[Math.floor(Math.random() * splitbijak.length)]
                kaguya.reply(from, randombijak, id)
            })
            .catch(() => {
                kaguya.reply(from, 'Ada yang Error!', id)
            })
            break
        case 'pantun':
            if(isReg(obj)) return
            if (isLimit(serial)) return kaguya.reply(from, `Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik ${prefix}limit Untuk Mengecek Kuota Limit Kamu`, id)
            if (isAfk) return await kaguya.reply(from, `Maaf ${pushname}, Kamu sedang afk! Ketik ${prefix}unafk untuk mematikan`,  id)
            await limitAdd(serial)
            fetch('https://raw.githubusercontent.com/Arugaz/grabbed-results/main/random/pantun.txt')
            .then(res => res.text())
            .then(body => {
                let splitpantun = body.split('\n')
                let randompantun = splitpantun[Math.floor(Math.random() * splitpantun.length)]
                kaguya.reply(from, randompantun.replace(/aruga-line/g,"\n"), id)
            })
            .catch(() => {
                kaguya.reply(from, 'Ada yang Error!', id)
            })
            break
		case 'puisi':
            if(isReg(obj)) return
            if (isLimit(serial)) return kaguya.reply(from, `Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik ${prefix}limit Untuk Mengecek Kuota Limit Kamu`, id)
            if (isAfk) return await kaguya.reply(from, `Maaf ${pushname}, Kamu sedang afk! Ketik ${prefix}unafk untuk mematikan`,  id)
            await limitAdd(serial)
			kaguyaapi.puisi()
			.then(async (res) => {
				await kaguya.reply(from, res.result, id)
			})
			break

        //Random Images
        case 'anime':
            if(isReg(obj)) return
            if (isLimit(serial)) return kaguya.reply(from, `Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik ${prefix}limit Untuk Mengecek Kuota Limit Kamu`, id)
            if (isAfk) return await kaguya.reply(from, `Maaf ${pushname}, Kamu sedang afk! Ketik ${prefix}unafk untuk mematikan`,  id)
            await limitAdd(serial)
            if (args.length == 0) return kaguya.reply(from, `Untuk menggunakan ${prefix}anime\nSilahkan ketik: ${prefix}anime [query]\nContoh: ${prefix}anime random\n\nquery yang tersedia:\nrandom, waifu, husbu, neko`, id)
            if (args[0] == 'random' || args[0] == 'waifu' || args[0] == 'husbu' || args[0] == 'neko') {
                fetch('https://raw.githubusercontent.com/Arugaz/grabbed-results/main/random/anime/' + args[0] + '.txt')
                .then(res => res.text())
                .then(body => {
                    let randomnime = body.split('\n')
                    let randomnimex = randomnime[Math.floor(Math.random() * randomnime.length)]
                    kaguya.sendFileFromUrl(from, randomnimex, '', 'Nee..', id)
                })
                .catch(() => {
                    kaguya.reply(from, 'Ada yang Error!', id)
                })
            } else {
                kaguya.reply(from, `Maaf query tidak tersedia. Silahkan ketik ${prefix}anime untuk melihat list query`)
            }
            break
        case 'coffee':
            if(isReg(obj)) return
            if (isAfk) return await kaguya.reply(from, `Maaf ${pushname}, Kamu sedang afk! Ketik ${prefix}unafk untuk mematikan`,  id)
            if (isLimit(serial)) return kaguya.reply(from, `Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik ${prefix}limit Untuk Mengecek Kuota Limit Kamu`, id)
            await limitAdd(serial)
            axios.get('https://nekobot.xyz/api/image?type=coffee')
              .then(async(rest) => {
            kaguya.sendFileFromUrl(from, `${rest.data.message}`, ``, `Neh...Kopi` )
             .catch(() => {
            kaguya.reply(from, 'Sepertinya server sedang error', id)
                })
            })
           break
           case 'food':
            if(isReg(obj)) return
            if (isAfk) return await kaguya.reply(from, `Maaf ${pushname}, Kamu sedang afk! Ketik ${prefix}unafk untuk mematikan`,  id)
            if (isLimit(serial)) return kaguya.reply(from, `Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik ${prefix}limit Untuk Mengecek Kuota Limit Kamu`, id)
            await limitAdd(serial)
            axios.get('https://nekobot.xyz/api/image?type=food')
              .then(async(rest) => {
            kaguya.sendFileFromUrl(from, `${rest.data.message}`, ``, `Neh...Makanan`)
             .catch(() => {
            kaguya.reply(from, 'Sepertinya server sedang error', id)
                })
            })
           break
           case 'kanna':
            if(isReg(obj)) return
            if (isAfk) return await kaguya.reply(from, `Maaf ${pushname}, Kamu sedang afk! Ketik ${prefix}unafk untuk mematikan`,  id)
            if (isLimit(serial)) return kaguya.reply(from, `Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik ${prefix}limit Untuk Mengecek Kuota Limit Kamu`, id)
            await limitAdd(serial)
            axios.get('https://nekobot.xyz/api/image?type=kanna')
              .then(async(rest) => {
            kaguya.sendFileFromUrl(from, `${rest.data.message}`, ``, `Nih...` )
             .catch(() => {
            kaguya.reply(from, 'Sepertinya server sedang error', id)
                })
            })
           break
           case 'holo':
            if(isReg(obj)) return
            if (isAfk) return await kaguya.reply(from, `Maaf ${pushname}, Kamu sedang afk! Ketik ${prefix}unafk untuk mematikan`,  id)
            if (isLimit(serial)) return kaguya.reply(from, `Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik ${prefix}limit Untuk Mengecek Kuota Limit Kamu`, id)
            await limitAdd(serial)
            axios.get('https://nekobot.xyz/api/image?type=holo')
              .then(async(rest) => {
            kaguya.sendFileFromUrl(from, `${rest.data.message}`, ``, `Nih...`)
             .catch(() => {
            kaguya.reply(from, 'Sepertinya server sedang error', id)
                })
            })
           break
           case 'kemonomini':
            if(isReg(obj)) return
            if (isAfk) return await kaguya.reply(from, `Maaf ${pushname}, Kamu sedang afk! Ketik ${prefix}unafk untuk mematikan`,  id)
            if (isLimit(serial)) return kaguya.reply(from, `Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik ${prefix}limit Untuk Mengecek Kuota Limit Kamu`, id)
            await limitAdd(serial)
            axios.get('https://nekobot.xyz/api/image?type=kemonomimi')
              .then(async(rest) => {
            kaguya.sendFileFromUrl(from, `${rest.data.message}`, ``, `Nih...`)
             .catch(() => {
            kaguya.reply(from, 'Sepertinya server sedang error', id)
                })
            })
           break
          case 'neko':
            if(isReg(obj)) return
            if (isLimit(serial)) return kaguya.reply(from, `Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik ${prefix}limit Untuk Mengecek Kuota Limit Kamu`, id)
            if (isAfk) return await kaguya.reply(from, `Maaf ${pushname}, Kamu sedang afk! Ketik ${prefix}unafk untuk mematikan`,  id)
            await limitAdd(serial)
            q2 = Math.floor(Math.random() * 900) + 300;
            q3 = Math.floor(Math.random() * 900) + 300;
            kaguya.sendFileFromUrl(from, 'http://placekitten.com/'+q3+'/'+q2, 'neko.png','Neko ')
            break
        case 'wallanime' :
            if(isReg(obj)) return
            if (isLimit(serial)) return kaguya.reply(from, `Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik ${prefix}limit Untuk Mengecek Kuota Limit Kamu`, id)
            if (isAfk) return await kaguya.reply(from, `Maaf ${pushname}, Kamu sedang afk! Ketik ${prefix}unafk untuk mematikan`,  id)
            await limitAdd(serial)
            const walnime = ['https://wallpaperaccess.com/full/395986.jpg','https://wallpaperaccess.com/full/21628.jpg','https://wallpaperaccess.com/full/21622.jpg','https://wallpaperaccess.com/full/21612.jpg','https://wallpaperaccess.com/full/21611.png','https://wallpaperaccess.com/full/21597.jpg','https://cdn.nekos.life/wallpaper/QwGLg4oFkfY.png','https://wallpaperaccess.com/full/21591.jpg','https://cdn.nekos.life/wallpaper/bUzSjcYxZxQ.jpg','https://cdn.nekos.life/wallpaper/j49zxzaUcjQ.jpg','https://cdn.nekos.life/wallpaper/YLTH5KuvGX8.png','https://cdn.nekos.life/wallpaper/Xi6Edg133m8.jpg','https://cdn.nekos.life/wallpaper/qvahUaFIgUY.png','https://cdn.nekos.life/wallpaper/leC8q3u8BSk.jpg','https://cdn.nekos.life/wallpaper/tSUw8s04Zy0.jpg','https://cdn.nekos.life/wallpaper/sqsj3sS6EJE.png','https://cdn.nekos.life/wallpaper/HmjdX_s4PU4.png','https://cdn.nekos.life/wallpaper/Oe2lKgLqEXY.jpg','https://cdn.nekos.life/wallpaper/GTwbUYI-xTc.jpg','https://cdn.nekos.life/wallpaper/nn_nA8wTeP0.png','https://cdn.nekos.life/wallpaper/Q63o6v-UUa8.png','https://cdn.nekos.life/wallpaper/ZXLFm05K16Q.jpg','https://cdn.nekos.life/wallpaper/cwl_1tuUPuQ.png','https://cdn.nekos.life/wallpaper/wWhtfdbfAgM.jpg','https://cdn.nekos.life/wallpaper/3pj0Xy84cPg.jpg','https://cdn.nekos.life/wallpaper/sBoo8_j3fkI.jpg','https://cdn.nekos.life/wallpaper/gCUl_TVizsY.png','https://cdn.nekos.life/wallpaper/LmTi1k9REW8.jpg','https://cdn.nekos.life/wallpaper/sbq_4WW2PUM.jpg','https://cdn.nekos.life/wallpaper/QOSUXEbzDQA.png','https://cdn.nekos.life/wallpaper/khaqGIHsiqk.jpg','https://cdn.nekos.life/wallpaper/iFtEXugqQgA.png','https://cdn.nekos.life/wallpaper/deFKIDdRe1I.jpg','https://cdn.nekos.life/wallpaper/OHZVtvDm0gk.jpg','https://cdn.nekos.life/wallpaper/YZYa00Hp2mk.jpg','https://cdn.nekos.life/wallpaper/R8nPIKQKo9g.png','https://cdn.nekos.life/wallpaper/_brn3qpRBEE.jpg','https://cdn.nekos.life/wallpaper/ADTEQdaHhFI.png','https://cdn.nekos.life/wallpaper/MGvWl6om-Fw.jpg','https://cdn.nekos.life/wallpaper/YGmpjZW3AoQ.jpg','https://cdn.nekos.life/wallpaper/hNCgoY-mQPI.jpg','https://cdn.nekos.life/wallpaper/3db40hylKs8.png','https://cdn.nekos.life/wallpaper/iQ2FSo5nCF8.jpg','https://cdn.nekos.life/wallpaper/meaSEfeq9QM.png','https://cdn.nekos.life/wallpaper/CmEmn79xnZU.jpg','https://cdn.nekos.life/wallpaper/MAL18nB-yBI.jpg','https://cdn.nekos.life/wallpaper/FUuBi2xODuI.jpg','https://cdn.nekos.life/wallpaper/ez-vNNuk6Ck.jpg','https://cdn.nekos.life/wallpaper/K4-z0Bc0Vpc.jpg','https://cdn.nekos.life/wallpaper/Y4JMbswrNg8.jpg','https://cdn.nekos.life/wallpaper/ffbPXIxt4-0.png','https://cdn.nekos.life/wallpaper/x63h_W8KFL8.jpg','https://cdn.nekos.life/wallpaper/lktzjDRhWyg.jpg','https://cdn.nekos.life/wallpaper/j7oQtvRZBOI.jpg','https://cdn.nekos.life/wallpaper/MQQEAD7TUpQ.png','https://cdn.nekos.life/wallpaper/lEG1-Eeva6Y.png','https://cdn.nekos.life/wallpaper/Loh5wf0O5Aw.png','https://cdn.nekos.life/wallpaper/yO6ioREenLA.png','https://cdn.nekos.life/wallpaper/4vKWTVgMNDc.jpg','https://cdn.nekos.life/wallpaper/Yk22OErU8eg.png','https://cdn.nekos.life/wallpaper/Y5uf1hsnufE.png','https://cdn.nekos.life/wallpaper/xAmBpMUd2Zw.jpg','https://cdn.nekos.life/wallpaper/f_RWFoWciRE.jpg','https://cdn.nekos.life/wallpaper/Y9qjP2Y__PA.jpg','https://cdn.nekos.life/wallpaper/eqEzgohpPwc.jpg','https://cdn.nekos.life/wallpaper/s1MBos_ZGWo.jpg','https://cdn.nekos.life/wallpaper/PtW0or_Pa9c.png','https://cdn.nekos.life/wallpaper/32EAswpy3M8.png','https://cdn.nekos.life/wallpaper/Z6eJZf5xhcE.png','https://cdn.nekos.life/wallpaper/xdiSF731IFY.jpg','https://cdn.nekos.life/wallpaper/Y9r9trNYadY.png','https://cdn.nekos.life/wallpaper/8bH8CXn-sOg.jpg','https://cdn.nekos.life/wallpaper/a02DmIFzRBE.png','https://cdn.nekos.life/wallpaper/MnrbXcPa7Oo.png','https://cdn.nekos.life/wallpaper/s1Tc9xnugDk.jpg','https://cdn.nekos.life/wallpaper/zRqEx2gnfmg.jpg','https://cdn.nekos.life/wallpaper/PtW0or_Pa9c.png','https://cdn.nekos.life/wallpaper/0ECCRW9soHM.jpg','https://cdn.nekos.life/wallpaper/kAw8QHl_wbM.jpg','https://cdn.nekos.life/wallpaper/ZXcaFmpOlLk.jpg','https://cdn.nekos.life/wallpaper/WVEdi9Ng8UE.png','https://cdn.nekos.life/wallpaper/IRu29rNgcYU.png','https://cdn.nekos.life/wallpaper/LgIJ_1AL3rM.jpg','https://cdn.nekos.life/wallpaper/DVD5_fLJEZA.jpg','https://cdn.nekos.life/wallpaper/siqOQ7k8qqk.jpg','https://cdn.nekos.life/wallpaper/CXNX_15eGEQ.png','https://cdn.nekos.life/wallpaper/s62tGjOTHnk.jpg','https://cdn.nekos.life/wallpaper/tmQ5ce6EfJE.png','https://cdn.nekos.life/wallpaper/Zju7qlBMcQ4.jpg','https://cdn.nekos.life/wallpaper/CPOc_bMAh2Q.png','https://cdn.nekos.life/wallpaper/Ew57S1KtqsY.jpg','https://cdn.nekos.life/wallpaper/hVpFbYJmZZc.jpg','https://cdn.nekos.life/wallpaper/sb9_J28pftY.jpg','https://cdn.nekos.life/wallpaper/JDoIi_IOB04.jpg','https://cdn.nekos.life/wallpaper/rG76AaUZXzk.jpg','https://cdn.nekos.life/wallpaper/9ru2luBo360.png','https://cdn.nekos.life/wallpaper/ghCgiWFxGwY.png','https://cdn.nekos.life/wallpaper/OSR-i-Rh7ZY.png','https://cdn.nekos.life/wallpaper/65VgtPyweCc.jpg','https://cdn.nekos.life/wallpaper/3vn-0FkNSbM.jpg','https://cdn.nekos.life/wallpaper/u02Y0-AJPL0.jpg','https://cdn.nekos.life/wallpaper/_-Z-0fGflRc.jpg','https://cdn.nekos.life/wallpaper/3VjNKqEPp58.jpg','https://cdn.nekos.life/wallpaper/NoG4lKnk6Sc.jpg','https://cdn.nekos.life/wallpaper/xiTxgRMA_IA.jpg','https://cdn.nekos.life/wallpaper/yq1ZswdOGpg.png','https://cdn.nekos.life/wallpaper/4SUxw4M3UMA.png','https://cdn.nekos.life/wallpaper/cUPnQOHNLg0.jpg','https://cdn.nekos.life/wallpaper/zczjuLWRisA.jpg','https://cdn.nekos.life/wallpaper/TcxvU_diaC0.png','https://cdn.nekos.life/wallpaper/7qqWhEF_uoY.jpg','https://cdn.nekos.life/wallpaper/J4t_7DvoUZw.jpg','https://cdn.nekos.life/wallpaper/xQ1Pg5D6J4U.jpg','https://cdn.nekos.life/wallpaper/aIMK5Ir4xho.jpg','https://cdn.nekos.life/wallpaper/6gneEXrNAWU.jpg','https://cdn.nekos.life/wallpaper/PSvNdoISWF8.jpg','https://cdn.nekos.life/wallpaper/SjgF2-iOmV8.jpg','https://cdn.nekos.life/wallpaper/vU54ikOVY98.jpg','https://cdn.nekos.life/wallpaper/QjnfRwkRU-Q.jpg','https://cdn.nekos.life/wallpaper/uSKqzz6ZdXc.png','https://cdn.nekos.life/wallpaper/AMrcxZOnVBE.jpg','https://cdn.nekos.life/wallpaper/N1l8SCMxamE.jpg','https://cdn.nekos.life/wallpaper/n2cBaTo-J50.png','https://cdn.nekos.life/wallpaper/ZXcaFmpOlLk.jpg','https://cdn.nekos.life/wallpaper/7bwxy3elI7o.png','https://cdn.nekos.life/wallpaper/7VW4HwF6LcM.jpg','https://cdn.nekos.life/wallpaper/YtrPAWul1Ug.png','https://cdn.nekos.life/wallpaper/1p4_Mmq95Ro.jpg','https://cdn.nekos.life/wallpaper/EY5qz5iebJw.png','https://cdn.nekos.life/wallpaper/aVDS6iEAIfw.jpg','https://cdn.nekos.life/wallpaper/veg_xpHQfjE.jpg','https://cdn.nekos.life/wallpaper/meaSEfeq9QM.png','https://cdn.nekos.life/wallpaper/Xa_GtsKsy-s.png','https://cdn.nekos.life/wallpaper/6Bx8R6D75eM.png','https://cdn.nekos.life/wallpaper/zXOGXH_b8VY.png','https://cdn.nekos.life/wallpaper/VQcviMxoQ00.png','https://cdn.nekos.life/wallpaper/CJnRl-PKWe8.png','https://cdn.nekos.life/wallpaper/zEWYfFL_Ero.png','https://cdn.nekos.life/wallpaper/_C9Uc5MPaz4.png','https://cdn.nekos.life/wallpaper/zskxNqNXyG0.jpg','https://cdn.nekos.life/wallpaper/g7w14PjzzcQ.jpg','https://cdn.nekos.life/wallpaper/KavYXR_GRB4.jpg','https://cdn.nekos.life/wallpaper/Z_r9WItzJBc.jpg','https://cdn.nekos.life/wallpaper/Qps-0JD6834.jpg','https://cdn.nekos.life/wallpaper/Ri3CiJIJ6M8.png','https://cdn.nekos.life/wallpaper/ArGYIpJwehY.jpg','https://cdn.nekos.life/wallpaper/uqYKeYM5h8w.jpg','https://cdn.nekos.life/wallpaper/h9cahfuKsRg.jpg','https://cdn.nekos.life/wallpaper/iNPWKO8d2a4.jpg','https://cdn.nekos.life/wallpaper/j2KoFVhsNig.jpg','https://cdn.nekos.life/wallpaper/z5Nc-aS6QJ4.jpg','https://cdn.nekos.life/wallpaper/VUFoK8l1qs0.png','https://cdn.nekos.life/wallpaper/rQ8eYh5mXN8.png','https://cdn.nekos.life/wallpaper/D3NxNISDavQ.png','https://cdn.nekos.life/wallpaper/Z_CiozIenrU.jpg','https://cdn.nekos.life/wallpaper/np8rpfZflWE.jpg','https://cdn.nekos.life/wallpaper/ED-fgS09gik.jpg','https://cdn.nekos.life/wallpaper/AB0Cwfs1X2w.jpg','https://cdn.nekos.life/wallpaper/DZBcYfHouiI.jpg','https://cdn.nekos.life/wallpaper/lC7pB-GRAcQ.png','https://cdn.nekos.life/wallpaper/zrI-sBSt2zE.png','https://cdn.nekos.life/wallpaper/_RJhylwaCLk.jpg','https://cdn.nekos.life/wallpaper/6km5m_GGIuw.png','https://cdn.nekos.life/wallpaper/3db40hylKs8.png','https://cdn.nekos.life/wallpaper/oggceF06ONQ.jpg','https://cdn.nekos.life/wallpaper/ELdH2W5pQGo.jpg','https://cdn.nekos.life/wallpaper/Zun_n5pTMRE.png','https://cdn.nekos.life/wallpaper/VqhFKG5U15c.png','https://cdn.nekos.life/wallpaper/NsMoiW8JZ60.jpg','https://cdn.nekos.life/wallpaper/XE4iXbw__Us.png','https://cdn.nekos.life/wallpaper/a9yXhS2zbhU.jpg','https://cdn.nekos.life/wallpaper/jjnd31_3Ic8.jpg','https://cdn.nekos.life/wallpaper/Nxanxa-xO3s.png','https://cdn.nekos.life/wallpaper/dBHlPcbuDc4.jpg','https://cdn.nekos.life/wallpaper/6wUZIavGVQU.jpg','https://cdn.nekos.life/wallpaper/_-Z-0fGflRc.jpg','https://cdn.nekos.life/wallpaper/H9OUpIrF4gU.jpg','https://cdn.nekos.life/wallpaper/xlRdH3fBMz4.jpg','https://cdn.nekos.life/wallpaper/7IzUIeaae9o.jpg','https://cdn.nekos.life/wallpaper/FZCVL6PyWq0.jpg','https://cdn.nekos.life/wallpaper/5dG-HH6d0yw.png','https://cdn.nekos.life/wallpaper/ddxyA37HiwE.png','https://cdn.nekos.life/wallpaper/I0oj_jdCD4k.jpg','https://cdn.nekos.life/wallpaper/ABchTV97_Ts.png','https://cdn.nekos.life/wallpaper/58C37kkq39Y.png','https://cdn.nekos.life/wallpaper/HMS5mK7WSGA.jpg','https://cdn.nekos.life/wallpaper/1O3Yul9ojS8.jpg','https://cdn.nekos.life/wallpaper/hdZI1XsYWYY.jpg','https://cdn.nekos.life/wallpaper/h8pAJJnBXZo.png','https://cdn.nekos.life/wallpaper/apO9K9JIUp8.jpg','https://cdn.nekos.life/wallpaper/p8f8IY_2mwg.jpg','https://cdn.nekos.life/wallpaper/HY1WIB2r_cE.jpg','https://cdn.nekos.life/wallpaper/u02Y0-AJPL0.jpg','https://cdn.nekos.life/wallpaper/jzN74LcnwE8.png','https://cdn.nekos.life/wallpaper/IeAXo5nJhjw.jpg','https://cdn.nekos.life/wallpaper/7lgPyU5fuLY.jpg','https://cdn.nekos.life/wallpaper/f8SkRWzXVxk.png','https://cdn.nekos.life/wallpaper/ZmDTpGGeMR8.jpg','https://cdn.nekos.life/wallpaper/AMrcxZOnVBE.jpg','https://cdn.nekos.life/wallpaper/ZhP-f8Icmjs.jpg','https://cdn.nekos.life/wallpaper/7FyUHX3fE2o.jpg','https://cdn.nekos.life/wallpaper/CZoSLK-5ng8.png','https://cdn.nekos.life/wallpaper/pSNDyxP8l3c.png','https://cdn.nekos.life/wallpaper/AhYGHF6Fpck.jpg','https://cdn.nekos.life/wallpaper/ic6xRRptRes.jpg','https://cdn.nekos.life/wallpaper/89MQq6KaggI.png','https://cdn.nekos.life/wallpaper/y1DlFeHHTEE.png']
            let walnimek = walnime[Math.floor(Math.random() * walnime.length)]
            kaguya.sendFileFromUrl(from, walnimek, 'Nih.jpg', '', message.id)
            break
        case 'kiss':
            if(isReg(obj)) return
            if (isAfk) return await kaguya.reply(from, `Maaf ${pushname}, Kamu sedang afk! Ketik ${prefix}unafk untuk mematikan`,  id)
            axios.get('https://neko-love.xyz/api/v1/kiss')
            .then(async(rest) => {
            kaguya.sendFileFromUrl(from, rest.data.url)
            .catch(() => {
            kaguya.reply(from, 'Sepertinya server sedang error', id)
              })
            })
         break
        case 'hug':
            if(isReg(obj)) return
            if (isAfk) return await kaguya.reply(from, `Maaf ${pushname}, Kamu sedang afk! Ketik ${prefix}unafk untuk mematikan`,  id)
            axios.get('https://neko-love.xyz/api/v1/hug')
            .then(async(rest) => {
            kaguya.sendFileFromUrl(from, rest.data.url)
            .catch(() => {
            kaguya.reply(from, 'Sepertinya server sedang error', id)
              })
            })
         break
        case 'shota':
            if(isReg(obj)) return
            if (isAfk) return await kaguya.reply(from, `Maaf ${pushname}, Kamu sedang afk! Ketik ${prefix}unafk untuk mematikan`,  id)
            if (!isGroupMsg) return kaguya.reply(from, 'Perintah ini hanya bisa di gunakan dalam group!', id)
            if (isLimit(serial)) return kaguya.reply(from, `Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik ${prefix}limit Untuk Mengecek Kuota Limit Kamu`, id)
            const ibase64 = require('image-to-base64')
            var shouta = ['shota anime','anime shota'];
            var shotaa = shouta[Math.floor(Math.random() * shouta.length)];
            var urlshot = "https://api.fdci.se/rep.php?gambar=" + shotaa;
            axios.get(urlshot)
            .then((result) => {
            var sht = JSON.parse(JSON.stringify(result.data));
            var shotaak =  sht[Math.floor(Math.random() * sht.length)];
            ibase64(shotaak)
            .then(
                (response) => {
            let img = 'data:image/jpeg;base64,'+response
            kaguya.sendFile(from, img, "shota.jpg", `*SHOTA*`, id)
            limitAdd(serial)
                    }) 
                .catch(
                    (error) => {
                        console.log(error);
                    })
            })
            break
        case 'rubah' :
            if(isReg(obj)) return
            if (isLimit(serial)) return kaguya.reply(from, `Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik ${prefix}limit Untuk Mengecek Kuota Limit Kamu`, id)
            if (isAfk) return await kaguya.reply(from, `Maaf ${pushname}, Kamu sedang afk! Ketik ${prefix}unafk untuk mematikan`,  id)
            await limitAdd(serial)
            const fox = ['https://tinyurl.com/yyb9skqp','https://tinyurl.com/y4pj6v6t','https://tinyurl.com/y2kye7cw','https://tinyurl.com/yxh23xjf','https://tinyurl.com/yytyj5na','https://tinyurl.com/y4deb3te','https://tinyurl.com/y4s63sns','https://tinyurl.com/y57g8jp8','https://tinyurl.com/y4ewgw9d','https://tinyurl.com/y2xrxt6o','https://tinyurl.com/y2kxwkvf','https://tinyurl.com/y6fznobn','https://tinyurl.com/y3f9qkye']
            let fod = fox[Math.floor(Math.random() * fox.length)]
            kaguya.sendFileFromUrl(from, fod, 'Nih.jpg', '', message.id)
            break
        case 'cogan':
            if(isReg(obj)) return
            if (isAfk) return await kaguya.reply(from, `Maaf ${pushname}, Kamu sedang afk! Ketik ${prefix}unafk untuk mematikan`,  id)
            if (!isGroupMsg) return kaguya.reply(from, 'Perintah ini hanya bisa di gunakan dalam group!', id)
            if (isLimit(serial)) return kaguya.reply(from, `Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik ${prefix}limit Untuk Mengecek Kuota Limit Kamu`, id)
            const Base64 = require('image-to-base64')
            var ite = ["cowo ganteng", "cogan", "korean boy", "chinese boy", "japan boy", "cowok indo ganteng", "cowok korea"];
            var cog = ite[Math.floor(Math.random() * ite.length)];
            var urlshot = "https://api.fdci.se/rep.php?gambar=" + cog;
            axios.get(urlshot)
            .then((result) => {
            var coga = JSON.parse(JSON.stringify(result.data));
            var coc =  coga[Math.floor(Math.random() * coga.length)];
            Base64(coc)
            .then(
                (response) => {
            let img = 'data:image/jpeg;base64,'+response
            kaguya.sendFile(from, img, "COGAN.jpg", `*Nih...*`, id)
            limitAdd(serial)
                    }) 
                .catch(
                    (error) => {
                        console.log(error);
                    })
            })
            break
        case 'cecan':
            if(isReg(obj)) return
            if (isAfk) return await kaguya.reply(from, `Maaf ${pushname}, Kamu sedang afk! Ketik ${prefix}unafk untuk mematikan`,  id)
            if (!isGroupMsg) return kaguya.reply(from, 'Perintah ini hanya bisa di gunakan dalam group!', id)
            if (isLimit(serial)) return kaguya.reply(from, `Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik ${prefix}limit Untuk Mengecek Kuota Limit Kamu`, id)
            const ase64 = require('image-to-base64')
            var item = ["ullzang girl", "cewe cantik", "hijab cantik", "korean girl", "remaja cantik", "cewek korea", "cewek jepang"];
            var cec = item[Math.floor(Math.random() * item.length)];
            var urlshot = "https://api.fdci.se/rep.php?gambar=" + cec;
            axios.get(urlshot)
            .then((result) => {
            var cewi = JSON.parse(JSON.stringify(result.data));
            var cank =  cewi[Math.floor(Math.random() * cewi.length)];
            ase64(cank)
            .then(
                (response) => {
            let img = 'data:image/jpeg;base64,'+response
            kaguya.sendFile(from, img, "CECAN.jpg", `*Nih...*`, id)
            limitAdd(serial)
                    }) 
                .catch(
                    (error) => {
                        console.log(error);
                    })
            })
            break
        case 'sadnime':
            if(isReg(obj)) return
            if (isAfk) return await kaguya.reply(from, `Maaf ${pushname}, Kamu sedang afk! Ketik ${prefix}unafk untuk mematikan`,  id)
            if (!isGroupMsg) return kaguya.reply(from, 'Perintah ini hanya bisa di gunakan dalam group!', id)
            if (isLimit(serial)) return kaguya.reply(from, `Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik ${prefix}limit Untuk Mengecek Kuota Limit Kamu`, id)
            const TBase64 = require('image-to-base64')
            var sad = ['Anime Sad','Sad Anime','sad boy','anime fake smile'];
            var lsad = sad[Math.floor(Math.random() * sad.length)];
            var urlshot = "https://api.fdci.se/rep.php?gambar=" + lsad;
            axios.get(urlshot)
            .then((result) => {
            var lsadi = JSON.parse(JSON.stringify(result.data));
            var lsadk =  lsadi[Math.floor(Math.random() * lsadi.length)];
            TBase64(lsadk)
            .then(
                (response) => {
            let img = 'data:image/jpeg;base64,'+response
            kaguya.sendFile(from, img, "SadBoy.jpg", `*ANIME SAD*`, id)
            limitAdd(serial)
                    }) 
                .catch(
                    (error) => {
                        console.log(error);
                    })
            })
            break
        case 'loli':
            if(isReg(obj)) return
            if (isAfk) return await kaguya.reply(from, `Maaf ${pushname}, Kamu sedang afk! Ketik ${prefix}unafk untuk mematikan`,  id)
            if (!isGroupMsg) return kaguya.reply(from, 'Perintah ini hanya bisa di gunakan dalam group!', id)
            if (isLimit(serial)) return kaguya.reply(from, `Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik ${prefix}limit Untuk Mengecek Kuota Limit Kamu`, id)
            const ToBase64 = require('image-to-base64')
            var lol = ['loli','anime loli','loli anime'];
            var lolii = lol[Math.floor(Math.random() * lol.length)];
            var urlshot = "https://api.fdci.se/rep.php?gambar=" + lolii;
            axios.get(urlshot)
            .then((result) => {
            var lli = JSON.parse(JSON.stringify(result.data));
            var loliik =  lli[Math.floor(Math.random() * lli.length)];
            ToBase64(loliik)
            .then(
                (response) => {
            let img = 'data:image/jpeg;base64,'+response
            kaguya.sendFile(from, img, "loli.jpg", `*LOLI*`, id)
            limitAdd(serial)
                    }) 
                .catch(
                    (error) => {
                        console.log(error);
                    })
            })
            break
        case 'pokemon':
            if (isAfk) return await kaguya.reply(from, `Maaf ${pushname}, Kamu sedang afk! Ketik ${prefix}unafk untuk mematikan`,  id)
            if(isReg(obj)) return
            if (isLimit(serial)) return kaguya.reply(from, `Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik ${prefix}limit Untuk Mengecek Kuota Limit Kamu`, id)
            
            await limitAdd(serial)
            q7 = Math.floor(Math.random() * 890) + 1;
            kaguya.sendFileFromUrl(from, 'https://assets.pokemon.com/assets/cms2/img/pokedex/full/'+q7+'.png','Pokemon.png',)
            break
         case 'inu':
            if (isAfk) return await kaguya.reply(from, `Maaf ${pushname}, Kamu sedang afk! Ketik ${prefix}unafk untuk mematikan`,  id)
            if(isReg(obj)) return
            if (isLimit(serial)) return kaguya.reply(from, `Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik ${prefix}limit Untuk Mengecek Kuota Limit Kamu`, id)
            if (isAfk) return await kaguya.reply(from, `Maaf ${pushname}, Kamu sedang afk! Ketik ${prefix}unafk untuk mematikan`,  id)
            await limitAdd(serial)
            const list = ["https://cdn.shibe.online/shibes/247d0ac978c9de9d9b66d72dbdc65f2dac64781d.jpg","https://cdn.shibe.online/shibes/1cf322acb7d74308995b04ea5eae7b520e0eae76.jpg","https://cdn.shibe.online/shibes/1ce955c3e49ae437dab68c09cf45297d68773adf.jpg","https://cdn.shibe.online/shibes/ec02bee661a797518d37098ab9ad0c02da0b05c3.jpg","https://cdn.shibe.online/shibes/1e6102253b51fbc116b887e3d3cde7b5c5083542.jpg","https://cdn.shibe.online/shibes/f0c07a7205d95577861eee382b4c8899ac620351.jpg","https://cdn.shibe.online/shibes/3eaf3b7427e2d375f09fc883f94fa8a6d4178a0a.jpg","https://cdn.shibe.online/shibes/c8b9fcfde23aee8d179c4c6f34d34fa41dfaffbf.jpg","https://cdn.shibe.online/shibes/55f298bc16017ed0aeae952031f0972b31c959cb.jpg","https://cdn.shibe.online/shibes/2d5dfe2b0170d5de6c8bc8a24b8ad72449fbf6f6.jpg","https://cdn.shibe.online/shibes/e9437de45e7cddd7d6c13299255e06f0f1d40918.jpg","https://cdn.shibe.online/shibes/6c32141a0d5d089971d99e51fd74207ff10751e7.jpg","https://cdn.shibe.online/shibes/028056c9f23ff40bc749a95cc7da7a4bb734e908.jpg","https://cdn.shibe.online/shibes/4fb0c8b74dbc7653e75ec1da597f0e7ac95fe788.jpg","https://cdn.shibe.online/shibes/125563d2ab4e520aaf27214483e765db9147dcb3.jpg","https://cdn.shibe.online/shibes/ea5258fad62cebe1fedcd8ec95776d6a9447698c.jpg","https://cdn.shibe.online/shibes/5ef2c83c2917e2f944910cb4a9a9b441d135f875.jpg","https://cdn.shibe.online/shibes/6d124364f02944300ae4f927b181733390edf64e.jpg","https://cdn.shibe.online/shibes/92213f0c406787acd4be252edb5e27c7e4f7a430.jpg","https://cdn.shibe.online/shibes/40fda0fd3d329be0d92dd7e436faa80db13c5017.jpg","https://cdn.shibe.online/shibes/e5c085fc427528fee7d4c3935ff4cd79af834a82.jpg","https://cdn.shibe.online/shibes/f83fa32c0da893163321b5cccab024172ddbade1.jpg","https://cdn.shibe.online/shibes/4aa2459b7f411919bf8df1991fa114e47b802957.jpg","https://cdn.shibe.online/shibes/2ef54e174f13e6aa21bb8be3c7aec2fdac6a442f.jpg","https://cdn.shibe.online/shibes/fa97547e670f23440608f333f8ec382a75ba5d94.jpg","https://cdn.shibe.online/shibes/fb1b7150ed8eb4ffa3b0e61ba47546dd6ee7d0dc.jpg","https://cdn.shibe.online/shibes/abf9fb41d914140a75d8bf8e05e4049e0a966c68.jpg","https://cdn.shibe.online/shibes/f63e3abe54c71cc0d0c567ebe8bce198589ae145.jpg","https://cdn.shibe.online/shibes/4c27b7b2395a5d051b00691cc4195ef286abf9e1.jpg","https://cdn.shibe.online/shibes/00df02e302eac0676bb03f41f4adf2b32418bac8.jpg","https://cdn.shibe.online/shibes/4deaac9baec39e8a93889a84257338ebb89eca50.jpg","https://cdn.shibe.online/shibes/199f8513d34901b0b20a33758e6ee2d768634ebb.jpg","https://cdn.shibe.online/shibes/f3efbf7a77e5797a72997869e8e2eaa9efcdceb5.jpg","https://cdn.shibe.online/shibes/39a20ccc9cdc17ea27f08643b019734453016e68.jpg","https://cdn.shibe.online/shibes/e67dea458b62cf3daa4b1e2b53a25405760af478.jpg","https://cdn.shibe.online/shibes/0a892f6554c18c8bcdab4ef7adec1387c76c6812.jpg","https://cdn.shibe.online/shibes/1b479987674c9b503f32e96e3a6aeca350a07ade.jpg","https://cdn.shibe.online/shibes/0c80fc00d82e09d593669d7cce9e273024ba7db9.jpg","https://cdn.shibe.online/shibes/bbc066183e87457b3143f71121fc9eebc40bf054.jpg","https://cdn.shibe.online/shibes/0932bf77f115057c7308ef70c3de1de7f8e7c646.jpg","https://cdn.shibe.online/shibes/9c87e6bb0f3dc938ce4c453eee176f24636440e0.jpg","https://cdn.shibe.online/shibes/0af1bcb0b13edf5e9b773e34e54dfceec8fa5849.jpg","https://cdn.shibe.online/shibes/32cf3f6eac4673d2e00f7360753c3f48ed53c650.jpg","https://cdn.shibe.online/shibes/af94d8eeb0f06a0fa06f090f404e3bbe86967949.jpg","https://cdn.shibe.online/shibes/4b55e826553b173c04c6f17aca8b0d2042d309fb.jpg","https://cdn.shibe.online/shibes/a0e53593393b6c724956f9abe0abb112f7506b7b.jpg","https://cdn.shibe.online/shibes/7eba25846f69b01ec04de1cae9fed4b45c203e87.jpg","https://cdn.shibe.online/shibes/fec6620d74bcb17b210e2cedca72547a332030d0.jpg","https://cdn.shibe.online/shibes/26cf6be03456a2609963d8fcf52cc3746fcb222c.jpg","https://cdn.shibe.online/shibes/c41b5da03ad74b08b7919afc6caf2dd345b3e591.jpg","https://cdn.shibe.online/shibes/7a9997f817ccdabac11d1f51fac563242658d654.jpg","https://cdn.shibe.online/shibes/7221241bad7da783c3c4d84cfedbeb21b9e4deea.jpg","https://cdn.shibe.online/shibes/283829584e6425421059c57d001c91b9dc86f33b.jpg","https://cdn.shibe.online/shibes/5145c9d3c3603c9e626585cce8cffdfcac081b31.jpg","https://cdn.shibe.online/shibes/b359c891e39994af83cf45738b28e499cb8ffe74.jpg","https://cdn.shibe.online/shibes/0b77f74a5d9afaa4b5094b28a6f3ee60efcb3874.jpg","https://cdn.shibe.online/shibes/adccfdf7d4d3332186c62ed8eb254a49b889c6f9.jpg","https://cdn.shibe.online/shibes/3aac69180f777512d5dabd33b09f531b7a845331.jpg","https://cdn.shibe.online/shibes/1d25e4f592db83039585fa480676687861498db8.jpg","https://cdn.shibe.online/shibes/d8349a2436420cf5a89a0010e91bf8dfbdd9d1cc.jpg","https://cdn.shibe.online/shibes/eb465ef1906dccd215e7a243b146c19e1af66c67.jpg","https://cdn.shibe.online/shibes/3d14e3c32863195869e7a8ba22229f457780008b.jpg","https://cdn.shibe.online/shibes/79cedc1a08302056f9819f39dcdf8eb4209551a3.jpg","https://cdn.shibe.online/shibes/4440aa827f88c04baa9c946f72fc688a34173581.jpg","https://cdn.shibe.online/shibes/94ea4a2d4b9cb852e9c1ff599f6a4acfa41a0c55.jpg","https://cdn.shibe.online/shibes/f4478196e441aef0ada61bbebe96ac9a573b2e5d.jpg","https://cdn.shibe.online/shibes/96d4db7c073526a35c626fc7518800586fd4ce67.jpg","https://cdn.shibe.online/shibes/196f3ed10ee98557328c7b5db98ac4a539224927.jpg","https://cdn.shibe.online/shibes/d12b07349029ca015d555849bcbd564d8b69fdbf.jpg","https://cdn.shibe.online/shibes/80fba84353000476400a9849da045611a590c79f.jpg","https://cdn.shibe.online/shibes/94cb90933e179375608c5c58b3d8658ef136ad3c.jpg","https://cdn.shibe.online/shibes/8447e67b5d622ef0593485316b0c87940a0ef435.jpg","https://cdn.shibe.online/shibes/c39a1d83ad44d2427fc8090298c1062d1d849f7e.jpg","https://cdn.shibe.online/shibes/6f38b9b5b8dbf187f6e3313d6e7583ec3b942472.jpg","https://cdn.shibe.online/shibes/81a2cbb9a91c6b1d55dcc702cd3f9cfd9a111cae.jpg","https://cdn.shibe.online/shibes/f1f6ed56c814bd939645138b8e195ff392dfd799.jpg","https://cdn.shibe.online/shibes/204a4c43cfad1cdc1b76cccb4b9a6dcb4a5246d8.jpg","https://cdn.shibe.online/shibes/9f34919b6154a88afc7d001c9d5f79b2e465806f.jpg","https://cdn.shibe.online/shibes/6f556a64a4885186331747c432c4ef4820620d14.jpg","https://cdn.shibe.online/shibes/bbd18ae7aaf976f745bc3dff46b49641313c26a9.jpg","https://cdn.shibe.online/shibes/6a2b286a28183267fca2200d7c677eba73b1217d.jpg","https://cdn.shibe.online/shibes/06767701966ed64fa7eff2d8d9e018e9f10487ee.jpg","https://cdn.shibe.online/shibes/7aafa4880b15b8f75d916b31485458b4a8d96815.jpg","https://cdn.shibe.online/shibes/b501169755bcf5c1eca874ab116a2802b6e51a2e.jpg","https://cdn.shibe.online/shibes/a8989bad101f35cf94213f17968c33c3031c16fc.jpg","https://cdn.shibe.online/shibes/f5d78feb3baa0835056f15ff9ced8e3c32bb07e8.jpg","https://cdn.shibe.online/shibes/75db0c76e86fbcf81d3946104c619a7950e62783.jpg","https://cdn.shibe.online/shibes/8ac387d1b252595bbd0723a1995f17405386b794.jpg","https://cdn.shibe.online/shibes/4379491ef4662faa178f791cc592b52653fb24b3.jpg","https://cdn.shibe.online/shibes/4caeee5f80add8c3db9990663a356e4eec12fc0a.jpg","https://cdn.shibe.online/shibes/99ef30ea8bb6064129da36e5673649e957cc76c0.jpg","https://cdn.shibe.online/shibes/aeac6a5b0a07a00fba0ba953af27734d2361fc10.jpg","https://cdn.shibe.online/shibes/9a217cfa377cc50dd8465d251731be05559b2142.jpg","https://cdn.shibe.online/shibes/65f6047d8e1d247af353532db018b08a928fd62a.jpg","https://cdn.shibe.online/shibes/fcead395cbf330b02978f9463ac125074ac87ab4.jpg","https://cdn.shibe.online/shibes/79451dc808a3a73f99c339f485c2bde833380af0.jpg","https://cdn.shibe.online/shibes/bedf90869797983017f764165a5d97a630b7054b.jpg","https://cdn.shibe.online/shibes/dd20e5801badd797513729a3645c502ae4629247.jpg","https://cdn.shibe.online/shibes/88361ee50b544cb1623cb259bcf07b9850183e65.jpg","https://cdn.shibe.online/shibes/0ebcfd98e8aa61c048968cb37f66a2b5d9d54d4b.jpg"]
            let kya = list[Math.floor(Math.random() * list.length)]
            kaguya.sendFileFromUrl(from, kya, 'Dog.jpeg', 'Inu')
            break
        case 'nekonime':
            if(isReg(obj)) return
            if (isAfk) return await kaguya.reply(from, `Maaf ${pushname}, Kamu sedang afk! Ketik ${prefix}unafk untuk mematikan`,  id)
            axios.get('https://tobz-api.herokuapp.com/api/nekonime')
            .then(async(rest) => {
            kaguya.sendFileFromUrl(from, rest.data.result)
            .catch(() => {
            kaguya.reply(from, 'Sepertinya server sedang error', id)
              })
            })
         break
        case 'walldekstop':
            if(isReg(obj)) return
            if (isAfk) return await kaguya.reply(from, `Maaf ${pushname}, Kamu sedang afk! Ketik ${prefix}unafk untuk mematikan`,  id)
            if (isLimit(serial)) return kaguya.reply(from, `Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik ${prefix}limit Untuk Mengecek Kuota Limit Kamu`, id)
            
            await limitAdd(serial)
            kaguya.sendFileFromUrl(from, 'https://source.unsplash.com/1920x1080/?nature','wp.jpeg')
            break
        case 'wallhp':
            if(isReg(obj)) return
            if (isAfk) return await kaguya.reply(from, `Maaf ${pushname}, Kamu sedang afk! Ketik ${prefix}unafk untuk mematikan`,  id)
            if (isLimit(serial)) return kaguya.reply(from, `Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik ${prefix}limit Untuk Mengecek Kuota Limit Kamu`, id)
            
            await limitAdd(serial)
            kaguya.sendFileFromUrl(from, 'https://source.unsplash.com/1080x1920/?nature','wp.jpeg')
            break
        case 'kpop':
            if(isReg(obj)) return
            if (isAfk) return await kaguya.reply(from, `Maaf ${pushname}, Kamu sedang afk! Ketik ${prefix}unafk untuk mematikan`,  id)
            if (isLimit(serial)) return kaguya.reply(from, `Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik ${prefix}limit Untuk Mengecek Kuota Limit Kamu`, id)
            
            await limitAdd(serial)
            if (args.length == 0) return kaguya.reply(from, `Untuk menggunakan ${prefix}kpop\nSilahkan ketik: ${prefix}kpop [query]\nContoh: ${prefix}kpop bts\n\nquery yang tersedia:\nblackpink, exo, bts`, id)
            if (args[0] == 'blackpink' || args[0] == 'exo' || args[0] == 'bts') {
                fetch('https://raw.githubusercontent.com/Arugaz/grabbed-results/main/random/kpop/' + args[0] + '.txt')
                .then(res => res.text())
                .then(body => {
                    let randomkpop = body.split('\n')
                    let randomkpopx = randomkpop[Math.floor(Math.random() * randomkpop.length)]
                    kaguya.sendFileFromUrl(from, randomkpopx, '', 'Nee..', id)
                })
                .catch(() => {
                    kaguya.reply(from, 'Ada yang Error!', id)
                })
            } else {
                kaguya.reply(from, `Maaf query tidak tersedia. Silahkan ketik ${prefix}kpop untuk melihat list query`)
            }
            break
        case 'memes':
            if(isReg(obj)) return
            if (isAfk) return await kaguya.reply(from, `Maaf ${pushname}, Kamu sedang afk! Ketik ${prefix}unafk untuk mematikan`,  id)
            if (isLimit(serial)) return kaguya.reply(from, `Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik ${prefix}limit Untuk Mengecek Kuota Limit Kamu`, id)
            
            await limitAdd(serial)
            const randmeme = await meme.random()
            kaguya.sendFileFromUrl(from, randmeme, '', '', id)
            .catch(() => {
                kaguya.reply(from, 'Ada yang Error!', id)
            })
            break
		case 'animeme':
            if(isReg(obj)) return
            if (isAfk) return await kaguya.reply(from, `Maaf ${pushname}, Kamu sedang afk! Ketik ${prefix}unafk untuk mematikan`,  id)
            if (isLimit(serial)) return kaguya.reply(from, `Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik ${prefix}limit Untuk Mengecek Kuota Limit Kamu`, id)
            
            await limitAdd(serial)
			if (args.length !== 0) return kaguya.reply(from, `Tulis Memenya\nContoh: ${prefix}searchmeme wholesomeanimemes\nUntuk Meliha List Meme Ketik ${prefix}listmeme`, id)
			kaguyaapi.mex(args[0],args[1],args[2])
			.then(async(res) => {
				await kaguya.sendFileFromUrl(from, `${res.link}`, 'meme.jpg', `${res.text}`, id)
			})
			break
		case 'dewabatch':
            if(isReg(obj)) return
            if (isAfk) return await kaguya.reply(from, `Maaf ${pushname}, Kamu sedang afk! Ketik ${prefix}unafk untuk mematikan`,  id)
		    if (args.length == 0) return kaguya.reply(from, `Untuk mencari anime batch, ketik ${prefix}dewabatch judul\n\nContoh: ${prefix}dewabatch naruto`, id)
		    kaguyaapi.dewabatch(args[0])
		    .then(async(res) => {
		    await kaguya.sendFileFromUrl(from, `${res.link}`, '', `${res.text}`, id)
		    })
		    break
		case 'searchmemes':
            if(isReg(obj)) return
            if (isAfk) return await kaguya.reply(from, `Maaf ${pushname}, Kamu sedang afk! Ketik ${prefix}unafk untuk mematikan`,  id)
            if (isLimit(serial)) return kaguya.reply(from, `Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik ${prefix}limit Untuk Mengecek Kuota Limit Kamu`, id)
            
            await limitAdd(serial)
			if (args.length !== 1) return kaguya.reply(from, `Tulis Memenya\nContoh: ${prefix}searchmeme wholesomeanimemes\nUntuk Meliha List Meme Ketik ${prefix}listmeme`, id)
			kaguyaapi.mes(args[0],args[1],args[2])
			.then(async(res) => {
				await kaguya.sendFileFromUrl(from, `${res.link}`, 'meme.jpg', `${res.text}`, id)
			})
			break

        // Search Any
        case 'images':
            if(isReg(obj)) return
            if (isAfk) return await kaguya.reply(from, `Maaf ${pushname}, Kamu sedang afk! Ketik ${prefix}unafk untuk mematikan`,  id)
            if (isLimit(serial)) return kaguya.reply(from, `Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik ${prefix}limit Untuk Mengecek Kuota Limit Kamu`, id)
            await limitAdd(serial)
            if (args.length == 0) return kaguya.reply(from, `Untuk mencari gambar\nketik: ${prefix}images [search]\ncontoh: ${prefix}images naruto`, id)
            const cariwall = body.slice(8)
            const hasilwall = await images.fdci(cariwall)
            await kaguya.sendFileFromUrl(from, hasilwall, '', '', id)
            .catch(() => {
                kaguya.reply(from, 'Ada yang Error!', id)
            })
            break 
        case 'images2':
            if(isReg(obj)) return
            if (isAfk) return await kaguya.reply(from, `Maaf ${pushname}, Kamu sedang afk! Ketik ${prefix}unafk untuk mematikan`,  id)
            if (isLimit(serial)) return kaguya.reply(from, `Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik ${prefix}limit Untuk Mengecek Kuota Limit Kamu`, id)
            await limitAdd(serial)
            if (args.length == 0) return kaguya.reply(from, `Untuk mencari gambar\nketik: ${prefix}images [search]\ncontoh: ${prefix}images naruto`, id)
            const cariimg = body.slice(8)
            const hasilimg = await images.melo(cariimg)
            await kaguya.sendFileFromUrl(from, hasilimg, '', '', id)
            .catch(() => {
                kaguya.reply(from, 'Ada yang Error!', id)
            })
            break
	       case 'brainly':
               if(isReg(obj)) return
               if (isLimit(serial)) return kaguya.reply(from, `Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik ${prefix}limit Untuk Mengecek Kuota Limit Kamu`, id)
               if (isAfk) return await kaguya.reply(from, `Maaf ${pushname}, Kamu sedang afk! Ketik ${prefix}unafk untuk mematikan`,  id)
              await limitAdd(serial)
              if (args.length >= 2){
                const BrainlySearch = require('./lib/brainly')
                let tanya = body.slice(9)
                let jum = Number(tanya.split('.')[1]) || 2
                if (jum > 10) return kaguya.reply(from, 'Max 10!', id)
                if (Number(tanya[tanya.length-1])){
                    tanya
                }
                kaguya.reply(from, `➸ *Pertanyaan* : ${tanya.split('.')[0]}\n\n➸ *Jumlah jawaban* : ${Number(jum)}`, id)
                await BrainlySearch(tanya.split('.')[0],Number(jum), function(res){
                    res.forEach(x=>{
                        if (x.jawaban.fotoJawaban.length == 0) {
                            kaguya.reply(from, `➸ *Pertanyaan* : ${x.pertanyaan}\n\n➸ *Jawaban* : ${x.jawaban.judulJawaban}\n`, id)
			    kaguya.sendText(from, 'Selesai ✅')
                        } else {
                            kaguya.reply(from, `➸ *Pertanyaan* : ${x.pertanyaan}\n\n➸ *Jawaban* 〙: ${x.jawaban.judulJawaban}\n\n➸ *Link foto jawaban* : ${x.jawaban.fotoJawaban.join('\n')}`, id)
                        }
                    })
                })
            } else {
                kaguya.reply(from, 'Usage :\n!brainly [pertanyaan] [.jumlah]\n\nEx : \n!brainly NKRI .2', id)
            }
            break
            case 'readchat':
                if (!isGroupMsg) return kaguya.reply(from, `Perintah ini hanya bisa di gunakan dalam group!`, id)                
                if (!quotedMsg) return kaguya.reply(from, `Tolong Reply Pesan Bot`, id)
                if (isAfk) return await kaguya.reply(from, `Maaf ${pushname}, Kamu sedang afk! Ketik ${prefix}unafk untuk mematikan`,  id)
                if (!quotedMsgObj.fromMe) return kaguya.reply(from, `Tolong Reply Pesan Bot`, id)
                 try {
                    const reader = await kaguya.getMessageReaders(quotedMsgObj.id)
                    let list = ''
                    for (let pembaca of reader) {
                    list += `- @${pembaca.id.replace(/@c.us/g, '')}\n` 
                    }
                    kaguya.sendTextWithMentions(from, `Nih Daftar Yang Cuman Read Dong..\n${list}`)
                    } catch(err) {
                    console.log(err)
                    kaguya.reply(from, `Maaf, Belum Ada Yang Membaca Pesan Bot atau Mereka Menonaktifkan Read Receipts`, id)    
                    }
                  break
            case 'ytsearch':
                if (isAfk) return await kaguya.reply(from, `Maaf ${pushname}, Kamu sedang afk! Ketik ${prefix}unafk untuk mematikan`,  id)
                if(isLimit(serial)) return
                if(isReg(obj)) return
                if (!args.length >=1 ) return await kaguya.reply(from, 'Masukkan keyword pencarian!', id);{
                const nama = body.slice(8)
                    await yts(nama, function ( err, r ) {
                    const videos = r.videos.slice( 0, 10 )
                    let hasil = `🔎 hasil pencarian youtube *'${nama}'* 🔍*`
                    hasil += `\n`;
                    Object.keys(videos).forEach(function (i) {
                        hasil += `\n═════════════════\n\n● Judul : ${videos[i].title}\n● Channel : ${videos[i].author.name}\n● Durasi : ${videos[i].timestamp}\n● Link : https://www.youtube.com/watch?v=${videos[i].videoId}\n`;
                    });
                    hasil += '\n_*ʏᴏᴜᴛᴜʙᴇ ꜱᴇᴀʀᴄʜ*_';
                        kaguya.sendText(from, hasil)
                        limitAdd(serial)
                    })
                }         
              break      
            case 'google':
            if (isAfk) return await kaguya.reply(from, `Maaf ${pushname}, Kamu sedang afk! Ketik ${prefix}unafk untuk mematikan`,  id)
            if(isReg(obj)) return
            if (isLimit(serial)) return kaguya.reply(from, `Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik ${prefix}limit Untuk Mengecek Kuota Limit Kamu`, id)
            await limitAdd(serial)
            if (!args.length >=1 ) return await kaguya.reply(from, 'Masukkan keyword pencarian!', id);{
                const googleQuery = body.slice(8)
                if(googleQuery == undefined || googleQuery == ' ') return kaguya.reply(from, `*Hasil Pencarian : tidak ditemukan*`, id)
                google({ 'query': googleQuery }).then(results => {
                let vars = `_*Hasil Pencarian : ${googleQuery}*_\n`
                for (let i = 0; i < results.length; i++) {
                    vars +=  `\n═════════════════\n\n*Judul* : ${results[i].title}\n\n*Deskripsi* : ${results[i].snippet}\n\n*Link* : ${results[i].link}\n\n`
                }
                    kaguya.reply(from, vars, id);
                }).catch(e => {
                    console.log(e)
                    kaguya.sendText(ownerNumber, 'Google Error : ' + e);
                })
            }
                break
        case 'setgroupname':
            if (isAfk) return await kaguya.reply(from, `Maaf ${pushname}, Kamu sedang afk! Ketik ${prefix}unafk untuk mematikan`,  id)
            if (!isGroupMsg) return kaguya.reply(from, `Fitur ini hanya bisa di gunakan dalam group`, id)
            if (!isGroupAdmins) return kaguya.reply(from, `Fitur ini hanya bisa di gunakan oleh admin group`, id)
            if (!isBotGroupAdmins) return kaguya.reply(from, `Fitur ini hanya bisa di gunakan ketika bot menjadi admin`, id)
            const namagrup = body.slice(14)
            let sebelum = chat.groupMetadata.formattedName
            let halaman = global.page ? global.page : await kaguya.getPage()
            await halaman.evaluate((chatId, subject) =>
            Store.WapQuery.changeSubject(chatId, subject),groupId, `${namagrup}`)
            kaguya.sendTextWithMentions(from, `Nama group telah diubah oleh admin @${sender.id.replace('@c.us','')}\n\n• Before: ${sebelum}\n• After: ${namagrup}`)
            break
        case 'setgroupicon':
            if (isAfk) return await kaguya.reply(from, `Maaf ${pushname}, Kamu sedang afk! Ketik ${prefix}unafk untuk mematikan`,  id)
            if (!isGroupMsg) return kaguya.reply(from, `Fitur ini hanya bisa di gunakan dalam group`, id)
            if (!isGroupAdmins) return kaguya.reply(from, `Fitur ini hanya bisa di gunakan oleh admin group`, id)
            if (!isBotGroupAdmins) return kaguya.reply(from, `Fitur ini hanya bisa di gunakan ketika bot menjadi admin`, id)
            if (isMedia) {
                const mediaData = await decryptMedia(message)
                const imageBase64 = `data:${mimetype};base64,${mediaData.toString('base64')}`
                await kaguya.setGroupIcon(from, imageBase64)
                kaguya.sendTextWithMentions(from, `Profile group telah diubah oleh admin @${sender.id.replace('@c.us','')}`)
            } else if (quotedMsg && quotedMsg.type == 'image') {
                const mediaData = await decryptMedia(quotedMsg)
                const imageBase64 = `data:${quotedMsg.mimetype};base64,${mediaData.toString('base64')}`
                await kaguya.setGroupIcon(from, imageBase64)
                kaguya.sendTextWithMentions(from, `Profile group telah diubah oleh admin @${sender.id.replace('@c.us','')}`)
            } else {
                kaguya.reply(from, `Wrong Format!\n⚠️ Harap Kirim Gambar Dengan ${prefix}setgroupicon`, id)
            }
            break
        case 'sreddit':
            if(isReg(obj)) return
            if (isAfk) return await kaguya.reply(from, `Maaf ${pushname}, Kamu sedang afk! Ketik ${prefix}unafk untuk mematikan`,  id)
            if (isLimit(serial)) return kaguya.reply(from, `Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik ${prefix}limit Untuk Mengecek Kuota Limit Kamu`, id)
            
            await limitAdd(serial)
            if (args.length == 0) return kaguya.reply(from, `Untuk mencari gambar di sub reddit\nketik: ${prefix}sreddit [search]\ncontoh: ${prefix}sreddit naruto`, id)
            const carireddit = body.slice(9)
            const hasilreddit = await images.sreddit(carireddit)
            await kaguya.sendFileFromUrl(from, hasilreddit, '', '', id)
            .catch(() => {
                kaguya.reply(from, 'Ada yang Error!', id)
            })
	    break
        case 'resep':
            if(isReg(obj)) return
            if (isAfk) return await kaguya.reply(from, `Maaf ${pushname}, Kamu sedang afk! Ketik ${prefix}unafk untuk mematikan`,  id)
            if (isLimit(serial)) return kaguya.reply(from, `Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik ${prefix}limit Untuk Mengecek Kuota Limit Kamu`, id)
            
            await limitAdd(serial)
            if (args.length == 0) return kaguya.reply(from, `Untuk mencari resep makanan\nCaranya ketik: ${prefix}resep [search]\n\ncontoh: ${prefix}resep tahu`, id)
            const cariresep = body.slice(7)
            const hasilresep = await resep.resep(cariresep)
            await kaguya.reply(from, hasilresep + '\n\nIni kak resep makanannya..', id)
            .catch(() => {
                kaguya.reply(from, 'Ada yang Error!', id)
            })
            break
        case 'poi':
            if(isReg(obj)) return
            if (isAfk) return await kaguya.reply(from, `Maaf ${pushname}, Kamu sedang afk! Ketik ${prefix}unafk untuk mematikan`,  id)
            if (isLimit(serial)) return kaguya.reply(from, `Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik ${prefix}limit Untuk Mengecek Kuota Limit Kamu`, id)
            
            await limitAdd(serial)
             rugapoi.getLatest()
            .then((result) => {
                Kaguyapoi.getVideo(result.link)
                .then((res) => {
                    let heheq = '\n'
                    for (let i = 0; i < res.links.length; i++) {
                        heheq += `${res.links[i]}\n`
                    }
                    kaguya.reply(from, `Title: ${res.title}\n\nLink:\n${heheq}\nmasih tester bntr :v`)
                })
            })
            .catch(() => {
                kaguya.reply(from, 'Ada yang Error!', id)
            })
            break
        case 'stalkig':
            if(isReg(obj)) return
            if (isLimit(serial)) return kaguya.reply(from, `Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik ${prefix}limit Untuk Mengecek Kuota Limit Kamu`, id)
            if (isAfk) return await kaguya.reply(from, `Maaf ${pushname}, Kamu sedang afk! Ketik ${prefix}unafk untuk mematikan`,  id)
            await limitAdd(serial)
            if (args.length == 0) return kaguya.reply(from, `Untuk men-stalk akun instagram seseorang\nketik ${prefix}stalkig [username]\ncontoh: ${prefix}stalkig ini.arga`, id)
            const igstalk = await kaguyaapi.stalkig(args[0])
            const igstalkpict = await kaguyaapi.stalkigpict(args[0])
            await kaguya.sendFileFromUrl(from, igstalkpict, '', igstalk, id)
            .catch(() => {
                kaguya.reply(from, 'Ada yang Error!', id)
            })
            break
        case 'github':
            if(isReg(obj)) return
            if (isLimit(serial)) return kaguya.reply(from, `Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik ${prefix}limit Untuk Mengecek Kuota Limit Kamu`, id)
            if (isAfk) return await kaguya.reply(from, `Maaf ${pushname}, Kamu sedang afk! Ketik ${prefix}unafk untuk mematikan`,  id)
            await limitAdd(serial)
            if (args.length == 0) return kaguya.reply(from, `Untuk men-stalk akun github seseorang\nketik ${prefix}github [username]\ncontoh: ${prefix}github Tanaka9531`, id)
            const stalkgit = await kaguyaapi.stalkgit(args[0])
            const stalkgitpict = await kaguyaapi.stalkgitpict(args[0])
            await kaguya.sendFileFromUrl(from, stalkgitpict, '', stalkgit, id)
            .catch(() => {
                kaguya.reply(from, 'Ada yang Error!', id)
            })
            break
        case 'wiki':
            if(isReg(obj)) return
            if (isAfk) return await kaguya.reply(from, `Maaf ${pushname}, Kamu sedang afk! Ketik ${prefix}unafk untuk mematikan`,  id)
            if (isLimit(serial)) return kaguya.reply(from, `Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik ${prefix}limit Untuk Mengecek Kuota Limit Kamu`, id)
            
            await limitAdd(serial)
            if (args.length === 0) return kaguya.reply(from, 'Harap masukan pertanyaan yang di cari!', id)
            await kaguya.reply(from, '_Scraping Metadata...', id)
            kaguyaapi.wiki(args[0])
                .then((result) => kaguya.reply(from, result, id))
                .catch(() => kaguya.reply(from, 'Error, Pertanyaan mu tidak ada di database kami.', id))
            break
        case 'crygif':
            if(isReg(obj)) return
            if (isLimit(serial)) return kaguya.reply(from, `Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik ${prefix}limit Untuk Mengecek Kuota Limit Kamu`, id)
            if (isAfk) return await kaguya.reply(from, `Maaf ${pushname}, Kamu sedang afk! Ketik ${prefix}unafk untuk mematikan`,  id)
            await limitAdd(serial)
            axios.get('https://tobz-api.herokuapp.com/api/cry')
            .then(async(rest) => {
            kaguya.sendStickerfromUrl(from, rest.data.result)
            .catch(() => {
            kaguya.reply(from, 'Sepertinya server sedang error', id)
              })
            })
         break
            case 'bakagif':
            if(isReg(obj)) return
            if (isLimit(serial)) return kaguya.reply(from, `Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik ${prefix}limit Untuk Mengecek Kuota Limit Kamu`, id)
            if (isAfk) return await kaguya.reply(from, `Maaf ${pushname}, Kamu sedang afk! Ketik ${prefix}unafk untuk mematikan`,  id)
            await limitAdd(serial)
            axios.get('https://nekos.life/api/v2/img/baka')
            .then(async(rest) => {
            kaguya.sendStickerfromUrl(from, rest.data.url)
            .catch(() => {
            kaguya.reply(from, 'Sepertinya server sedang error', id)
              })
            })
         break
        case 'huggif':
            if(isReg(obj)) return
            if (isLimit(serial)) return kaguya.reply(from, `Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik ${prefix}limit Untuk Mengecek Kuota Limit Kamu`, id)
            if (isAfk) return await kaguya.reply(from, `Maaf ${pushname}, Kamu sedang afk! Ketik ${prefix}unafk untuk mematikan`,  id)
            await limitAdd(serial)
            axios.get('https://tobz-api.herokuapp.com/api/hug')
            .then(async(rest) => {
            kaguya.sendStickerfromUrl(from, rest.data.result)
            .catch(() => {
            kaguya.reply(from, 'Sepertinya server sedang error', id)
              })
            })
         break
        case 'kissgif':
            if(isReg(obj)) return
            if (isLimit(serial)) return kaguya.reply(from, `Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik ${prefix}limit Untuk Mengecek Kuota Limit Kamu`, id)
            if (isAfk) return await kaguya.reply(from, `Maaf ${pushname}, Kamu sedang afk! Ketik ${prefix}unafk untuk mematikan`,  id)
            await limitAdd(serial)
            axios.get('https://tobz-api.herokuapp.com/api/kiss')
            .then(async(rest) => {
            kaguya.sendStickerfromUrl(from, rest.data.result)
            .catch(() => {
            kaguya.reply(from, 'Sepertinya server sedang error', id)
              })
            })
         break
        case 'kbbi':
            if(isReg(obj)) return
            if (isAfk) return await kaguya.reply(from, `Maaf ${pushname}, Kamu sedang afk! Ketik ${prefix}unafk untuk mematikan`,  id)
            if (isLimit(serial)) return kaguya.reply(from, `Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik ${prefix}limit Untuk Mengecek Kuota Limit Kamu`, id)
            
            await limitAdd(serial)
            if (args.length === 0) return kaguya.reply(from, 'Harap masukan pertanyaan yang di cari!', id)
            await kaguya.reply(from, '_Scraping Metadata...', id)
            kaguyaapi.kbbi(args[0])
                .then((result) => kaguya.reply(from, result, id))
                .catch(() => kaguya.reply(from, 'Error, Pertanyaan mu tidak ada di database kami.', id))
            break
        case 'covworld':
            if(isReg(obj)) return
            if (isAfk) return await kaguya.reply(from, `Maaf ${pushname}, Kamu sedang afk! Ketik ${prefix}unafk untuk mematikan`,  id)
            if (isLimit(serial)) return kaguya.reply(from, `Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik ${prefix}limit Untuk Mengecek Kuota Limit Kamu`, id)
            
            await limitAdd(serial)
            const covwo = await kaguyaapi.coworl()
            await kaguya.reply(from, covwo, id)
            .catch(() => {
                kaguya.reply(from, 'Ada yang Error!', id)
            })
            break
        case 'cuaca':
            if(isReg(obj)) return
            if (isAfk) return await kaguya.reply(from, `Maaf ${pushname}, Kamu sedang afk! Ketik ${prefix}unafk untuk mematikan`,  id)
            if (isLimit(serial)) return kaguya.reply(from, `Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik ${prefix}limit Untuk Mengecek Kuota Limit Kamu`, id)
            
            await limitAdd(serial)
            if (args.length == 0) return kaguya.reply(from, `Untuk melihat cuaca pada suatu daerah\nketik: ${prefix}cuaca [daerah]`, id)
            const cuacaq = body.slice(7)
            const cuacap = await kaguyaapi.cuaca(cuacaq)
            await kaguya.reply(from, cuacap, id)
            .catch(() => {
                kaguya.reply(from, 'Ada yang Error!', id)
            })
            break
        case 'lyrics':
        case 'lirik':
            if(isReg(obj)) return
            if (isAfk) return await kaguya.reply(from, `Maaf ${pushname}, Kamu sedang afk! Ketik ${prefix}unafk untuk mematikan`,  id)
            if (isLimit(serial)) return kaguya.reply(from, `Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik ${prefix}limit Untuk Mengecek Kuota Limit Kamu`, id)
            
            await limitAdd(serial)
            if (args.length == 0) return kaguya.reply(from, `Untuk mencari lirik dari sebuah lagu\bketik: ${prefix}lirik [judul_lagu]`, id)
            kaguyaapi.lirik(body.slice(7))
            .then(async (res) => {
                await kaguya.reply(from, `Lirik Lagu: ${body.slice(7)}\n\n${res}`, id)
            })
            break
        case 'chord':
            if(isReg(obj)) return
            if (isAfk) return await kaguya.reply(from, `Maaf ${pushname}, Kamu sedang afk! Ketik ${prefix}unafk untuk mematikan`,  id)
            if (isLimit(serial)) return kaguya.reply(from, `Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik ${prefix}limit Untuk Mengecek Kuota Limit Kamu`, id)
            
            await limitAdd(serial)
            if (args.length == 0) return kaguya.reply(from, `Untuk mencari lirik dan chord dari sebuah lagu\bketik: ${prefix}chord [judul_lagu]`, id)
            const chordq = body.slice(7)
            const chordp = await kaguyaapi.chord(chordq)
            await kaguya.reply(from, chordp, id)
            .catch(() => {
                kaguya.reply(from, 'Ada yang Error!', id)
            })
            break
        case 'ss'://jika error silahkan buka file di folder settings/api.json dan ubah apiSS 'API-KEY' yang kalian dapat dari website https://apiflash.com/
        case 'screenshot':
            if(isReg(obj)) return
            if (isAfk) return await kaguya.reply(from, `Maaf ${pushname}, Kamu sedang afk! Ketik ${prefix}unafk untuk mematikan`,  id)
            if (isLimit(serial)) return kaguya.reply(from, `Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik ${prefix}limit Untuk Mengecek Kuota Limit Kamu`, id)
            
            await limitAdd(serial)
            if (args.length == 0) return kaguya.reply(from, `Membuat bot men-screenshot sebuah web\n\nPemakaian: ${prefix}ss [url]\n\ncontoh: ${prefix}ss http://google.com`, id)
            const scrinshit = await meme.ss(args[0])
            await kaguya.sendFile(from, scrinshit, 'ss.jpg', 'cekrek', id)
            .catch(() => {
                kaguya.reply(from, 'Ada yang Error!', id)
            })
            break
        case 'play'://silahkan kalian custom sendiri jika ada yang ingin diubah
            if(isReg(obj)) return
            if (isAfk) return await kaguya.reply(from, `Maaf ${pushname}, Kamu sedang afk! Ketik ${prefix}unafk untuk mematikan`,  id)
            if (isLimit(serial)) return kaguya.reply(from, `Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik ${prefix}limit Untuk Mengecek Kuota Limit Kamu`, id)
            await limitAdd(serial)
            if (args.length == 0) return kaguya.reply(from, `Untuk mencari lagu dari youtube\n\nPenggunaan: ${prefix}play judul lagu`, id)
            axios.get(`https://yt-scraper.eclipseapis.ga/api/v1/video?q=${body.slice(6)}`)
            .then(async (res) => {
                await kaguya.sendFileFromUrl(from, `${res.data.thumbnail}`, ``, `「 PLAY 」\n\n•Judul: ${res.data.title}\n•Durasi: ${res.data.seconds}detik\n•Uploaded: ${res.data.ago}\n•View: ${res.data.views}\n•Link: ${res.data.url}\n\n*Mohon Tunggu Sebentar ${pushname}, Kaguya Lagi Ngirim Audionya*`, id)
				kaguyaapi.ymp3(`https://youtu.be/${res.data.videoId}`)
				.then(async(res) => {
					if (res.status == 'error') return kaguya.sendFileFromUrl(from, `${res.link}`, '', `${res.error}`)
					await kaguya.sendAudio(from, `${res.getVideo}`, '', '', id)
					.catch(() => {
					console.log(err)
					kaguya.reply(from, `ERROR! MAAF JUDUL YANG KAMU CARI TIDAK DI TEMUKAN`, id)
					})
                })
            })
            .catch(() => {
                kaguya.reply(from, 'Ada yang Error!', id)
            })
            break
        case 'play2'://silahkan kalian custom sendiri jika ada yang ingin diubah
            if(isReg(obj)) return
            if (isAfk) return await kaguya.reply(from, `Maaf ${pushname}, Kamu sedang afk! Ketik ${prefix}unafk untuk mematikan`,  id)
            if (isLimit(serial)) return kaguya.reply(from, `Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik ${prefix}limit Untuk Mengecek Kuota Limit Kamu`, id)
            await limitAdd(serial)
            if (args.length == 0) return kaguya.reply(from, `Untuk mencari lagu dari youtube\n\nPenggunaan: ${prefix}play judul lagu`, id)
            axios.get(`https://yt-scraper.eclipseapis.ga/api/v1/video?q=${body.slice(6)}`)
            .then(async (res) => {
                await kaguya.sendFileFromUrl(from, `${res.data.thumbnail}`, ``, `「 PLAY 」\n\n•Judul: ${res.data.title}\n•Durasi: ${res.data.seconds}detik\n•Uploaded: ${res.data.ago}\n•View: ${res.data.views}\n\n*Mohon Tunggu Sebentar ${pushname}, Kaguya Lagi Ngirim Videonya*`, id)
				kaguyaapi.ymp4(`https://youtu.be/${res.data.getVideo}`)
				.then(async(res) => {
					if (res.status == 'error') return kaguya.sendFileFromUrl(from, `${res.link}`, '', `${res.error}`)
					await kaguya.sendFileFromUrl(from, `${res.result}`, '', '', id)
					.catch(() => {
					console.log(err)
					kaguya.reply(from, `ERROR! MAAF JUDUL YANG KAMU CARI TIDAK DI TEMUKAN`, id)
					})
				})
            })
            .catch(() => {
                kaguya.reply(from, 'Ada yang Error!', id)
            })
            break
		case 'movie':
            if (isAfk) return await kaguya.reply(from, `Maaf ${pushname}, Kamu sedang afk! Ketik ${prefix}unafk untuk mematikan`,  id)
            if(isReg(obj)) return
            if (isLimit(serial)) return kaguya.reply(from, `Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik ${prefix}limit Untuk Mengecek Kuota Limit Kamu`, id)
            
            await limitAdd(serial)
			if (args.length == 0) return kaguya.reply(from, `Untuk mencari suatu movie dari website sdmovie.fun\nketik: ${prefix}movie judulnya`, id)
			kaguyaapi.movie((body.slice(7)))
			.then(async (res) => {
				if (res.status == 'error') return kaguya.reply(from, res.hasil, id)
				await kaguya.sendFileFromUrl(from, res.link, 'movie.jpg', res.hasil, id)
			})
			break
        case 'whatanime':
            if (isAfk) return await kaguya.reply(from, `Maaf ${pushname}, Kamu sedang afk! Ketik ${prefix}unafk untuk mematikan`,  id)
		    if(isReg(obj)) return
            if (isLimit(serial)) return kaguya.reply(from, `Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik ${prefix}limit Untuk Mengecek Kuota Limit Kamu`, id)
            
            await limitAdd(serial)
            if (isMedia && type === 'image' || quotedMsg && quotedMsg.type === 'image') {
                if (isMedia) {
                    var mediaData = await decryptMedia(message, uaOverride)
                } else {
                    var mediaData = await decryptMedia(quotedMsg, uaOverride)
                }
                const fetch = require('node-fetch')
                const imgBS4 = `data:${mimetype};base64,${mediaData.toString('base64')}`
                kaguya.reply(from, 'Searching....', id)
                fetch('https://trace.moe/api/search', {
                    method: 'POST',
                    body: JSON.stringify({ image: imgBS4 }),
                    headers: { "Content-Type": "application/json" }
                })
                .then(respon => respon.json())
                .then(resolt => {
                	if (resolt.docs && resolt.docs.length <= 0) {
                		kaguya.reply(from, 'Maaf, saya tidak tau ini anime apa, pastikan gambar yang akan di Search tidak Buram/Kepotong', id)
                	}
                    const { is_adult, title, title_chinese, title_romaji, title_english, episode, similarity, filename, at, tokenthumb, anilist_id } = resolt.docs[0]
                    teks = ''
                    if (similarity < 0.92) {
                    	teks = '*Saya memiliki keyakinan rendah dalam hal ini* :\n\n'
                    }
                    teks += `➸ *Title Japanese* : ${title}\n➸ *Title chinese* : ${title_chinese}\n➸ *Title Romaji* : ${title_romaji}\n➸ *Title English* : ${title_english}\n`
                    teks += `➸ *R-18?* : ${is_adult}\n`
                    teks += `➸ *Eps* : ${episode.toString()}\n`
                    teks += `➸ *Kesamaan* : ${(similarity * 100).toFixed(1)}%\n`
                    var video = `https://media.trace.moe/video/${anilist_id}/${encodeURIComponent(filename)}?t=${at}&token=${tokenthumb}`;
                    kaguya.sendFileFromUrl(from, video, 'anime.mp4', teks, id).catch(() => {
                        kaguya.reply(from, teks, id)
                    })
                })
                .catch(() => {
                    kaguya.reply(from, 'Ada yang Error!', id)
                })
            } else {
				kaguya.reply(from, `Maaf format salah\n\nSilahkan kirim foto dengan caption ${prefix}whatanime\n\nAtau reply foto dengan caption ${prefix}whatanime`, id)
			}
            break
            
        // Other Command
        case 'resi':
            if(isReg(obj)) return
            if (isAfk) return await kaguya.reply(from, `Maaf ${pushname}, Kamu sedang afk! Ketik ${prefix}unafk untuk mematikan`,  id)
            if (isLimit(serial)) return kaguya.reply(from, `Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik ${prefix}limit Untuk Mengecek Kuota Limit Kamu`, id)
            
            await limitAdd(serial)
            if (args.length !== 2) return kaguya.reply(from, `Maaf, format pesan salah.\nSilahkan ketik pesan dengan ${prefix}resi <kurir> <no_resi>\n\nKurir yang tersedia:\njne, pos, tiki, wahana, jnt, rpx, sap, sicepat, pcp, jet, dse, first, ninja, lion, idl, rex`, id)
            const kurirs = ['jne', 'pos', 'tiki', 'wahana', 'jnt', 'rpx', 'sap', 'sicepat', 'pcp', 'jet', 'dse', 'first', 'ninja', 'lion', 'idl', 'rex']
            if (!kurirs.includes(args[0])) return kaguya.sendText(from, `Maaf, jenis ekspedisi pengiriman tidak didukung layanan ini hanya mendukung ekspedisi pengiriman ${kurirs.join(', ')} Tolong periksa kembali.`)
            console.log('Memeriksa No Resi', args[1], 'dengan ekspedisi', args[0])
            cekResi(args[0], args[1]).then((result) => kaguya.sendText(from, result))
            break
        case 'math':
            if(isReg(obj)) return
            if (isAfk) return await kaguya.reply(from, `Maaf ${pushname}, Kamu sedang afk! Ketik ${prefix}unafk untuk mematikan`,  id)
            if (isLimit(serial)) return kaguya.reply(from, `Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik ${prefix}limit Untuk Mengecek Kuota Limit Kamu`, id)
            
            await limitAdd(serial)
            if (args.length === 0) return kaguya.reply(from, `[❗] Kirim perintah *${prefix}math [ Angka ]*\nContoh : ${prefix}math 12*12\n*NOTE* :\n- Untuk Perkalian Menggunakan *\n- Untuk Pertambahan Menggunakan +\n- Untuk Pengurangan Mennggunakan -\n- Untuk Pembagian Menggunakan /`, id)
            const mtk = body.slice(6)
            if (typeof Math_js.evaluate(mtk) !== "number") {
            kaguya.reply(from, `"${mtk}", bukan Gitu\n[❗] Kirim perintah *${prefix}math [ Angka ]*\nContoh : ${prefix}math 12 * 12\n*NOTE* :\n- Untuk Perkalian Menggunakan *\n- Untuk Pertambahan Menggunakan +\n- Untuk Pengurangan Mennggunakan -\n- Untuk Pembagian Menggunakan /`, id)
        } else {
            kaguya.reply(from, `*「 MATH 」*\n\n*Kalkulator*\n${mtk} = ${Math_js.evaluate(mtk)}`, id)
        }
        break
        case 'pinteres':
            if(isReg(obj)) return
            if (isAfk) return await kaguya.reply(from, `Maaf ${pushname}, Kamu sedang afk! Ketik ${prefix}unafk untuk mematikan`,  id)
            if (isLimit(serial)) return kaguya.reply(from, `Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik ${prefix}limit Untuk Mengecek Kuota Limit Kamu`, id)
            await limitAdd(serial)
            if (args.length == 0) return kaguya.reply(from, `Ada Yang Salah!`, id)
            kaguyaapi.prix(args[0])
            .then(async(res) => {
            await kaguya.sendFileFromUrl(from, `${res.link}`, 'P.jpg', `${res.text}`, id)
			})
            .catch(() => {
            kaguya.reply(from, 'Ada yang Error!', id)
			})
            break
        case 'blackpink':
            if(isReg(obj)) return
            if (isAfk) return await kaguya.reply(from, `Maaf ${pushname}, Kamu sedang afk! Ketik ${prefix}unafk untuk mematikan`,  id)
            if (isLimit(serial)) return kaguya.reply(from, `Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik ${prefix}limit Untuk Mengecek Kuota Limit Kamu`, id)
            if (args.length === 0) return kaguya.reply(from, `Kirim perintah *${prefix}blackpink [ Teks ]*, contoh *${prefix}blackpink Kaguya*`, id)
            kaguya.reply(from, `[WAIT] Sedang di proses⏳ silahkan tunggu ± 1 min!`, id)
            const blpk = body.slice(11)
            if (blpk.length > 10) return kaguya.reply(from, '*Teks Terlalu Panjang!*\n_Maksimal 10 huruf!_', id)
            await kaguya.sendFileFromUrl(from, `https://docs-jojo.herokuapp.com/api/blackpink?text=${blpk}`, 'blackpink.jpg', '', id)
            break
        case 'pornhub':
            if(isReg(obj)) return
            if (isAfk) return await kaguya.reply(from, `Maaf ${pushname}, Kamu sedang afk! Ketik ${prefix}unafk untuk mematikan`,  id)
            if (isLimit(serial)) return kaguya.reply(from, `Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik ${prefix}limit Untuk Mengecek Kuota Limit Kamu`, id)
            if (args.length === 0) return kaguya.reply(from, `Kirim perintah *${prefix}pornhub [ |Teks1|Teks2 ]*, contoh *${prefix}pornhub |Tanaka|-kun*`, id)
            argz = body.trim().split('|')
            if (argz.length >= 2) {
                kaguya.reply(from, `[WAIT] Sedang di proses⏳ silahkan tunggu ± 1 min!`, id)
                const lpornhub = argz[1]
                const lpornhub2 = argz[2]
                if (lpornhub.length > 10) return kaguya.reply(from, '*Teks1 Terlalu Panjang!*\n_Maksimal 10 huruf!_', id)
                if (lpornhub2.length > 10) return kaguya.reply(from, '*Teks2 Terlalu Panjang!*\n_Maksimal 10 huruf!_', id)
                kaguya.sendFileFromUrl(from, `https://docs-jojo.herokuapp.com/api/phblogo?text1=${lpornhub}&text2=${lpornhub2}`, 'Pornhub.jpg', '', id)
                await limitAdd(serial)
            } else {
                await kaguya.reply(from, `Wrong Format!\n[❗] Kirim perintah *${prefix}pornhub [ |Teks1|Teks2 ]*, contoh *${prefix}pornhub |kaguya|-San*`, id)
            }
            break
         case 'glitch':
            if(isReg(obj)) return
            if (isAfk) return await kaguya.reply(from, `Maaf ${pushname}, Kamu sedang afk! Ketik ${prefix}unafk untuk mematikan`,  id)
            if (isLimit(serial)) return kaguya.reply(from, `Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik ${prefix}limit Untuk Mengecek Kuota Limit Kamu`, id)
            if (args.length === 0) return kaguya.reply(from, `Kirim perintah *${prefix}glitch [ |Teks1|Teks2 ]*, contoh *${prefix}glitch |Tanaka|-kun*`, id)
            argz = body.trim().split('|')
            if (argz.length >= 2) {
                kaguya.reply(from, `[WAIT] Sedang di proses⏳ silahkan tunggu ± 1 min!`, id)
                const lgliz = argz[1]
                const lgliz2 = argz[2]
                if (lgliz.length > 10) return kaguya.reply(from, '*Teks1 Terlalu Panjang!*\n_Maksimal 10 huruf!_', id)
                    if (lgliz2.length > 10) return kaguya.reply(from, '*Teks2 Terlalu Panjang!*\n_Maksimal 10 huruf!_', id)
                kaguya.sendFileFromUrl(from, `https://docs-jojo.herokuapp.com/api/ttlogo?text1=${lgliz}&text2=${lgliz2}`, 'GLIZ.jpg', '', id)
                await limitAdd(serial)
            } else {
                await kaguya.reply(from, `Wrong Format!\n[❗] Kirim perintah *${prefix}glitch [ |Teks1|Teks2 ]*, contoh *${prefix}glitch |kaguya|-San*`, id)
            }
            break
        case 'wolf':
            if(isReg(obj)) return
            if (isAfk) return await kaguya.reply(from, `Maaf ${pushname}, Kamu sedang afk! Ketik ${prefix}unafk untuk mematikan`,  id)
            if (isLimit(serial)) return kaguya.reply(from, `Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik ${prefix}limit Untuk Mengecek Kuota Limit Kamu`, id)
            if (args.length === 0) return kaguya.reply(from, `Kirim perintah *${prefix}wolf [ |Teks1|Teks2 ]*, contoh *${prefix}wolf |Tanaka|-kun*`, id)
            argz = body.trim().split('|')
            if (argz.length >= 2) {
                kaguya.reply(from, `[WAIT] Sedang di proses⏳ silahkan tunggu ± 1 min!`, id)
                const lwol = argz[1]
                const lwol2 = argz[2]
                if (lwol.length > 10) return kaguya.reply(from, '*Teks1 Terlalu Panjang!*\n_Maksimal 10 huruf!_', id)
                    if (lwol2.length > 10) return kaguya.reply(from, '*Teks2 Terlalu Panjang!*\n_Maksimal 10 huruf!_', id)
                kaguya.sendFileFromUrl(from, `https://docs-jojo.herokuapp.com/api/wolf?text1=${lwol}&text2=${lwol2}`, 'Wolf.jpg', '', id)
                await limitAdd(serial)
            } else {
                await kaguya.reply(from, `Wrong Format!\n[❗] Kirim perintah *${prefix}wolf [ |Teks1|Teks2 ]*, contoh *${prefix}wolf |kaguya|-San*`, id)
            }
            break
            case 'neon':
                if(isReg(obj)) return
                if (isAfk) return await kaguya.reply(from, `Maaf ${pushname}, Kamu sedang afk! Ketik ${prefix}unafk untuk mematikan`,  id)
                if (isLimit(serial)) return kaguya.reply(from, `Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik ${prefix}limit Untuk Mengecek Kuota Limit Kamu`, id)
                if (args.length === 0) return kaguya.reply(from, `Kirim perintah *${prefix}neon [ |Teks1|Teks2|Text3 ]*, contoh *${prefix}neon |I|SO|LAZY*`, id)
                argz = body.trim().split('|')
                if (argz.length >= 3) {
                    kaguya.reply(from, `[WAIT] Sedang di proses⏳ silahkan tunggu ± 1 min!`, id)
                    const lneo = argz[1]
                    const lneo2 = argz[2]
                    const lneo3 = argz[3]
                    if (lneo.length > 10) return kaguya.reply(from, '*Teks1 Terlalu Panjang!*\n_Maksimal 10 huruf!_', id)
                    if (lneo2.length > 10) return kaguya.reply(from, '*Teks2 Terlalu Panjang!*\n_Maksimal 10 huruf!_', id)
                        if (lneo3.length > 10) return kaguya.reply(from, '*Teks2 Terlalu Panjang!*\n_Maksimal 10 huruf!_', id)
                    kaguya.sendFileFromUrl(from, `https://docs-jojo.herokuapp.com/api/neon?text1=${lneo}&text2=${lneo2}&text3=${lneo3}`, 'NEON.jpg', '', id)
                    await limitAdd(serial)
                } else {
                    await kaguya.reply(from, `Wrong Format!\n[❗] Kirim perintah *${prefix}neon [ |Teks1|Teks2|Text3 ]*, contoh *${prefix}neon |I|LOVE|ANIME*`, id)
                    }
                break
            case 'thunder':
                if(isReg(obj)) return
                if (isAfk) return await kaguya.reply(from, `Maaf ${pushname}, Kamu sedang afk! Ketik ${prefix}unafk untuk mematikan`,  id)
                if (isLimit(serial)) return kaguya.reply(from, `Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik ${prefix}limit Untuk Mengecek Kuota Limit Kamu`, id)
                if (args.length === 0) return kaguya.reply(from, `Kirim perintah *${prefix}thunder [ Teks ]*, contoh *${prefix}thunder Kaguya*`, id)
                kaguya.reply(from, `[WAIT] Sedang di proses⏳ silahkan tunggu ± 1 min!`, id)
                const thund = body.slice(8)
                if (thund.length > 15) return kaguya.reply(from, '*Teks Terlalu Panjang!*\n_Maksimal 10 huruf!_', id)
                await kaguya.sendFileFromUrl(from, `https://docs-jojo.herokuapp.com/api/thunder?text=${thund}`, 'thunder.jpg', '', id)
                break
            case 'artimimpi':
                if(isReg(obj)) return
                if (isAfk) return await kaguya.reply(from, `Maaf ${pushname}, Kamu sedang afk! Ketik ${prefix}unafk untuk mematikan`,  id)
                if (isLimit(serial)) return kaguya.reply(from, `Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik ${prefix}limit Untuk Mengecek Kuota Limit Kamu`, id)
                if (args.length === 0) return kaguya.reply(from, `Kirim perintah *${prefix}artimimpi [mimpi]*\nContoh : *${prefix}artimimpi ular*`, id)
            try {
                const resp = await axios.get('https://melodicxt.herokuapp.com/api/primbon-arti-mimpi?query=' + body.slice(13) + '&&apiKey=administrator')
                const anm2 = `➸ Artimimpi : ${resp.data.result}`
                kaguya.reply(from, anm2, id)
                limitAdd(serial)
            } catch(err) {
                console.log(err)
                   await kaguya.reply(from, 'Maaf batas penggunaan hari ini sudah mencapai maksimal', id)
            }
            break
            case 'heroml':
                if(isReg(obj)) return
                if (isAfk) return await kaguya.reply(from, `Maaf ${pushname}, Kamu sedang afk! Ketik ${prefix}unafk untuk mematikan`,  id)
                if (isLimit(serial)) return kaguya.reply(from, `Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik ${prefix}limit Untuk Mengecek Kuota Limit Kamu`, id)
                if (args.length === 0) return kaguya.reply(from, `Kirim perintah *${prefix}heroml [nama hero]*\nContoh : *${prefix}heroml akai*`, id)
            try {
                const resp = await axios.get('https://melodicxt.herokuapp.com/api/mobilelegends/hero-detail?query=' + body.slice(8) + '&apiKey=administrator')
                if (resp.data.error) return kaguya.reply(from, resp.data.error, id)
                const anm2 = `➸ Name : ${resp.data.result.hero_name}\n➸ Quotes : ${resp.data.result.entrance_quotes}\n➸ Release : ${resp.data.result.release_date}\n➸ Role : ${resp.data.result.role}\n➸ Difficulty : ${resp.data.result.skill.difficulty}\n➸ Durability : ${resp.data.result.skill.durability}\n➸ Offense : ${resp.data.result.skill.offense}\n➸ Skill Effects : ${resp.data.result.skill.skill_effects}\n➸ Coin : ${resp.data.result.price.battle_point}\n➸ Diamond : ${resp.data.result.price.diamond}\n➸ Fragment : ${resp.data.result.price.hero_fragment}\n➸ Crit Rate : ${resp.data.result.attributes.ability_crit_rate}\n➸ Attack Speed : ${resp.data.result.attributes.attack_speed}\n➸ Basic Atk Crit : ${resp.data.result.attributes.basic_atk_crit_rate}\n➸ Darah : ${resp.data.result.attributes.hp}\n➸ Hp Regen : ${resp.data.result.attributes.hp_regen}\n➸ Magic Defense : ${resp.data.result.attributes.magic_defense}\n➸ Magic Power : ${resp.data.result.attributes.magic_power}\n➸ Mana : ${resp.data.result.attributes.mana}\n➸ Mana Regen : ${resp.data.result.attributes.mana_regen}\n➸ Movement Speed : ${resp.data.result.attributes.movement_speed}\n➸ Physical Atk : ${resp.data.result.attributes.physical_attack}\n➸ Physical Defense : ${resp.data.result.attributes.physical_defense}\n➸ Info : ${resp.data.result.items}\n➸ Speciality : ${resp.data.result.speciality}`
                kaguya.sendFileFromUrl(from, resp.data.result.image, 'hero.jpg', anm2, id)
                limitAdd(serial)
            } catch(err) {
                console.log(err)
                   await kaguya.reply(from, 'Maaf batas penggunaan hari ini sudah mencapai maksimal', id)
            }
            break
            case 'tebakgambar':
                if(isReg(obj)) return
                if (isAfk) return await kaguya.reply(from, `Maaf ${pushname}, Kamu sedang afk! Ketik ${prefix}unafk untuk mematikan`,  id)
                if (!isGroupMsg) return kaguya.reply(from, 'Perintah ini hanya bisa di gunakan dalam group!', id)
                if (isLimit(serial)) return kaguya.reply(from, `Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik ${prefix}limit Untuk Mengecek Kuota Limit Kamu`, id)
            try {
                const resp = await axios.get('https://melodicxt.herokuapp.com/api/tebak-gambar?apiKey=administrator')
                if (resp.data.error) return kaguya.reply(from, resp.data.error, id)
                const jwban = `➸ Jawaban : ${resp.data.result.jawaban}`
                kaguya.sendFileFromUrl(from, resp.data.result.img, 'tebakgambar.jpg', '_Silahkan Jawab Maksud Dari Gambar Ini_', id)
                kaguya.sendText(from, `30 Detik Lagi...`, id)
                await sleep(10000)
                kaguya.sendText(from, `20 Detik Lagi...`, id)
                await sleep(10000)
                kaguya.sendText(from, `10 Detik Lagi...`, id)
                await sleep(10000)
                kaguya.reply(from, jwban, id)
                limitAdd(serial)
            } catch(err) {
                console.log(err)
                   await kaguya.reply(from, 'Maaf batas penggunaan hari ini sudah mencapai maksimal', id)
            }
               break
            case 'blood':
                if(isReg(obj)) return
                if (isAfk) return await kaguya.reply(from, `Maaf ${pushname}, Kamu sedang afk! Ketik ${prefix}unafk untuk mematikan`,  id)
                if (isLimit(serial)) return kaguya.reply(from, `Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik ${prefix}limit Untuk Mengecek Kuota Limit Kamu`, id)
                await limitAdd(serial)
                if (args.length === 0) return kaguya.reply(from, `Kirim perintah *${prefix}blood [ Teks ]*, contoh *${prefix}blood YOU DIE*`, id)
                kaguya.reply(from, `[WAIT] Sedang di proses⏳ silahkan tunggu ± 1 min!`, id)
                const blod = body.slice(6)
                if (blod.length > 10) return kaguya.reply(from, '*Teks Terlalu Panjang!*\n_Maksimal 10 huruf!_', id)
                axios.get(`https://tobz-api.herokuapp.com/api/textpro?theme=blood&text=${blod}`)
                .then(async(res) => {
                await kaguya.sendImage(from, `${res.data.result}`,'', `Nih...`,id)
                .catch(() => {
                    kaguya.reply(from, 'Ada yang Error!', id)
                })
                })
                break
            case 'neonlight':
                if(isReg(obj)) return
                if (isAfk) return await kaguya.reply(from, `Maaf ${pushname}, Kamu sedang afk! Ketik ${prefix}unafk untuk mematikan`,  id)
                if (isLimit(serial)) return kaguya.reply(from, `Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik ${prefix}limit Untuk Mengecek Kuota Limit Kamu`, id)
                await limitAdd(serial)
                if (args.length === 0) return kaguya.reply(from, `Kirim perintah *${prefix}blood [ Teks ]*, contoh *${prefix}blood YOU DIE*`, id)
                kaguya.reply(from, `[WAIT] Sedang di proses⏳ silahkan tunggu ± 1 min!`, id)
                const nen = body.slice(10)
                if (nen.length > 15) return kaguya.reply(from, '*Teks Terlalu Panjang!*\n_Maksimal 10 huruf!_', id)
                axios.get(`https://tobz-api.herokuapp.com/api/textpro?theme=neon_light&text=${nen}`)
                .then(async(res) => {
                    await kaguya.sendImage(from, `${res.data.result}`,'', `Nih...`,id)
                .catch(() => {
                    kaguya.reply(from, 'Ada yang Error!', id)
                })
                })
                break
            case 'dropwater':
                if(isReg(obj)) return
                if (isAfk) return await kaguya.reply(from, `Maaf ${pushname}, Kamu sedang afk! Ketik ${prefix}unafk untuk mematikan`,  id)
                if (isLimit(serial)) return kaguya.reply(from, `Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik ${prefix}limit Untuk Mengecek Kuota Limit Kamu`, id)
                await limitAdd(serial)
                if (args.length === 0) return kaguya.reply(from, `Kirim perintah *${prefix}dropwater [ Teks ]*, contoh *${prefix}dropwater KAGUYA-SAN*`, id)
                kaguya.reply(from, `[WAIT] Sedang di proses⏳ silahkan tunggu ± 1 min!`, id)
                const water = body.slice(9)
                if (water.length > 15) return kaguya.reply(from, '*Teks Terlalu Panjang!*\n_Maksimal 15 huruf!_', id)
                axios.get(`https://tobz-api.herokuapp.com/api/textpro?theme=dropwater&text=${water}`)
                .then(async(res) => {
                await kaguya.sendImage(from, `${res.data.result}`,'', `Nih...`,id)
                .catch(() => {
                    kaguya.reply(from, 'Ada yang Error!', id)
                })
                })
                break
            case 'skywriting':
                if(isReg(obj)) return
                if (isAfk) return await kaguya.reply(from, `Maaf ${pushname}, Kamu sedang afk! Ketik ${prefix}unafk untuk mematikan`,  id)
                if (isLimit(serial)) return kaguya.reply(from, `Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik ${prefix}limit Untuk Mengecek Kuota Limit Kamu`, id)
                await limitAdd(serial)
                if (args.length === 0) return kaguya.reply(from, `Kirim perintah *${prefix}sandwriting [ Teks ]*, contoh *${prefix}sandwriting JOKER*`, id)
                kaguya.reply(from, `[WAIT] Sedang di proses⏳ silahkan tunggu ± 1 min!`, id)
                const sky = body.slice(12)
                if (sky.length > 15) return kaguya.reply(from, '*Teks Terlalu Panjang!*\n_Maksimal 15 huruf!_', id)
                axios.get(`https://melodicxt.herokuapp.com/api/txtcustom?theme=sky_online&text=${sky}&apiKey=administrator`)
                .then(async(res) => {
                await kaguya.sendImage(from, `${res.data.result}`,'', `Nih...`,id)
                .catch(() => {
                        kaguya.reply(from, 'Ada yang Error!', id)
                })
                })
                break
            case 'sandwriting':
                if(isReg(obj)) return
                if (isAfk) return await kaguya.reply(from, `Maaf ${pushname}, Kamu sedang afk! Ketik ${prefix}unafk untuk mematikan`,  id)
                if (isLimit(serial)) return kaguya.reply(from, `Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik ${prefix}limit Untuk Mengecek Kuota Limit Kamu`, id)
                await limitAdd(serial)
                if (args.length === 0) return kaguya.reply(from, `Kirim perintah *${prefix}sandwriting [ Teks ]*, contoh *${prefix}sandwriting JOKER*`, id)
                kaguya.reply(from, `[WAIT] Sedang di proses⏳ silahkan tunggu ± 1 min!`, id)
                const sand = body.slice(13)
                if (sand.length > 10) return kaguya.reply(from, '*Teks Terlalu Panjang!*\n_Maksimal 10 huruf!_', id)
                axios.get(`https://melodicxt.herokuapp.com/api/txtcustom?theme=sand_engraved&text=${sand}&apiKey=administrator`)
                .then(async(res) => {
                await kaguya.sendImage(from, `${res.data.result}`,'', `Nih...`,id)
                .catch(() => {
                        kaguya.reply(from, 'Ada yang Error!', id)
                })
                })
                break
            case 'greenneon':
                if(isReg(obj)) return
                if (isAfk) return await kaguya.reply(from, `Maaf ${pushname}, Kamu sedang afk! Ketik ${prefix}unafk untuk mematikan`,  id)
                if (isLimit(serial)) return kaguya.reply(from, `Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik ${prefix}limit Untuk Mengecek Kuota Limit Kamu`, id)
                await limitAdd(serial)
                if (args.length === 0) return kaguya.reply(from, `Kirim perintah *${prefix}greenneon [ Teks ]*, contoh *${prefix}greenneon JOKER*`, id)
                kaguya.reply(from, `[WAIT] Sedang di proses⏳ silahkan tunggu ± 1 min!`, id)
                const gre = body.slice(10)
                if (gre.length > 15) return kaguya.reply(from, '*Teks Terlalu Panjang!*\n_Maksimal 10 huruf!_', id)
                axios.get(`https://melodicxt.herokuapp.com/api/txtcustom?theme=green_neon&text=${gre}&apiKey=administrator`)
                .then(async(res) => {
                await kaguya.sendImage(from, `${res.data.result}`,'', `Nih...`,id)
                .catch(() => {
                        kaguya.reply(from, 'Ada yang Error!', id)
                })
                })
                break
            case 'hackert':
                if(isReg(obj)) return
                if (isAfk) return await kaguya.reply(from, `Maaf ${pushname}, Kamu sedang afk! Ketik ${prefix}unafk untuk mematikan`,  id)
                if (isLimit(serial)) return kaguya.reply(from, `Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik ${prefix}limit Untuk Mengecek Kuota Limit Kamu`, id)
                await limitAdd(serial)
                if (args.length === 0) return kaguya.reply(from, `Kirim perintah *${prefix}hackert [ Teks ]*, contoh *${prefix}hackert Anime*`, id)
                kaguya.reply(from, `[WAIT] Sedang di proses⏳ silahkan tunggu ± 1 min!`, id)
                const hac = body.slice(9)
                if (hac.length > 15) return kaguya.reply(from, '*Teks Terlalu Panjang!*\n_Maksimal 10 huruf!_', id)
                axios.get(`https://melodicxt.herokuapp.com/api/txtcustom?theme=matrix&text=${hac}&apiKey=administrator`)
                .then(async(res) => {
                await kaguya.sendImage(from, `${res.data.result}`,'', `Nih...`,id)
                .catch(() => {
                    kaguya.reply(from, 'Ada yang Error!', id)
                })
                })
                break
            case 'glow':
                if(isReg(obj)) return
                if (isAfk) return await kaguya.reply(from, `Maaf ${pushname}, Kamu sedang afk! Ketik ${prefix}unafk untuk mematikan`,  id)
                if (isLimit(serial)) return kaguya.reply(from, `Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik ${prefix}limit Untuk Mengecek Kuota Limit Kamu`, id)
                await limitAdd(serial)
                if (args.length === 0) return kaguya.reply(from, `Kirim perintah *${prefix}glow [ Teks ]*, contoh *${prefix}glow Anime*`, id)
                kaguya.reply(from, `[WAIT] Sedang di proses⏳ silahkan tunggu ± 1 min!`, id)
                const glo = body.slice(6)
                if (glo.length > 15) return kaguya.reply(from, '*Teks Terlalu Panjang!*\n_Maksimal 10 huruf!_', id)
                axios.get(`https://melodicxt.herokuapp.com/api/txtcustom?theme=advanced_glow&text=${glo}&apiKey=administrator`)
                .then(async(res) => {
                await kaguya.sendImage(from, `${res.data.result}`,'', `Nih...`,id)
                .catch(() => {
                    kaguya.reply(from, 'Ada yang Error!', id)
                })
                })
                break
            case 'jokerlogo':
                if(isReg(obj)) return
                if (isAfk) return await kaguya.reply(from, `Maaf ${pushname}, Kamu sedang afk! Ketik ${prefix}unafk untuk mematikan`,  id)
                if (isLimit(serial)) return kaguya.reply(from, `Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik ${prefix}limit Untuk Mengecek Kuota Limit Kamu`, id)
                await limitAdd(serial)
                if (args.length === 0) return kaguya.reply(from, `Kirim perintah *${prefix}jokerlogo [ Teks ]*, contoh *${prefix}jokerlogo JOKER*`, id)
                kaguya.reply(from, `[WAIT] Sedang di proses⏳ silahkan tunggu ± 1 min!`, id)
                const joker = body.slice(9)
                if (joker.length > 10) return kaguya.reply(from, '*Teks Terlalu Panjang!*\n_Maksimal 10 huruf!_', id)
                axios.get(`https://tobz-api.herokuapp.com/api/textpro?theme=jokerlogo&text=${joker}`)
                .then(async(res) => {
                await kaguya.sendImage(from, `${res.data.result}`,'', `Nih...`,id)
                .catch(() => {
                        kaguya.reply(from, 'Ada yang Error!', id)
                })
                })
                break
            case 'marvel':
                if(isReg(obj)) return
                if (isAfk) return await kaguya.reply(from, `Maaf ${pushname}, Kamu sedang afk! Ketik ${prefix}unafk untuk mematikan`,  id)
                if (isLimit(serial)) return kaguya.reply(from, `Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik ${prefix}limit Untuk Mengecek Kuota Limit Kamu`, id)
                await limitAdd(serial)
                if (args.length === 0) return kaguya.reply(from, `Kirim perintah *${prefix}marvel [ |Teks1|Teks2 ]*, contoh *${prefix}marvel |Shinomiya|Kaguya*`, id)
                argz = body.trim().split('|')
                if (argz.length >= 2) {
                kaguya.reply(from, `[WAIT] Sedang di proses⏳ silahkan tunggu ± 1 min!`, id)
                const lmar = argz[1]
                const lmar2 = argz[2]
                if (lmar.length > 10) return kaguya.reply(from, '*Teks1 Terlalu Panjang!*\n_Maksimal 10 huruf!_', id)
                if (lmar2.length > 10) return kaguya.reply(from, '*Teks2 Terlalu Panjang!*\n_Maksimal 10 huruf!_', id)
                axios.get(`https://melodicxt.herokuapp.com/api/txtcustom?theme=marvel_studio&text1=${lmar}&text2=${lmar2}&apiKey=administrator`)
                .then(async(res) => {
                await kaguya.sendImage(from, `${res.data.result}`,'', `Nih...`,id)
                .catch(() => {
                    kaguya.reply(from, 'Ada yang Error!', id)
                })
                })
            } else {
                await kaguya.reply(from, `Wrong Format!\n[❗] Kirim perintah *${prefix}marvel [ |Teks1|Teks2 ]*, contoh *${prefix}marvel |TANAKA|KUN*`, id)
                }
                break        
            case 'lionlogo':
                if(isReg(obj)) return
                if (isAfk) return await kaguya.reply(from, `Maaf ${pushname}, Kamu sedang afk! Ketik ${prefix}unafk untuk mematikan`,  id)
                if (isLimit(serial)) return kaguya.reply(from, `Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik ${prefix}limit Untuk Mengecek Kuota Limit Kamu`, id)
                await limitAdd(serial)
                if (args.length === 0) return kaguya.reply(from, `Kirim perintah *${prefix}lionlogo [ |Teks1|Teks2 ]*, contoh *${prefix}lionlogo |Shinomiya|Kaguya*`, id)
                argz = body.trim().split('|')
                if (argz.length >= 2) {
                kaguya.reply(from, `[WAIT] Sedang di proses⏳ silahkan tunggu ± 1 min!`, id)
                const llio = argz[1]
                const llio2 = argz[2]
                if (llio.length > 10) return kaguya.reply(from, '*Teks1 Terlalu Panjang!*\n_Maksimal 10 huruf!_', id)
                if (llio2.length > 10) return kaguya.reply(from, '*Teks2 Terlalu Panjang!*\n_Maksimal 10 huruf!_', id)
                axios.get(`https://tobz-api.herokuapp.com/api/textpro?theme=lionlogo&text1=${llio}&text2=${llio2}`)
                .then(async(res) => {
                await kaguya.sendImage(from, `${res.data.result}`,'', `Nih...`,id)
                .catch(() => {
                    kaguya.reply(from, 'Ada yang Error!', id)
                })
                })
            } else {
                await kaguya.reply(from, `Wrong Format!\n[❗] Kirim perintah *${prefix}lionlogo [ |Teks1|Teks2 ]*, contoh *${prefix}lionlogo |TANAKA|KUN*`, id)
                }
                break
            case 'ninjalogo':
                if(isReg(obj)) return
                if (isAfk) return await kaguya.reply(from, `Maaf ${pushname}, Kamu sedang afk! Ketik ${prefix}unafk untuk mematikan`,  id)
                if (isLimit(serial)) return kaguya.reply(from, `Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik ${prefix}limit Untuk Mengecek Kuota Limit Kamu`, id)
                await limitAdd(serial)
                if (args.length === 0) return kaguya.reply(from, `Kirim perintah *${prefix}ninjalogo [ |Teks1|Teks2 ]*, contoh *${prefix}ninjalogo |Shinomiya|Kaguya*`, id)
                argz = body.trim().split('|')
                if (argz.length >= 2) {
                kaguya.reply(from, `[WAIT] Sedang di proses⏳ silahkan tunggu ± 1 min!`, id)
                const lnin = argz[1]
                const lnin2 = argz[2]
                if (lnin.length > 10) return kaguya.reply(from, '*Teks1 Terlalu Panjang!*\n_Maksimal 10 huruf!_', id)
                if (lnin2.length > 10) return kaguya.reply(from, '*Teks2 Terlalu Panjang!*\n_Maksimal 10 huruf!_', id)
                axios.get(`https://tobz-api.herokuapp.com/api/textpro?theme=ninjalogo&text1=${lnin}&text2=${lnin2}`)
                .then(async(res) => {
                await kaguya.sendImage(from, `${res.data.result}`,'', `Nih...`,id)
                .catch(() => {
                    kaguya.reply(from, 'Ada yang Error!', id)
                })
                })
            } else {
                await kaguya.reply(from, `Wrong Format!\n[❗] Kirim perintah *${prefix}ninjalogo [ |Teks1|Teks2 ]*, contoh *${prefix}ninjalogo |Hai|Kaguya*`, id)
                }
                break
        case 'text3d':
            if(isReg(obj)) return
            if (isAfk) return await kaguya.reply(from, `Maaf ${pushname}, Kamu sedang afk! Ketik ${prefix}unafk untuk mematikan`,  id)
            if (isLimit(serial)) return kaguya.reply(from, `Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik ${prefix}limit Untuk Mengecek Kuota Limit Kamu`, id)
            if (args.length === 0) return kaguya.reply(from, `Kirim perintah *${prefix}text3d [ Teks ]*, contoh *${prefix}text3d Kaguya*`, id)
            kaguya.reply(from, `[WAIT] Sedang di proses⏳ silahkan tunggu ± 1 min!`, id)
            const t3d = body.slice(7)
            if (t3d.length > 10) return kaguya.reply(from, '*Teks Terlalu Panjang!*\n_Maksimal 10 huruf!_', id)
            await kaguya.sendFileFromUrl(from, `https://docs-jojo.herokuapp.com/api/text3d?text=${t3d}`, 't3d.jpg', '', id)
            break
        case 'tiktoks':
            if(isReg(obj)) return
            if (isAfk) return await kaguya.reply(from, `Maaf ${pushname}, Kamu sedang afk! Ketik ${prefix}unafk untuk mematikan`,  id)
            if (isLimit(serial)) return kaguya.reply(from, `Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik ${prefix}limit Untuk Mengecek Kuota Limit Kamu`, id)
            await limitAdd(serial)
            if (args.length == 0) return kaguya.reply(from, `Untuk mencari user di tiktok, gunakan ${prefix}tiktoks username\n\nContoh: ${prefix}tiktoks Shinomiya-Kaguya`, id)
            kaguyaapi.tikx(args[0])
            .then(async(res) => {
            await kaguya.sendFileFromUrl(from, `${res.link}`, '',`Nih...`, id)
            })
            break
        case 'smule':
            if(isReg(obj)) return
            if (isAfk) return await kaguya.reply(from, `Maaf ${pushname}, Kamu sedang afk! Ketik ${prefix}unafk untuk mematikan`,  id)
            if (isLimit(serial)) return kaguya.reply(from, `Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik ${prefix}limit Untuk Mengecek Kuota Limit Kamu`, id)
            await limitAdd(serial)
            if (args.length == 0) return kaguya.reply(from, `Baka, Masukan Linknya\nContoh: ${prefix}smule https://www.smule.com/bla bla bla`, id)
            kaguyaapi.smul(args[0])
            .then(async(res) => {
            await kaguya.sendFileFromUrl(from, `${res}`, id)
            })
            break
        case 'kusonime':
            if(isReg(obj)) return
            if (isAfk) return await kaguya.reply(from, `Maaf ${pushname}, Kamu sedang afk! Ketik ${prefix}unafk untuk mematikan`,  id)
            if (isLimit(serial)) return kaguya.reply(from, `Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik ${prefix}limit Untuk Mengecek Kuota Limit Kamu`, id)
            
            await limitAdd(serial)
            if (args.length == 0) return kaguya.reply(from, `Maaf Ada Yang Salah!`, id)
            kaguyaapi.kusonime(args[0])
            .then(async(res) => {
            await kaguya.sendFileFromUrl(from, `${res.link}`, '',`${res.text}`, id)
            })
            break
		case 'say':
		case 'bilang':
            if(isReg(obj)) return
            if (isAfk) return await kaguya.reply(from, `Maaf ${pushname}, Kamu sedang afk! Ketik ${prefix}unafk untuk mematikan`,  id)
            if (isLimit(serial)) return kaguya.reply(from, `Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik ${prefix}limit Untuk Mengecek Kuota Limit Kamu`, id)
            
            await limitAdd(serial)
        const says = args.join(' ')
		await kaguya.sendText(from, `${says}`)
		break
        case 'kapankah':
		case 'kapan':
            if(isReg(obj)) return
            if (isAfk) return await kaguya.reply(from, `Maaf ${pushname}, Kamu sedang afk! Ketik ${prefix}unafk untuk mematikan`,  id)
            if (isLimit(serial)) return kaguya.reply(from, `Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik ${prefix}limit Untuk Mengecek Kuota Limit Kamu`, id)
            
            await limitAdd(serial)
            if (!isGroupMsg) return kaguya.reply(from, 'Perintah ini hanya bisa di gunakan dalam group!', id)
            const when = args.join(' ')
            const ans = kapankah[Math.floor(Math.random() * (kapankah.length))]
            if (!when) kaguya.reply(from, `⚠️ Format salah! Ketik *${prefix}menu* untuk penggunaan.`, id)
            await kaguya.sendText(from, `Pertanyaan: *${when}* \n\nJawaban: ${ans}`)
            break
        case 'nilai':
        case 'rate':
            if(isReg(obj)) return
            if (isAfk) return await kaguya.reply(from, `Maaf ${pushname}, Kamu sedang afk! Ketik ${prefix}unafk untuk mematikan`,  id)
            if (isLimit(serial)) return kaguya.reply(from, `Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik ${prefix}limit Untuk Mengecek Kuota Limit Kamu`, id)
            
            await limitAdd(serial)
            if (!isGroupMsg) return kaguya.reply(from, 'Perintah ini hanya bisa di gunakan dalam group!', id)
            const rating = args.join(' ')
            const awr = rate[Math.floor(Math.random() * (rate.length))]
            if (!rating) kaguya.reply(from, `⚠️ Format salah! Ketik *${prefix}menu* untuk penggunaan.`, id)
            await kaguya.sendText(from, `Pertanyaan: *${rating}* \n\nJawaban: ${awr}`)
            break
        case 'apakah':
            if(isReg(obj)) return
            if (isAfk) return await kaguya.reply(from, `Maaf ${pushname}, Kamu sedang afk! Ketik ${prefix}unafk untuk mematikan`,  id)
            if (isLimit(serial)) return kaguya.reply(from, `Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik ${prefix}limit Untuk Mengecek Kuota Limit Kamu`, id)
            
            await limitAdd(serial)
            if (!isGroupMsg) return kaguya.reply(from, 'Perintah ini hanya bisa di gunakan dalam group!', id)
            const nanya = args.join(' ')
            const jawab = apakah[Math.floor(Math.random() * (apakah.length))]
            if (!nanya) kaguya.reply(from, `⚠️ Format salah! Ketik *${prefix}menu* untuk penggunaan.`, id)
            await kaguya.sendText(from, `Pertanyaan: *${nanya}* \n\nJawaban: ${jawab}`)
            break
         case 'bisakah':
            if (isAfk) return await kaguya.reply(from, `Maaf ${pushname}, Kamu sedang afk! Ketik ${prefix}unafk untuk mematikan`,  id)
            if(isReg(obj)) return
            if (isLimit(serial)) return kaguya.reply(from, `Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik ${prefix}limit Untuk Mengecek Kuota Limit Kamu`, id)
            
            await limitAdd(serial)
            if (!isGroupMsg) return kaguya.reply(from, 'Perintah ini hanya bisa di gunakan dalam group!', id)
            const bsk = args.join(' ')
            const jbsk = bisakah[Math.floor(Math.random() * (bisakah.length))]
            if (!bsk) kaguya.reply(from, `⚠️ Format salah! Ketik *${prefix}menu* untuk penggunaan.`, id)
            await kaguya.sendText(from, `Pertanyaan: *${bsk}* \n\nJawaban: ${jbsk}`)
            break
        case 'koin':
            if (isAfk) return await kaguya.reply(from, `Maaf ${pushname}, Kamu sedang afk! Ketik ${prefix}unafk untuk mematikan`,  id)
            if(isReg(obj)) return
            if (isLimit(serial)) return kaguya.reply(from, `Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik ${prefix}limit Untuk Mengecek Kuota Limit Kamu`, id)
            
            await limitAdd(serial)
            if (!isGroupMsg) return kaguya.reply(from, 'Perintah ini hanya bisa di gunakan dalam group!', id)
            const side = Math.floor(Math.random() * 2) + 1
            if (side == 1) {
              kaguya.sendStickerfromUrl(from, 'https://i.ibb.co/YTWZrZV/2003-indonesia-500-rupiah-copy.png', { method: 'get' })
            } else {
              kaguya.sendStickerfromUrl(from, 'https://i.ibb.co/bLsRM2P/2003-indonesia-500-rupiah-copy-1.png', { method: 'get' })
            }
            break
        case 'dadu':
            if (isAfk) return await kaguya.reply(from, `Maaf ${pushname}, Kamu sedang afk! Ketik ${prefix}unafk untuk mematikan`,  id)
            if(isReg(obj)) return
            if (isLimit(serial)) return kaguya.reply(from, `Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik ${prefix}limit Untuk Mengecek Kuota Limit Kamu`, id)
            
            await limitAdd(serial)
            if (!isGroupMsg) return kaguya.reply(from, 'Perintah ini hanya bisa di gunakan dalam group!', id)
            const dice = Math.floor(Math.random() * 6) + 1
            await kaguya.sendStickerfromUrl(from, 'https://www.random.org/dice/dice' + dice + '.png', { method: 'get' })
            break
		case 'hilih':
            if (isAfk) return await kaguya.reply(from, `Maaf ${pushname}, Kamu sedang afk! Ketik ${prefix}unafk untuk mematikan`,  id)
            if(isReg(obj)) return
            if (isLimit(serial)) return kaguya.reply(from, `Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik ${prefix}limit Untuk Mengecek Kuota Limit Kamu`, id)
            
            await limitAdd(serial)
            if (isLimit(serial)) return kaguya.reply(from, `Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik ${prefix}limit Untuk Mengecek Kuota Limit Kamu`, id)
            
            await limitAdd(serial)
		    await kaguya.reply(from, `Mohon Tunggu . . . `, id)
			if (args.length == 0) return await kaguya.reply(from, `Ada Yang Salah Coba Priksa Kembali`, id)
			kaguyaapi.hilih(body.slice(11))
			.then(async(res) => {
				await kaguya.reply(from, `${res}`, id)
			})
			break
		case 'cerpen':
            if (isAfk) return await kaguya.reply(from, `Maaf ${pushname}, Kamu sedang afk! Ketik ${prefix}unafk untuk mematikan`,  id)
            if(isReg(obj)) return
            if (isLimit(serial)) return kaguya.reply(from, `Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik ${prefix}limit Untuk Mengecek Kuota Limit Kamu`, id)
            
            await limitAdd(serial)
			kaguyaapi.cerpen()
			.then(async (res) => {
				await kaguya.reply(from, res.result, id)
			})
			break
		case 'cerpen2':
            if (isAfk) return await kaguya.reply(from, `Maaf ${pushname}, Kamu sedang afk! Ketik ${prefix}unafk untuk mematikan`,  id)
            if(isReg(obj)) return
            if (isLimit(serial)) return kaguya.reply(from, `Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik ${prefix}limit Untuk Mengecek Kuota Limit Kamu`, id)
            
            await limitAdd(serial)
			kaguyaapi.cersex()
			.then(async (res) => {
				await kaguya.reply(from, res.result, id)
			})
			break
        case 'tts':
            if (isAfk) return await kaguya.reply(from, `Maaf ${pushname}, Kamu sedang afk! Ketik ${prefix}unafk untuk mematikan`,  id)
            if(isReg(obj)) return
            if (isLimit(serial)) return kaguya.reply(from, `Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik ${prefix}limit Untuk Mengecek Kuota Limit Kamu`, id)
            
            await limitAdd(serial)
            if (args.length == 0) return kaguya.reply(from, `Mengubah teks menjadi sound (google voice)\nketik: ${prefix}tts <kode_bahasa> <teks>\ncontoh : ${prefix}tts id halo\nuntuk Cek kode bahasa Ketik ${prefix}bahasa`, id)
            const ttsGB = require('node-gtts')(args[0])
            const dataText = body.slice(8)
                if (dataText === '') return kaguya.reply(from, 'Baka, Teks Nya Mana...\nKalau Mau Liat List Text Bahasa Ketik ${prefix}bahasa', id)
                if (dataText.length > 500) return kaguya.reply(from, 'Teks terlalu panjang!', id)
                try {
                    ttsGB.save('./media/tts.mp3', dataText, function () {
                    kaguya.sendPtt(from, './media/tts.mp3', id)
                    })
                } catch (err) {
                    kaguya.reply(from, err, id)
                }
            break
        case 'translate':
            if(isReg(obj)) return
            if (isLimit(serial)) return kaguya.reply(from, `Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik ${prefix}limit Untuk Mengecek Kuota Limit Kamu`, id)
            if (isAfk) return await kaguya.reply(from, `Maaf ${pushname}, Kamu sedang afk! Ketik ${prefix}unafk untuk mematikan`,  id)
            await limitAdd(serial)
            if(args[1] == undefined || args[2] == undefined) return
            if(args.length >= 2){
            var codelang = args[0]
            const text = body.slice(11+codelang.length)
                translatte(text, {to: codelang}).then(res => {
                    kaguya.sendText(from,`Hasil Translate: ${res.text}`)
                    limitAdd(serial)
                }).catch(err => {
                     kaguya.sendText(from,`[ERROR] Teks tidak ada, atau kode bahasa ${codelang} tidak support\n~> *${prefix}bahasa* untuk melihat list kode bahasa`, id);
                })
            }
            break
        case 'maps':
            if(isReg(obj)) return
            if (isLimit(serial)) return kaguya.reply(from, `Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik ${prefix}limit Untuk Mengecek Kuota Limit Kamu`, id)
            if (isAfk) return await kaguya.reply(from, `Maaf ${pushname}, Kamu sedang afk! Ketik ${prefix}unafk untuk mematikan`,  id)
            await limitAdd(serial)
            const map = body.trim().split(' ')
            var slicedArgs = Array.prototype.slice.call(map, 1);
            const mapz = await slicedArgs.join(' ')
            try {
            const mapz2 = await axios.get('https://mnazria.herokuapp.com/api/maps?search=' + mapz)
            const { gambar } = mapz2.data
            const pictk = await bent("buffer")(gambar)
            const base64 = `data:image/jpg;base64,${pictk.toString("base64")}`
            kaguya.sendImage(from, base64, 'error.jpg', `*Hasil Maps : ${mapz}*`)
            } catch {
                kaguya.reply(from, `Maaf Gambar Anime Tidak Ada Di List! ,Coba Ketik ${prefix}list Untuk Melihat List Anime Yang Ada!`, id)
            }
          break
            case 'spamcall':
            if(isReg(obj)) return
            if (isAfk) return await kaguya.reply(from, `Maaf ${pushname}, Kamu sedang afk! Ketik ${prefix}unafk untuk mematikan`,  id)
            if (isLimit(serial)) return kaguya.reply(from, `Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik ${prefix}limit Untuk Mengecek Kuota Limit Kamu`, id)
            await limitAdd(serial)
            if (args.length !== 1) return kaguya.reply(from, `Untuk menggunakan fitur spamcall, ketik :\n${prefix}spamcall 8xxxxxxxxxx\n\nContoh: ${prefix}spamcall 8162437379088`, id)
            kaguyaapi.spamcall(args[0])
            .then(async (res) => {
            await kaguya.reply(from, `${res}`, id)
            })
           break
        case 'covid':
        if(isReg(obj)) return
        if (isAfk) return await kaguya.reply(from, `Maaf ${pushname}, Kamu sedang afk! Ketik ${prefix}unafk untuk mematikan`,  id)
		if (args.length !== 1) return kaguya.reply(from, `Maaf Kota Yang Anda Ketik Tidak Ada!`, id)
            kaguyaapi.cekcovid(args[0])
            .then(async (res) => {
            await kaguya.reply(from, `${res}`, id)
            })
          break
        case 'ceklokasi':
            if (isAfk) return await kaguya.reply(from, `Maaf ${pushname}, Kamu sedang afk! Ketik ${prefix}unafk untuk mematikan`,  id)
            if(isReg(obj)) return
            if (isLimit(serial)) return kaguya.reply(from, `Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik ${prefix}limit Untuk Mengecek Kuota Limit Kamu`, id)
            
            await limitAdd(serial)
            if (quotedMsg.type !== 'location') return kaguya.reply(from, `Maaf, format pesan salah.\nKirimkan lokasi dan reply dengan caption ${prefix}ceklokasi`, id)
            console.log(`Request Status Zona Penyebaran Covid-19 (${quotedMsg.lat}, ${quotedMsg.lng}).`)
            const zoneStatus = await getLocationData(quotedMsg.lat, quotedMsg.lng)
            if (zoneStatus.kode !== 200) kaguya.sendText(from, 'Maaf, Terjadi error ketika memeriksa lokasi yang anda kirim.')
            let datax = ''
            for (let i = 0; i < zoneStatus.data.length; i++) {
                const { zone, region } = zoneStatus.data[i]
                const _zone = zone == 'green' ? 'Hijau* (Aman) \n' : zone == 'yellow' ? 'Kuning* (Waspada) \n' : 'Merah* (Bahaya) \n'
                datax += `${i + 1}. Kel. *${region}* Berstatus *Zona ${_zone}`
            }
            const text = `*CEK LOKASI PENYEBARAN COVID-19*\nHasil pemeriksaan dari lokasi yang anda kirim adalah *${zoneStatus.status}* ${zoneStatus.optional}\n\nInformasi lokasi terdampak disekitar anda:\n${datax}`
            kaguya.sendText(from, text)
            break
        case 'shortlink':
            if (isAfk) return await kaguya.reply(from, `Maaf ${pushname}, Kamu sedang afk! Ketik ${prefix}unafk untuk mematikan`,  id)
            if(isReg(obj)) return
            if (isLimit(serial)) return kaguya.reply(from, `Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik ${prefix}limit Untuk Mengecek Kuota Limit Kamu`, id)
            
            await limitAdd(serial)
            if (args.length == 0) return kaguya.reply(from, `ketik ${prefix}shortlink <url>`, id)
            if (!isUrl(args[0])) return kaguya.reply(from, 'Maaf, url yang kamu kirim tidak valid.', id)
            const shortlink = await urlShortener(args[0])
            await kaguya.sendText(from, shortlink)
            .catch(() => {
                kaguya.reply(from, 'Ada yang Error!', id)
            })
            break
        case 'kadarkehokian' :
            if(isReg(obj)) return
            if (isAfk) return await kaguya.reply(from, `Maaf ${pushname}, Kamu sedang afk! Ketik ${prefix}unafk untuk mematikan`,  id)
            if (!isGroupMsg) return kaguya.reply(from, 'Perintah ini hanya bisa di gunakan dalam group!', id)
            if (isLimit(serial)) return kaguya.reply(from, `Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik ${prefix}limit Untuk Mengecek Kuota Limit Kamu`, id)
            
            await limitAdd(serial)
            kaguya.sendText(from, pintar())
            break
        case 'kadarkepintaran' :
            if(isReg(obj)) return
            if (isAfk) return await kaguya.reply(from, `Maaf ${pushname}, Kamu sedang afk! Ketik ${prefix}unafk untuk mematikan`,  id)
            if (!isGroupMsg) return kaguya.reply(from, 'Perintah ini hanya bisa di gunakan dalam group!', id)
            if (isLimit(serial)) return kaguya.reply(from, `Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik ${prefix}limit Untuk Mengecek Kuota Limit Kamu`, id)
            
            await limitAdd(serial)
            kaguya.sendText(from, kehokian())
            break
		case 'ninja':
            if(isReg(obj)) return
            if (isAfk) return await kaguya.reply(from, `Maaf ${pushname}, Kamu sedang afk! Ketik ${prefix}unafk untuk mematikan`,  id)
            if (isLimit(serial)) return kaguya.reply(from, `Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik ${prefix}limit Untuk Mengecek Kuota Limit Kamu`, id)
            
            await limitAdd(serial)
		    await kaguya.reply(from, `[ WAIT ] Sedang di proses⏳ silahkan tunggu sebentar`, id)
			if (args.length == 0) return await kaguya.reply(from, `${prefix}ninja [Nama Ninja Mu]\nContoh : Shinomiya Kaguya`, id)
			kaguyaapi.ninja(body.slice(11))
			.then(async(res) => {
				await kaguya.reply(from, `${res}`, id)
			})
            break
        case 'stickers':
            if(isReg(obj)) return
            if (isAfk) return await kaguya.reply(from, `Maaf ${pushname}, Kamu sedang afk! Ketik #unafk untuk mematikan`, id)
            if (isLimit(serial)) return kaguya.reply(from, `Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik ${prefix}limit Untuk Mengecek Kuota Limit Kamu`, id)
            await limitAdd(serial)
            if (args.length == 0) return kaguya.reply(from, `Untuk mencari sticker dari pinterest\nketik: ${prefix}sticker2 [search]\ncontoh: ${prefix}sticker2 naruto`, id)
            const cariwallu = body.slice(8)
            const hasilwallu = await images.fdci(cariwallu)
            await kaguya.sendStickerfromUrl(from, hasilwallu, '', '', id)
          .catch(() => {
                kaguya.reply(from, 'Ada yang Error!', id)
            })
          break
		case 'namaindo':
            if(isReg(obj)) return
            if (isAfk) return await kaguya.reply(from, `Maaf ${pushname}, Kamu sedang afk! Ketik ${prefix}unafk untuk mematikan`,  id)
            if (isLimit(serial)) return kaguya.reply(from, `Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik ${prefix}limit Untuk Mengecek Kuota Limit Kamu`, id)
            
            await limitAdd(serial)
		    await kaguya.reply(from, `[ WAIT ] Sedang di proses⏳ silahkan tunggu sebentar`, id)
			if (args.length == 0) return await kaguya.reply(from, `Baka, Pilih Kamu Jenis Kelamin Apa Male Atau Famele\nContoh: ${prefix}namaindo male`, id)
			kaguyaapi.indo(body.slice(11))
			.then(async(res) => {
				await kaguya.reply(from, `${res}`, id)
			})
			break
		case 'bapakfont':
            if(isReg(obj)) return
            if (isLimit(serial)) return kaguya.reply(from, `Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik ${prefix}limit Untuk Mengecek Kuota Limit Kamu`, id)
            if (isAfk) return await kaguya.reply(from, `Maaf ${pushname}, Kamu sedang afk! Ketik ${prefix}unafk untuk mematikan`,  id)
            await limitAdd(serial)
			if (args.length == 0) return kaguya.reply(from, `Mengubah kalimat menjadi alayyyyy\n\nketik ${prefix}bapakfont kalimat`, id)
			kaguyaapi.bapakfont(body.slice(11))
			.then(async(res) => {
				await kaguya.reply(from, `${res}`, id)
			})
			break
		 //Terlarang
		case 'indohot':
            if (!isPrivate) return await kaguya.reply(from, 'Fitur ini hanya dapat digunakan di private chat', id)
            if (isAfk) return await kaguya.reply(from, `Maaf ${pushname}, Kamu sedang afk! Ketik ${prefix}unafk untuk mematikan`,  id)
            if(isReg(obj)) return
            if(cekumur(cekage)) return
            if (isLimit(serial)) return kaguya.reply(from, `Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik ${prefix}limit Untuk Mengecek Kuota Limit Kamu`, id)
            await limitAdd(serial)
			kaguyaapi.baka()
			.then(async (res) => {
				await kaguya.reply(from, `${res}`, id)
			})
			break    
        case 'hentaigif':
            if (!isPrivate) return await kaguya.reply(from, 'Fitur ini hanya dapat digunakan di private chat', id)
            if (isAfk) return await kaguya.reply(from, `Maaf ${pushname}, Kamu sedang afk! Ketik ${prefix}unafk untuk mematikan`,  id)
            if(isReg(obj)) return
            if(cekumur(cekage)) return
            if (isLimit(serial)) return kaguya.reply(from, `Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik ${prefix}limit Untuk Mengecek Kuota Limit Kamu`, id)
            await limitAdd(serial)
            axios.get('https://tobz-api.herokuapp.com/api/nsfwblowjob')
            .then(async(rest) => {
            kaguya.sendStickerfromUrl(from, rest.data.result)
            .catch(() => {
            kaguya.reply(from, 'Sepertinya server sedang error', id)
              })
            })
         break
         case 'pgif':
            if (!isPrivate) return await kaguya.reply(from, 'Fitur ini hanya dapat digunakan di private chat', id)
            if (isAfk) return await kaguya.reply(from, `Maaf ${pushname}, Kamu sedang afk! Ketik ${prefix}unafk untuk mematikan`,  id)
            if(isReg(obj)) return
            if(cekumur(cekage)) return
            if (isLimit(serial)) return kaguya.reply(from, `Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik ${prefix}limit Untuk Mengecek Kuota Limit Kamu`, id)
            await limitAdd(serial)
            axios.get('https://nekobot.xyz/api/image?type=pgif')
            .then(async(rest) => {
            kaguya.sendStickerfromUrl(from, rest.data.message)
            .catch(() => {
            kaguya.reply(from, 'Sepertinya server sedang error', id)
              })
            })
         break
         case 'hass':
            if (!isPrivate) return await kaguya.reply(from, 'Fitur ini hanya dapat digunakan di private chat', id)
            if (isAfk) return await kaguya.reply(from, `Maaf ${pushname}, Kamu sedang afk! Ketik ${prefix}unafk untuk mematikan`,  id)
            if(isReg(obj)) return
            if(cekumur(cekage)) return
            if (isLimit(serial)) return kaguya.reply(from, `Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik ${prefix}limit Untuk Mengecek Kuota Limit Kamu`, id)
            await limitAdd(serial)
            axios.get('https://nekobot.xyz/api/image?type=hass')
            .then(async(rest) => {
            kaguya.sendFileFromUrl(from, rest.data.message)
            .catch(() => {
            kaguya.reply(from, 'Sepertinya server sedang error', id)
              })
            })
         break
         case 'hmidriff':
            if (!isPrivate) return await kaguya.reply(from, 'Fitur ini hanya dapat digunakan di private chat', id)
            if (isAfk) return await kaguya.reply(from, `Maaf ${pushname}, Kamu sedang afk! Ketik ${prefix}unafk untuk mematikan`,  id)
            if(isReg(obj)) return
            if(cekumur(cekage)) return
            if (isLimit(serial)) return kaguya.reply(from, `Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik ${prefix}limit Untuk Mengecek Kuota Limit Kamu`, id)
            await limitAdd(serial)
            axios.get('https://nekobot.xyz/api/image?type=hmidriff')
            .then(async(rest) => {
            kaguya.sendFileFromUrl(from, rest.data.message)
            .catch(() => {
            kaguya.reply(from, 'Sepertinya server sedang error', id)
              })
            })
         break
         case '4k':
            if (!isPrivate) return await kaguya.reply(from, 'Fitur ini hanya dapat digunakan di private chat', id)
            if (isAfk) return await kaguya.reply(from, `Maaf ${pushname}, Kamu sedang afk! Ketik ${prefix}unafk untuk mematikan`,  id)
            if(isReg(obj)) return
            if(cekumur(cekage)) return
            if (isLimit(serial)) return kaguya.reply(from, `Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik ${prefix}limit Untuk Mengecek Kuota Limit Kamu`, id)
            await limitAdd(serial)
            axios.get('https://nekobot.xyz/api/image?type=4k')
            .then(async(rest) => {
            kaguya.sendFileFromUrl(from, rest.data.message)
            .catch(() => {
            kaguya.reply(from, 'Sepertinya server sedang error', id)
              })
            })
         break
         case 'hentai':
            if (!isPrivate) return await kaguya.reply(from, 'Fitur ini hanya dapat digunakan di private chat', id)
            if (isAfk) return await kaguya.reply(from, `Maaf ${pushname}, Kamu sedang afk! Ketik ${prefix}unafk untuk mematikan`,  id)
            if(isReg(obj)) return
            if(cekumur(cekage)) return
            if (isLimit(serial)) return kaguya.reply(from, `Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik ${prefix}limit Untuk Mengecek Kuota Limit Kamu`, id)
            await limitAdd(serial)
            axios.get('https://nekobot.xyz/api/image?type=hentai')
            .then(async(rest) => {
            kaguya.sendFileFromUrl(from, `${rest.data.message}`, 'Hentai.jpg', '', id)
            .catch(() => {
            kaguya.reply(from, 'Sepertinya server sedang error', id)
              })
            })
         break
         case 'hneko':
            if (!isPrivate) return await kaguya.reply(from, 'Fitur ini hanya dapat digunakan di private chat', id)
            if (isAfk) return await kaguya.reply(from, `Maaf ${pushname}, Kamu sedang afk! Ketik ${prefix}unafk untuk mematikan`,  id)
            if(isReg(obj)) return
            if(cekumur(cekage)) return
            if (isLimit(serial)) return kaguya.reply(from, `Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik ${prefix}limit Untuk Mengecek Kuota Limit Kamu`, id)
            await limitAdd(serial)
            axios.get('https://nekobot.xyz/api/image?type=hneko')
            .then(async(rest) => {
            kaguya.sendFileFromUrl(from, rest.data.message)
            .catch(() => {
            kaguya.reply(from, 'Sepertinya server sedang error', id)
              })
            })
         break
         case 'hkitsune':
            if (!isPrivate) return await kaguya.reply(from, 'Fitur ini hanya dapat digunakan di private chat', id)
            if (isAfk) return await kaguya.reply(from, `Maaf ${pushname}, Kamu sedang afk! Ketik ${prefix}unafk untuk mematikan`,  id)
            if(isReg(obj)) return
            if(cekumur(cekage)) return
            if (isLimit(serial)) return kaguya.reply(from, `Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik ${prefix}limit Untuk Mengecek Kuota Limit Kamu`, id)
            await limitAdd(serial)
            axios.get('https://nekobot.xyz/api/image?type=hkitsune')
            .then(async(rest) => {
            kaguya.sendFileFromUrl(from, rest.data.message)
            .catch(() => {
            kaguya.reply(from, 'Sepertinya server sedang error', id)
              })
            })
         break
         case 'anal':
            if (!isPrivate) return await kaguya.reply(from, 'Fitur ini hanya dapat digunakan di private chat', id)
            if (isAfk) return await kaguya.reply(from, `Maaf ${pushname}, Kamu sedang afk! Ketik ${prefix}unafk untuk mematikan`,  id)
            if(isReg(obj)) return
            if(cekumur(cekage)) return
            if (isLimit(serial)) return kaguya.reply(from, `Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik ${prefix}limit Untuk Mengecek Kuota Limit Kamu`, id)
            await limitAdd(serial)
            axios.get('https://nekobot.xyz/api/image?type=anal')
            .then(async(rest) => {
            kaguya.sendFileFromUrl(from, rest.data.message)
            .catch(() => {
            kaguya.reply(from, 'Sepertinya server sedang error', id)
              })
            })
         break
         case 'paizuri':
            if (!isPrivate) return await kaguya.reply(from, 'Fitur ini hanya dapat digunakan di private chat', id)
            if (isAfk) return await kaguya.reply(from, `Maaf ${pushname}, Kamu sedang afk! Ketik ${prefix}unafk untuk mematikan`,  id)
            if(isReg(obj)) return
            if(cekumur(cekage)) return
            if (isLimit(serial)) return kaguya.reply(from, `Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik ${prefix}limit Untuk Mengecek Kuota Limit Kamu`, id)
            await limitAdd(serial)
            axios.get('https://nekobot.xyz/api/image?type=paizuri')
            .then(async(rest) => {
            kaguya.sendFileFromUrl(from, rest.data.message)
            .catch(() => {
            kaguya.reply(from, 'Sepertinya server sedang error', id)
              })
            })
         break
         case 'hanal':
            if (!isPrivate) return await kaguya.reply(from, 'Fitur ini hanya dapat digunakan di private chat', id)
            if (isAfk) return await kaguya.reply(from, `Maaf ${pushname}, Kamu sedang afk! Ketik ${prefix}unafk untuk mematikan`,  id)
            if(isReg(obj)) return
            if(cekumur(cekage)) return
            if (isLimit(serial)) return kaguya.reply(from, `Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik ${prefix}limit Untuk Mengecek Kuota Limit Kamu`, id)
            await limitAdd(serial)
            axios.get('https://nekobot.xyz/api/image?type=hanal')
            .then(async(rest) => {
            kaguya.sendFileFromUrl(from, rest.data.message)
            .catch(() => {
            kaguya.reply(from, 'Sepertinya server sedang error', id)
              })
            })
         break
         case 'gonewild':
            if (!isPrivate) return await kaguya.reply(from, 'Fitur ini hanya dapat digunakan di private chat', id)
            if (isAfk) return await kaguya.reply(from, `Maaf ${pushname}, Kamu sedang afk! Ketik ${prefix}unafk untuk mematikan`,  id)
            if(isReg(obj)) return
            if(cekumur(cekage)) return
            if (isLimit(serial)) return kaguya.reply(from, `Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik ${prefix}limit Untuk Mengecek Kuota Limit Kamu`, id)
            await limitAdd(serial)
            axios.get('https://nekobot.xyz/api/image?type=gonewild')
            .then(async(rest) => {
            kaguya.sendFileFromUrl(from, rest.data.message)
            .catch(() => {
            kaguya.reply(from, 'Sepertinya server sedang error', id)
              })
            })
         break
         case 'ass':
            if (!isPrivate) return await kaguya.reply(from, 'Fitur ini hanya dapat digunakan di private chat', id)
            if (isAfk) return await kaguya.reply(from, `Maaf ${pushname}, Kamu sedang afk! Ketik ${prefix}unafk untuk mematikan`,  id)
            if(isReg(obj)) return
            if(cekumur(cekage)) return
            if (isLimit(serial)) return kaguya.reply(from, `Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik ${prefix}limit Untuk Mengecek Kuota Limit Kamu`, id)
            await limitAdd(serial)
            axios.get('https://nekobot.xyz/api/image?type=ass')
            .then(async(rest) => {
            kaguya.sendFileFromUrl(from, rest.data.message)
            .catch(() => {
            kaguya.reply(from, 'Sepertinya server sedang error', id)
              })
            })
         break
         case 'pussy':
            if (!isPrivate) return await kaguya.reply(from, 'Fitur ini hanya dapat digunakan di private chat', id)
            if (isAfk) return await kaguya.reply(from, `Maaf ${pushname}, Kamu sedang afk! Ketik ${prefix}unafk untuk mematikan`,  id)
            if(isReg(obj)) return
            if(cekumur(cekage)) return
            if (isLimit(serial)) return kaguya.reply(from, `Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik ${prefix}limit Untuk Mengecek Kuota Limit Kamu`, id)
            await limitAdd(serial)
            axios.get('https://nekobot.xyz/api/image?type=pussy')
            .then(async(rest) => {
            kaguya.sendFileFromUrl(from, rest.data.message)
            .catch(() => {
            kaguya.reply(from, 'Sepertinya server sedang error', id)
              })
            })
         break
         case 'thigh':
            if (!isPrivate) return await kaguya.reply(from, 'Fitur ini hanya dapat digunakan di private chat', id)
            if (isAfk) return await kaguya.reply(from, `Maaf ${pushname}, Kamu sedang afk! Ketik ${prefix}unafk untuk mematikan`,  id)
            if(isReg(obj)) return
            if(cekumur(cekage)) return
            if (isLimit(serial)) return kaguya.reply(from, `Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik ${prefix}limit Untuk Mengecek Kuota Limit Kamu`, id)
            await limitAdd(serial)
            axios.get('https://nekobot.xyz/api/image?type=thigh')
            .then(async(rest) => {
            kaguya.sendFileFromUrl(from, rest.data.message)
            .catch(() => {
            kaguya.reply(from, 'Sepertinya server sedang error', id)
              })
            })
         break
         case 'hthigh':
            if (!isPrivate) return await kaguya.reply(from, 'Fitur ini hanya dapat digunakan di private chat', id)
            if (isAfk) return await kaguya.reply(from, `Maaf ${pushname}, Kamu sedang afk! Ketik ${prefix}unafk untuk mematikan`,  id)
            if(isReg(obj)) return
            if(cekumur(cekage)) return
            if (isLimit(serial)) return kaguya.reply(from, `Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik ${prefix}limit Untuk Mengecek Kuota Limit Kamu`, id)
            await limitAdd(serial)
            axios.get('https://nekobot.xyz/api/image?type=hthigh')
            .then(async(rest) => {
            kaguya.sendFileFromUrl(from, rest.data.message)
            .catch(() => {
            kaguya.reply(from, 'Sepertinya server sedang error', id)
              })
            })
         break
         case 'tentacle':
            if (!isPrivate) return await kaguya.reply(from, 'Fitur ini hanya dapat digunakan di private chat', id)
            if (isAfk) return await kaguya.reply(from, `Maaf ${pushname}, Kamu sedang afk! Ketik ${prefix}unafk untuk mematikan`,  id)
            if(isReg(obj)) return
            if(cekumur(cekage)) return
            if (isLimit(serial)) return kaguya.reply(from, `Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik ${prefix}limit Untuk Mengecek Kuota Limit Kamu`, id)
            await limitAdd(serial)
            axios.get('https://nekobot.xyz/api/image?type=tentacle')
            .then(async(rest) => {
            kaguya.sendFileFromUrl(from, rest.data.message)
            .catch(() => {
            kaguya.reply(from, 'Sepertinya server sedang error', id)
              })
            })
         break
         case 'boobs':
            if (!isPrivate) return await kaguya.reply(from, 'Fitur ini hanya dapat digunakan di private chat', id)
            if (isAfk) return await kaguya.reply(from, `Maaf ${pushname}, Kamu sedang afk! Ketik ${prefix}unafk untuk mematikan`,  id)
            if(isReg(obj)) return
            if(cekumur(cekage)) return
            if (isLimit(serial)) return kaguya.reply(from, `Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik ${prefix}limit Untuk Mengecek Kuota Limit Kamu`, id)
            await limitAdd(serial)
            axios.get('https://nekobot.xyz/api/image?type=boobs')
            .then(async(rest) => {
            kaguya.sendFileFromUrl(from, rest.data.message)
            .catch(() => {
            kaguya.reply(from, 'Sepertinya server sedang error', id)
              })
            })
         break
         case 'hboobs':
            if (!isPrivate) return await kaguya.reply(from, 'Fitur ini hanya dapat digunakan di private chat', id)
            if (isAfk) return await kaguya.reply(from, `Maaf ${pushname}, Kamu sedang afk! Ketik ${prefix}unafk untuk mematikan`,  id)
            if(isReg(obj)) return
            if(cekumur(cekage)) return
            if (isLimit(serial)) return kaguya.reply(from, `Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik ${prefix}limit Untuk Mengecek Kuota Limit Kamu`, id)
            await limitAdd(serial)
            axios.get('https://nekobot.xyz/api/image?type=hboobs')
            .then(async(rest) => {
            kaguya.sendFileFromUrl(from, rest.data.message)
            .catch(() => {
            kaguya.reply(from, 'Sepertinya server sedang error', id)
              })
            })
         break
         case 'hot':
            if (!isPrivate) return await kaguya.reply(from, 'Fitur ini hanya dapat digunakan di private chat', id)
            if (isAfk) return await kaguya.reply(from, `Maaf ${pushname}, Kamu sedang afk! Ketik ${prefix}unafk untuk mematikan`,  id)
            if(isReg(obj)) return
            if(cekumur(cekage)) return
            if (isLimit(serial)) return kaguya.reply(from, `Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik ${prefix}limit Untuk Mengecek Kuota Limit Kamu`, id)
            await limitAdd(serial)

                const mskkntl = fs.readFileSync('./lib/data/18+.json') 
                const kntlnya = JSON.parse(mskkntl)
                const rindBkp = Math.floor(Math.random() * kntlnya.length)
                const rindBkep = kntlnya[rindBkp]
                kaguya.sendFileFromUrl(from, rindBkep.image, 'Bokep.jpg', rindBkep.teks, id)
                break
        case 'nekopoi':
            if(isReg(obj)) return
            if(cekumur(cekage)) return
            if (isAfk) return await kaguya.reply(from, `Maaf ${pushname}, Kamu sedang afk! Ketik ${prefix}unafk untuk mematikan`,  id)
            if (isLimit(serial)) return kaguya.reply(from, `Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik ${prefix}limit Untuk Mengecek Kuota Limit Kamu`, id)
            await limitAdd(serial)
            if (!isPrivate) return await kaguya.reply(from, 'Fitur ini hanya dapat digunakan di private chat', id)
                if (!isGroupMsg) return kaguya.reply(from, 'Perintah ini hanya bisa di gunakan di dalam Grup!', id) 
                const neko = fs.readFileSync('./lib/data/akopoi.json') 
                const poi = JSON.parse(neko)
                const dameyo = Math.floor(Math.random() * poi.length)
                const yamete = poi[dameyo]
                kaguya.sendFileFromUrl(from, yamete.image, 'nekopoi.jpg', yamete.teks, id)
                break			
	    case 'picanime':
            if (!isPrivate) return await kaguya.reply(from, 'Fitur ini hanya dapat digunakan di private chat', id)
            if (isAfk) return await kaguya.reply(from, `Maaf ${pushname}, Kamu sedang afk! Ketik ${prefix}unafk untuk mematikan`,  id)
            if(isReg(obj)) return
            if(cekumur(cekage)) return
            if (isLimit(serial)) return kaguya.reply(from, `Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik ${prefix}limit Untuk Mengecek Kuota Limit Kamu`, id)
            await limitAdd(serial)
            const pcz = body.trim().split(' ')
            var slicedArgs = Array.prototype.slice.call(pcz, 1);
            const picz = await slicedArgs.join(' ')
            try {
            const picz2 = await axios.get('https://mnazria.herokuapp.com/api/picanime?list=' + picz)
            const { gambar } = picz2.data
            const pictk = await bent("buffer")(gambar)
            const base64 = `data:image/jpg;base64,${pictk.toString("base64")}`
            kaguya.sendImage(from, base64, 'baka.jpg')
                } catch {
                kaguya.reply(from, `Maaf Gambar Anime Tidak Ada Di List! ,Coba Ketik ${prefix}list Untuk Melihat List Anime Yang Ada!`, id)
                }
              break			
        //Fun Menu
        case 'klasemen':
		case 'klasmen':
            if (isAfk) return await kaguya.reply(from, `Maaf ${pushname}, Kamu sedang afk! Ketik ${prefix}unafk untuk mematikan`,  id)
            if(isReg(obj)) return
            if (isLimit(serial)) return kaguya.reply(from, `Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik ${prefix}limit Untuk Mengecek Kuota Limit Kamu`, id)
            await limitAdd(serial)
			if (!isGroupMsg) return kaguya.reply(from, 'Maaf, perintah ini hanya dapat dipakai didalam grup!', id)
			const klasemen = db.get('group').filter({id: groupId}).map('members').value()[0]
            let urut = Object.entries(klasemen).map(([key, val]) => ({id: key, ...val})).sort((a, b) => b.denda - a.denda);
            let textKlas = "*Klasemen Denda Sementara*\n"
            let i = 1;
            urut.forEach((klsmn) => {
            textKlas += i+". @"+klsmn.id.replace('@c.us', '')+" ➤ Rp"+formatin(klsmn.denda)+"\n"
            i++
            });
            await kaguya.sendTextWithMentions(from, textKlas)
			break

        // Group Commands (group admin only)
        case 'limit':
            if(isReg(obj)) return
            if (!isGroupMsg) return kaguya.reply(from, `Perintah ini hanya bisa di gunakan dalam group!`, id)
            var found = false
            const limidat = JSON.parse(fs.readFileSync('./lib/data/limit.json'))
            for(let lmt of limidat){
                if(lmt.id === serial){
                    let limitCounts = limitCount-lmt.limit
                    if(limitCounts <= 0) return kaguya.reply(from, `Limit request anda sudah habis\n\n_Note : Untuk Mendapatkan Limit Silahkan Chat Owner bot!_`, id)
                    kaguya.reply(from, `Sisa limit request anda tersisa : *${limitCounts}*\n\n_Note : Untuk Mendapatkan Limit Silahkan Chat Owner bot!_`, id)
                    found = true
                }
            }
            console.log(limit)
            console.log(limidat)
            if (found === false){
                let obj = {id: `${serial}`, limit:1};
                limit.push(obj);
                fs.writeFileSync('./lib/data/limit.json',JSON.stringify(limit, 1));
                kaguya.reply(from, `Sisa limit request anda tersisa : *${limitCount}*\n\n_Note : Untuk Mendapatkan Limit Silahkan Chat Owner bot!_`, id)
            }
            break
        case 'gift':
            if (!isOwnerBot) return kaguya.reply(from, `Maaf, perintah ini hanya dapat dilakukan oleh Owner Bot!`, id)
                    const nomerr = arg.split(' ')[0]
                    const jmla = arg.split(' ')[1]
                    if(!nomerr) return kaguya.reply(from, `Masukkan nomor yang akan di gift, ${prefix}gift [ @tagmember Jumlah ]\n=> Contoh : ${prefix}gift @62813118507151 15`, id)
                    let texta = nomerr.replace(/[-\s+@c.us]/g,'')
                    const cusz = texta + '@c.us'
                    if(!jmla) return kaguya.reply(from, `Masukkan Jumlah gift quota, ${prefix}gift [ @tagmember Jumlah ]\n=> Contoh : ${prefix}gift @62813118507151 15`, id)
                    if(jmla > 20) return await kaguya.reply(from, `Maximal  20!`, id)
                        var found = false
                        Object.keys(limit).forEach((i) => {
                            if(limit[i].id == cusz){
                                found = i
                            }
                        })
                        if (found !== false) {
                            limit[found].limit = Math.max(0, limit[found].limit);
                            if(limit[found].limit <= 20) return kaguya.reply(from, `Kuota Limit pada nomor tersebut masih penuh\nUntuk gift pastikan kuota limit target sudah habis`, id)
                            if(limit[found].limit <= 0) { // JIKA LIMIT 0 MAKA BISA GIFT
                                return kaguya.reply(from, `Kuota limit pada nomor tersebut sudah penuh!`, id)
                            }else{
                            limit[found].limit -= jmla
                            const updated = limit[found]
                            const result = `Gift kuota limit sukses dengan pada ${moment().format('DD/MM/YY HH:mm:ss')}
╭───「 *GIF LIMIT* 」───
│++
│+ [SN]: ${SN}
│+ User : @${updated.id.replace('@c.us','')}
│+ Limit: ${limitCount-updated.limit}
│++
│
╰───────────────────`
                            console.log(limit[found])
                            fs.writeFileSync('./lib/data/limit.json',JSON.stringify(limit));
                            kaguya.sendTextWithMentions(from, result)
                            }
                        } else {
                                kaguya.reply(from, `Maaf, nomor itu tidak terdaftar di database!`, id)
                        }
                break
	case 'listbanned':
            if(isReg(obj)) return

            let bened = `Nomor Yang Sudah Di Banned\nTotal : ${banned.length}\n`
            for (let i of banned) {
                bened += `➸ ${i.replace(/@c.us/g,'')}\n`
            }
            await kaguya.reply(from, bened, id)
            break
	case 'listblock':
            if(isReg(obj)) return

            let hih = `Nomor Yang Sudah Di Block\nTotal : ${blockNumber.length}\n`
            for (let i of blockNumber) {
                hih += `➸ ${i.replace(/@c.us/g,'')}\n`
            }
            await kaguya.reply(from, hih, id)
            break
	case 'ownergc':
            if(isReg(obj)) return

            if (!isGroupMsg) return kaguya.reply(from, 'Perintah ini hanya bisa di gunakan dalam group!', id)
            const Owner_ = chat.groupMetadata.owner
            await kaguya.sendTextWithMentions(from, `Owner Group : @${Owner_}`)
            break
	case 'adminlist':
	        if(isReg(obj)) return

            if (!isGroupMsg) return kaguya.reply(from, 'Perintah ini hanya bisa di gunakan dalam group!', id)
            let mimin = ''
            for (let admon of groupAdmins) {
                mimin += `➸ @${admon.replace(/@c.us/g, '')}\n` 
            }
            await kaguya.sendTextWithMentions(from, mimin)
            break
	    case 'add':
            if (!isGroupMsg) return kaguya.reply(from, 'Maaf, perintah ini hanya dapat dipakai didalam grup!', id)
            if (!isGroupAdmins) return kaguya.reply(from, 'Gagal, perintah ini hanya dapat digunakan oleh admin grup!', id)
            if (!isBotGroupAdmins) return kaguya.reply(from, 'Gagal, silahkan tambahkan bot sebagai admin grup!', id)
	        if (args.length !== 1) return kaguya.reply(from, `Untuk menggunakan ${prefix}add\nPenggunaan: ${prefix}add <nomor>\ncontoh: ${prefix}add 628xxx`, id)
                try {
                    await kaguya.addParticipant(from,`${args[0]}@c.us`)
                } catch {
                    kaguya.reply(from, 'Tidak dapat menambahkan target', id)
                }
            break
        case 'kick':
            if (!isGroupMsg) return kaguya.reply(from, 'Maaf, perintah ini hanya dapat dipakai didalam grup!', id)
            if (!isGroupAdmins) return kaguya.reply(from, 'Gagal, perintah ini hanya dapat digunakan oleh admin grup!', id)
            if (!isBotGroupAdmins) return kaguya.reply(from, 'Gagal, silahkan tambahkan bot sebagai admin grup!', id)
            if (mentionedJidList.length === 0) return kaguya.reply(from, 'Maaf, format pesan salah.\nSilahkan tag satu atau lebih orang yang akan dikeluarkan', id)
            if (mentionedJidList[0] === botNumber) return await kaguya.reply(from, 'Maaf, format pesan salah.\nTidak dapat mengeluarkan akun bot sendiri', id)
            await kaguya.sendTextWithMentions(from, `Request diterima, mengeluarkan:\n${mentionedJidList.map(x => `@${x.replace('@c.us', '')}`).join('\n')}`)
            for (let i = 0; i < mentionedJidList.length; i++) {
                if (groupAdmins.includes(mentionedJidList[i])) return await kaguya.sendText(from, 'Gagal, kamu tidak bisa mengeluarkan admin grup.')
                await kaguya.removeParticipant(groupId, mentionedJidList[i])
            }
            break
        case 'promote':
            if (!isGroupMsg) return kaguya.reply(from, 'Maaf, perintah ini hanya dapat dipakai didalam grup!', id)
            if (!isGroupAdmins) return kaguya.reply(from, 'Gagal, perintah ini hanya dapat digunakan oleh admin grup!', id)
            if (!isBotGroupAdmins) return kaguya.reply(from, 'Gagal, silahkan tambahkan bot sebagai admin grup!', id)
            if (mentionedJidList.length !== 1) return kaguya.reply(from, 'Maaf, hanya bisa mempromote 1 user', id)
            if (groupAdmins.includes(mentionedJidList[0])) return await kaguya.reply(from, 'Maaf, user tersebut sudah menjadi admin.', id)
            if (mentionedJidList[0] === botNumber) return await kaguya.reply(from, 'Maaf, format pesan salah.\nTidak dapat mempromote akun bot sendiri', id)
            await kaguya.promoteParticipant(groupId, mentionedJidList[0])
            await kaguya.sendTextWithMentions(from, `Request diterima, menambahkan @${mentionedJidList[0].replace('@c.us', '')} sebagai admin.`)
            break
        case 'demote':
            if (!isGroupMsg) return kaguya.reply(from, 'Maaf, perintah ini hanya dapat dipakai didalam grup!', id)
            if (!isGroupAdmins) return kaguya.reply(from, 'Gagal, perintah ini hanya dapat digunakan oleh admin grup!', id)
            if (!isBotGroupAdmins) return kaguya.reply(from, 'Gagal, silahkan tambahkan bot sebagai admin grup!', id)
            if (mentionedJidList.length !== 1) return kaguya.reply(from, 'Maaf, hanya bisa mendemote 1 user', id)
            if (!groupAdmins.includes(mentionedJidList[0])) return await kaguya.reply(from, 'Maaf, user tersebut belum menjadi admin.', id)
            if (mentionedJidList[0] === botNumber) return await kaguya.reply(from, 'Maaf, format pesan salah.\nTidak dapat mendemote akun bot sendiri', id)
            await kaguya.demoteParticipant(groupId, mentionedJidList[0])
            await kaguya.sendTextWithMentions(from, `Request diterima, menghapus jabatan @${mentionedJidList[0].replace('@c.us', '')}.`)
            break
        case 'bye':
            if (!isGroupMsg) return kaguya.reply(from, 'Maaf, perintah ini hanya dapat dipakai didalam grup!', id)
            if (!isGroupAdmins) return kaguya.reply(from, 'Gagal, perintah ini hanya dapat digunakan oleh admin grup!', id)
            kaguya.sendText(from, 'Good bye... ( ⇀‸↼‶ )').then(() => kaguya.leaveGroup(groupId))
            break
        case 'del':
        case 'delete':
            if (!quotedMsg) return kaguya.reply(from, `Maaf, format pesan salah silahkan.\nReply pesan bot dengan caption ${prefix}del`, id)
            if (!quotedMsgObj.fromMe) return kaguya.reply(from, `Maaf, format pesan salah silahkan.\nReply pesan bot dengan caption ${prefix}del`, id)
            kaguya.deleteMessage(quotedMsgObj.chatId, quotedMsgObj.id, false)
            break
        case 'join':
            if (args.length == 0) return kaguya.reply(from, `Jika kalian ingin mengundang bot kegroup silahkan invite atau dengan\nketik ${prefix}join [link group]`, id)
            let linkgrup = body.slice(6)
            let islink = linkgrup.match(/(https:\/\/chat.whatsapp.com)/gi)
            let chekgrup = await kaguya.inviteInfo(linkgrup)
            if (!islink) return kaguya.reply(from, 'Maaf link group-nya salah! silahkan kirim link yang benar', id)
            if (isOwnerBot) {
                await kaguya.joinGroupViaLink(linkgrup)
                      .then(async () => {
                          await kaguya.sendText(from, 'Berhasil join grup via link!')
                          await kaguya.sendText(chekgrup.id, `Hai minna~, Watashi no namae wa Shinomiya Kaguya desu Hajimemashite`)
                      })
            } else {
                let cgrup = await kaguya.getAllGroups()
                if (cgrup.length > groupLimit) return kaguya.reply(from, `Gomennasai, Grup Bot Full\nMax Group is: ${groupLimit}`, id)
                if (cgrup.size < memberLimit) return kaguya.reply(from, `Gomennasai, Member Pada Grup Terlalu Dedikit Mainimal ${memberLimit} Orang`, id)
                await kaguya.joinGroupViaLink(linkgrup)
                      .then(async () =>{
                          await kaguya.reply(from, 'Berhasil join grup via link!', id)
                      })
                      .catch(() => {
                          kaguya.reply(from, 'Gagal!', id)
                      })
            }
            break
        case 'tagall':
        case 'everyone':

            if (!isGroupMsg) return kaguya.reply(from, 'Maaf, perintah ini hanya dapat dipakai didalam grup!', id)
            if (!isGroupAdmins) return kaguya.reply(from, 'Gagal, perintah ini hanya dapat digunakan oleh admin grup!', id)
            const groupMem = await kaguya.getGroupMembers(groupId)
            let hehex = '╔══✪〘 Mention All 〙✪══\n'
            for (let i = 0; i < groupMem.length; i++) {
                hehex += '╠➥'
                hehex += ` @${groupMem[i].id.replace(/@c.us/g, '')}\n`
            }
            hehex += '╚═〘 *K A G U Y A  B O T* 〙'
            await kaguya.sendTextWithMentions(from, hehex)
            break
		case 'katakasar':
            if (isAfk) return await kaguya.reply(from, `Maaf ${pushname}, Kamu sedang afk! Ketik ${prefix}unafk untuk mematikan`,  id)
            if (isLimit(serial)) return kaguya.reply(from, `Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik ${prefix}limit Untuk Mengecek Kuota Limit Kamu`, id)
            await limitAdd(serial)
			if (!isGroupMsg) return kaguya.reply(from, 'Maaf, perintah ini hanya dapat dipakai didalam grup!', id)
			kaguya.reply(from, `Untuk mengaktifkan Fitur Kata Kasar pada Group Chat\n\nApasih kegunaan Fitur Ini? Apabila seseorang mengucapkan kata kasar akan mendapatkan denda\n\nPenggunaan\n${prefix}kasar on --mengaktifkan\n${prefix}kasar off --nonaktifkan\n\n${prefix}reset --reset jumlah denda`, id)
			break
		case 'kasar':
            if (isLimit(serial)) return kaguya.reply(from, `Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik ${prefix}limit Untuk Mengecek Kuota Limit Kamu`, id)
            if (isAfk) return await kaguya.reply(from, `Maaf ${pushname}, Kamu sedang afk! Ketik ${prefix}unafk untuk mematikan`,  id)
            await limitAdd(serial)
			if (!isGroupMsg) return kaguya.reply(from, 'Maaf, perintah ini hanya dapat dipakai didalam grup!', id)
            if (!isGroupAdmins) return kaguya.reply(from, 'Gagal, perintah ini hanya dapat digunakan oleh admin grup!', id)
			if (args.length !== 1) return kaguya.reply(from, `Untuk mengaktifkan Fitur Kata Kasar pada Group Chat\n\nApasih kegunaan Fitur Ini? Apabila seseorang mengucapkan kata kasar akan mendapatkan denda\n\nPenggunaan\n${prefix}kasar on --mengaktifkan\n${prefix}kasar off --nonaktifkan\n\n${prefix}reset --reset jumlah denda`, id)
			if (args[0] == 'on') {
				ngegas.push(chatId)
				fs.writeFileSync('./settings/ngegas.json', JSON.stringify(ngegas))
				kaguya.reply(from, 'Fitur Anti Kasar sudah di Aktifkan', id)
			} else if (args[0] == 'off') {
				let nixx = ngegas.indexOf(chatId)
				ngegas.splice(nixx, 1)
				fs.writeFileSync('./settings/ngegas.json', JSON.stringify(ngegas))
				kaguya.reply(from, 'Fitur Anti Kasar sudah di non-Aktifkan', id)
			} else {
				kaguya.reply(from, `Untuk mengaktifkan Fitur Kata Kasar pada Group Chat\n\nApasih kegunaan Fitur Ini? Apabila seseorang mengucapkan kata kasar akan mendapatkan denda\n\nPenggunaan\n${prefix}kasar on --mengaktifkan\n${prefix}kasar off --nonaktifkan\n\n${prefix}reset --reset jumlah denda`, id)
			}
            break
        case 'simisimi':
            if (isAfk) return await kaguya.reply(from, `Maaf ${pushname}, Kamu sedang afk! Ketik ${prefix}unafk untuk mematikan`,  id)
            if (!isGroupMsg) return aruga.reply(from, 'Maaf, perintah ini hanya dapat dipakai didalam grup!', id)
            kaguya.reply(from, `Untuk mengaktifkan simi-simi pada Group Chat\n\nPenggunaan\n${prefix}simi on --mengaktifkan\n${prefix}simi off --nonaktifkan\n`, id)
            break
        case 'simi':
            if (isAfk) return await kaguya.reply(from, `Maaf ${pushname}, Kamu sedang afk! Ketik ${prefix}unafk untuk mematikan`,  id)
            if (!isGroupMsg) return aruga.reply(from, 'Maaf, perintah ini hanya dapat dipakai didalam grup!', id)
            if (!isGroupAdmins) return kaguya.reply(from, 'Gagal, perintah ini hanya dapat digunakan oleh admin grup!', id)
            if (args.length !== 1) return kaguya.reply(from, `Untuk mengaktifkan simi-simi pada Group Chat\n\nPenggunaan\n${prefix}simi on --mengaktifkan\n${prefix}simi off --nonaktifkan\n`, id)
            if (args[0] == 'on') {
                simi.push(chatId)
                fs.writeFileSync('./settings/simi.json', JSON.stringify(simi))
                kaguya.reply(from, 'Mengaktifkan bot simi-simi!', id)
            } else if (args[0] == 'off') {
                let inxx = simi.indexOf(chatId)
                simi.splice(inxx, 1)
                fs.writeFileSync('./settings/simi.json', JSON.stringify(simi))
                kaguya.reply(from, 'Menonaktifkan bot simi-simi!', id)
            } else {
                kaguya.reply(from, `Untuk mengaktifkan simi-simi pada Group Chat\n\nPenggunaan\n${prefix}simi on --mengaktifkan\n${prefix}simi off --nonaktifkan\n`, id)
            }
            break
		case 'reset':
            if (isLimit(serial)) return kaguya.reply(from, `Maaf ${pushname}, Kuota Limit Kamu Sudah Habis, Ketik ${prefix}limit Untuk Mengecek Kuota Limit Kamu`, id)
            if (isAfk) return await kaguya.reply(from, `Maaf ${pushname}, Kamu sedang afk! Ketik ${prefix}unafk untuk mematikan`,  id)
            await limitAdd(serial)
			if (!isGroupMsg) return kaguya.reply(from, 'Maaf, perintah ini hanya dapat dipakai didalam grup!', id)
            if (!isGroupAdmins) return kaguya.reply(from, 'Gagal, perintah ini hanya dapat digunakan oleh admin grup!', id)
			const reset = db.get('group').find({ id: groupId }).assign({ members: []}).write()
            if(reset){
				await kaguya.sendText(from, "Klasemen telah direset.")
            }
			break
		case 'mutegrup':

			if (!isGroupMsg) return kaguya.reply(from, 'Maaf, perintah ini hanya dapat dipakai didalam grup!', id)
            if (!isGroupAdmins) return kaguya.reply(from, 'Gagal, perintah ini hanya dapat digunakan oleh admin grup!', id)
            if (!isBotGroupAdmins) return kaguya.reply(from, 'Gagal, silahkan tambahkan bot sebagai admin grup!', id)
			if (args.length !== 1) return kaguya.reply(from, `Untuk mengubah settingan group chat agar hanya admin saja yang bisa chat\n\nPenggunaan:\n${prefix}mutegrup on --aktifkan\n${prefix}mutegrup off --nonaktifkan`, id)
            if (args[0] == 'on') {
				kaguya.setGroupToAdminsOnly(groupId, true).then(() => kaguya.sendText(from, 'Berhasil mengubah agar hanya admin yang dapat chat!'))
			} else if (args[0] == 'off') {
				kaguya.setGroupToAdminsOnly(groupId, false).then(() => kaguya.sendText(from, 'Berhasil mengubah agar semua anggota dapat chat!'))
			} else {
				kaguya.reply(from, `Untuk mengubah settingan group chat agar hanya admin saja yang bisa chat\n\nPenggunaan:\n${prefix}mutegrup on --aktifkan\n${prefix}mutegrup off --nonaktifkan`, id)
			}
			break
		case 'setprofile':

			if (!isGroupMsg) return kaguya.reply(from, 'Maaf, perintah ini hanya dapat dipakai didalam grup!', id)
            if (!isGroupAdmins) return kaguya.reply(from, 'Gagal, perintah ini hanya dapat digunakan oleh admin grup!', id)
            if (!isBotGroupAdmins) return kaguya.reply(from, 'Gagal, silahkan tambahkan bot sebagai admin grup!', id)
			if (isMedia && type == 'image' || isQuotedImage) {
				const dataMedia = isQuotedImage ? quotedMsg : message
				const _mimetype = dataMedia.mimetype
				const mediaData = await decryptMedia(dataMedia, uaOverride)
				const imageBase64 = `data:${_mimetype};base64,${mediaData.toString('base64')}`
				await kaguya.setGroupIcon(groupId, imageBase64)
			} else if (args.length === 1) {
				if (!isUrl(url)) { await kaguya.reply(from, 'Maaf, link yang kamu kirim tidak valid.', id) }
				kaguya.setGroupIconByUrl(groupId, url).then((r) => (!r && r !== undefined)
				? kaguya.reply(from, 'Maaf, link yang kamu kirim tidak memuat gambar.', id)
				: kaguya.reply(from, 'Berhasil mengubah profile group', id))
			} else {
				kaguya.reply(from, `Commands ini digunakan untuk mengganti icon/profile group chat\n\n\nPenggunaan:\n1. Silahkan kirim/reply sebuah gambar dengan caption ${prefix}setprofile\n\n2. Silahkan ketik ${prefix}setprofile linkImage`, id)
			}
			break 
        case 'welcome':
            if (!isGroupMsg) return kaguya.reply(from, 'Maaf, perintah ini hanya dapat dipakai didalam grup!', id)
            if (!isGroupAdmins) return kaguya.reply(from, 'Gagal, perintah ini hanya dapat digunakan oleh admin grup!', id)
            if (!isBotGroupAdmins) return kaguya.reply(from, 'Gagal, silahkan tambahkan bot sebagai admin grup!', id)
            if (args.length !== 1) return kaguya.reply(from, `Membuat BOT menyapa member yang baru join kedalam group chat!\n\nPenggunaan:\n${prefix}welcome on --aktifkan\n${prefix}welcome off --nonaktifkan`, id)
            if (args[0] == 'on') {
                welcome.push(chatId)
                fs.writeFileSync('./settings/welcome.json', JSON.stringify(welcome))
                kaguya.reply(from, 'Welcome Message sekarang diaktifkan!', id)
            } else if (args[0] == 'off') {
                let xporn = welcome.indexOf(chatId)
                welcome.splice(xporn, 1)
                fs.writeFileSync('./settings/welcome.json', JSON.stringify(welcome))
                kaguya.reply(from, 'Welcome Message sekarang dinonaktifkan', id)
            } else {
                kaguya.reply(from, `Membuat BOT menyapa member yang baru join kedalam group chat!\n\nPenggunaan:\n${prefix}welcome on --aktifkan\n${prefix}welcome off --nonaktifkan`, id)
            }
            break

        //Owner Group
        case 'kickall': //mengeluarkan semua member
        if (isBlocked) return await kaguya.reply(from, mess.blockk, id)
        if (!isGroupMsg) return kaguya.reply(from, 'Maaf, perintah ini hanya dapat dipakai didalam grup!', id)
        let isOwner = chat.groupMetadata.owner == pengirim
        if (!isOwner) return kaguya.reply(from, 'heh, siapa ini bukan owner main suruh', id)
        if (!isBotGroupAdmins) return kaguya.reply(from, 'Gagal, silahkan tambahkan bot sebagai admin grup!', id)
            const allMem = await kaguya.getGroupMembers(groupId)
            for (let i = 0; i < allMem.length; i++) {
                if (groupAdmins.includes(allMem[i].id)) {

                } else {
                    await kaguya.removeParticipant(groupId, allMem[i].id)
                }
            }
            kaguya.reply(from, 'Success kick all member', id)
        break

        //Owner Bot
        case 'ban':

            if (!isOwnerBot) return kaguya.reply(from, 'heh, siapa ini bukan owner Gue Kok main suruh', id)
            if (args.length == 0) return kaguya.reply(from, `Untuk banned seseorang agar tidak bisa menggunakan commands\n\nCaranya ketik: \n${prefix}ban add 628xx --untuk mengaktifkan\n${prefix}ban del 628xx --untuk nonaktifkan\n\ncara cepat ban banyak digrup ketik:\n${prefix}ban @tag @tag @tag`, id)
            if (args[0] == 'add') {
                banned.push(args[1]+'@c.us')
                fs.writeFileSync('./settings/banned.json', JSON.stringify(banned))
                kaguya.reply(from, 'Success banned target!')
            } else
            if (args[0] == 'del') {
                let xnxx = banned.indexOf(args[1]+'@c.us')
                banned.splice(xnxx,1)
                fs.writeFileSync('./settings/banned.json', JSON.stringify(banned))
                kaguya.reply(from, 'Success unbanned target!')
            } else {
             for (let i = 0; i < mentionedJidList.length; i++) {
                banned.push(mentionedJidList[i])
                fs.writeFileSync('./settings/banned.json', JSON.stringify(banned))
                kaguya.reply(from, 'Success ban target!', id)
                }
            }
            break
        case 'bc':
            if (!isOwnerBot) return kaguya.reply(from, `Perintah ini hanya untuk Owner Bot`, id)
                bctxt = body.slice(4)
                txtbc = `*「 K A G U Y A 」*\n\n${bctxt}`
                const semuagrup = await kaguya.getAllChatIds();
                if(quotedMsg && quotedMsg.type == 'image'){
                    const mediaData = await decryptMedia(quotedMsg)
                    const imageBase64 = `data:${quotedMsg.mimetype};base64,${mediaData.toString('base64')}`
                    for(let grupnya of semuagrup){
                        var cekgrup = await kaguya.getChatById(grupnya)
                        if(!cekgrup.isReadOnly) kaguya.sendImage(grupnya, imageBase64, 'gambar.jpeg', txtbc)
                    }
                    kaguya.reply('Broadcast sukses!')
                }else{
                    for(let grupnya of semuagrup){
                        var cekgrup = await kaguya.getChatById(grupnya)
                        if(!cekgrup.isReadOnly && isMuted(grupnya)) kaguya.sendText(grupnya, txtbc)
                    }
                            kaguya.reply('Broadcast Success!')
                }
                break
        case 'leaveall': //mengeluarkan bot dari semua group serta menghapus chatnya

            if (!isOwnerBot) return kaguya.reply(from, 'heh, siapa ini bukan owner Saya main suruh!', id)
            const allChatz = await kaguya.getAllChatIds()
            const allGroupz = await kaguya.getAllGroups()
            for (let gclist of allGroupz) {
                await kaguya.sendText(gclist.contact.id, `Maaf bot sedang pembersihan, total chat aktif : ${allChatz.length}`)
                await kaguya.leaveGroup(gclist.contact.id)
                await kaguya.deleteChat(gclist.contact.id)
            }
            kaguya.reply(from, 'Success leave all group!', id)
            break
        case 'clearall': //menghapus seluruh pesan diakun bot
            if (isBlocked) return await kaguya.reply(from, mess.blockk, id)
            if (!isOwnerBot) return kaguya.reply(from, 'Perintah ini hanya untuk Owner bot', id)
            const allChatx = await kaguya.getAllChats()
            for (let dchat of allChatx) {
                await kaguya.deleteChat(dchat.id)
            }
            kaguya.reply(from, 'Success clear all chat!', id)
            break
        case 'wa.me':
        case 'wame':
            if (isAfk) return await kaguya.reply(from, `Maaf ${pushname}, Kamu sedang afk! Ketik ${prefix}unafk untuk mematikan`,  id)
            const wa = body.trim().split(' ')
            var slicedArgs = Array.prototype.slice.call(wa, 1);
            const waz = await slicedArgs.join(' ')
            await kaguya.reply(from, `*Nih Nomor Wa Lu ${pushname}*\n\n*• wa.me/${sender.id.replace(/[@c.us]/g, '')}*\n*• api.whatsapp.com/send?phone=${sender.id.replace(/[@c.us]/g, '')}*\n*• api.whatsapp.com/send?phone=${sender.id.replace(/[@c.us]/g, '')}&text=${waz}*`, id)
            break
        case 'snk':
            kaguya.reply(from, snk, message.id)
    default:
        if (body.startsWith(`${prefix}`)) {
            kaguya.reply(from, `Baka ${pushname}, Fitur Yang Kamu Ketik Gak Ada Di Menu`, id)
        }
        (color('[UNLISTED]', 'red'), color('yellow'), 'Unregistered Command from', color(pushname))
        }
		// Simi-simi function
		if ((!isCmd && isGroupMsg && isSimi) && message.type === 'chat') {
			axios.get(`http://simsumi.herokuapp.com/api?text=${encodeURIComponent(message.body)}&lang=id`)
			.then((res) => {
				kaguya.reply(from, `${res.data.success}`, id)
			})
			.catch((err) => {
				kaguya.reply(from, `${err}`, id)
			})
		}
		// Kata kasar function
		if(!isCmd && isGroupMsg && isNgegas) {
            const find = db.get('group').find({ id: groupId }).value()
            if(find && find.id === groupId){
                const cekuser = db.get('group').filter({id: groupId}).map('members').value()[0]
                const isIn = inArray(pengirim, cekuser)
                if(cekuser && isIn !== false){
                    if(isKasar){
                        const denda = db.get('group').filter({id: groupId}).map('members['+isIn+']').find({ id: pengirim }).update('denda', n => n + 5000).write()
                        if(denda){
                            await kaguya.reply(from, "*「 ANTI BADWORD DETECTOR 」*\n\nJangan Kasar\nDenda +5.000\nTotal : Rp"+formatin(denda.denda), id)
                        }
                    }
                } else {
                    const cekMember = db.get('group').filter({id: groupId}).map('members').value()[0]
                    if(cekMember.length === 0){
                        if(isKasar){
                            db.get('group').find({ id: groupId }).set('members', [{id: pengirim, denda: 5000}]).write()
                        } else {
                            db.get('group').find({ id: groupId }).set('members', [{id: pengirim, denda: 0}]).write()
                        }
                    } else {
                        const cekuser = db.get('group').filter({id: groupId}).map('members').value()[0]
                        if(isKasar){
                            cekuser.push({id: pengirim, denda: 5000})
                            await kaguya.reply(from, "*「 ANTI BADWORD DETECTOR 」*\n\nJangan Kasar\nDenda +5.000", id)
                        } else {
                            cekuser.push({id: pengirim, denda: 0})
                        }
                        db.get('group').find({ id: groupId }).set('members', cekuser).write()
                    }
                }
            } else {
                if(isKasar){
                    db.get('group').push({ id: groupId, members: [{id: pengirim, denda: 5000}] }).write()
                    await kaguya.reply(from, "*「 ANTI BADWORD DETECTOR 」*\n\nJangan Kasar\nDenda +5.000\nTotal : Rp5.000", id)
                } else {
                    db.get('group').push({ id: groupId, members: [{id: pengirim, denda: 0}] }).write()
                }
            }
        }
    } catch (err) {
        console.log(color('[EROR]', 'red'), err)
    }
}