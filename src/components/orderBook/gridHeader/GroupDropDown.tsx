import { FunctionComponent, useState } from 'react';
import { selectGroup, selectGrouping, changeSelectedGroup } from './../../../store/reducers/orderBook/orderBookReducer'
import { useAppSelector, useAppDispatch } from '../../../app/hooks';


export const GroupDropDown: FunctionComponent = () => {
    const [ isOpen, setIsOpen ] = useState<boolean>(false);
    
    const dispatch = useAppDispatch();

    const selectedGroup: number = useAppSelector(selectGroup);
    const groupingValues = useAppSelector(selectGrouping);
    
    return (
        <div className={`grid-header-dropdown ${isOpen ? 'active' : null}`} >
            <div id="dropdown-text" onClick={() => setIsOpen(!isOpen)}>{selectedGroup}</div>
            <div id="dropdown-options">
                { isOpen ?
                    groupingValues.map((value, idx) => {
                        return <div className="dropdown-option" key={idx} onClick={() => {
                            dispatch(changeSelectedGroup(value));
                            setIsOpen(!isOpen);
                        }}>{value}</div>
                    })
                    : null
                }
            </div>
        </div>
    );
}