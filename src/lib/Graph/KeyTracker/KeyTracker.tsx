import * as React from "react";
import * as keycode from "keycode";
import { observable, action } from "mobx";
import { EventEmitter } from "events";

export type KeyName = keyof (typeof keycode)["codes"];

export type KeyStates = { [K in KeyName]: boolean };

export class KeyTrackerStore {
  @observable
  keyStates: KeyStates;

  keyDownEmitter = new EventEmitter();
  keyUpEmitter = new EventEmitter();

  keyUpListeners: [KeyName, (e: KeyboardEvent) => void][];
  keyDownListeners: [KeyName, (e: KeyboardEvent) => void][];

  constructor() {
    this.keyStates = {} as KeyStates;
    this.keyDownListeners = [];
    this.keyUpListeners = [];
  }

  switchListeners(onOrOff: "on" | "off") {
    this.keyUpListeners.forEach(([key, listener]) => {
      this.keyUpEmitter[onOrOff](key, listener);
    });

    this.keyDownListeners.forEach(([key, listener]) => {
      this.keyDownEmitter[onOrOff](key, listener);
    });
  }

  onKeyDown(key: KeyName, handler: (e: KeyboardEvent) => void) {
    this.keyDownListeners.push([key, handler]);
  }

  onKeyUp(key: KeyName, handler: (e: KeyboardEvent) => void) {
    this.keyUpListeners.push([key, handler]);
  }

  @action
  updateKeyState(key: KeyName, isDown: boolean) {
    this.keyStates[key] = isDown;
  }

  isKeyDown(key: KeyName) {
    return this.keyStates[key] === true;
  }

  isKeyUp(key: KeyName) {
    return this.keyStates[key] === false;
  }
}

export class KeyTracker extends React.Component<{ store: KeyTrackerStore }> {
  componentDidMount() {
    this.props.store.switchListeners("on");
    window.addEventListener("keydown", this.handleKeyDown);
    window.addEventListener("keyup", this.handleKeyUp);
  }

  componentWillUnmount() {
    this.props.store.switchListeners("off");
    window.removeEventListener("keydown", this.handleKeyDown);
    window.removeEventListener("keyup", this.handleKeyUp);
  }

  handleKeyDown = (e: KeyboardEvent) => {
    const keyName = keycode(e) as KeyName;

    this.props.store.updateKeyState(keyName, true);
    this.props.store.keyDownEmitter.emit(keyName);
  };

  handleKeyUp = (e: KeyboardEvent) => {
    const keyName = keycode(e) as KeyName;

    this.props.store.updateKeyState(keyName, false);
    this.props.store.keyUpEmitter.emit(keyName);
  };

  render() {
    return null;
  }
}
