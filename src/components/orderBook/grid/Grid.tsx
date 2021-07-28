import { FunctionComponent } from "react";
import { selectBuyArray, selectSellArray, } from './../../../store/reducers/orderBook/orderBookReducer';
import { useAppSelector } from '../../../app/hooks';


const Grid: FunctionComponent = () => {
    const buyArray: any = useAppSelector(selectBuyArray);
    const sellArray: any = useAppSelector(selectSellArray);

    return (
        <div>
            <div id="grid">
                <div className='grid-half'>
                    {
                        buyArray.map((item: any, idx: number) => {
                            return <div style={{ display: 'flex', }} key={idx}>
                                <div className="grid-size">{item.size}</div>
                                <div className="grid-price buy">{item.price}</div>
                            </div>
                        })
                    }
                </div>
                <div className='grid-half'>
                    {
                        sellArray.map((item: any, idx: number) => {
                            return <div style={{ display: 'flex',  }} key={idx}>
                                <div className="grid-price sell">{item.price}</div>
                                <div className="grid-size">{item.size}</div>
                            </div>
                        })
                    }
                </div>
            </div>
        </div>
    );
};

export default Grid;