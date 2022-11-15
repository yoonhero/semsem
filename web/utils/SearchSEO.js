const SearchSEO = ({ locale }) => {
    return (
        <>
            <>
                {locale == 'ko' ? (
                    <>
                        <meta http-equiv="content-language" content="ko" />
                        <meta
                            name="description"
                            content="멜라 네컷을 찍어보세요! 4장의 사진을 찍으면 인공지능이 여러분의 얼굴을 재밌게 바꾸어줍니다! 여러가지 프레임 중에 직접 프레임을 선택하여 자신의 개성을 표현하세요! "
                        />
                        <meta
                            name="keywords"
                            content="인생네컷, 멜라네컷, 카메라웹사이트, 카메라, 카메라필터앱, 사진앱, 인공지능, 인공지능필터, 로맬라, 세마고등학교"
                        ></meta>
                        <meta property="og:title" content="멜라네컷 with AI" />
                    </>
                ) : (
                    <>
                        <meta http-equiv="content-language" content="en" />
                        <meta
                            name="description"
                            content="Take a MeLa4Selfies! If you take four pictures, artificial intelligence changes your face in a fun way! Choose your own frame from various frames to express your personality!"
                        />
                        <meta
                            name="keywords"
                            content="Four cuts of life, Melanecut, camera website, camera, camera filter app, photo app, artificial intelligence, artificial intelligence filter, Romala, Sema Highschool"
                        ></meta>
                        <meta
                            property="og:title"
                            content="MeLa4Selfies with AI"
                        />
                    </>
                )}
            </>

            <meta
                name="viewport"
                content="initial-scale=1.0, width=device-width"
            />

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
