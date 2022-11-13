import Script from 'next/script';

const GoogleAdsense = () => {
    return (
        <Script
            id="Adsense-id"
            data-ad-client="ca-pub-4008680507057815"
            async="true"
            strategy="beforeInteractive"
            src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"
        />
    );
};

export { GoogleAdsense };
