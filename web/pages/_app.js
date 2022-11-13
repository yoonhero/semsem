import '../styles/globals.css';
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
