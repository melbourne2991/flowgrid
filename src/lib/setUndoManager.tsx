import { UndoManager } from "mst-middlewares";

export let undoManager: any = {};

const undo = () => undoManager.canUndo && undoManager.undo();
const redo = () => undoManager.canRedo && undoManager.redo();

export const keyListener = (e: KeyboardEvent) => {
  if (e.which === 89 && e.ctrlKey) {
    redo();
  } else if (e.which === 90 && e.ctrlKey) {
    undo();
  }
};

export const setUndoManager = (targetStore: any) => {
  document.addEventListener("keydown", keyListener);
  undoManager = UndoManager.create({}, { targetStore });
};
