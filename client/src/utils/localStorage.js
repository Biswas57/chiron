const KB_LOCAL_STORAGE_KEY = "KBs"

export function addKBtoLocalStorage(kb_id, title, data) {
    let kbs = getKBfromLocalStorage();
    kbs.push({
        kbId: kb_id,
        title: title,
        timeGenerated: new Date().toLocaleString(),
        data: data
    });

    localStorage.setItem(KB_LOCAL_STORAGE_KEY, JSON.stringify(kbs));
}

export function getKBfromLocalStorage() {
    if (localStorage.getItem(KB_LOCAL_STORAGE_KEY) === null) {
        localStorage.setItem(KB_LOCAL_STORAGE_KEY, JSON.stringify([]));
    }

    return JSON.parse(localStorage.getItem(KB_LOCAL_STORAGE_KEY));
}
