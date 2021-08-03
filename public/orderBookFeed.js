let feed

let bidArray = [];
let returnBidArray = [];
let askArray = [];
let returnAskArray = [];
let selectedMarket = "XBT";

const startFeed = () => {
    feed = new WebSocket("wss://www.cryptofacilities.com/ws/v1");

    feed.onopen = (e) => {
        const subscribeMessage = {
            event: "subscribe",
            feed: "book_ui_1",
            product_ids: [`PI_${selectedMarket}USD`],
        };
        
        feed.send(JSON.stringify(subscribeMessage));
    
        console.log('connected');
    };
    
    feed.onmessage = async (event) => {
        const data = JSON.parse(event.data);
        if (handleFeedDataIssues(data) === false) return
        if (data.feed === 'book_ui_1_snapshot') {
            hashArray('first bid', data.bids);
            hashArray('first ask', data.asks);
            postMessage({type: 'first send', data: {bidArray: returnBidArray.slice(0, 50), askArray: returnAskArray.slice(0, 50)}});
        } else if (data.feed === 'book_ui_1' && !data.event) {
            
            if (data.bids.length) {
                hashArray('bid', data.bids)
            }
            if (data.asks.length) {
                hashArray('ask', data.asks)
            }
            
        }
    }
    
    feed.onerror = (error) => {
        feed.close();
        console.log('[Error]:', error);
        console.log('Feed connection closed. Waiting for user to initiate reconnect...');
    }

    feed.onclose = () => {
        feed = null;
    }
}

startFeed()

const handleFeedDataIssues = (data) => {
    if (!data) return false
    if (typeof data !== 'object') return false
    if (!data.bids && !data.asks) return false
    if (typeof data.bids !== 'object') return false
    if (typeof data.asks !== 'object') return false
    return true
}

const getPreviousSize = (dataSource, idx) => {
    if (idx === - 1) return 0
    return dataSource[idx][1];
};

const sortArrayDesc = ( a, b ) => {
    if ( a.price < b.price ) return 1;
    if ( a.price > b.price ) return -1;
    return 0;
}

const sortArrayAsc = ( a, b ) => {
    if ( a.price < b.price ) return -1;
    if ( a.price > b.price ) return 1;
    return 0;
}

const hashArray = async (type, newData) => {

    const getPreviousTotal = (type, idx) => {
        if (idx === -1) return 0;
        if (type === 'bid') return returnBidArray[idx].total;
        if (type === 'ask') return returnAskArray[idx].total;
    }

    const hashed = await newData.map((delta, idx) => {
        const [price, size] = delta;
        return { price, size, total: size }
        }).reduce((acc, curr) => {
            return { ...acc, [curr.price]: curr }
    }, {})
      
    if (type === 'bid') {
        await newData.forEach(item => {
            const [ price, size ] = item
            if (bidArray[price]) {
                if (size === 0) {
                    delete bidArray[price]
                } else {
                    bidArray[price].price = price
                }
            } else {
                if (size !== 0) {
                    bidArray[price] = {price, size, total: size}
                }
            }
        })
        returnBidArray = Object.values(bidArray).sort(sortArrayDesc)

        returnBidArray.forEach((item, idx) => {
            item.total = item.size + getPreviousTotal('bid', idx -1);
        });
    }

    if (type === 'first bid') {
        bidArray = hashed
        returnBidArray = Object.values(bidArray).sort(sortArrayDesc)
        returnBidArray.forEach((item, idx) => {
            item.total = item.size + getPreviousTotal('bid', idx -1);
        });
    }

    if (type === 'first ask') {
        askArray = hashed
        returnAskArray = Object.values(askArray).sort(sortArrayAsc)
        returnAskArray.forEach((item, idx) => {
            item.total = item.size + getPreviousTotal('ask', idx -1);
        });
    };

    if (type === 'ask') {
        await newData.forEach(item => {
            const [ price, size ] = item;
            if (askArray[price]) {
                if (size === 0) {
                    delete askArray[price];
                } else {
                    askArray[price].price = price;
                }
            } else {
                if (size !== 0) {
                    askArray[price] = {price, size};
                }
            }
        });
        returnAskArray = Object.values(askArray).sort(sortArrayAsc)
        returnAskArray.forEach((item, idx) => {
            item.total = item.size + getPreviousTotal('ask', idx -1);
        });
    };
};

setInterval(() => {
    if (!feed) return
    postMessage({type: 'Updates', data: {bidArray: returnBidArray.slice(0, 50), askArray: returnAskArray.slice(0, 50)}});
}, 1000);

const changeMarket = () => {
    if (selectedMarket === "XBT") {selectedMarket = "ETH"; return}
    if (selectedMarket === "ETH") {selectedMarket = "XBT"; return}
};


self.addEventListener('message', (ev)=>{
    if (ev.data.msg === 'Toggle') {
        const unsubscribeMessage = {
            event: "unsubscribe",
            feed: "book_ui_1",
            product_ids: [`PI_${selectedMarket}USD`],
        };
        feed.send(JSON.stringify(unsubscribeMessage));

        changeMarket()
        
        const subscribeMessage = {
            event: "subscribe",
            feed: "book_ui_1",
            product_ids: [`PI_${selectedMarket}USD`],
        };
        feed.send(JSON.stringify(subscribeMessage));
    }

    if (ev.data.msg === 'Kill Feed') {
        
        if (feed) {
            feed.close(1000, 'Forced close');
            startFeed();
             feed.close(1000, 'Forced close');

        } else {
            console.log('Reconnecting...')
            startFeed();
        }
    }
})