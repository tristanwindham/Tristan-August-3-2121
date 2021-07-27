import React, { Component } from 'react';
import GridHeader from './gridHeader/GridHeader';
import Grid from './grid/Grid';
import DataFeedButtons from './dataFeedButtons/DataFeedButtons';


import './order-book.scss';


class OrderBook extends Component {
    // constructor(props: any) {  
    //     super(props)

    // }

    render() {

        return (
            <div id="order-book">
                <GridHeader />
                <Grid />
                <DataFeedButtons  />
            </div>
        )
    }
}

export default OrderBook