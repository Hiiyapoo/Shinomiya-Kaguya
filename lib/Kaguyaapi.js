const axios = require('axios')
const fetch = require('node-fetch')
const { fetchJson } = require('../utils/fetcher')
const { promisify } = require('util')
const { instagram, twitter } = require('video-url-link')
const igGetInfo = promisify(instagram.getInfo)
const twtGetInfo = promisify(twitter.getInfo)
const fileyt = 'https://raw.githubusercontent.com/ArugaZ/scraper-results/main/20201111_230923.jpg'
const eroryt = 'https://raw.githubusercontent.com/ArugaZ/scraper-results/main/20201111_234624.jpg'

const ymp3 = async (url) => new Promise((resolve, reject) => {
    axios.get(`http://128.199.72.121/ytmp3.php?key=PandaEver&url=${url}`)
    .then((res) => {
		resolve(res.data)
    })
    .catch((err) =>{
        reject(err)
    })
})

const ytmp3 = async (url) => new Promise((resolve, reject) => {
    axios.get(`https://st4rz.herokuapp.com/api/yta?url=${url}`)
    .then((res) => {
		resolve(res.data)
    })
    .catch((err) =>{
        reject(err)
    })
})

const ymp4 = async (url) => new Promise((resolve, reject) => {
    axios.get(`http://128.199.72.121/ytmp4.php?key=PandaEver&url=${url}`)
    .then((res) => {
		resolve(res.data)
    })
    .catch((err) =>{
        reject(err)
    })
})

const ytmp4 = async (url) => new Promise((resolve, reject) => {
    axios.get(`https://st4rz.herokuapp.com/api/ytv?url=${url}`)
    .then((res) => {
		resolve(res.data)
    })
    .catch((err) =>{
        reject(err)
    })
})


const smul = async (url) => new Promise((resolve, reject) => {
    axios.get(`https://tobz-api.herokuapp.com/api/smule?link=${url}`)
    .then((res) => {
	resolve(res.data.result)
    })
    .catch((err) =>{
        reject(err)
    })
})


const cerpen = async () => new Promise((resolve, reject) => {
	axios.get(`https://arugaz.herokuapp.com/api/cerpen`)
	.then((res) => {
		resolve(res.data)
	})
	.catch((err) => {
		reject(err)
	})
})

const cersex = async () => new Promise((resolve, reject) => {
	const ransex = Math.floor(Math.random() * 2) + 1
	axios.get(`https://arugaz.herokuapp.com/api/cersex${ransex}`)
	.then((res) => {
		resolve(res.data)
	})
	.catch((err) => {
		reject(err)
	})
})

const ninja = async (nama) => new Promise((resolve, reject) => {
	axios.get(`https://api.terhambar.com/ninja?nama=${nama}`)
	.then((res) => {
		const textv = `Nama Ninja Kamu: ${res.data.result.ninja}`
		resolve(textv)
	})
	.catch((err) => {
		reject(err)
	})
})

const tik = async (url) => new Promise((resolve, reject) => {
	axios.get(`http://128.199.72.121/?id=tiktok&key=PandaEver&url=${url}`)
	.then((res) => {
		resolve(res.data.mp4direct)
	})
	.catch((err) => {
		reject(err)
	})
})

const puisi = async () => new Promise((resolve, reject) => {
	const puiti = ['1','3']
	const ranisi = puiti[Math.floor(Math.random() * puiti.length)]
	axios.get(`https://arugaz.herokuapp.com/api/puisi${ranisi}`)
	.then((res) => {
		resolve(res.data)
	})
	.catch((err) => {
		reject(err)
	})
})

const stalkig = async (url) => new Promise((resolve, reject) => {
    axios.get(`https://melodicxt.herokuapp.com/api/igprofile?user=${url}&apiKey=administrator`)
    .then((res) => {
		if (res.data.error) resolve(res.data.error)
        const text = `Name: ${res.data.Name}\nBio: ${res.data.Bio}\nFollower: ${res.data.Followers_count}\nFollowing: ${res.data.Following_count}\nPost: ${res.data.Post_count}`
        resolve(text)
    })
    .catch((err) =>{
        reject(err)
    })
})

const stalkgit = async (url) => new Promise((resolve, reject) => {
    axios.get(`https://tobz-api.herokuapp.com/api/githubprofile?username=${url}`)
    .then((res) => {
		if (res.data.error) resolve(res.data.error)
        const text = `Username: ${res.data.result.username}\nName: ${res.data.result.name}\nBiography: ${res.data.result.biography}\nFollower: ${res.data.result.follower}\nFollowing: ${res.data.result.following}\nRepository: ${res.data.result.public_repository}\nGists: ${res.data.result.public_gists}\nUrl: ${res.data.result.url}\nCompany: ${res.data.result.company}\nEmail: ${res.data.result.email}`
        resolve(text)
    })
    .catch((err) =>{
        reject(err)
    })
})

const stalkgitpict = async (url) => new Promise((resolve, reject) => {
    axios.get(`https://tobz-api.herokuapp.com/api/githubprofile?username=${url}`)
    .then((res) => {
		if (res.data.error) resolve('https://tinyurl.com/y8rzf4lr')
        resolve(`${res.data.result.avatar}`)
    })
    .catch((err) =>{
        reject(err)
    })
})

const stalkigpict = async (url) => new Promise((resolve, reject) => {
    axios.get(`https://melodicxt.herokuapp.com/api/igprofile?user=${url}&apiKey=administrator`)
    .then((res) => {
		if (res.data.error) resolve('https://tinyurl.com/y8rzf4lr')
        resolve(`${res.data.Profile_picture}`)
    })
    .catch((err) =>{
        reject(err)
    })
})

const kbbi = (query) => new Promise((resolve, reject) => {
    console.log('Get metadata from =>', query)
	axios.get(`https://tobz-api.herokuapp.com/api/kbbi?kata=${query}`)
	.then((res) => {
		resolve(`${res.data.result}`)
	})
	.catch((err) => {
		reject(err)
	})
})

const wiki = (query) => new Promise((resolve, reject) => {
    console.log('Get metadata from =>', query)
    fetchJson('https://tobz-api.herokuapp.com/api/wiki?q=' + query)
        .then((hasil) => {
            if (hasil.status != 200) return resolve(hasil.status)
            const jawaban = hasil.result

            resolve(jawaban)
            }).catch((err) => {
                console.error(err)
                reject(err)
            })
})

const daerah = async () => new Promise((resolve, reject) => {
    axios.get(`https://arugaz.herokuapp.com/api/daerah`)
    .then((res) => {
        resolve(res.data.result)
    })
    .catch((err) =>{
        reject(err)
    })
})

const jadwaldaerah = async (url) => new Promise((resolve, reject) => {
    axios.get(`https://tobz-api.herokuapp.com/api/jadwalshalat?q=${url}`)
    .then((res) => {
		if (res.data.error) resolve(res.data.error)
        const text = `Jadwal Sholat ${url}\n\nImsyak: ${res.data.result.Imsyak}\nSubuh: ${res.data.result.Subuh}\nDzuhur: ${res.data.result.Dzuhur}\nAshar: ${res.data.result.Ashar}\nMaghrib: ${res.data.result.Maghrib}\nIsya: ${res.data.Isya}`
        resolve(text)
    })
    .catch((err) =>{
        reject(err)
    })
})

const cuaca = async (url) => new Promise((resolve, reject) => {
    axios.get(`https://rest.farzain.com/api/cuaca.php?id=${url}&apikey=O8mUD3YrHIy9KM1fMRjamw8eg`)
    .then((res) => {
		if (res.data.respon.cuaca == null) resolve('Maaf daerah kamu tidak tersedia')
        const text = `Cuaca di: ${res.data.respon.tempat}\n\nCuaca: ${res.data.respon.cuaca}\nAngin: ${res.data.respon.angin}\nDesk: ${res.data.respon.deskripsi}\nKelembapan: ${res.data.respon.kelembapan}\nSuhu: ${res.data.respon.suhu}\nUdara: ${res.data.respon.udara}`
        resolve(text)
    })
    .catch((err) =>{
        reject(err)
    })
})

const chord = async (url) => new Promise((resolve, reject) => {
    axios.get(`https://tobz-api.herokuapp.com/api/chord?q=${url}`)
    .then((res) => {
		if (res.data.error) resolve(res.data.error)
        resolve(res.data.result)
    })
    .catch((err) =>{
        reject(err)
    })
})

/**
 * Search for JadwalTv.
 * @param {String} query 
 */
const Jadwaltv = (query) => new Promise((resolve, reject) => {
    fetchJson(`https://docs-jojo.herokuapp.com/api/jadwaltv?ch=${query}`)
        .then((result) => resolve(result))
        .catch((err) => reject(err))
})

/**
 * Search for Alkitab.
 * @param {String} query 
 */
const alkitabsearch = (query) => new Promise((resolve, reject) => {
    fetchJson(`https://docs-jojo.herokuapp.com/api/alkitabsearch?q=${query}`)
        .then((result) => resolve(result))
        .catch((err) => reject(err))
})

const tulis = async (teks) => new Promise((resolve, reject) => {
    axios.get(`https://arugaz.herokuapp.com/api/nulis?text=${encodeURIComponent(teks)}`)
    .then((res) => {
        resolve(`${res.data.result}`)
    })
    .catch((err) => {
        reject(err)
    })
})

const tulis2 = async (teks) => new Promise((resolve, reject) => {
    axios.get(`https://nekobot.xyz/api/imagegen?type=kannagen&text=${teks}`)
    .then((res) => {
        resolve(`${res.data.message}`)
    })
    .catch((err) => {
        reject(err)
    })
})

const artinama = async (nama) => new Promise((resolve, reject) => {
	axios.get(`https://arugaz.herokuapp.com/api/artinama?nama=${nama}`)
	.then((res) => {
		resolve(res.data.result)
	})
	.catch((err) => {
		reject(err)
	})
})

const cekjodoh = async (nama,pasangan) => new Promise((resolve, reject) => {
	axios.get(`https://arugaz.herokuapp.com/api/jodohku?nama=${nama}&pasangan=${pasangan}`)
	.then((res) => {
		const textc = `Nama : ${res.data.nama}\nPasangan : ${res.data.pasangan}\nPositif: ${res.data.positif}\nNegatif : ${res.data.negatif}`
		resolve({link: res.data.gambar, text: textc})
	})
	.catch((err) => {
		reject(err)
	})
})

const gempux = async (nama,pasangan) => new Promise((resolve, reject) => {
	axios.get(`https://tobz-api.herokuapp.com/api/infogempa`)
	.then((res) => {
		const textg = `Lokasi: ${res.data.lokasi}\nKoordinat: ${res.data.koordinat}\nKedalaman: ${res.data.kedalaman}\nMagnitude: ${res.data.magnitude}\nPotensi: ${res.data.potensi}\nWaktu: ${res.data.waktu}`
		resolve({link: res.data.map, text: textg})
	})
	.catch((err) => {
		reject(err)
	})
})

const covidindo = async () => new Promise((resolve, reject) => {
	axios.get(`https://arugaz.herokuapp.com/api/coronaindo`)
	.then((res) => {
		const textv = `Info Covid-19 ${res.data.negara}\n\nKasus Baru: ${res.data.kasus_baru}\nTotal Kasus: ${res.data.kasus_total}\nSembuh: ${res.data.sembuh}\nPenanganan: ${res.data.penanganan}\nMeninggoy: ${res.data.meninggal}\n\nUpdate: ${res.data.terakhir}`
		resolve(textv)
	})
	.catch((err) => {
		reject(err)
	})
})

const bapakfont = async (kalimat) => new Promise((resolve, reject) => {
	axios.get(`https://api.terhambar.com/bpk?kata=${kalimat}`)
	.then((res) => {
		resolve(res.data.result)
	})
	.catch((err) => {
		reject(err)
	})
})

const lirik = async (judul) => new Promise((resolve, reject) => {
	axios.get(`https://tobz-api.herokuapp.com/api/lirik?q=${judul}`)
	.then((res) => {
		resolve(res.data.result.lirik)
	})
	.catch((err) => {
		reject(err)
	})
})

/**
 * Get Instagram Metadata
 *
 * @param  {String} url
 */
const insta = (url) => new Promise((resolve, reject) => {
    console.log('Get metadata from =>', url)
    const uri = url.replace(/\?.*$/g, '')
    igGetInfo(uri, {})
        .then((result) => resolve(result))
        .catch((err) => {
            console.error(err)
            reject(err)
        })
})

/**
 * Get Twitter Metadata
 *
 * @param  {String} url
 */
const tweet = (url) => new Promise((resolve, reject) => {
    console.log('Get metadata from =>', url)
    twtGetInfo(url, {})
        .then((content) => resolve(content))
        .catch((err) => {
            console.error(err)
            reject(err)
        })
})

const movie = async (judul) => new Promise((resolve, reject) => {
	axios.get(`https://arugaz.herokuapp.com/api/sdmovie?film=${encodeURIComponent(judul)}`)
	.then((res) => {
		if (res.data.error) return resolve({status: 'error', hasil: res.data.result})
		const teksmov = `Judul: ${res.data.result.title}\nRating: ${res.data.result.rating}\nSinopsis: ${res.data.result.sinopsis}\nLink: ${res.data.result.video}`
		resolve({status: 'success', hasil: teksmov, link: res.data.result.thumb})
	})
	.catch((err) => {
		reject(err)
	})
})

const bucin = async () => new Promise((resolve, reject) => {
	axios.get(`https://arugaz.herokuapp.com/api/howbucins`)
    .then((res) => {
        const text = `${res.data.desc}`
        resolve(text)
    })
    .catch((err) =>{
        reject(err)
    })
})

const gay = async () => new Promise((resolve, reject) => {
	axios.get(`https://arugaz.herokuapp.com/api/howgay`)
    .then((res) => {
        const text = `${res.data.desc}`
        resolve(text)
    })
    .catch((err) =>{
        reject(err)
    })
})

const renungan = async () => new Promise((resolve, reject) => {
	axios.get(`https://docs-jojo.herokuapp.com/api/renungan`)
    .then((res) => {
        const text = `Judul: ${res.data.judul}\n${res.data.Isi}\nPesan: ${res.data.pesan}`
        resolve(text)
    })
    .catch((err) =>{
        reject(err)
    })
})

const Alkitab = async () => new Promise((resolve, reject) => {
	axios.get(`https://docs-jojo.herokuapp.com/api/alkitab`)
    .then((res) => {
        const texto = `Ayat: ${res.data.result.ayat}\n${res.data.result.isi}\nLink: ${res.data.result.link}`
        resolve({link: res.data.result.img, text: texto})
    })
    .catch((err) =>{
        reject(err)
    })
})

const getStickerMaker = (link) => new Promise((resolve, reject) => {
    fetch('https://api.areltiyan.site/sticker_maker?text='+encodeURIComponent(link), {
        method: 'GET',
    })
    .then(async res => {
        const text = await res.json()

        resolve(text)
        
     })
    .catch(err => reject(err))
})

const indo = async (jenis) => new Promise((resolve, reject) => {
	axios.get(`https://api.terhambar.com/nama?jenis=${jenis}`)
	.then((res) => {
		const textv = `Nama Kamu: ${res.data.result.nama}`
		resolve(textv)
	})
	.catch((err) => {
		reject(err)
	})
})

const hilih = async (kata) => new Promise((resolve, reject) => {
	axios.get(`https://ostch.herokuapp.com/api/v1/hilih?kata=${kata}`)
    .then((res) => {
        resolve(res.data.result)
    })
    .catch((err) =>{
        reject(err)
    })
})

const kusonime = async (title) => new Promise((resolve, reject) => {
	axios.get(`https://tobz-api.herokuapp.com/api/kuso?q=${title}`)
	.then((res) => {
		const textnime = `Judul: *${res.data.title}*\n\n${res.data.info}\n\nSinopsis: ${res.data.sinopsis}\n\nLink Download:\n${res.data.link_dl}`
        resolve({link: res.data.thumb, text: textnime})
	})
	.catch((err) => {
		reject(err)
	})
})

const jux = async (query) => new Promise((resolve, reject) => {
	axios.get(`https://tobz-api.herokuapp.com/api/joox?q=${query}`)
	.then((res) => {
		const textd = `Judul: ${res.data.result.judul}\nAlbum: ${res.data.result.album}\nDipublikasi: ${res.data.result.dipublikasi}\n\nSabar Lagi Ngirim Lagunya`
		resolve({link: res.data.result.mp3, text: textd, url: res.data.result.thumb})
	})
	.catch((err) => {
		reject(err)
	})
})

const baka = async () => new Promise((resolve, reject) => {
	axios.get(`https://arugaz.herokuapp.com/api/indohot`)
	.then((res) => {
		const textv = `Negara: ${res.data.result.country}\nDurasi: ${res.data.result.durasi}\nGenre: ${res.data.result.genre}\nJudul: ${res.data.result.judul}\nLink: ${res.data.result.url}`
		resolve(textv)
	})
	.catch((err) => {
		reject(err)
	})
})

const mes = async (query) => new Promise((resolve, reject) => {
	axios.get(`https://mnazria.herokuapp.com/api/meme-search?genre=${query}`)
	.then((res) => {
		resolve({link : res.data.url, text: res.data.title})
	})
	.catch((err) => {
		reject(err)
	})
})

const mex = async () => new Promise((resolve, reject) => {
	axios.get(`https://meme-api.herokuapp.com/gimme/wholesomeanimemes`)
	.then((res) => {
		resolve({link: res.data.url, text: res.data.title})
	})
	.catch((err) => {
		reject(err)
	})
})

const tikx = async (user) => new Promise((resolve, reject) => {
	axios.get(`https://docs-jojo.herokuapp.com/api/tiktokpp?user=${user}`)
	.then((res) => {
		resolve({link: res.data.result})
	})
	.catch((err) => {
		reject(err)
	})
})

const coworl = async (url) => new Promise((resolve, reject) => {
    axios.get(`https://api.terhambar.com/negara/World`)
    .then((res) => {
		if (res.data.error) resolve(res.data.error)
        const text = `🌎️ Covid Info World 🌍️\n\nTotal: ${res.data.total}\nKasus Baru: ${res.data.kasus_baru}\nMeninggal: ${res.data.meninggal}\nBaru Meninggal: ${res.data.meninggal_baru}\nSembuh: ${res.data.sembuh}\nPenangan: ${res.data.penanganan}\nTerakhir: ${res.data.terakhir}`
        resolve(text)
    })
    .catch((err) =>{
        reject(err)
    })
})

const prix = async (url) => new Promise((resolve, reject) => {
	axios.get(`https://scrap.terhambar.com/pin?url=${url}`)
	.then((res) => {
const texp = `${res.data.response.title}`
		resolve({link: res.data.response.thumbnail, text: texp})
	})
	.catch((err) => {
		reject(err)
	})
})

const dewabatch = async (judul) => new Promise((resolve, reject) => {
	axios.get(`https://tobz-api.herokuapp.com/api/dewabatch?q=${judul}`)
	.then((res) => {
		const textdew = `${res.data.result}\n\nSinopsis: ${res.data.sinopsis}`
		resolve({link: res.data.thumb, text: textdew})
	})
	.catch((err) => {
		reject(err)
	})
})

const spamcall = async (notlp) => new Promise((resolve, reject) => {
	axios.get(`https://arugaz.herokuapp.com/api/spamcall?no=${notlp}`)
	.then((res) => {
		resolve(res.data.logs)
	})
	.catch((err) => {
		reject(err)
	})
})

const cekcovid = async (negara) => new Promise((resolve, reject) => {
    axios.get(`https://coronavirus-19-api.herokuapp.com/countries/${negara}`)
    .then((res) => {
        const text = `🌎️ Covid Info ${res.data.country} 🌍️\nTotal Kasus: ${res.data.cases}\nKasus Hari Ini: ${res.data.todayCases}\nMeninggal: ${res.data.deaths}\nMeninggal Hari Ini: ${res.data.todayDeaths}\nKasus Aktif: ${res.data.active}`
        resolve(text)
    })
    .catch((err) =>{
        reject(err)
    })
})

const cekzodiak = async (nama,tgl,bln,thn) => new Promise((resolve, reject) => {
    axios.get(`https://arugaz.herokuapp.com/api/getzodiak?nama=${nama}&tgl-bln-thn=${tgl}-${bln}-${thn}`)
    .then((res) => {
        const text = `Nama: ${res.data.nama}\nUltah: ${res.data.ultah}\nZodiak: ${res.data.zodiak}`
        resolve(text)
    })
    .catch((err) =>{
        reject(err)
    })
})

const fake = async () => new Promise((resolve, reject) => {
    axios.get(`https://fakeid.now.sh/api/random`)
    .then((res) => {
        const text = `Name: ${res.data.data.Name}\nAge: ${res.data.data.Details.Age}\nBirthday: ${res.data.data.Details.Birthday}\nZodiac: ${res.data.data.Details.TropicalZodiac}\nAddress: ${res.data.data.Address}\nFavoriteColor: ${res.data.data.Details.FavoriteColor}\nBloodType: ${res.data.data.Details.BloodType}\nCompany: ${res.data.data.Details.Company}\nPhone: ${res.data.data.Details.Phone}\nEmailAddress: ${res.data.data.Details.EmailAddress}\nUsername: ${res.data.data.Details.Username}\nPassword: ${res.data.data.Details.Password}`
        resolve(text)
    })
    .catch((err) =>{
        reject(err)
    })
})

const sleep = async (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const jadwalnow = async () => new Promise((resolve, reject) => {
    axios.get(`https://docs-jojo.herokuapp.com/api/jadwaltvnow`)
    .then((res) => {
        const text = `Jam: ${res.data.result.jam}\n\nJadwalTv: ${res.data.result.jadwalTV}`
        resolve(text)
    })
    .catch((err) =>{
        reject(err)
    })
})

module.exports = {
	ytmp3,
	ytmp4,
	stalkig,
	stalkgitpict,
	stalkgit,
    stalkigpict,
	wiki,
	bucin,
	jadwalnow,
	Jadwaltv,
	tikx,
	gay,
	daerah,
	sleep,
    jadwaldaerah,
    cuaca,
    chord,
	tulis,
	tulis2,
	ninja,
	fake,
	artinama,
	cekjodoh,
	covidindo,
	bapakfont,
	lirik,
	ymp3,
	ymp4,
	gempux,
	movie,
	cerpen,
	Alkitab,
	alkitabsearch,
	cersex,
	tik,
	puisi,
	spamcall,
	indo,
	baka,
	hilih,
	kusonime,
	kbbi,
	jux,
	mes,
	cekcovid,
	coworl,
	renungan,
	smul,
	prix,
	mex,
	dewabatch,
	cekzodiak,
	tweet,
	insta
}