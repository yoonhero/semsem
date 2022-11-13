import Script from 'next/script';
import { useRef, useEffect } from 'react';

const KakaoInit = () => {
    return (
        <Script
            strategy="beforeInteractive"
            type="text/javascript"
            src="//t1.daumcdn.net/kas/static/ba.min.js"
            async="true"
        ></Script>
    );
};

function KakaoAdFit() {
    // 최초 1회만 광고를 불러오기 위한 변수
    const adRef = useRef(false);

    useEffect(() => {
        // 로딩된 광고가 있으면, 추가 로딩 X
        if (adRef.current) {
            return;
        }

        const ins1 = document.createElement('ins');
        const ins2 = document.createElement('ins');
        const script = document.createElement('script');

        ins1.className = 'kakao_ad_area';
        ins1.style.display = 'none;';

        ins2.className = 'kakao_ad_area';
        ins2.style.display = 'none;';

        ins1.setAttribute('data-ad-width', '320');
        ins1.setAttribute('data-ad-height', '100');
        ins1.setAttribute('data-ad-unit', 'DAN-6QvvzO2NnZ0ojb01');

        ins2.setAttribute('data-ad-width', '250');
        ins2.setAttribute('data-ad-height', '250');
        ins2.setAttribute('data-ad-unit', 'DAN-eOpSxEPGWBwqWD2i');

        script.async = true;
        script.type = 'text/javascript';
        script.src = '//t1.daumcdn.net/kas/static/ba.min.js';

        document.querySelector('.aside__kakaoAdFit')?.appendChild(ins1);
        document.querySelector('.aside__kakaoAdFit')?.appendChild(ins2);
        document.querySelector('.aside__kakaoAdFit')?.appendChild(script);

        // 광고 로딩 여부 상태 변경
        adRef.current = true;
    }, []);
    return (
        <>
            <aside className="aside__kakaoAdFit flex flex-col gap-2 mb-8  justify-center items-center"></aside>
        </>
    );
}

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

export { KakaoInit, DisplayAds, KakaoAdFit };
