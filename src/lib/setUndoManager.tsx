import { UndoManager } from "mst-middlewares";

export const setUndoManager = (targetStore: any) => {
  const undoManager = UndoManager.create({}, { targetStore });
  const undo = () => undoManager.canUndo && undoManager.undo();
  const redo = () => undoManager.canRedo && undoManager.redo();

  const keyListener = (e: KeyboardEvent) => {
    if (e.which === 89 && e.ctrlKey) {
      redo();
    } else if (e.which === 90 && e.ctrlKey) {
      undo();
    }
  };

  document.addEventListener("keydown", keyListener);
  return undoManager;
};
