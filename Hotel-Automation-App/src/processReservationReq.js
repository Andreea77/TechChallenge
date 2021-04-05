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
 * Search available rooms for an interval
 * @param {*} req 
 * @param {*} res 
 * @param {*} reservations - all reservations from database
 */
function getAllAvailableRoomsForInterval(/*req, res,*/ reservations, rooms) {
    // to check the name for this inputs.
    // var _startDate = req.body.startDate;
    // var _endDate = req.body.endDate;
    startDateForGuest = new Date(2021, 3, 5);
    endDateForGuest = new Date(2021, 3, 15);
    // + room type

    //let allAvailableRooms = getAllAvailableRooms(reservations, rooms);

    getAllAvailableRooms(reservations, rooms).then((value) => {
        console.log("in main!");
        console.log("All available rooms: " + value.length);
        value.forEach(element => console.log(element));
    });
    // console.log("All available rooms: " + allAvailableRooms.length);
    // allAvailableRooms.forEach(element => console.log(element));
    // now should somehow show all available rooms, having their id.
}

/**
 * Get a list of all rooms that are busy for that interval.
 * @param {*} allReservations - A list of all reservations from database
 * @returns 
 */
async function getAllBusyRooms(allReservations) {
    var allBusyRooms = [];

    // allReservations.find({ startDate: { $gt: startDateForGuest, $lt: _endDate } }, function (err, reservations) {
    //     if (err) {
    //         console.log("ERROR in [getAllBusyRooms]: " + err);
    //         return allBusyRooms;
    //     }

    //     if (reservations !== 'undefined' && reservations.length > 0) {
    //         console.log("Receive some room that are busy for that interval! (1)");
    //         reservations.forEach(function (_reservation) {
    //             allBusyRooms.push(_reservation.roomId);
    //         });
    //     }
    // });

    let reservationsList = await allReservations.find({ startDate: { $gt: startDateForGuest, $lt: endDateForGuest } });

    if (reservationsList !== 'undefined' && reservationsList.length > 0) {
        console.log("Receive some room that are busy for that interval! (1)");
        reservationsList.forEach(function (reservation) {
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


    // allReservations.find({ startDate: { $gt: startDateForGuest, $lt: _endDate } }, function (err, reservations) {
    //     if (err) {
    //         console.log("ERROR in [getAllBusyRooms]: " + err);
    //         return allBusyRooms;
    //     }

    //     if (reservations !== 'undefined' && reservations.length > 0) {
    //         console.log("Receive some room that are busy for that interval! (1)");
    //         reservations.forEach(function (_reservation) {
    //             allBusyRooms.push(_reservation.roomId);
    //         });
    //     }

    // });

    // allReservations.find({ endDate: { $gt: startDateForGuest, $lt: _endDate } }, function (err, reservations) {
    //     if (err) {
    //         console.log("ERROR in [getAllBusyRooms]: " + err);
    //         return allBusyRooms;
    //     }

    //     if (reservations !== 'undefined' && reservations.length > 0) {
    //         console.log("Receive some room that are busy for that interval! (2)");
    //         reservations.forEach(function (_reservation) {
    //             allBusyRooms.push(_reservation.roomId);
    //         });
    //     }
    // });

    return allBusyRooms;
}


/**
 * Search in reservations all rooms that are available.
 * @param {*} allReservations  - list of all existing reservations
 * @param {*} allRooms - List of all rooms existing in the hotel
 * @returns an array of roomId for all available rooms
 */
async function getAllAvailableRooms(allReservations, allRooms) {
    let allAvailableRooms = [];
    await getAllBusyRooms(allReservations).then(async (allBusyRooms) => { 
        console.log("receive busy rooms!");

        await test(allBusyRooms, allRooms).then((value) => {
            console.log("receive availb rooms!");
            console.log(value);
            allAvailableRooms =  value;})

        // let roomList = await allRooms.find();
        // roomList.forEach(function (room) {
        //     if (allBusyRooms.find(element => element === room.roomId) == null) {
        //         // not found in busy rooms
        //         allAvailableRooms.push(room.roomId);
        //         // console.log(_room.roomId);
        //     }
        // });
    });

    // let allBusyRooms = getAllBusyRooms(allReservations);
    // console.log("busy len: " + allBusyRooms);
    // allRooms.find({}, function (err, _rooms) {
    //     _rooms.forEach(function (_room) {
    //         if (allBusyRooms.find(element => element === _room.roomId) == null) {
    //             // not found in busy rooms
    //             allAvailableRooms.push(_room.roomId);
    //             // console.log(_room.roomId);
    //         }
    //     });
    // });
    console.log("at the end of allAvailableRooms: " + allAvailableRooms.length);
    return allAvailableRooms; // empty.
}

async function test(allBusyRooms, allRooms) {
    let allAvailableRooms = [];
    let roomList = await allRooms.find();
    roomList.forEach(function (room) {
        if (allBusyRooms.find(element => element === room.roomId) == null) {
            // not found in busy rooms
            allAvailableRooms.push(room.roomId);
            // console.log(room.roomId);
        }
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