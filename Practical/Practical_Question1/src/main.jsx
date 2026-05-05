import React from "react"
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import ReactDOM from 'react-dom/client'
import {  } from "module";
import {Provider} from 'react-dom
import {store} from 'react-dom'


// Question1:  context api qmplementation create a react app the use the concept contex api required creat/ provider/ consume

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
);
