import _ from 'lodash';

const websocketTest = () => describe('Tests websocket connection.', () => {
    
    it('Test subscription and first subscribe event.', (done) => {
        let feed = new WebSocket("wss://www.cryptofacilities.com/ws/v1");
        let messageSendCount = 0
        feed.onopen = () => {
            const subscribeMessage = {
                event: "subscribe",
                feed: "book_ui_1",
                product_ids: [`PI_XBTUSD`],
            };
            feed.send(JSON.stringify(subscribeMessage));
        };

        feed.onmessage = async (event) => {
            messageSendCount += 1;
            if(messageSendCount <= 1) return;
            
            if(messageSendCount === 2) {
                const data = JSON.parse(event.data);
                const expected = { event: 'subscribed' }
                expect(_.isObject(data)).toBe(true);
                expect(data).toMatchObject(expected);
            };

            if(messageSendCount === 3) {
                const data = JSON.parse(event.data);
                console.log(data)
                expect(data).toHaveProperty('asks' && 'bids');
            };

            if (messageSendCount = 4) feed.close();
        };

        feed.onclose = () => {
            done();
        };
    });
});

export default websocketTest();