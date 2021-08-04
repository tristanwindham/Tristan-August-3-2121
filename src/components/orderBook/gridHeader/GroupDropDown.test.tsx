import { Provider } from 'react-redux';
import { render, fireEvent } from '@testing-library/react';
import { store } from './../../../store/store';
import { GroupDropDown } from './GroupDropDown';

test('Tests user selecting new group', () => {
  const { getByText } = render(
        <Provider store={store}>
            <GroupDropDown />
        </Provider>
    );

    fireEvent.click(getByText('0.5'))
    getByText('2.5')
    fireEvent.click(getByText('2.5'))
    getByText('2.5')
    
});