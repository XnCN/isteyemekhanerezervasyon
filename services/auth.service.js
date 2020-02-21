const axios = require('axios');

const setAuthCredentials = async (opt = { number, password, captcha: 'aydemirerayhan', cookieString, token }) => {
    const { data, headers } = await axios.post('https://rezervasyon.iste.edu.tr/', {
        '_token': opt.token,
        'tur': 'obs',
        'numara': opt.number,
        'password': opt.password,
        'dogrulama': opt.captcha
    }, { headers: { Cookie: opt.cookieString } });
    if (!data.includes("Giriş Başarılı!")) return false;
    return { data, headers };
}

module.exports = { setAuthCredentials }


