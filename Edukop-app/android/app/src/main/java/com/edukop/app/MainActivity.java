package com.edukop.app;
import android.os.Bundle;

import com.ionicframework.capacitor.Checkout;
import com.codetrixstudio.capacitor.GoogleAuth.GoogleAuth;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        registerPlugin(Checkout.class);
        registerPlugin(GoogleAuth.class);
    }
}
