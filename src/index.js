import React from 'react';
import ReactDOM from 'react-dom';

import './global.css';
import styles from './index.scss';
import App from "./components/App/App";


let root = document.createElement('root');
root.id = 'root';
document.body.appendChild(root);

ReactDOM.render(
  <App/>,
  root
);

