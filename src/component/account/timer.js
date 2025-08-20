import { useEffect } from 'react';
import css from "@/styles/accountModal.module.scss";

const Timer = ({ seconds, setSeconds, isActive,stopTimer }) => {

  useEffect(() => {
    let interval = null;
    if (isActive && seconds > 0) {
      interval = setInterval(() => {
        setSeconds(prevSeconds => prevSeconds - 1);
      }, 1000);
    } else  {
      clearInterval(interval);
      stopTimer()
    }

    return () => clearInterval(interval);
  }, [isActive, seconds, setSeconds]);

  return (
    <div  className={css.resendotp}>
      <span className={css.timer}>{seconds} seconds</span>
    </div>
  );
};

export default Timer;
