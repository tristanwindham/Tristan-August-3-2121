import { FunctionComponent } from 'react';
import { useAppDispatch } from '../../../app/hooks';
import { changeSelectedMarket } from "./../../../store/reducers/orderBook/orderBookReducer";

const DataFeedButtons: FunctionComponent = () => {
    const dispatch = useAppDispatch();
    
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