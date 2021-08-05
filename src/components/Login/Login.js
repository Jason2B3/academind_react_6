import React, { useState, useEffect, useReducer } from "react";

import Card from "../UI/Card/Card";
import classes from "./Login.module.css";
import Button from "../UI/Button/Button";

/**
 * We can define our reducerFn outside the main component function.
 * It interacts with nothing inside the component function anyway
 * @param {*} state: our last state snapshot
 * @param {*} action: the object arg we give the dispatchEmail ƒunction
 * @returns
 */
const emailReducer = function (emailState, action) {
  //$ On change, update emailState.value and check for validity
  if (action.type === "ON_CHANGE")
    return { value: action.value, isValid: action.value.includes("@") };
  //$ On blur, leave the emailState.value as is, and check for validity
  if (action.type === "ON_BLUR")
    return { value: emailState.value, isValid: emailState.value.includes("@") };
  //$ If action.type has no matches here, return the following as our emailState
  return { value: "", isValid: true };
};
const passwordReducer = function (passwordState, action) {
  //$ On change, update the passwordState.value, and check for validity
  if (action.type === "ON_CHANGE")
    return { value: action.value, isValid: action.value.trim().length > 6 };
  //$ On blur, leave the passwordState.value as is, and check for validity
  if (action.type === "ON_BLUR")
    return {
      value: passwordState.value,
      isValid: passwordState.value.trim().length > 6,
    };
  // If neither action types are those just listed, return the following obj
  return { value: "", isValid: true };
};
const Login = (props) => {
  //% Track form validity with useState (is dependent on emailState and passwordState)
  const [formIsValid, setFormIsValid] = useState(false);

  //% Track enteredEmail and emailIsValid with useReducer
  const [emailState, dispatchEmail] = useReducer(emailReducer, {
    value: "", // initial state object
    isValid: true, // initialize as true, so that we don't get red fields on startup
  });
  //% Track enteredPassword and passwordIsValid with useReducer
  const [passwordState, dispatchPassword] = useReducer(passwordReducer, {
    value: "", // initial state object
    isValid: true, // initialize as true, so that we don't get red fields on startup
  });
  //$ Supply state properties (isValid) as useEffect dependencies instead of the entire state object
  // Makes it so useEffect only runs when their validities change
  // No more unneeded verification after we know both password/email are valid already
  const { isValid: emailIsValid } = emailState;
  const { isValid: passwordIsValid } = passwordState;
  //% Check if both email and password are valid, after a 1s time gap after typing
  //% If they are, set formIsValid= true (and vice versa)
  useEffect(() => {
    const delayedCheck = setTimeout(() => {
      // DEBOUNCE: runs after a 1 second gap after the latest key tap
      console.log("Checking form validity RN");
      if (emailIsValid && passwordIsValid) setFormIsValid(true);
      else setFormIsValid(false);
    }, 1000);
    return () => {
      // CLEANUP: Timer reset function runs after every key tap
      console.log("cleanup");
      clearTimeout(delayedCheck);
    };
  }, [emailIsValid, passwordIsValid]);

  //% After each keytap, invoke email reducerFn ON_CHANGE actions
  const emailChangeHandler = (event) => {
    dispatchEmail({ type: "ON_CHANGE", value: event.target.value });
  };
  //% After losing a form field's focus, invoke email reducerFn ON_BLUR actions
  const validateEmailHandler = () => {
    dispatchEmail({ type: "ON_BLUR" });
  };
  //% After each keytap, invoke password reducerFn ON_CHANGE actions
  const passwordChangeHandler = (event) => {
    dispatchPassword({ type: "ON_CHANGE", value: event.target.value });
  };
  //% After losing a form field's focus, invoke password reducerFn ON_BLUR actions
  const validatePasswordHandler = () => {
    dispatchPassword({ type: "ON_BLUR" });
  };
  const submitHandler = (event) => {
    event.preventDefault();
    props.onLogin(emailState.value, passwordState.value);
  };

  return (
    <Card className={classes.login}>
      <form onSubmit={submitHandler}>
        <div
          className={`${classes.control} ${
            emailState.isValid === false ? classes.invalid : ""
          }`}
        >
          <label htmlFor="email">E-Mail</label>
          <input
            type="email"
            id="email"
            value={emailState.value}
            onChange={emailChangeHandler}
            onBlur={validateEmailHandler}
          />
        </div>
        <div
          className={`${classes.control} ${
            passwordState.isValid === false ? classes.invalid : ""
          }`}
        >
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={passwordState.value}
            onChange={passwordChangeHandler}
            onBlur={validatePasswordHandler}
          />
        </div>
        <div className={classes.actions}>
          <Button type="submit" className={classes.btn} disabled={!formIsValid}>
            Login
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default Login;
