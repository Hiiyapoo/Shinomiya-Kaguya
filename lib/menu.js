const fs = require('fs-extra')
const { 
    prefix
} = JSON.parse(fs.readFileSync('./settings/setting.json'))

exports.textTnC = () => {
    return `
┏━━━━━❖•ABOUT BOT•❖━━━━━┓
┃
┃➥ Nama: Shinomiya Kaguya
┃➥ Versi: 2.1.0
┃➥ Bahasa: JavaScript
┃➥ Creator: wa.me/62816243737
┃
┗━━━━━❖•KAGUYA BOT•❖━━━━━`
}

exports.textMenu = (pushname,jam,tgl) => {
    return `
┏━━━━━━━━━━━━━━❉
┃ Hi, ${pushname}! 👋️
┃ Jam: ${jam}
┃ Tanggal: ${tgl}
┣━━━━━━━━━━━━━━❉
┃
┣━━━━━❖•CREATOR•❖━━━━━┓
┃
┃➥ *${prefix}sticker*
┃➥ *${prefix}stickertoimg*
┃➥ *${prefix}blackpink*
┃➥ *${prefix}tts*
┃➥ *${prefix}stickergif*
┃➥ *${prefix}huggif*
┃➥ *${prefix}bakagif*
┃➥ *${prefix}kissgif*
┃➥ *${prefix}crygif*
┃➥ *${prefix}stickergiphy*
┃➥ *${prefix}meme*
┃➥ *${prefix}quotemaker*
┃➥ *${prefix}nulis*
┃➥ *${prefix}nulis2*
┃➥ *${prefix}pornhub*
┃➥ *${prefix}text3d*
┃➥ *${prefix}glitch*
┃➥ *${prefix}ninjalogo*
┃➥ *${prefix}neon*
┃➥ *${prefix}neonlight*
┃➥ *${prefix}thunder*
┃➥ *${prefix}wolf*
┃➥ *${prefix}lionlogo*
┃➥ *${prefix}jokerlogo*
┃➥ *${prefix}blood*
┃
┣━━━━━⊱AGAMA⊰━━━━✿
┃
┃➥ *${prefix}Infosurah*
┃➥ *${prefix}Surah*
┃➥ *${prefix}Tafsir*
┃➥ *${prefix}ALaudio*
┃➥ *${prefix}Jsolat*
┃➥ *${prefix}Renungan*
┃➥ *${prefix}Alkitab*
┃➥ *${prefix}Alkitabs*
┃
┣━━━━━⊱FUN MENU⊰━━━━✿
┃
┃➥ *${prefix}simisimi*
┃➥ *${prefix}katakasar*
┃➥ *${prefix}readchat*
┃➥ *${prefix}fakeid*
┃➥ *${prefix}klasmen*
┃➥ *${prefix}artinama*
┃➥ *${prefix}cekjodoh*
┃➥ *${prefix}cekjodoh2*
┃➥ *${prefix}gombal*
┃➥ *${prefix}cekzodiak*
┃➥ *${prefix}koin*
┃➥ *${prefix}spamcall*
┃➥ *${prefix}dadu*
┃➥ *${prefix}gay*
┃
┣━━━━━⊱DOWNLOADER⊰━━━━✿
┃
┃➥ *${prefix}pinteres*
┃➥ *${prefix}ytmp3*
┃➥ *${prefix}ytmp4*
┃➥ *${prefix}joox*
┃➥ *${prefix}tiktok*
┃➥ *${prefix}twt*
┃➥ *${prefix}ig*
┃➥ *${prefix}facebook*
┃
┣━━━━━⊱SEARCH ANY⊰━━━━✿
┃
┃➥ *${prefix}images*
┃➥ *${prefix}stickers*
┃➥ *${prefix}images2*
┃➥ *${prefix}stalkig*
┃➥ *${prefix}github*
┃➥ *${prefix}tiktoks*
┃➥ *${prefix}ytsearch*
┃➥ *${prefix}google*
┃➥ *${prefix}play*
┃➥ *${prefix}play2*
┃➥ *${prefix}tanggalnow*
┃➥ *${prefix}jadwaltvnow*
┃➥ *${prefix}jadwaltv*
┃➥ *${prefix}brainly*
┃➥ *${prefix}situsanime*
┃➥ *${prefix}kbbi*
┃➥ *${prefix}maps*
┃➥ *${prefix}searchmemes*
┃➥ *${prefix}kusonime*
┃➥ *${prefix}sreddit*
┃➥ *${prefix}resep*
┃➥ *${prefix}stalkig*
┃➥ *${prefix}wiki*
┃➥ *${prefix}cuaca*
┃➥ *${prefix}chord*
┃➥ *${prefix}lirik*
┃➥ *${prefix}screenshot*
┃➥ *${prefix}movie*
┃➥ *${prefix}whatanime*
┃
┣━━━━━⊱RANDOM TEXT⊰━━━━✿
┃
┃➥ *${prefix}fakta*
┃➥ *${prefix}katabijak*
┃➥ *${prefix}quote*
┃➥ *${prefix}ninja*
┃➥ *${prefix}namaindo*
┃➥ *${prefix}qanime*
┃➥ *${prefix}kadarkepintaran*
┃➥ *${prefix}kadarkehokian*
┃
┣━━━━━⊱RANDOM IMAGES⊰━━━━✿
┃
┃➥ *${prefix}loli*
┃➥ *${prefix}coffee*
┃➥ *${prefix}food*
┃➥ *${prefix}holo*
┃➥ *${prefix}kemonomini*
┃➥ *${prefix}kiss*
┃➥ *${prefix}rubah*
┃➥ *${prefix}inu*
┃➥ *${prefix}shota*
┃➥ *${prefix}neko*
┃➥ *${prefix}nekonime*
┃➥ *${prefix}wallanime*
┃➥ *${prefix}walldekstop*
┃➥ *${prefix}wallhp*
┃➥ *${prefix}pokemon*
┃➥ *${prefix}cecan*
┃➥ *${prefix}cogan*
┃➥ *${prefix}kpop*
┃➥ *${prefix}memes*
┃➥ *${prefix}animeme*
┃➥ *${prefix}dewabatch*
┃
┣━━━━━⊱OTHER⊰━━━━✿
┃
┃➥ *${prefix}wame*
┃➥ *${prefix}infogempa*
┃➥ *${prefix}baka*
┃➥ *${prefix}getpic*
┃➥ *${prefix}jamindo*
┃➥ *${prefix}say*
┃➥ *${prefix}translate*
┃➥ *${prefix}resi*
┃➥ *${prefix}profile*
┃➥ *${prefix}groupinfo*
┃➥ *${prefix}getpicture*
┃➥ *${prefix}covid*
┃➥ *${prefix}math*
┃➥ *${prefix}hilih*
┃➥ *${prefix}ceklokasi*
┃➥ *${prefix}shortlink*
┃➥ *${prefix}bapakfont*
┃
┣━━━━━⊱KERANG MENU⊰━━━━✿
┃
┃➥ *${prefix}kapankah*
┃➥ *${prefix}rate*
┃➥ *${prefix}apakah*
┃➥ *${prefix}apakah*
┃➥ *${prefix}bisakah*
┃
┣━━━━━⊱ABOUT⊰━━━━✿
┃
┃➥ *${prefix}info*
┃➥ *cekprefix*
┃➥ *${prefix}bugreport*
┃➥ *${prefix}kaguyagroup*
┃➥ *${prefix}donasi*
┃➥ *${prefix}botstat*
┃➥ *${prefix}creator*
┃➥ *${prefix}join*
┃➥ *${prefix}listbanned*
┃➥ *${prefix}listblock*
┃➥ *${prefix}ownergc*
┃➥ *${prefix}adminlist*
┃
┣━━━━━⊱OWNER MENU⊰━━━━✿
┃
┃➥ *${prefix}banned*
┃➥ *${prefix}gift*
┃➥ *${prefix}setprefix*
┃➥ *${prefix}setname*
┃➥ *${prefix}setstatus*
┃➥ *${prefix}setprofilepic*
┃➥ *${prefix}leaveall*
┃➥ *${prefix}clearall*
┃
┣━━━━━⊱ADMIN MENU⊰━━━━✿
┃
┃➥ *${prefix}add*
┃➥ *${prefix}promosi*
┃➥ *${prefix}welcome*
┃➥ *${prefix}kick* @tag
┃➥*${prefix}promote* @tag
┃➥ *${prefix}demote* @tag
┃➥ *${prefix}mutegrup*
┃➥ *${prefix}tagall*
┃➥ *${prefix}setprofile*
┃➥ *${prefix}del*
┃➥ *${prefix}revoke*
┃➥ *${prefix}grouplink*
┃
┣━━━━━⊱OWNER GROUP⊰━━━━✿
┃
┃➥ *${prefix}kickall*
┃
┗━━━━━❖•KAGUYA BOT•❖━━━━━`
}

exports.textnfws = () => {
    return `
┏━━━━━❖•BAKA MENU•❖━━━━━┓
┃
┃➥ *${prefix}hot*
┃➥ *${prefix}nekopoi*
┃➥ *${prefix}indohot*
┃➥ *${prefix}picanime*
┃➥ *${prefix}hentaigif*
┃➥ *${prefix}pgif*
┃➥ *${prefix}hass*
┃➥ *${prefix}hmidriff*
┃➥ *${prefix}4k*
┃➥ *${prefix}hentai*
┃➥ *${prefix}hneko*
┃➥ *${prefix}hkitsune*
┃➥ *${prefix}anal*
┃➥ *${prefix}hanal*
┃➥ *${prefix}paizuri*
┃➥ *${prefix}gonewild*
┃➥ *${prefix}ass*
┃➥ *${prefix}pussy*
┃➥ *${prefix}thigh*
┃➥ *${prefix}tentacle*
┃➥ *${prefix}boobs*
┃➥ *${prefix}hboobs*
┃
┗━━━━━❖•KAGUYA BOT•❖━━━━━
`
}

exports.texthilix = () => {
    return `
"hilih" adalah modifikasi bunyi vokal dari ekspresi bahasa Jawa "halah", "heleh" yang menunjukkan ke-tidak sepakat-an, ke-tidak setuju-an, ke-tidak percaya-an, bahkan kemuakan untuk menyangkal lawan bicara anda yang membosankan dan sok-sok an.
`
}

exports.textmex = () => {
    return `
╔══✪〘 LIST MEME 〙✪══
║
╠➥ dankmemes 
╠➥ wholesomeanimemes
╠➥ wholesomememes4
╠➥ AdviceAnimals
╠➥ MemeEconomy 
╠➥ memes
╠➥ terriblefacebookmemes
╠➥ teenagers 
╠➥ historymemes
╠➥ okbuddyretard
╠➥ nukedmemes
║
╚═✪〘 KAGUYA BOT 〙✪══
`
}

exports.textbaha = () => {
    return `
╔══✪〘 LIST BAHASA 〙✪══
║
╠➥ Automatic: "auto",
╠➥ Afrikaans: "af",
╠➥ Albanian: "sq",
╠➥ Amharic: "am",
╠➥ Arabic: "ar",
╠➥ Armenian: "hy",
╠➥ Azerbaijani: "az",
╠➥ Basque: "eu",
╠➥ Belarusian: "be",
╠➥ Bengali: "bn",
╠➥ Bosnian: "bs",
╠➥ Bulgarian: "bg",
╠➥ Catalan: "ca",
╠➥ Cebuano: "ceb",
╠➥ Chichewa: "ny",
╠➥ "Chinese Simplified": "zh-cn",
╠➥ "Chinese Traditional": "zh-tw",
╠➥ Corsican: "co",
╠➥ Croatian: "hr",
╠➥ Czech: "cs",
╠➥ Danish: "da",
╠➥ Dutch: "nl",
╠➥ English: "en",
╠➥ Esperanto: "eo",
╠➥ Estonian: "et",
╠➥ Filipino: "tl",
╠➥ Finnish: "fi",
╠➥ French: "fr",
╠➥ Frisian: "fy",
╠➥ Galician: "gl",
╠➥ Georgian: "ka",
╠➥ German: "de",
╠➥ Greek: "el",
╠➥ Gujarati: "gu",
╠➥ "Haitian Creole": "ht",
╠➥ Hausa: "ha",
╠➥ Hawaiian: "haw",
╠➥ Hebrew: "iw",
╠➥ Hindi: "hi",
╠➥ Hmong: "hmn",
╠➥ Hungarian: "hu",
╠➥ Icelandic: "is",
╠➥ Igbo: "ig",
╠➥ Indonesian: "id",
╠➥ Irish: "ga",
╠➥ Italian: "it",
╠➥ Japanese: "ja",
╠➥ Javanese: "jw",
╠➥ Kannada: "kn",
╠➥ Kazakh: "kk",
╠➥ Khmer: "km",
╠➥ Korean: "ko",
╠➥ "Kurdish (Kurmanji)": "ku",
╠➥ Kyrgyz: "ky",
╠➥ Lao: "lo",
╠➥ Latin: "la",
╠➥ Latvian: "lv",
╠➥ Lithuanian: "lt",
╠➥ Luxembourgish: "lb",
╠➥ Macedonian: "mk",
╠➥ Malagasy: "mg",
╠➥ Malay: "ms",
╠➥ Malayalam: "ml",
╠➥ Maltese: "mt",
╠➥ Maori: "mi",
╠➥ Marathi: "mr",
╠➥ Mongolian: "mn",
╠➥ "Myanmar (Burmese)": "my",
╠➥ Nepali: "ne",
╠➥ Norwegian: "no",
╠➥ Pashto: "ps",
╠➥ Persian: "fa",
╠➥ Polish: "pl",
╠➥ Portuguese: "pt",
╠➥ Punjabi: "ma",
╠➥ Romanian: "ro",
╠➥ Russian: "ru",
╠➥ Samoan: "sm",
╠➥ "Scots Gaelic": "gd",
╠➥ Serbian: "sr",
╠➥ Sesotho: "st",
╠➥ Shona: "sn",
╠➥ Sindhi: "sd",
╠➥ Sinhala: "si",
╠➥ Slovak: "sk",
╠➥ Slovenian: "sl",
╠➥ Somali: "so",
╠➥ Spanish: "es",
╠➥ Sundanese: "su",
╠➥ Swahili: "sw",
╠➥ Swedish: "sv",
╠➥ Tajik: "tg",
╠➥ Tamil: "ta",
╠➥ Telugu: "te",
╠➥ Thai: "th",
╠➥ Turkish: "tr",
╠➥ Ukrainian: "uk",
╠➥ Urdu: "ur",
╠➥ Uyghur: "ug",
╠➥ Uzbek: "uz",
╠➥ Vietnamese: "vi",
╠➥ Welsh: "cy",
╠➥ Xhosa: "xh",
╠➥ Yiddish: "yi",
╠➥ Yoruba: "yo",
╠➥ Zulu: "zu"
║
╚═✪〘 KAGUYA BOT 〙✪══
`}

exports.textlist = () => {
    return `
╔══✪〘 LIST ANIME 〙✪══
║
╠➥ femdom
╠➥ tickle
╠➥ classic
╠➥ ngif
╠➥ erofeet
╠➥ meow
╠➥ erok
╠➥ poke
╠➥ les
╠➥ v3(NOT WORK)
╠➥ hololewd
╠➥ nekoapi_v3.1(NOT WORK)
╠➥ lewdk
╠➥ keta
╠➥ feetg
╠➥ nsfw_neko_gif
╠➥ eroyuri
╠➥ kiss
╠➥ 8ball
╠➥ kuni
╠➥ tits
╠➥ pussy_jpg
╠➥ cum_jpg
╠➥ pussy
╠➥ lewdkemo
╠➥ lizard
╠➥ slap
╠➥ lewd
╠➥ cum
╠➥ cuddle
╠➥ spank
╠➥ smallboobs
╠➥ goose
╠➥ Random_hentai_gif
╠➥ avatar
╠➥ fox_girl
╠➥ nsfw_avatar
╠➥ hug
╠➥ gecg
╠➥ boobs
╠➥ pat
╠➥ feet
╠➥ smug
╠➥ kemonomimi
╠➥ solog
╠➥ holo
╠➥ wallpaper
╠➥ bj
╠➥ woof
╠➥ yuri
╠➥ trap
╠➥ anal
╠➥ baka
╠➥ blowjob
╠➥ holoero
╠➥ feed
╠➥ neko
╠➥ gasm
╠➥ hentai
╠➥ futanari
╠➥ ero
╠➥ solo
╠➥ waifu
╠➥ pwankg
╠➥ eron
╠➥ erokemo
║
╚═✪〘 KAGUYA BOT 〙✪══
`
}

exports.textDonasi = (pushname) => {
    return `
Hai, ${pushname} Untuk Berdonasi Bisa Lewat:
*Saweria : https://saweria.co/Tanaka9531*
*Trakteer : https://trakteer.id/Shinomiya-Kaguya-Bot*
*Pulsa : 6289603409290*
Doakan agar project bot ini bisa terus berkembang
Doakan agar author bot ini dapat ide-ide yang kreatif lagi
Donasi akan digunakan untuk pengembangan dan pengoperasian bot ini.
Terimakasih.`
}
