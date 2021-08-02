import { selectBidData, selectAskData, selectSpread } from './../../../store/reducers/orderBook/orderBookReducer';
import { useAppSelector } from '../../../app/hooks';
import { useMediaQuery } from 'react-responsive';
import numeral from 'numeral'
import { Fragment } from 'react';

interface dataObject {
    price: number,
    size: number,
    total: number,
}

const Grid: React.FC = () => {
    let bidData: dataObject[] = useAppSelector(selectBidData);
    let askData: dataObject[] = useAppSelector(selectAskData);
    const spread: string = useAppSelector(selectSpread);
    const isMobile: boolean = useMediaQuery({ query: `(max-width: 900px)` });
    const dataLength: number = isMobile ? 12 : 25;
    
    // Formats ask data in reverse order for mobile display.
    let sortedAskData = [...askData.slice(0, isMobile ? 12 : 25)];
    if (isMobile) {
        sortedAskData = sortedAskData.reverse();
    }

    return (
        <div id="grid">
            <div className='grid-half'>
                    { isMobile ? 
                        null
                        :
                        <div className="grid-row header">
                            <div className="grid-size buy-header">TOTAL</div>
                            <div className="grid-size buy-header">SIZE</div>
                            <div className="grid-price buy-header">PRICE</div>
                        </div>
                    }
                {
                    bidData.map((item: dataObject, idx: number) => {
                        const depthIdx = bidData.length < dataLength ? bidData.length - 1 : dataLength - 1;
                        const depth = (item.total / bidData[depthIdx].total) * 100;
                        return <div className="grid-row" key={idx}>
                            <div className={`grid-depth buy ${isMobile ? 'mobile' : ''}`} style={{ width: `${Math.round(depth)}%` }}></div>

                            {/* Swaps the column layout if mobile screen size detected. */}
                            { isMobile ? 
                                <Fragment>
                                    <div className="grid-price buy mobile">{numeral(item.price).format('0,0.00')}</div>
                                    <div className="grid-size buy">{numeral(item.size).format('0,0')}</div>
                                    <div className="grid-size mobile">{numeral(item.total).format('0,0')}</div>
                                </Fragment>
                                : 
                                <Fragment>
                                    <div className="grid-size">{numeral(item.total).format('0,0')}</div>
                                    <div className="grid-size">{numeral(item.size).format('0,0')}</div>
                                    <div className="grid-price buy">{numeral(item.price).format('0,0.00')}</div>
                                </Fragment>
                            }

                        </div>
                    }).slice(0, dataLength)
                }
            </div>
            { isMobile ? <div id="grid-spread">{spread}</div> : null }
            <div className='grid-half'>
                <div className="grid-row header">
                    <div className={`grid-price sell-header ${isMobile ? 'mobile' : ''}`}>PRICE</div>
                    <div className="grid-size sell-header">SIZE</div>
                    <div className={`grid-size sell-header ${isMobile ? 'mobile' : ''}`}>TOTAL</div>
                </div>
                {
                    sortedAskData.map((item: dataObject, idx: number) => {
                        let depthIdx = sortedAskData.length < dataLength ? sortedAskData.length - 1 : dataLength - 1;
                        if (isMobile) depthIdx = 0
                        const depth = (item.total / sortedAskData[depthIdx].total) * 100;
                        return <div className="grid-row" key={idx}>
                            <div className="grid-depth sell" style={{ width: `${Math.round(depth)}%` }}></div>
                            <div className={`grid-price sell ${isMobile ? 'mobile' : ''}`}>{numeral(item.price).format('0,0.00')}</div>
                            <div className="grid-size sell">{numeral(item.size).format('0,0')}</div>
                            <div className={`grid-size ${isMobile ? 'mobile' : ''}`}>{numeral(item.total).format('0,0')}</div>
                        </div>
                    }).slice(0, dataLength)
                }
            </div>
        </div>
    );
};

export default Grid;