import { FunctionComponent } from 'react';
import { useAppDispatch } from '../../../app/hooks';
import { changeSelectedMarket, changeBuyArray, changeSellArray } from "./../../../store/reducers/orderBook/orderBookReducer";
import { orderBy } from 'lodash'

const worker = new Worker('orderBookFeed.js');

const DataFeedButtons: FunctionComponent = () => {
    const dispatch = useAppDispatch();

    worker.onmessage = (e) => {
        dispatch(changeBuyArray(Object.values(orderBy(e.data.data.buyArray, ['price'], ['asc'])).slice(0,25)));
        dispatch(changeSellArray(Object.values(orderBy(e.data.data.sellArray, ['price'], ['desc'])).slice(0,25)));
    }
    
    return (
        <div id="dfb-container">
             <button className="dfb-button" onClick={() => {
                dispatch(changeSelectedMarket())
            }}>Toggle Feed</button>
            <button className="dfb-button kill">Kill Feed</button>
        </div>
    );
};

export default DataFeedButtons;