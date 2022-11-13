import Script from 'next/script';

const KakaoInit = () => {
    return (
        <Script
            strategy="afterInteractive"
            type="text/javascript"
            src="//t1.daumcdn.net/kas/static/ba.min.js"
            async="true"
        ></Script>
    );
};

const DisplayAds = () => {
    return (
        <>
            <ins
                className="kakao_ad_area"
                style={{ display: 'none' }}
                data-ad-unit="DAN-6QvvzO2NnZ0ojb01"
                data-ad-width="320"
                data-ad-height="100"
            ></ins>
            <ins
                className="kakao_ad_area"
                style={{ display: 'none' }}
                data-ad-unit="DAN-eOpSxEPGWBwqWD2i"
                data-ad-width="250"
                data-ad-height="250"
            ></ins>
        </>
    );
};

export { KakaoInit, DisplayAds };
