const axios = require('axios');
const cheerio = require('cherio');
const store = require('../store');
const { parseTable } = require("@joshuaavalon/cheerio-table-parser");


const getReservations = async () => {
    const { data } = await axios.get('https://rezervasyon.iste.edu.tr/panel/listele', { headers: { Cookie: store.cookieString } })
    const $ = cheerio.load(data);

    const reservationDetailLinks = $('a.btn-success').map(function (i, el) {
        return $(this).attr('href');
    }).get();

    const lastReservations = parseTable($("table")[0], {
        parser: element => cheerio(element).text().trim()
    }).splice(-1, 1).map((el, i) => {
        const foodDate = el[0].split(" ")[0];
        const placeAndMenuType = el[1].split("/");
        const place = placeAndMenuType[0].split("(")[0].trim();
        const menuType = placeAndMenuType[1];
        const price = el[2];
        const cancelDate = el[3];
        const id = reservationDetailLinks[i].split('detay/')[1];
        return {
            id,
            foodDate,
            place,
            menuType,
            price,
            cancelDate
        };
    });
    console.log(lastReservations);
}

const getReservationDetail = async (reservationId) => {
    const { data } = await axios.get(`https://rezervasyon.iste.edu.tr/panel/detay/${reservationId}`, { headers: { Cookie: store.cookieString } })
    const $ = cheerio.load(data);

    const date = $('div.card-body > div:nth-child(1) > div').text().trim().split(' ')[0];
    const place = $('div.card-body > div:nth-child(2) > div').text().split('(')[0].trim();
    const repas = $('div.card-body > div:nth-child(3) > div').text().trim();
    const menuName = $('div.card-body > div:nth-child(4) > div').text().trim();
    const price = parseFloat($('div.card-body > div:nth-child(6) > div').text().trim());
    const cancelDate = $('div.card-body > div:nth-child(7) > div').text().trim();
    const menu = $('div.card-body > div:nth-child(5) > div > div > div > div > div > span:nth-child(2)').text().trim().split(')').map(f => {
        try {
            const foodInformation = f.split('(');
            const name = foodInformation[0].trim();
            const cal = parseInt(foodInformation[1].split(' cal.')[0]);
            return {
                name,
                cal
            }
        }
        catch (e) { null }
    }).filter(f => f != undefined);
    console.log({ date, place, repas, price, cancelDate, menuName, menu });
}

module.exports = { getReservations, getReservationDetail }