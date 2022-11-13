import '../styles/globals.css';
import { KakaoInit } from '../utils/KakaoAdfit';
import { NaverAnalystics } from '../utils/NaverAnalystics';

function MyApp({ Component, pageProps }) {
    return (
        <>
            <Component {...pageProps} />
            <KakaoInit />
            <NaverAnalystics />
        </>
    );
}

export default MyApp;
