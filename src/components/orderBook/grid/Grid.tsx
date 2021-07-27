import { FunctionComponent, useState } from "react";

// import orderBook from './../../../workers''

let worker: Worker

    worker = new Worker('orderBookFeed.js');

const Grid: FunctionComponent = () => {
    const [ buyArray, setBuyArray ] = useState<Array<{price: number, size: number}>>([]);
    const [ sellArray, setSellArray ] = useState<Array<{}>>([]);
    
    const feed = new WebSocket("wss://www.cryptofacilities.com/ws/v1");
    // feed.onopen = () => {
    //         const subscribeMessage = {
    //             event: "subscribe",
    //             feed: "book_ui_1",
    //             product_ids: ["PI_XBTUSD"],
    //         };
            
    //         feed.send(JSON.stringify(subscribeMessage));

    //         // setTimeout(() => {
    //         //     feed.send(JSON.stringify(unsubscribeMessage));
    //         // }, 2000)
    //         console.log('connected')
    // };

    // feed.onmessage = (event) => {
    //         const data = JSON.parse(event.data);
    //         // postMessage(JSON.parse(event.data));
    //         // console.log('test', data)
    //         console.log('here', data)
                
    //     if (!buyArray.length) {
            
    //     }
    // }
    // worker.postMessage({msg: 'Start'});

    worker.onmessage = (e) => {
        // console.log('e', e.data)
        setBuyArray(e.data.data)
        // if (e.data.buyArray !== buyArray && buyArray.length === 0) {
        //     // setBuyArray([...e.data.buyArray])
        //     console.log('New Buy Array', [...e.data.buyArray])
        // }
        // if (e.data.sellArray !== sellArray && buyArray.length === 0) {
        //     // setSellArray([...e.data.sellArray])
        //     console.log('New Sell Array', sellArray, e.data.sellArray)
        // }
        
    }
    

    return (
        <div>
            <div style={{ background: 'blue', height: 50, width: 50 }} onClick={() => worker.postMessage({msg: 'Start'})}>Start</div>
            <div style={{ background: 'red', height: 50, width: 50 }} onClick={() => worker.postMessage({msg: 'Stop'})}>Stop</div>

            {
                buyArray.map((item, idx) => {
                    return <div style={{ display: 'flex' }} key={idx}>
                        <div style={{ marginRight: 50 }}>{item.price}</div>
                        <div>{item.size}</div>
                    </div>
                })
            }
        </div>
    );
};

export default Grid;