import React from "react";
import { GroupDropDown } from "./GroupDropDown";
import { selectMarket, selectSpread} from './../../../store/reducers/orderBook/orderBookReducer';
import { useMediaQuery } from 'react-responsive';
import { useAppSelector } from '../../../app/hooks';

const GridHeader: React.FC = () => {
    const selectedMarket: string = useAppSelector(selectMarket);
    const spread: string = useAppSelector(selectSpread);
    const isDesktop: boolean = useMediaQuery({ query: `(min-width: 900px)` });

    return (
        <div className="grid-header">
            <div className="grid-header-title">{selectedMarket}</div>
            { isDesktop ? <div className="grid-header-spread">{spread}</div> : null }
            <GroupDropDown />
        </div>
    );
};

export default GridHeader;