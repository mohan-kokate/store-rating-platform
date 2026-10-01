import React from 'react';
import {createRoot} from 'react-dom/client';
import {BrowserRouter,Routes,Route,Navigate} from 'react-router-dom';
import {App,Register} from './main';
function Router(){return <Routes><Route path="/login" element={<App/>}/><Route path="/register" element={<Register/>}/><Route path="*" element={<App/>}/></Routes>};
createRoot(document.getElementById('root')).render(<React.StrictMode><BrowserRouter><Router/></BrowserRouter></React.StrictMode>);