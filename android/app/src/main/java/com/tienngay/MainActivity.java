package com.tienngay;

import com.facebook.react.ReactActivity;
import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.ReactRootView;
import com.facebook.react.config.ReactFeatureFlags;
public class MainActivity extends ReactActivity {

  static {
//    ReactFeatureFlags.useTurboModules = true;
  }

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "Tienngay";
  }
}
