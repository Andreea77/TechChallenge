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
function getAllAvailableRoomsForInterval(/*req, res,*/ reservations, rooms) {
    // to check the name for this inputs.
    // var _startDate = req.body.startDate;
    // var _endDate = req.body.endDate;
    var _startDate = new Date(2021, 3, 5);
    var _endDate = new Date(2021, 3, 15);
    // + room type

    var allAvailableRooms = getAllAvailableRooms(reservations, _startDate, _endDate, rooms);
    allAvailableRooms.forEach(element => console.log(element));
    // now should somehow show all available rooms, having their id.
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

        if (reservations !== 'undefined' && reservations.length > 0) {
            console.log("Receive some room that are busy for that interval! (1)");
            reservations.forEach(function (_reservation) {
                allBusyRooms.push(_reservation.roomId);
            });
        }
    });

    allReservations.find({ endDate: { $gt: _startDate, $lt: _endDate } }, function (err, reservations) {
        if (err) {
            console.log("ERROR in [getAllBusyRooms]: " + err);
            return allBusyRooms;
        }

        if (reservations !== 'undefined' && reservations.length > 0) {
            console.log("Receive some room that are busy for that interval! (2)");
            reservations.forEach(function (_reservation) {
                allBusyRooms.push(_reservation.roomId);
            });
        }
    });

    return allBusyRooms;
}

/**
 * Search in reservations all rooms that are available.
 * @param {*} allReservations  - list of all existing reservations
 * @param {*} _startDate - The start date which the guest is interested in
 * @param {*} _endDate - The end date which the guest is interested in
 * @param {*} allRooms - List of all rooms existing in the hotel
 * @returns an array of roomId for all available rooms
 */
function getAllAvailableRooms(allReservations, _startDate, _endDate, allRooms)
{
    var allBusyRooms = getAllBusyRooms(allReservations,_startDate, _endDate);
    var allAvailableRooms = [];
    console.log("All available rooms:");
    allRooms.find({}, function(err, _rooms)
    {
        _rooms.forEach(function (_room) {
            if (allBusyRooms.find(element => element === _room.roomId) == null)
            {
                // not found in busy rooms
                allAvailableRooms.push(_room.roomId);
                console.log(_room.roomId);
            }
        });
    });
    
    return allAvailableRooms; // array with roomId
}

function addReservation(/*req, res,*/ reservations, rooms) {
    // TODO: How to get selected room??
    // and how to create new object??

    var allAvailableRooms = getAllAvailableRooms(reservations, _startDate, _endDate, rooms);
    allAvailableRooms.forEach(element => console.log(element));
    // now should somehow show all available rooms, having their id.
}


module.exports = {
    getAllAvailableRoomsForInterval
};