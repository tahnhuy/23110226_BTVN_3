import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { setupAuthInterceptor } from './services/axiosConfig';
import { logout } from './store/authSlice';
import { store } from './store/store';
import './index.css';
import App from './App';

setupAuthInterceptor(() => {
    store.dispatch(logout());
});

const rootEl = document.getElementById('root');
if (!rootEl) {
    throw new Error('Root element #root not found');
}

createRoot(rootEl).render(
    <StrictMode>
        <Provider store={store}>
            <App />
        </Provider>
    </StrictMode>
);
