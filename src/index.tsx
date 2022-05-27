import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import App from './pages/App';
import { HashRouter } from "react-router-dom";
import windowService from "./hooks/window.service";

const initServices = () => {
    windowService.start();
}

initServices();

ReactDOM.render(
  <React.StrictMode>
      <HashRouter>
          <App />
      </HashRouter>
  </React.StrictMode>,
  document.getElementById('root')
);
