

self.addEventListener('message', (ev)=>{
    
    const feed = new WebSocket("wss://www.cryptofacilities.com/ws/v1");

    let localSocket = feed
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

        
            localSocket.onopen = (e) => {
                localSocket = e.target
                if (ev.data.msg === 'Start') {
                    const subscribeMessage = {
                        event: "subscribe",
                        feed: "book_ui_1",
                        product_ids: ["PI_XBTUSD"],
                    };
                    
                    localSocket.send(JSON.stringify(subscribeMessage));
    
                    // setTimeout(() => {
                    //     feed.send(JSON.stringify(unsubscribeMessage));
                    // }, 2000)
                    console.log('connected')
                }
            };

            
                


            let buyArray = [];
            let sellArray = [];

            const editArray = (type, newData) => {
                // console.log(type, newData)

                const hashed = newData.map((delta) => {
                    const [price, size] = delta;
                    // const total = getPrevDeltaSize(...) + size;
                    return { price, size }
                  }).reduce((acc, curr) => {
                    return { ...acc, [curr.price]: curr }
                  }, {})
                  
                //   console.log('hash', hashed)

                //   buyArray = hashed


            }

            const updateMainData = () => {
                // console.log('Running this', buyArray)
                // if (buyArray.length) {
                    // setInterval(() => {
                    //     postMessage({type: 'later send', data: buyArray});
                    //     }, 5000)
                // }
            }
    
            

            localSocket.onmessage = (event) => {
                const data = JSON.parse(event.data);
                // postMessage(JSON.parse(event.data));
                // console.log('test', data)
                console.log('here', data)
                if (data.feed === 'book_ui_1_snapshot') {
                    buyArray = data.asks.map((item) => {
                        return {
                            price: item[0],
                            size: item[1],
                        }
                    });
                    sellArray = data.bids.map((item) => {
                        return {
                            price: item[0],
                            size: item[1],
                        }
                    });
                    
                    postMessage({type: 'first send', data: buyArray});
                } else if (data.feed === 'book_ui_1' && !data.event) {
                    
                    if (data.bids.length) {
                        // editArray('buy', data.bids.map((item) => {
                        //     return {
                        //         price: item[0],
                        //         size: item[1],
                        //     }
                        // }))
                        editArray('sell', data.bids)
                    }
                    // if (data.asks.length) {
                    //     editArray('sell', data.asks.map((item) => {
                    //         return {
                    //             price: item[0],
                    //             size: item[1],
                    //         }
                    //     }))
                    // }
                }
                // postMessage({buyArray, sellArray});
            }
            updateMainData()
        
            if (ev.data.msg === 'Stop') {
                const unsubscribeMessage = {
                    event: "unsubscribe",
                    feed: "book_ui_1",
                    product_ids: ["PI_XBTUSD"],
                };
                console.log('unsubscribed', feed.readyState);
                localSocket.send(JSON.stringify(unsubscribeMessage));
            }
        
})