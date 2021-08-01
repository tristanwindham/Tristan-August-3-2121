import React from "react";
import { GroupDropDown } from "./GroupDropDown";
import { selectMarket, selectSpread} from './../../../store/reducers/orderBook/orderBookReducer';
import { useAppSelector } from '../../../app/hooks';

const GridHeader: React.FC = () => {
    const selectedMarket: string = useAppSelector(selectMarket);
    const spread: string = useAppSelector(selectSpread);

    return (
        <div id="grid-header">
            <div id="grid-header-title">{selectedMarket}</div>
            <div id="grid-header-spread">{spread}</div>
            <GroupDropDown />
        </div>
    )
}

export default GridHeader