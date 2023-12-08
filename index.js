const cheerio = require('cheerio')
const request = require('request') // Deprecated
const download = require('node-image-downloader')
const axios = require('axios') // Alternative `npm request`

console.log("App is running")


// ################################################### //
                  /* IMAGE SCRAPER */
// ################################################### //

// Temporary database
const fs = require('fs')
const database = require('./database.json')

// Scraper start from here - Web target Wallpaper Abyss
// --- Using `npm request` and `npm cheerio`
// getTarget(https://wall.alphacoders.com/search.php?search=honkai+impact&page=1)
async function getTarget(target){
	request(target, async(error, response, html) => {
		if (!error) {
			let $ = cheerio.load(html)
			const list = $('div[class="boxgrid"]').find('a').toArray().map(element => $(element).attr('href'));
			list.forEach(async urlData => {
				return await scrapeTarget(`https://wall.alphacoders.com/${urlData}`)
			})
		}
	})
}
const collectedUrl = []
async function scrapeTarget(urlData){
	request(urlData, (error, response, html) => {
		if (!error) {
			let $ = cheerio.load(html)
			let imageSrc = $(".center.img-container-desktop a").attr("href")
			if (!collectedUrl.includes(imageSrc)) {
				collectedUrl.push(imageSrc)
			}
			return collectedUrl.forEach(urlList => downloadData(urlList))
		}
	})
}
async function downloadData(url){
	const path = './database.json'
	if (!database.includes(url)) {
		database.push(url)
		await fs.writeFile(path, await JSON.stringify(database, null, 4), error => { if (error) console.log(error) })
		// Download
		await download({
			imgs:[
				{
					uri:url
				}
			],
			dest: "./downloads"
		}).then(() => {
			console.log(`An image downloaded`)
		})
	}
}



// --- Using `npm axios` - without cheerio
// safebooruJson('pink_hair', 'bikini')
async function safebooruJson(tag1, tag2){
	if (tag2 === undefined) { tag2 = '' } else { tag2 = `%20${tag2}` }
	const url = `https://safebooru.donmai.us/posts/random.json?tags=${tag1}${tag2}&limit=1&only=file_url`
	await axios.get(url).then(resp => {
		const result = resp.data;
		console.log(result.file_url)
	})
}




// Single post
async function getSrc() {
	let url = 'https://wall.alphacoders.com/search.php?search=honkai+impact'
	request(url, async(error, response, html) => {
		if (!error) {
			let $ = cheerio.load(html)
			let imageSrc = $(".boxgrid a").attr("href")
			let urlget = (`https://wall.alphacoders.com/${imageSrc}`)
			return await getImg(urlget)
		}
	})
}
async function getImg(urlget){
	request(urlget, (error, response, html) => {
		if (!error) {
			let $ = cheerio.load(html)
			let imageSrc = $(".center.img-container-desktop a").attr("href")
			return console.log(imageSrc)
		}
	})
}




// Other Random #1
// inputQuery("activity/")
async function inputQuery(text) {
	const query = String(text).split(/ +/).join("%20")
	const url = String(`https://picsum.photos/200/300?random=1`);
	await axios.get(url).then(resp => {
		const result = resp.data;
		// ## Read result ## //
		console.log(result)
	})
}




// Flower Knight Girl Wikia
// WikiaURL("https://flowerknight.fandom.com/wiki/Special:Search?query=absorbs+HP&scope=internal&navigationSearch=true")
async function WikiaURL(url) {
	request(url, async(error, response, html) => {
		if (!error) {
			let $ = cheerio.load(html)
			const list = $('li[class="unified-search__result"]')
			.find("li > article > h1 > a").toArray().map(element => $(element).attr('href'))
			list.forEach(async urlData => {
				return await forEachWikiPage(urlData)
			})
		}
	})
}
const listedUrlImg = []
async function forEachWikiPage(getImgURL) {
	request(getImgURL, (error, response, html) => {
		if (!error) {
			let $ = cheerio.load(html)
			let imageSrc = $('table[class="wikitable cs cs-force-center"]')
			.find("tbody > tr > td > a > img").attr("data-src")
			if (!listedUrlImg.includes(imageSrc)) {
				listedUrlImg.push(imageSrc)
			}
			return listedUrlImg.forEach(urlList => downloadImgUrl(urlList))
		}
	})
}
async function downloadImgUrl(url){
	const rawUrl = String(url).replace("/revision/latest/scale-to-width-down/80?cb=", "").slice(0, 74)
	const path = './database.json'
	if (!database.includes(url)) {
		database.push(url)
		await fs.writeFile(path, await JSON.stringify(database, null, 4), error => { if (error) console.log(error) })
		// Download
		await download({
			imgs:[
				{
					uri:rawUrl
				}
			],
			dest: "./downloads"
		}).then(() => {
			console.log(`An image downloaded`)
		})
	}
}
