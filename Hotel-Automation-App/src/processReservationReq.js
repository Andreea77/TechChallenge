/**
 * Will use to get the user
 */
const userService = require('./processAuthReq');

/**
 * memorise the start date for reservation
 */
let startDateForGuest;
/**
 * memorise the start date for reservation
 */
let endDateForGuest;

/**
 * The list with all rooms.
 */
let roomList;

/**
 * Search available rooms for an interval
 * @param {*} req 
 * @param {*} res 
 * @param {*} reservations - all reservations from database
 */
function getAllAvailableRoomsForInterval(req, res, reservations, rooms) {

    //------------------get date-------------------//
    let rangeDate = req.body.rangeDate;
    startDateForGuest = new Date(parseInt(rangeDate.substring(0, 4)),
        (parseInt(rangeDate.substring(5, 7)) - 1),
        parseInt(rangeDate.substring(8, 10)));
    endDateForGuest = new Date(parseInt(rangeDate.substring(14, 18)),
        (parseInt(rangeDate.substring(19, 21)) - 1),
        parseInt(rangeDate.substring(22, 24)));

    //--------------- get room type -------------//
    let roomType_val = req.body.roomType;
    let roomType;
    if (roomType_val == 1) {
        roomType = "Single";
    }
    else if (roomType_val == 2) {
        roomType = "Double";
    }
    else {
        roomType = "Triple";
    }

    //-------------------------//

    getAllAvailableRooms(reservations, rooms, roomType).then((allAvailableRooms) => {
        let roomsToShow = [];
        roomList.forEach(function (room) {
            if (allAvailableRooms.find(element => element === room.roomId) != null ) {
                roomsToShow.push({
                    roomType: room.type,
                    nrPerson: roomType_val,
                    price: room.price
                });
            }
        });

        res.render("find-option", {
            rooms: roomsToShow,
          });
    });
}

/**
 * Get a list of all rooms that are busy for that interval.
 * @param {*} allReservations - A list of all reservations from database
 * @returns 
 */
async function getAllBusyRooms(allReservations) {
    var allBusyRooms = [];

    let reservationsList1 = await allReservations.find({ startDate: { $gt: startDateForGuest, $lt: endDateForGuest } });

    if (reservationsList1 !== 'undefined' && reservationsList1.length > 0) {
        console.log("Receive some room that are busy for that interval! (1)");
        reservationsList1.forEach(function (reservation) {
            allBusyRooms.push(reservation.roomId);
        });
    }

    let reservationsList2 = await allReservations.find({ endDate: { $gt: startDateForGuest, $lt: endDateForGuest } });
    if (reservationsList2 !== 'undefined' && reservationsList2.length > 0) {
        console.log("Receive some room that are busy for that interval! (2)");
        reservationsList2.forEach(function (reservation) {
            allBusyRooms.push(reservation.roomId);
        });
    }

    let reservationsList3 = await allReservations.find({ startDate: { $lt: startDateForGuest }, endDate: { $gt: endDateForGuest } });
    if (reservationsList3 !== 'undefined' && reservationsList3.length > 0) {
        console.log("Receive some room that are busy for that interval! (3)");
        reservationsList3.forEach(function (reservation) {
            allBusyRooms.push(reservation.roomId);
        });
    }

    return allBusyRooms;
}

/**
 * Search in reservations all rooms that are available.
 * @param {*} allReservations  - list of all existing reservations
 * @param {*} allRooms - List of all rooms existing in the hotel
 * @returns an array of roomId for all available rooms
 */
async function getAllAvailableRooms(allReservations, allRooms, roomType) {
    let allAvailableRooms = [];
    roomList = await allRooms.find();

    await getAllBusyRooms(allReservations).then((allBusyRooms) => {
        roomList.forEach(function (room) {
            if (allBusyRooms.find(element => element === room.roomId) == null && room.type === roomType) {
                // not found in busy rooms + type is ok
                allAvailableRooms.push(room.roomId);
            }
        });
    });
    return allAvailableRooms;
}


function addReservation(/*req, res,*/ reservations, rooms) {
    // TODO: How to get selected room??
    // based on roomNumber should get the roomId.
    const newReservation = new reservations({
        reservationId: reservations.length,
        userId: userService.getUser(),
        roomId: 1,
        startDate: startDateForGuest,
        endDate: endDateForGuest
    });
    newReservation.save(function (err) {
        if (err) return handleError(err);
        // saved!
    });
}


module.exports = {
    getAllAvailableRoomsForInterval
};