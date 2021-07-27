import { Dispatch } from '@reduxjs/toolkit';
import {
    CHANGE_SELECTED_MARKET,
} from './../constants/actionTypes';

export const changeSelectedMarket = () => (dispatch: Dispatch ) => {
    // const { orderBook: selectedMarket } = getState();
    console.log('selectedMarket', 'HERE')
    dispatch({
        type: CHANGE_SELECTED_MARKET,
        payload: {
            selectedMarket: 'Changed',
        }
    });
};

// export const changeSelectedMarket = () => (dispatch: , getState: any) => {
//     const { orderBook: selectedMarket } = getState();
//     console.log('selectedMarket', selectedMarket)
// };