import "@babel/polyfill";
import "./styles.css";
import { init } from "./init";

const rootElement: HTMLElement = document.getElementById("root")!;

init(rootElement, {});
