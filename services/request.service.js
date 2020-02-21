const axios = require('axios');
const cheerio = require('cherio');

const getRequestData = async (opt = { captcha: false }) => {
    const { data, headers } = await axios.get('https://rezervasyon.iste.edu.tr/');
    const $ = cheerio.load(data);
    const token = $('meta[name=csrf-token]').attr('content');
    const cookieString = headers["set-cookie"].map(cookie => cookie.split('expires')[0].split(' ').join('')).reduce((prev, next) => prev + ' ' + next);
    if (opt.captcha) {
        const captchaImage = $('body > div:nth-child(3) > div:nth-child(2) > div > div > div > form > div.mb-3.text-center > img').attr('src');
        return { token, cookieString, captchaImage }
    }
    return { token, cookieString };
}

const getTokenAndCookieString = async (opt = { data, headers }) => {
    const $ = cheerio.load(opt.data);
    const token = $('meta[name=csrf-token]').attr('content');
    const cookieString = opt.headers["set-cookie"].map(cookie => cookie.split('expires')[0].split(' ').join('')).reduce((prev, next) => prev + ' ' + next);
    return { token, cookieString };
}

module.exports = { getRequestData, getTokenAndCookieString };