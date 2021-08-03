import { createSlice, PayloadAction, current } from '@reduxjs/toolkit';
import { RootState } from '../../store'
import { orderBy } from 'lodash'

interface OrderBookState {
    testValue: number,
    grouping: number[],
    selectedMarket: string,
    selectedGroup: number,
    bidData: { price: number, size: number, total: number }[],
    askData: { price: number, size: number, total: number }[],
    spread: string,
}

const initialState: OrderBookState = {
    testValue: 1,
    grouping: [0.5, 1, 2.5],
    selectedMarket: 'XBT',
    selectedGroup: .5,
    bidData: [],
    askData: [],
    spread: 'Spread:',
}

interface DataObject {
    price: number, 
    size: number, 
    total: number,
}

const calculateSpread = (state: OrderBookState) => {
    if (!current(state).bidData[0]) return
    if (!current(state).askData[0]) return

    const highestAsk = current(state).askData[0].price;
    const lowestBid = current(state).bidData[0].price;
    const spreadValue = highestAsk - lowestBid;

    state.spread = `Spread: ${Math.abs(spreadValue).toFixed(1)} (${Math.abs(((spreadValue / highestAsk) * 100)).toFixed(2)}%)` 
}

const summarizeRows = (state: OrderBookState, dataSource: DataObject[]) => {
    const groupTickSize = current(state).selectedGroup;

    return dataSource.reduce((acc: { [key: number]: DataObject }, curr) => {
        const roundedPrice = groupTickSize * Math.floor(curr.price / groupTickSize);
        if(acc[roundedPrice]) {
            acc[roundedPrice] = {
                price: acc[roundedPrice].price,
                size: acc[roundedPrice].size + curr.size,
                total: acc[roundedPrice].total + curr.size,
            }
            return {...acc};
        } else {
            return {[roundedPrice]: {price: roundedPrice, size: curr.size, total: curr.total}, ...acc};
        }
    }, {});
    
}

export const orderBookSlice = createSlice({
    name: 'orderBook',
    initialState,
    reducers: {
        // Toggles between the XBT/ETH markets and sets the appropriate grouping values
        changeSelectedMarket: (state) => {
            if (state.selectedMarket === 'XBT' ){
                state.selectedMarket = 'ETH';
                state.selectedGroup = state.selectedGroup / 10;
                state.grouping = [0.05, .1, .25];
            } else {
                state.selectedMarket = 'XBT';
                state.selectedGroup = state.selectedGroup * 10;
                state.grouping = [0.5, 1, 2.5];
            }
        },
        changeSelectedGroup: (state, action: PayloadAction<number>) => {
            state.selectedGroup = action.payload;
            state.askData = orderBy(Object.values(summarizeRows(state, state.askData)), 'price', 'asc');
            state.bidData = orderBy(Object.values(summarizeRows(state, state.bidData)), 'price', 'desc');
        },
        changeBidData: (state, action: PayloadAction<DataObject[]>) => {
            state.bidData = action.payload;
            state.bidData = orderBy(Object.values(summarizeRows(state, state.bidData)), 'price', 'desc');
        },
        changeAskData: (state, action: PayloadAction<DataObject[]>) => {
            state.askData = action.payload;
            state.askData = orderBy(Object.values(summarizeRows(state, state.askData)), 'price', 'asc');
            calculateSpread(state);
        },
    },
  });

  export const selectMarket = (state: RootState) => state.orderBook.selectedMarket;
  export const selectGrouping = (state: RootState) => state.orderBook.grouping;
  export const selectGroup = (state: RootState) => state.orderBook.selectedGroup;
  export const selectBidData = (state: RootState) => state.orderBook.bidData;
  export const selectAskData = (state: RootState) => state.orderBook.askData;
  export const selectSpread = (state: RootState) => state.orderBook.spread;

  export const { changeSelectedMarket, changeSelectedGroup, changeBidData, changeAskData } = orderBookSlice.actions;

  export default orderBookSlice.reducer;