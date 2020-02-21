const { AuthService, RequestService } = require('../services');
const store = require('../store');


const authWithoutCaptcha = async (opt = { number, password }) => {
    const { token, cookieString } = await RequestService.getRequestData();
    const auth = await AuthService.setAuthCredentials({
        number: opt.number,
        password: opt.password,
        cookieString,
        token
    });
    if (!auth) return false;
    const authdata = await RequestService.getTokenAndCookieString({ data: auth.data, headers: auth.headers });
    store.token = authdata.token;
    store.cookieString = authdata.cookieString;
    return true;
}


module.exports = { authWithoutCaptcha };