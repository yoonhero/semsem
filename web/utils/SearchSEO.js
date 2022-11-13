import Script from 'next/script';
import useTranslation from 'next-translate/useTranslation';

const SearchSEO = () => {
    const { t } = useTranslation();

    return (
        <>
            <meta http-equiv="content-language" content={t('commont:lang')} />
            <meta name="description" content={t('common:description')} />
            <meta
                name="viewport"
                content="initial-scale=1.0, width=device-width"
            />
            <meta name="keywords" content={t('common:keywords')}></meta>
            <meta property="og:title" content={t('commont:lang')} />
            <meta property="og:type" content="website" />
            <meta property="og:url" content="https://semsem.vercel.app" />
            <meta
                property="og:image"
                content="https://semsem.vercel.app/favicon.png"
            />
            <meta property="og:article:author" content="Yoonhero" />
        </>
    );
};

const SearchEngine = () => {
    return (
        <>
            <meta
                name="naver-site-verification"
                content="6c747799b30a807eaeeae3c3afa06694b399e927"
            />
            <meta
                name="google-site-verification"
                content="1KDe4Utph9TllN9u4Gzkgc3k_Xo7kWtruaYaqrIwsKM"
            />
        </>
    );
};

export { SearchSEO, SearchEngine };
