import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

import { Provider } from 'react-redux';
import { BrowserRouter } from "react-router-dom";
import { createStore, applyMiddleware } from 'redux';
import promiseMiddelware from 'redux-promise';
import ReduxThunk from 'redux-thunk';
import Reducer from './redux/reducers';

import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css'

const createStoreWithMiddleware = applyMiddleware(promiseMiddelware, ReduxThunk)(createStore);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
			<BrowserRouter>
				<Provider store={createStoreWithMiddleware(
					Reducer,
					window.__REDUX_DEVTOOLS_EXTENSION__ &&
					window.__REDUX_DEVTOOLS_EXTENSION__()
				)}>
						<App />
				</Provider>
			</BrowserRouter>
  </React.StrictMode>
);
