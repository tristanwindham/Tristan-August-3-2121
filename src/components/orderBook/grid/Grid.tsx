import { FunctionComponent } from "react";
import { selectBidArray, selectAskArray } from './../../../store/reducers/orderBook/orderBookReducer';
import { useAppSelector } from '../../../app/hooks';
import numeral from 'numeral'

interface dataArray {
    price: number,
    size: number,
    total: number,
}

const Grid: FunctionComponent = () => {
    const bidArray: dataArray[] = useAppSelector(selectBidArray);
    const askArray: dataArray[] = useAppSelector(selectAskArray);

    return (
        <div id="grid">
            <div className='grid-half'>
                <div className="grid-row header">
                    <div className="grid-size buy-headerl">TOTAL</div>
                    <div className="grid-size buy-header">SIZE</div>
                    <div className="grid-price buy-header">PRICE</div>
                </div>
                {
                    bidArray.map((item: any, idx: number) => {
                        const depthIdx = bidArray.length < 25 ? bidArray.length - 1 : 24
                        const depth = (item.total / bidArray[depthIdx].total) * 100;
                        return <div className="grid-row" key={idx}>
                            <div className="grid-depth buy" style={{ width: `${Math.round(depth)}%` }}></div>
                            <div className="grid-size">{numeral(item.total).format('0,0')}</div>
                            <div className="grid-size">{numeral(item.size).format('0,0')}</div>
                            <div className="grid-price buy">{numeral(item.price).format('0,0.00')}</div>
                        </div>
                    }).slice(0, 25)
                }
            </div>
            <div className='grid-half'>
                <div className="grid-row header">
                    <div className="grid-price sell-header">PRICE</div>
                    <div className="grid-size sell-header">SIZE</div>
                    <div className="grid-size sell-header">TOTAL</div>
                </div>
                {
                    askArray.map((item: any, idx: number) => {
                        const depthIdx = askArray.length < 25 ? askArray.length - 1 : 24
                        const depth = (item.total / askArray[depthIdx].total) * 100;
                        return <div className="grid-row" key={idx}>
                            <div className="grid-depth sell" style={{ width: `${Math.round(depth)}%` }}></div>
                            <div className="grid-price sell">{numeral(item.price).format('0,0.00')}</div>
                            <div className="grid-size sell">{numeral(item.size).format('0,0')}</div>
                            <div className="grid-size sell">{numeral(item.total).format('0,0')}</div>
                        </div>
                    }).slice(0, 25)
                }
            </div>
        </div>
    );
};

export default Grid;