import React from 'react';
import {createRoot,hydrateRoot} from 'react-dom/client';
import App from './App';
import './styles.css';
const root=document.getElementById('root')!;
if(root.children.length)hydrateRoot(root,<App/>);else createRoot(root).render(<App/>);
