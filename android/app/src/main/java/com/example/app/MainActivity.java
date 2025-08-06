package com.example.app;

import android.os.Bundle;
import com.getcapacitor.BridgeActivity;
import com.getcapacitor.Plugin;


import java.util.ArrayList;

import com.capacitorjs.plugins.filetransfer.FileTransferPlugin; // ⬅️ این خط الزامی است

public class MainActivity extends BridgeActivity {
  @Override
  public void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);

    this.init(savedInstanceState, new ArrayList<Class<? extends Plugin>>() {{
      add(FileTransferPlugin.class); // ⬅️ این خط الزامی است
    }});
  }
}
