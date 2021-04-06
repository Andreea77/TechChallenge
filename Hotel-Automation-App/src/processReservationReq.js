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
    if (rangeDate.length < 24) {
        res.redirect("home-page/?firstName:" + userService.getUser().firstName);
        return;
    }
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
        let query = "";
        roomList.forEach(function (room) {
            if (allAvailableRooms.find(element => element === room.roomId) != null) {
                let result = {
                    roomId: room.roomId,
                    roomType: room.type,
                    nrPerson: roomType_val,
                    price: room.price
                };

                roomsToShow.push(result);
                query += new URLSearchParams(result);
            }
        });
        res.render("find-option", {
            rooms: roomsToShow,
        });

        console.log(query);
        // res.redirect("find-option/?rooms=" + query);
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


function addReservation(req, res, reservations) {
    getNrReservations(reservations).then((nrReservations) => {
        const newReservation = new reservations({
            reservationId: nrReservations + 1,
            userId: userService.getUser().userId,
            roomId: req.body.reserveBtn,
            startDate: startDateForGuest,
            endDate: endDateForGuest
        });
        newReservation.save(function (err) {
            if (err) {
                console.log(err);
                res.redirect("/find-option");
                return;
            }
            else {
                console.log("saved");
                res.redirect("home-page/?firstName:" + userService.getUser().firstName);
                return;
            }
        });
    });
}

async function getNrReservations(reservations) {
    let nrReservations = ((await reservations.find()).length);
    return nrReservations;
}



async function getAllReservationForUser(res, reservations, rooms) {
    let reservationsList = await reservations.find({ userId: userService.getUser().userId });
    let reservationToShow = [];

    reservationsList.forEach(async function (reservation) {
        let room = await rooms.find({ roomId: reservation.roomId });
        reservationToShow.push({
            startDate: reservation.startDate,
            endDate: reservation.endDate,
            status: reservation.status,
            roomNr: room.roomNumber,
            roomType: room.type
        });
    });

    res.render("my-reservations", {
        reservations: reservationToShow,
    });
    // res.redirect("my-reservations/?reservations=" + reservationsList.toString());
}



module.exports = {
    getAllAvailableRoomsForInterval,
    addReservation,
    getAllReservationForUser
};