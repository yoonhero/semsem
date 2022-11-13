import Script from 'next/script';
import { useEffect } from 'react';

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

const DisplayAds = () => {
    useEffect(() => {
        window.adsbygoogle = window.adsbygoogle || [];
        window.adsbygoogle.push({});
    }, []);
    return (
        <>
            <ins
                className="adsbygoogle"
                style="display:block"
                data-ad-client="ca-pub-4008680507057815"
                data-ad-slot="9015890487"
                data-ad-format="auto"
                data-full-width-responsive="true"
            ></ins>
        </>
    );
};

export { GoogleAdsense, DisplayAds };
