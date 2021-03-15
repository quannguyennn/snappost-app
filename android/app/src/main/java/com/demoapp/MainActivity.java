package com.appg.ericchi;
import android.os.Bundle;
import com.facebook.react.ReactActivity;
import com.zoontek.rnbootsplash.RNBootSplash;
import com.zing.zalo.zalosdk.oauth.ZaloSDK;
import android.content.Intent;
public class MainActivity extends ReactActivity {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
   @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    RNBootSplash.init(R.drawable.bootsplash, MainActivity.this); // <- display the generated bootsplash.xml drawable over our MainActivity
  }
  @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {
      super.onActivityResult(requestCode, resultCode, data);
      ZaloSDK.Instance.onActivityResult(this, requestCode, resultCode, data);
    }
  @Override
  protected String getMainComponentName() {
    return "DemoApp";
  }
}
