import { KeyName } from "./KeyTracker/KeyTracker";

export interface KeyBindings {
    UPDATE_SELECTION_MODE: KeyName | KeyName[];
    DELETE: KeyName | KeyName[];
    DRAG_SELECT: KeyName | KeyName[];
}

export const defaultKeyBindings: KeyBindings = {
    UPDATE_SELECTION_MODE: ['ctrl', 'command'],
    DELETE: ['delete', 'backspace'],
    DRAG_SELECT: 'shift'
};