import React, { Component } from "react";
import { GroupDropDown } from "./GroupDropDown";


class GridHeader extends Component {
    // constructor(props: any) {  
    //     super(props)

    // }

    render() {
        return (
            <div id="grid-header">
                <div id="grid-header-title">Order Book</div>
                <div id="grid-header-spread">Spread 17.0 (0.05%)</div>
                <GroupDropDown />
            </div>
        )
    }
}

export default GridHeader