export class HistoryItem {
    title = ""
    url = ""
    kbId = ""
    model = ""
    data = []   // array of HistoryElem
    currentIndex = 0

    constructor(title, url, kbId, model, scriptText) {
        this.title = title;
        this.url = url;
        this.kbId = kbId;
        this.model = model;
        this.data.push(new HistoryElem(Date.now(), scriptText));
        // console.log("HistoryItem constructor", this.data);
    }

    addData(scriptText) {
        this.data.push(new HistoryElem(Date.now(), scriptText));
        this.currentIndex = this.data.length - 1;
    }

    getLatestData() {
        return this.data[this.data.length - 1];
    }

    getCurrentData() {
        return this.data[this.currentIndex];
    }

    getTimeGenerated() {
        return this.data[0].timestamp;        
    }

    goToPreviousData() {
        if (this.currentIndex > 0) {
            this.currentIndex--;
        }
    }

    goToNextData() {
        if (this.currentIndex < this.data.length - 1) {
            this.currentIndex++;
        }
    }

    resetCurrentIndex() {
        this.currentIndex = this.data.length - 1;
    }
}

export class HistoryElem {
    constructor(timestamp, data) {
        this.timestamp = timestamp;
        this.data = data;
    }
}

export class HistoryManager{
    /**
     * Returns a list of HistoryItem objects
     * 
     * @param {*} json 
     */
    fromJSON(json) {
        if (!json) {
            return [];
        }

        let obj = JSON.parse(json);
        let history = [];

        for (let i = 0; i < obj.length; i++) {
            let item = obj[i];
            let historyItem = new HistoryItem(item.title, item.url, item.kbId, item.model, item.data[0].data);

            for (let j = 1; j < item.data.length; j++) {
                historyItem.addData(item.data[j].data);
            }

            history.push(historyItem);
        }

        return history;
    }

    /**
     * Returns a JSON string of the list of HistoryItem objects
     * 
     * @param {*} history 
     */
    toJSON(history) {
        let obj = [];

        for (let i = 0; i < history.length; i++) {
            let item = history[i];
            let data = [];

            for (let j = 0; j < item.data.length; j++) {
                data.push(new HistoryElem(item.data[j].timestamp, item.data[j].data));  //TODO: This is so stupid, fix this
            }

            obj.push({
                title: item.title,
                url: item.url,
                kbId: item.kbId,
                model: item.model,
                data: data
            });
        }

        return JSON.stringify(obj);
    }
}