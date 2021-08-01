import GridHeader from './gridHeader/GridHeader';
import Grid from './grid/Grid';
import DataFeedButtons from './dataFeedButtons/DataFeedButtons';
import { changeAskArray, changeBidArray } from '../../store/reducers/orderBook/orderBookReducer';
import { useAppDispatch } from '../../app/hooks';
import './order-book.scss';

const worker = new Worker('orderBookFeed.js', {type: 'module'});

const OrderBook: React.FC = () => {
    const dispatch = useAppDispatch();

    worker.onmessage = (e) => {
        dispatch(changeBidArray(e.data.data.bidArray));
        dispatch(changeAskArray(e.data.data.askArray));
    }

    const toggleFeed = () => {
        worker.postMessage({ msg: 'Toggle' })
    }
    const killFeed = () => {
        worker.postMessage({ msg: 'Kill Feed' })
    }

    return (
        <div id="order-book">
            <GridHeader />
            <Grid />
            <DataFeedButtons  toggleFeed={() => toggleFeed()} killFeed={() => killFeed()}/>
        </div>
    )
}

export default OrderBook