import "@babel/polyfill";
import "./styles.css";
import { init } from "./init";
import { GraphStore } from "./stores/GraphStore";

const rootElement: HTMLElement = document.getElementById("root")!;

init(rootElement, {
  graphStore: new GraphStore()
});
