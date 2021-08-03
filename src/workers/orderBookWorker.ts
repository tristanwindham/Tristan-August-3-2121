import { expose } from 'comlink';

interface orderBookDataObject {
    price: number,
    size: number,
    total: number,
};

let feed: WebSocket
let formattedBidData: orderBookDataObject[] = [];
let formattedAskData: orderBookDataObject[] = [];
let hashedBidData: orderBookDataObject[] = [];
let hashedAskData: orderBookDataObject[] = [];
let selectedMarket: string = "XBT";
let feedStatus: string;

const webworker = {
    // Starts websocket data feed and sends data updates to UI grid every 2 seconds if the connection is open.
    startUpFeed: () => {
        startFeed();
        setInterval(() => {
            if (feedStatus !== 'Open') return;
            postMessage({type: 'Updates', data: {bidData: formattedBidData.slice(0, 50), askData: formattedAskData.slice(0, 50)}});
        }, 2000);
    },
    // Handles messages sent from the main thread
    sendMessage: (message: string) => {
        if (message === 'Toggle Feed') {
            // Unsubscribes for the current product/market, then subscribes to the other product/market.
            const unsubscribeMessage = {
                event: "unsubscribe",
                feed: "book_ui_1",
                product_ids: [`PI_${selectedMarket}USD`],
            };
            feed.send(JSON.stringify(unsubscribeMessage));
            
            changeMarket();
            
            const subscribeMessage = {
                event: "subscribe",
                feed: "book_ui_1",
                product_ids: [`PI_${selectedMarket}USD`],
            };
            feed.send(JSON.stringify(subscribeMessage));
        }
        if (message === 'Kill Feed') {
            if (feedStatus === 'Open') {
                // Forces error and closes the feed.
                feed.close(1000, 'Forced close');
                startFeed();
                feed.close(1000, 'Forced close');
            } else {
                // If feed is closed, this will reconnect.
                console.log('Reconnecting...');
                startFeed();
            }
        }
    },
}

const startFeed = () => {
    feed = new WebSocket("wss://www.cryptofacilities.com/ws/v1");

    feed.onopen = (e) => {
        feedStatus = 'Open'
        const subscribeMessage = {
            event: "subscribe",
            feed: "book_ui_1",
            product_ids: [`PI_${selectedMarket}USD`],
        };
        feed.send(JSON.stringify(subscribeMessage));
    };
    
    feed.onmessage = async (event) => {
        const data = JSON.parse(event.data);
        if (handleFeedDataIssues(data) === false) return
        if (data.feed === 'book_ui_1_snapshot') {
            formatDataObject('first bid', data.bids);
            formatDataObject('first ask', data.asks);
            postMessage({type: 'first send', data: {bidData: formattedBidData.slice(0, 50), askData: formattedAskData.slice(0, 50)}});
        } else if (data.feed === 'book_ui_1' && !data.event) {
            if (data.bids.length) {
                formatDataObject('bid', data.bids)
            }
            if (data.asks.length) {
                formatDataObject('ask', data.asks)
            }
        }
    }
    
    feed.onerror = (error) => {
        feed.close();
        console.log('[Error]:', error);
        console.log('Feed connection closed. Waiting for user to initiate reconnect...');
    }

    feed.onclose = () => {
        feedStatus = 'Closed'
    }
}

const changeMarket = () => {
    if (selectedMarket === "XBT") {selectedMarket = "ETH"; return}
    if (selectedMarket === "ETH") {selectedMarket = "XBT"; return}
};

// Checks if message received from feed is formatted correctly before processing it and sending it to the main thread.
const handleFeedDataIssues = (data: { bids: [], asks: [] }) => {
    if (!data) return false
    if (typeof data !== 'object') return false
    if (!data.bids && !data.asks) return false
    if (typeof data.bids !== 'object') return false
    if (typeof data.asks !== 'object') return false
    return true
}

const sortArrayDesc = ( a: orderBookDataObject, b: orderBookDataObject ) => {
    if ( a.price < b.price ) return 1;
    if ( a.price > b.price ) return -1;
    return 0;
}

const sortArrayAsc = ( a: orderBookDataObject, b: orderBookDataObject ) => {
    if ( a.price < b.price ) return -1;
    if ( a.price > b.price ) return 1;
    return 0;
}

// Creates an object with each record's price as it's key. Also initializes each record's total field.
const hashData = (data: []) => {
    return data.map((delta: [price: number, size: number]) => {
        const [price, size] = delta;
        return { price, size, total: size };
    }).reduce((acc: any, curr: orderBookDataObject ) => {
        return { ...acc, [curr.price]: curr };
    }, {});
}

// Takes the data from the feed and makes the appropriate updates before sending to the main thread.
const formatDataObject = async (type: string, newData: []) => {

    // Returns the previous record's value for total.
    const getPreviousTotal = (type: string, idx: number) => {
        if (idx === -1) return 0;
        if (type === 'bid') return formattedBidData[idx].total;
        if (type === 'ask') return formattedAskData[idx].total;
        return 0;
    }

    // Set's the bid data upon the initial feed message.
    if (type === 'first bid') {
        // Creates hashed version of bid data for making updates.
        hashedBidData = hashData(newData)
        formattedBidData = Object.values(hashedBidData).sort(sortArrayDesc);
        // Calculates each record's total field.
        formattedBidData.forEach((item, idx) => {
            item.total = item.size + getPreviousTotal('bid', idx -1);
        });
    }

    // Set's the ask data upon the initial feed message.
    if (type === 'first ask') {
        // Creates hashed version of ask data for making updates.
        hashedAskData = hashData(newData)
        formattedAskData = Object.values(hashedAskData).sort(sortArrayAsc);
        // Calculates each record's total field.
        formattedAskData.forEach((item, idx) => {
            item.total = item.size + getPreviousTotal('ask', idx -1);
        });
    };
    
    // Makes updates to the bid data using the hashed version's specific keys.
    if (type === 'bid') {
        newData.forEach((item: [ price: number, size: number ]) => {
            const [ price, size ] = item;
            if (hashedBidData[price]) {
                if (size === 0) {
                    delete hashedBidData[price];
                } else {
                    hashedBidData[price].price = price;
                }
            } else {
                if (size !== 0) {
                    hashedBidData[price] = {price, size, total: size};
                }
            }
        });
        formattedBidData = Object.values(hashedBidData).sort(sortArrayDesc);
        formattedBidData.forEach((item, idx) => {
            item.total = item.size + getPreviousTotal('bid', idx -1);
        });
    }

    // Makes updates to the ask data using the hashed version's specific keys.
    if (type === 'ask') {
        newData.forEach((item: [ price: number, size: number ])  => {
            const [ price, size ] = item;
            if (hashedAskData[price]) {
                if (size === 0) {
                    delete hashedAskData[price];
                } else {
                    hashedAskData[price].price = price;
                }
            } else {
                if (size !== 0) {
                    hashedAskData[price] = {price, size, total: size};
                }
            }
        });
        formattedAskData = Object.values(hashedAskData).sort(sortArrayAsc);
        formattedAskData.forEach((item, idx) => {
            item.total = item.size + getPreviousTotal('ask', idx -1);
        });
    };
};

export type OrderBookWorker = typeof webworker;

expose(webworker);