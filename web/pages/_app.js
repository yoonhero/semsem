import '../styles/globals.css';
import { NaverAnalystics } from '../utils/NaverAnalystics';
import { Analytics } from '@vercel/analytics/react';

function MyApp({ Component, pageProps }) {
    return (
        <>
            <Component {...pageProps} />

            <NaverAnalystics />
            <Analytics />
        </>
    );
}

export default MyApp;
