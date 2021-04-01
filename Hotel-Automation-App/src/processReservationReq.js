/**
 * Will use to get the user
 */
const userService = require('./processAuthReq');

/**
 * Search available rooms for an interval
 * @param {*} req 
 * @param {*} res 
 * @param {*} reservations - all reservations from database
 */
function getAllAvailableRoomsForInterval(req, res, reservations) {
    // to check the name for this inputs.
    var _startDate = req.body.startDate;
    var _endDate = req.body.endDate;
}

/**
 * Get a list of all rooms that are busy for that interval.
 * @param {*} allReservations - A list of all reservations from database
 * @param {*} _startDate - The start date which the guest is interested in
 * @param {*} _endDate - The end date which the guest is interested in
 * @returns 
 */
function getAllBusyRooms(allReservations, _startDate, _endDate) {
    var allBusyRooms = [];

    allReservations.find({ startDate: { $gt: _startDate, $lt: _endDate } }, function (err, reservations) {
        if (err) {
            console.log("ERROR in [getAllBusyRooms]: " + err);
            return allBusyRooms;
        }

        if (reservations != null) {
            console.log("Receive some room that are busy for that interval!");
            reservations.forEach(function (_reservation) {
                allBusyRooms.push(_reservation.roomId);
                console.log(_reservation.roomId);
            });
        }
    });

    allReservations.find({ endDate: { $gt: _startDate, $lt: _endDate } }, function (err, reservations) {
        if (err) {
            console.log("ERROR in [getAllBusyRooms]: " + err);
            return allBusyRooms;
        }

        if (reservations != null) {
            console.log("Receive some room that are busy for that interval!");
            reservations.forEach(function (_reservation) {
                allBusyRooms.push(_reservation.roomId);
                console.log(_reservation.roomId);
            });
        }
    });

    return allBusyRooms;
}



module.exports = {
    getAllAvailableRoomsForInterval
};