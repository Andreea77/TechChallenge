package com.example.hotel_app;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.TextView;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import java.util.List;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;

public class HomeActivity extends AppCompatActivity {
    private TextView textViewResult;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_home);

        textViewResult = findViewById(R.id.text_view);

        Gson gson = new GsonBuilder()
                .setLenient()
                .create();

        Retrofit retrofit = new Retrofit.Builder()
                .baseUrl("http://10.0.2.2:3300")
                .addConverterFactory(GsonConverterFactory.create(gson))
                .build();

        JsonPlaceHolderApi jsonPlaceHolderApi = retrofit.create(JsonPlaceHolderApi.class);

        Call<List<Post>> call = jsonPlaceHolderApi.getPosts();

        call.enqueue(new Callback<List<Post>>() {
            @Override
            public void onResponse(Call<List<Post>> call, Response<List<Post>> response) {
                if(!response.isSuccessful()) {
                    textViewResult.setText("Code: " + response);
                    return;
                }

                List<Post> posts = response.body();

                for (Post post : posts) {
                    String content = "";
                    content += "RoomId: " + post.getRoomId() + "\n";
                    content += "RoomNumber: " + post.getRoomNumber() + "\n";
                    content += "Type: " + post.getType() + "\n";
                    content += "Status: " + post.getStatus() + "\n";
                    content += "Price: " + post.getPrice() + "\n";
                    content += "Facilities: " + post.getFacilities() + "\n\n";

                    textViewResult.append(content);
                }
            }

            @Override
            public void onFailure(Call<List<Post>> call, Throwable t) {
                textViewResult.setText(t.getMessage());
            }
        });
        Button btn_nfc_scanner = findViewById(R.id.btn_nfc_scanner);
        btn_nfc_scanner.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                startActivity(new Intent(HomeActivity.this, NfcActivity.class));
            }
        });
    }
}