package com.example.hotel_app;

import com.google.gson.annotations.SerializedName;

public class Post {

    private int RoomId;
    private int RoomNumber;
    private String Type;
    private int Status;
    private int Price;
    private String Facilities;

    public int getRoomId() {
        return RoomId;
    }

    public int getRoomNumber() {
        return RoomNumber;
    }

    public String getType() {
        return Type;
    }

    public int getStatus() {
        return Status;
    }

    public int getPrice() {
        return Price;
    }

    public String getFacilities() {
        return Facilities;
    }
}
