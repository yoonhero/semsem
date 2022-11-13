import Script from 'next/script';
import { useEffect } from 'react';

const GoogleAdsense = () => {
    return (
        <Script
            id="Adsense-id"
            data-ad-client="ca-pub-4008680507057815"
            async="true"
            strategy="afterInteractive"
            src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"
        />
    );
};

const DisplayAds = () => {
    useEffect(() => {
        try {
            (window.adsbygoogle = window.adsbygoogle || []).push({});
        } catch (err) {
            console.log(err);
        }
    }, []);
    return (
        <>
            <ins
                className="adsbygoogle adbanner-customize"
                style={{ display: 'block' }}
                data-ad-client="ca-pub-4008680507057815"
                data-ad-slot="9015890487"
            ></ins>
        </>
    );
};

export { GoogleAdsense, DisplayAds };
