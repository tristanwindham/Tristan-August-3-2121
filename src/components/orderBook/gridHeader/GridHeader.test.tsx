import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from './../../../store/store';
import GridHeader from './GridHeader';

test('Renders the market in header', () => {
  const { getByText } = render(
        <Provider store={store}>
            <GridHeader />
        </Provider>
    );
  

    getByText('XBT' || 'ETH');
});
