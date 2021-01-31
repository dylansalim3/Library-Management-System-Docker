// const db = require('../database/db.js');
const SettingRepository = require('../repository/SettingRepository');

exports.updateSetting = (req, res) => {
    const school_name = req.body.school_name;
    const school_address = req.body.school_address;
    const opening_hours = req.body.opening_hours;
    const email = req.body.email;
    const book_fine = req.body.book_fine;
    const reservation_function = req.body.reservation_function;

    SettingRepository.updateSetting(
        school_name,
        school_address,
        opening_hours,
        email,
        book_fine,
        reservation_function
    ).then((result) => {
        res.send({result: result});
    });
};

exports.getSetting = (req, res) => {
    SettingRepository.getSetting()
        .then((result) => {
            const flattenResult = result.flat(2);
            if (flattenResult.length > 0){
                res.send({result: flattenResult[0]});
            }
        })
}
