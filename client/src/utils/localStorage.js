const KB_LOCAL_STORAGE_KEY = "KBs"

export function addKBtoLocalStorage(metadata, scriptText) {
    let kbs = getAllKBfromLocalStorage();
    kbs.unshift({
        url: metadata.url,
        kbId: metadata.kb_id,
        title: metadata.title,
        model: metadata.model,
        timeGenerated: new Date().toLocaleString(),
        data: scriptText
    });

    localStorage.setItem(KB_LOCAL_STORAGE_KEY, JSON.stringify(kbs));
}

export function editKBtoLocalStorage(index, scriptText) {
    let kbs = getAllKBfromLocalStorage();
    console.log(index);
    kbs[index].data = scriptText;

    localStorage.setItem(KB_LOCAL_STORAGE_KEY, JSON.stringify(kbs));
}

export function getAllKBfromLocalStorage() {
    if (localStorage.getItem(KB_LOCAL_STORAGE_KEY) === null) {
        localStorage.setItem(KB_LOCAL_STORAGE_KEY, JSON.stringify([]));
    }

    let savedKbs = JSON.parse(localStorage.getItem(KB_LOCAL_STORAGE_KEY));

    return savedKbs;
}

export function getKBfromLocalStorage(idx) {
    return getAllKBfromLocalStorage()[idx];
}
