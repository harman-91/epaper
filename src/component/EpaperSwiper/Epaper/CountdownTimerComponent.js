import React, { useState, useEffect } from 'react';
import styles from '../../../styles/TimerComponent.module.css'; // CSS Module for styling
import { TfiTimer } from "react-icons/tfi";

export default function TimerComponent({ initialTime, onTimerComplete,timeLeft }) {


  return (
    <div className={styles.timerContainer}>
      <div className={styles.timerjnm}>
        <div className={styles.fontMon}>
          <div>Your free preview ends in</div>
          <div className={styles.countdownWrp}>
            <TfiTimer />
            <div className={styles.countdown}> {timeLeft}</div> sec
          </div>
          <button className={styles.timerSubs}>Subscribe to Jagran Epaper</button>
        </div>
      </div>
    </div>
  );
}