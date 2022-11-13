import '../styles/globals.css';
import { GoogleAdsense } from '../utils/googleAdsense';
import { NaverAnalystics } from '../utils/NaverAnalystics';
import { SearchEngine } from '../utils/SearchSEO';

function MyApp({ Component, pageProps }) {
    return (
        <>
            <Component {...pageProps} />
            <GoogleAdsense />
            <NaverAnalystics />
        </>
    );
}

export default MyApp;
