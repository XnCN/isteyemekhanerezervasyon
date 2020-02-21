const { authWithoutCaptcha } = require('./controllers/auth.controller');
const { getUserData } = require('./controllers/user.controller');
const { getReservations, getReservationDetail } = require('./controllers/reservation.controller');

(async () => {
    await authWithoutCaptcha({ number: 'Numaranız', password: 'Parolanız' });
    await getUserData();
    await getReservations();
    await getReservationDetail(5043);
})();