// createAsyncThunk, 
import { createSlice, PayloadAction, current } from '@reduxjs/toolkit';
// AppThunk
import { RootState } from '../../store'
import { orderBy } from 'lodash'

interface OrderBookState {
    testValue: number,
    grouping: number[],
    selectedMarket: string,
    selectedGroup: number,
    bidArray: { price: number, size: number, total: number }[],
    askArray: { price: number, size: number, total: number }[],
    spread: string,
}

const initialState: OrderBookState = {
    testValue: 1,
    grouping: [0.5, 1, 2.5],
    selectedMarket: 'XBT',
    selectedGroup: .5,
    bidArray: [],
    askArray: [],
    spread: 'Spread:',
}

const calculateSpread = (state: OrderBookState) => {
    if (!current(state).bidArray[0]) return
    if (!current(state).askArray[0]) return

    const highestAsk = current(state).askArray[0].price;
    const lowestBid = current(state).bidArray[0].price;
    const spreadValue = highestAsk - lowestBid;

    state.spread = `Spread: ${Math.abs(spreadValue).toFixed(1)} (${Math.abs(((spreadValue / highestAsk) * 100)).toFixed(2)}%)` 
}

const summarizeRows = (state: OrderBookState, dataSource: { price: number, size: number, total: number }[]) => {
    const groupTickSize = current(state).selectedGroup;
    return dataSource.reduce((acc: any, curr) => {
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
            state.askArray = orderBy(Object.values(summarizeRows(state, state.askArray)), 'price', 'asc');
            state.bidArray = orderBy(Object.values(summarizeRows(state, state.bidArray)), 'price', 'desc');
        },
        changeBidArray: (state, action: PayloadAction<{ price: number, size: number, total: number }[]>) => {
            // Sets the value of the buy array while also calculating and
            // setting the totals values for each record
            state.bidArray = action.payload;
            state.bidArray = orderBy(Object.values(summarizeRows(state, state.bidArray)), 'price', 'desc');
        },
        changeAskArray: (state, action: PayloadAction<{ price: number, size: number,  total: number }[]>) => {
            // Sets the value of the sell array while also calculating and
            // setting the totals values for each record
            state.askArray = action.payload;
            state.askArray = orderBy(Object.values(summarizeRows(state, state.askArray)), 'price', 'asc');

            calculateSpread(state)
        },
    },
  });

  export const selectMarket = (state: RootState) => state.orderBook.selectedMarket;
  export const selectGrouping = (state: RootState) => state.orderBook.grouping;
  export const selectGroup = (state: RootState) => state.orderBook.selectedGroup;
  export const selectBidArray = (state: RootState) => state.orderBook.bidArray
  export const selectAskArray = (state: RootState) => state.orderBook.askArray
  export const selectSpread = (state: RootState) => state.orderBook.spread

  export const { changeSelectedMarket, changeSelectedGroup, changeBidArray, changeAskArray } = orderBookSlice.actions;

  export default orderBookSlice.reducer;