import { Provider } from 'react-redux';
import { render, fireEvent } from '@testing-library/react';
import { store } from './../../../store/store';
import DataFeedButtons from './DataFeedButtons';

test('Tests rendering of and the click events for Toggle/Kill Feed buttons.', () => {
    let toggleValue = false
    let killValue = false

    const { getByText } = render(
        <Provider store={store}>
            <DataFeedButtons toggleFeed={() => {toggleValue = true}} killFeed={() => {killValue = true}}/>
        </Provider>
    );

    fireEvent.click(getByText('Toggle Feed'))
    expect(toggleValue).toBeTruthy()
    fireEvent.click(getByText('Kill Feed'))
    expect(killValue).toBeTruthy()
    
});