import { useAppDispatch } from '../../../app/hooks';
import { changeSelectedMarket } from "./../../../store/reducers/orderBook/orderBookReducer";

interface DataFeedButtonsProps {
    toggleFeed: () => void,
    killFeed: () => void,
}

const DataFeedButtons: React.FC<DataFeedButtonsProps> = ({ toggleFeed, killFeed }) => {
    const dispatch = useAppDispatch();
    
    return (
        <div className="dfb-container">
             <button className="dfb-button" onClick={() => {
                dispatch(changeSelectedMarket())
                toggleFeed()
            }}>Toggle Feed</button>
            <button className="dfb-button kill" onClick={() => killFeed()}>Kill Feed</button>
        </div>
    );
};

export default DataFeedButtons;