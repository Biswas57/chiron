import { HistoryManager, HistoryItem } from './genHistory.js';

const KB_LOCAL_STORAGE_KEY = "KBs"

export function addKBtoLocalStorage(metadata, scriptText) {
    let historyManager = new HistoryManager();
    let history = historyManager.fromJSON(localStorage.getItem(KB_LOCAL_STORAGE_KEY));
    let historyItem = new HistoryItem(metadata.title, metadata.url, metadata.kb_id, metadata.model, scriptText);

    history.unshift(historyItem);
    localStorage.setItem(KB_LOCAL_STORAGE_KEY, historyManager.toJSON(history));
}

export function editKBtoLocalStorage(index, scriptText) {
    let historyManager = new HistoryManager();
    let history = historyManager.fromJSON(localStorage.getItem(KB_LOCAL_STORAGE_KEY));

    history[index].addData(scriptText);

    localStorage.setItem(KB_LOCAL_STORAGE_KEY, historyManager.toJSON(history));
}

export function getAllKBfromLocalStorage() {
    let historyManager = new HistoryManager();
    let history = historyManager.fromJSON(localStorage.getItem(KB_LOCAL_STORAGE_KEY));

    return history;
}

export function getKBfromLocalStorage(idx) {
    let historyManager = new HistoryManager();
    let history = historyManager.fromJSON(localStorage.getItem(KB_LOCAL_STORAGE_KEY));

    return history[idx];
}
