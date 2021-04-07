function addNewRoom(req, res, rooms) {
    getNrRooms(rooms).then((nrRooms) => {
        const newRoom = new rooms({
            roomId: nrRooms + 1,
            roomNumber: req.body.roomNr,
            type: req.body.roomType,
            price: req.body.roomPrice,
            facilities: "needToBeAdded"
        });
        newRoom.save(function (err) {
            if (err) {
                console.log(err);
                getAllRooms(rooms).then((roomsToShow) => {
                    res.redirect("rooms/?rooms=" + JSON.stringify(roomsToShow));
                });
                return;
            } else {
                console.log("saved");
                getAllRooms(rooms).then((roomsToShow) => {
                    res.redirect("rooms/?rooms=" + JSON.stringify(roomsToShow));
                });
                return;
            }
        });
    });
}

async function getNrRooms(rooms) {
    let nrRooms = (await rooms.find()).length;
    return nrRooms;
}

async function getAllRooms(rooms) {
    let roomList = await rooms.find();
    let roomsToShow = [];

    roomList.forEach(function (room) {
        roomsToShow.push({
            roomId: room.roomId,
            roomNr: room.roomNumber,
            roomType: room.type,
            price: room.price,
            facilities: room.facilities,
        });
    });
    return roomsToShow;
}

function updateRoom(req, res, rooms) {
    let query = { roomNumber: req.body.roomNumer };

    rooms.findOneAndUpdate(query,
        {
            price: req.body.price,
            facilities: req.body.facilities,
        },
        function (err, doc) {
            if (err) {
                console.log("[ERROR:updateRoom]=" + err);
                getAllRooms(rooms).then((roomsToShow) => {
                    res.redirect("rooms/?rooms=" + JSON.stringify(roomsToShow));
                });
            }
            else {
                getAllRooms(rooms).then((roomsToShow) => {
                    res.redirect("rooms/?rooms=" + JSON.stringify(roomsToShow));
                });
            }
        });
}

function deleteRoom(req, res, rooms) {
    rooms.findByIdAndDelete({ roomNumber: req.body.roomNumber }, function (err) {
        if (err) {
            console.log("[ERROR:updateRoom]=" + err);
            getAllRooms(rooms).then((roomsToShow) => {
                res.redirect("rooms/?rooms=" + JSON.stringify(roomsToShow));
            });
        }
        else {
            getAllRooms(rooms).then((roomsToShow) => {
                res.redirect("rooms/?rooms=" + JSON.stringify(roomsToShow));
            });
        }
    });
}


module.exports = {
    addNewRoom,
    updateRoom,
    deleteRoom,
    getAllRooms
};