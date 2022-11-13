import '../styles/globals.css';
import { KakaoInit } from '../utils/KakaoAdfit';
import { NaverAnalystics } from '../utils/NaverAnalystics';

function MyApp({ Component, pageProps }) {
    return (
        <>
            <Component {...pageProps} />

            <NaverAnalystics />
        </>
    );
}

export default MyApp;
