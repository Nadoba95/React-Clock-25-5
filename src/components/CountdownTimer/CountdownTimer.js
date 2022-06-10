import { useEffect, useRef, useState } from "react";

import Card from "../Card/Card";
import classes from "./CountdownTimer.module.css";

function CountdownTimer() {
  const [breakTime, setBreakTime] = useState(5);
  const [sessionTime, setSessionTime] = useState(25);
  const [timer, setTimer] = useState(() => sessionTime * 60);

  const [isPaused, setIsPaused] = useState(true);
  const [isSessionTime, setIsSessionTime] = useState(true);
  const [timerLabel, setTimerLabel] = useState(true);
  const audioRef = useRef();

  useEffect(() => {
    if (isSessionTime) {
      setTimer(sessionTime * 60);
      setTimerLabel(true);
    }
  }, [sessionTime, isSessionTime]);

  useEffect(() => {
    if (!isSessionTime) {
      setTimer(breakTime * 60);
      setTimerLabel(false);
    }
  }, [breakTime, isSessionTime]);

  useEffect(() => {
    if (timer === 0) {
      audioRef.current.play();
      setIsSessionTime((prevIsSessionTime) => !prevIsSessionTime);
    }
  }, [timer]);

  useEffect(() => {
    let intervalTimer = 0;

    if (!isPaused) {
      intervalTimer = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    }

    return () => {
      clearInterval(intervalTimer);
    };
  }, [isPaused]);

  function convertSecToMin(value) {
    return `${value < 600 ? "0" : ""}${
      Math.floor(value / 60) +
      ":" +
      (value % 60 < 10 ? "0" + (value % 60) : value % 60)
    }`;
  }

  function timerStartStopHandler() {
    setIsPaused((prevIsPaused) => {
      return !prevIsPaused;
    });
  }

  function decrementBreakTimeHandler() {
    if (breakTime === 1) {
      return;
    }
    setBreakTime((prevBreakTime) => prevBreakTime - 1);
  }

  function incrementBreakTimeHandler() {
    if (breakTime === 60) {
      return;
    }
    setBreakTime((prevBreakTime) => prevBreakTime + 1);
  }

  function decrementSessionTimeHandler() {
    if (sessionTime === 1) {
      return;
    }
    setSessionTime((prevSessionTime) => prevSessionTime - 1);
  }

  function incrementSessionTimeHandler() {
    if (sessionTime === 60) {
      return;
    }
    setSessionTime((prevSessionTime) => prevSessionTime + 1);
  }

  function resetTimerHandler() {
    setBreakTime(5);
    setSessionTime(25);
    setTimer(() => sessionTime * 60);
    setIsPaused(true);
    setIsSessionTime(true);
    setTimerLabel(true);
    audioRef.current.load();
  }

  return (
    <Card>
      <div className={classes.title}>Clock 25 + 5</div>
      <div className={classes.columns}>
        <div className={classes.break}>
          <div className={classes["break_label"]}>Break Length</div>
          <button
            className={classes["break_decrement"]}
            onClick={decrementBreakTimeHandler}
            disabled={!isPaused}
          >
            <i className="fa-solid fa-arrow-down"></i>
          </button>
          <span className={classes["break_length"]}>{breakTime}</span>
          <button
            className={classes["break_increment"]}
            onClick={incrementBreakTimeHandler}
            disabled={!isPaused}
          >
            <i className="fa-solid fa-arrow-up"></i>
          </button>
        </div>
        <div className={classes.session}>
          <div className={classes["session_label"]}>Session Length</div>
          <button
            className={classes["session_decrement"]}
            onClick={decrementSessionTimeHandler}
            disabled={!isPaused}
          >
            <i className="fa-solid fa-arrow-down"></i>
          </button>
          <span className={classes["session_length"]}>{sessionTime}</span>
          <button
            className={classes["session_increment"]}
            onClick={incrementSessionTimeHandler}
            disabled={!isPaused}
          >
            <i className="fa-solid fa-arrow-up"></i>
          </button>
        </div>
      </div>
      <div className={classes.timer}>
        <div className={classes["timer-label"]}>
          {timerLabel ? "Session" : "Break"}
        </div>
        <span className={classes["time-left"]}>{convertSecToMin(timer)}</span>
      </div>
      <div className={classes.controls}>
        <button
          className={classes["start-stop"]}
          onClick={timerStartStopHandler}
        >
          {isPaused ? (
            <i className="fa-solid fa-play"></i>
          ) : (
            <i className="fa-solid fa-pause"></i>
          )}
        </button>
        <button className={classes.reset} onClick={resetTimerHandler}>
          <i className="fa-solid fa-repeat"></i>
        </button>
      </div>
      <audio
        ref={audioRef}
        preload="auto"
        src="https://www.soundjay.com/buttons/sounds/beep-01a.mp3"
      ></audio>
    </Card>
  );
}

export default CountdownTimer;
