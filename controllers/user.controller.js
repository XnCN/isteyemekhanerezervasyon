const axios = require('axios');
const cheerio = require('cherio');
const store = require('../store');
const { parseTable } = require("@joshuaavalon/cheerio-table-parser");


const getUserData = async () => {
    const { data } = await axios.get('https://rezervasyon.iste.edu.tr/panel', { headers: { Cookie: store.cookieString } })
    const $ = cheerio.load(data);
    const lastTransactions = parseTable($("table")[0], {
        parser: element => cheerio(element).text().trim()
    }).map(t => { return { place: t[0], date: t[1] } });

    const recentDeposits = parseTable($("table")[1], {
        parser: element => cheerio(element).text().trim()
    }).map(t => { return { money: t[0], date: t[1] } });

    const fullName = $('body > div > div.content-wrapper > section.content > div > div:nth-child(1) > div:nth-child(1) > div > div > span.info-box-text').text();
    const balance = $('body > div > div.content-wrapper > section.content > div > div:nth-child(1) > div:nth-child(2) > div > div > span.info-box-text').text();

    const userData = {
        fullName,
        balance,
        lastTransactions,
        recentDeposits
    }
    console.log(userData);
}

module.exports = { getUserData }