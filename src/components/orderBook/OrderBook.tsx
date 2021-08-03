import GridHeader from './gridHeader/GridHeader';
import Grid from './grid/Grid';
import DataFeedButtons from './dataFeedButtons/DataFeedButtons';
import { changeAskData, changeBidData } from '../../store/reducers/orderBook/orderBookReducer';
import { useAppDispatch } from '../../app/hooks';
import {Worker as JestWorker} from 'jest-worker';
import { wrap } from 'comlink';
import './order-book.scss';

// Fire up the web worker when the component loads in.
const worker = new Worker('../../workers/orderBookWorker', {name: 'runTestWorker', type: 'module'});
const { startUpFeed, sendMessage } = wrap<import('../../workers/orderBookWorker').OrderBookWorker>(worker);
startUpFeed();

const OrderBook: React.FC = () => {
    const dispatch = useAppDispatch();

    worker.onmessage = (e) => {
        if (!e.data.data) return
        dispatch(changeBidData(e.data.data.bidData));
        dispatch(changeAskData(e.data.data.askData));
    };

    const toggleFeed = () => {
        sendMessage('Toggle Feed')
    };

    const killFeed = () => {
        sendMessage('Kill Feed')
    };

    return (
        <section id="order-book">
            <GridHeader />
            <Grid />
            <DataFeedButtons  toggleFeed={() => toggleFeed()} killFeed={() => killFeed()}/>
        </section>
    );
};

export default OrderBook;