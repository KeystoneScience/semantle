import React, { useState, useEffect } from "react";
import { Accelerometer } from "expo-sensors";

var mAccel = 0;
var mAccelCurrent = 0;
var mAccelLast = 0;
export default function useShakeDetection(onShake) {
  const _slow = () => {
    Accelerometer.setUpdateInterval(1000);
  };

  const _fast = () => {
    Accelerometer.setUpdateInterval(16);
  };

  const _subscribe = async () => {
    Accelerometer.addListener((accelerometerData) => {
      mAccelLast = mAccelCurrent;
      mAccelCurrent = Math.sqrt(
        accelerometerData.x * accelerometerData.x +
          accelerometerData.y * accelerometerData.y +
          accelerometerData.z * accelerometerData.z
      );
      const delta = mAccelCurrent - mAccelLast;
      mAccel = mAccel * 0.9 + delta;
      if (mAccel > 1.4) {
        onShake();
      }
    });
  };
  const _unsubscribe = () => {
    Accelerometer.removeAllListeners();
  };

  const _initialize = () => {
    mAccel = 0;
    mAccelCurrent = 0;
    mAccelLast = 0;
  };
  useEffect(() => {
    mAccel = 0;
    mAccelCurrent = 0;
    mAccelLast = 0;
    _subscribe();
    return () => _unsubscribe();
  }, []);

  return { _unsubscribe, _subscribe, _initialize };
}
