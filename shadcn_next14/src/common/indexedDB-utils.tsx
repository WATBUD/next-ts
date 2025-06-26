export function set_indexedDB_Data(storeName = 'default',keyName='myCustomKey', data: any, callback?: () => void) {
    const openRequest = indexedDB.open("nextDatabase", 1);
    openRequest.onsuccess = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        const transaction = db.transaction([storeName], "readwrite");
        const store = transaction.objectStore(storeName);
        // let request = store.add("test", keyName);
        // request.onsuccess = function(event) {
        //     console.log("初始化DB成功！");
        // };
        const putRequest = store.put(data, keyName);


        putRequest.onsuccess = () => {
            console.log("Data stored successfully",storeName,keyName,data);
            if (callback) callback();
        };

        putRequest.onerror = () => {
            console.error("Error storing data");
        };
    };

    openRequest.onerror = () => {
        console.error("Failed to open database");
    };
}

export function get_indexedDB_data(storeName = 'default',keyName='myCustomKey') {
    return new Promise<any | undefined>((resolve, reject) => {
        const openRequest = indexedDB.open("nextDatabase", 1);
        openRequest.onupgradeneeded = (event) => {
            const db = (event.target as IDBOpenDBRequest).result;
    
            if (!db.objectStoreNames.contains(storeName)) {
                let objectStore = db.createObjectStore(storeName, { autoIncrement: true });
                let request = objectStore.add(undefined, keyName);
                request.onsuccess = function(event) {
                    console.log("初始化DB成功！");
                };
            }
        };
    
        openRequest.onsuccess = (event) => {
            const db = (event.target as IDBOpenDBRequest).result;
            const transaction = db.transaction([storeName], "readonly");
            const store = transaction.objectStore(storeName);

            const getRequest = store.get(keyName);


            getRequest.onsuccess = () => {
                console.log("getRequest.onsuccess:", getRequest.result,storeName);

                const data = getRequest.result ? getRequest.result : undefined;
                resolve(data);
            };

            getRequest.onerror = () => {
                console.error("Error retrieving data");
                reject(new Error("Failed to retrieve data"));
            };
        };

        openRequest.onerror = () => {
            console.error("Failed to open database");
            reject(new Error("Failed to open database"));
        };
    });
}
