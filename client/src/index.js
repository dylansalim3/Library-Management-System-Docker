import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { SnackbarProvider } from 'notistack';
if (process.env.NODE_ENV !== "development")
    console.error = console.log = () => {};
ReactDOM.render(
  <React.StrictMode>
    <SnackbarProvider maxSnack={1} autoHideDuration={3000}>
        <App />
    </SnackbarProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

