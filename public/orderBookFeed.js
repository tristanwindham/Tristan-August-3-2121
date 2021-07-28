const feed = new WebSocket("wss://www.cryptofacilities.com/ws/v1");
let buyArray = [];
let sellArray = [];
let workingBuyArray = [];
let workingSellArray = [];


feed.onopen = (e) => {
    const subscribeMessage = {
        event: "subscribe",
        feed: "book_ui_1",
        product_ids: ["PI_XBTUSD"],
    };
    
    feed.send(JSON.stringify(subscribeMessage));

    console.log('connected');
};

feed.onmessage = async (event) => {
    const data = JSON.parse(event.data);
    if (data.feed === 'book_ui_1_snapshot') {
        hashArray('first buy', data.asks);
        hashArray('first sell', data.bids);
        postMessage({type: 'first send', data: {buyArray, sellArray}});
    } else if (data.feed === 'book_ui_1' && !data.event) {
        
        if (data.bids.length) {
            hashArray('sell', data.bids)
        }
        if (data.asks.length) {
            hashArray('buy', data.asks)
        }
        
    }
}

const hashArray = (type, newData) => {

    const hashed = newData.map((delta) => {
        const [price, size] = delta;
        return { price, size }
        }).reduce((acc, curr) => {
            return { ...acc, [curr.price]: curr }
    }, {})
      
    if (type === 'buy') {
        newData.forEach(item => {
            const [ price, size ] = item
            if (buyArray[price]) {
                if (size === 0) {
                    delete buyArray[price]
                } else {
                    buyArray[price].price = price
                }
            } else {
                if (size !== 0) {
                    buyArray[price] = {price, size}
                }
            }
        })
        return buyArray
    }

    if (type === 'first buy') {
        workingBuyArray = hashed
        buyArray = hashed
        return buyArray
    }

    if (type === 'first sell') {
        workingSellArray = hashed
        sellArray = hashed
        return sellArray
    }

    if (type === 'sell') {
        newData.forEach(item => {
            const [ price, size ] = item
            if (sellArray[price]) {
                if (size === 0) {
                    delete sellArray[price]
                } else {
                    sellArray[price].price = price
                }
            } else {
                if (size !== 0) {
                    sellArray[price] = {price, size}
                }
            }
        })
        return sellArray
    }
}

console.log('Running')

setInterval(() => {
    postMessage({type: 'Updates', data: {buyArray, sellArray}});
}, 2000)




self.addEventListener('message', (ev)=>{
        // if (ev.data.msg === 'start interval') {
        //     console.log('recieved')
        //         postMessage({type: 'first send', data: {buyArray, sellArray}});
        // }
    

    //   const killFeed = async () => {
    //     const unsubscribeMessage = {
    //         event: "unsubscribe",
    //         feed: "book_ui_1",
    //         product_ids: ["PI_XBTUSD"],
    //     };
    //     console.log('unsubscribed', feed.readyState);
    //     feed.readyState = () => {
    //         feed.send(JSON.stringify(unsubscribeMessage));
    //     }
    //   }

        
            

            
                


            
            

            const updateMainData = () => {
                // console.log('Running this', buyArray)
                // if (buyArray.length) {
                    // setInterval(() => {
                    //     postMessage({type: 'later send', data: buyArray});
                    //     }, 5000)
                // }
            }
    
            

            
            updateMainData()
        
            if (ev.data.msg === 'Stop') {
                const unsubscribeMessage = {
                    event: "unsubscribe",
                    feed: "book_ui_1",
                    product_ids: ["PI_XBTUSD"],
                };
                console.log('unsubscribed', feed.readyState);
                feed.send(JSON.stringify(unsubscribeMessage));
            }
            if (ev.data.msg === 'Toggle') {
                // const 


                const unsubscribeMessage = {
                    event: "unsubscribe",
                    feed: "book_ui_1",
                    product_ids: [`PI_${ev.data.selectedMarket}USD`],
                };
                feed.send(JSON.stringify(unsubscribeMessage));
                console.log(`Unsubbed from ${ev.data.selectedMarket}`);

                const subscribeMessage = {
                    event: "subscribe",
                    feed: "book_ui_1",
                    product_ids: [`PI_${ev.data.selectedMarket}USD`],
                };
                
                feed.send(JSON.stringify(subscribeMessage));
                console.log(`Subbed to ${ev.data.selectedMarket}`);

            }
        
})