const KB_LOCAL_STORAGE_KEY = "KBs"

export function addKBtoLocalStorage(kb_id, title, data) {
    let kbs = getAllKBfromLocalStorage();
    kbs.unshift({
        kbId: kb_id,
        title: title,
        timeGenerated: new Date().toLocaleString(),
        data: data
    });

    localStorage.setItem(KB_LOCAL_STORAGE_KEY, JSON.stringify(kbs));
}

export function editKBtoLocalStorage(index, data) {
    let kbs = getAllKBfromLocalStorage();
    console.log(index);
    kbs[index].data = data;

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
