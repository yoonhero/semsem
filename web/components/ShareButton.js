import {
    FacebookShareButton,
    FacebookIcon,
    RedditShareButton,
    RedditIcon,
} from 'next-share';
import Image from 'next/image';
import { useRef, useEffect } from 'react';

const ShareBtn = ({ children }) => {
    return (
        <button className="w-[32px] h-[32px] rounded-full overflow-hidden">
            {children}
        </button>
    );
};

const KakaoShareButton = () => {
    const adRef = useRef(false);

    useEffect(() => {
        if (adRef.current) {
            return;
        }

        const script = document.createElement('script');

        script.async = true;
        script.type = 'text/javascript';
        script.src = 'https://developers.kakao.com/sdk/js/kakao.js';

        document.querySelector('.kakao__share')?.appendChild(script);

        adRef.current = true;
    }, []);

    const click = () => {
        if (window.Kakao) {
            const kakao = window.Kakao;
            // 중복 initialization 방지
            if (!kakao.isInitialized()) {
                // 두번째 step 에서 가져온 javascript key 를 이용하여 initialize
                kakao.init('308cc473f30d91a0bcfb54807f8fda91');
            }
            kakao.Link.sendDefault({
                objectType: 'feed',
                content: {
                    title: '멜라네컷 with AI',
                    description:
                        '멜라 네컷을 찍어보세요! 4장의 사진을 찍으면 인공지능이 여러분의 얼굴을 재밌게 바꾸어줍니다! 여러가지 프레임 중에 직접 프레임을 선택하여 자신의 개성을 표현하세요!',
                    imageUrl: `https://semsem.vercel.app/favicon.png`,
                    link: {
                        webUrl: 'https://semsem.vercel.app/',
                        mobileWebUrl: 'https://semsem.vercel.app/',
                    },
                },
            });
        }
    };

    return (
        <>
            <ShareBtn>
                <Image
                    onClick={() => {
                        click();
                    }}
                    src={'/kakao.png'}
                    width={80}
                    height={80}
                />
            </ShareBtn>
            <div className="kakao__share"></div>
        </>
    );
};

const ShareButtons = () => {
    return (
        <div className="flex flex-row gap-2 p-2">
            <FacebookShareButton
                url={'https://semsem.vercel.app'}
                quote={
                    '멜라 네컷을 찍어보세요! 4장의 사진을 찍으면 인공지능이 여러분의 얼굴을 재밌게 바꾸어줍니다! 여러가지 프레임 중에 직접 프레임을 선택하여 자신의 개성을 표현하세요!'
                }
                hashtag={'#nextshare'}
            >
                <FacebookIcon size={32} round />
            </FacebookShareButton>

            <RedditShareButton
                url={'https://semsem.vercel.app'}
                title={
                    '멜라 네컷을 찍어보세요! 4장의 사진을 찍으면 인공지능이 여러분의 얼굴을 재밌게 바꾸어줍니다! 여러가지 프레임 중에 직접 프레임을 선택하여 자신의 개성을 표현하세요!'
                }
            >
                <RedditIcon size={32} round />
            </RedditShareButton>
            <KakaoShareButton />
        </div>
    );
};

export { ShareButtons };
