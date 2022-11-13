import { useState, useEffect } from 'react';
import { CopyRight } from './copyright';

const Quotes = [
    '인생네컷보다 괜찮나요 ㅎㅎ',
    '어떻게 만들었을까요?!',
    '누가 만들었을까요?!',
    '히히',
    '사진이 멋있어진다ㅏ',
    '기다려주셔서 감사해요.!',
    '거의 다 왔어요.',
    '조금만 더..',
    '개발자의 썰에 따르면 길게는 18초까지 기다..려..야.',
    '추억으로 저장!',
    'ㅋ.ㅋ',
];

const ProgressBar = ({ msg, progress }) => {
    const [quote, setQuote] = useState();

    const getQuote = () => {
        return Quotes[Math.floor(Math.random() * Quotes.length) - 1];
    };

    useEffect(() => {
        setQuote(getQuote());
        const quote_interval = setInterval(() => {
            const t_q = getQuote();
            setQuote(t_q);
        }, 3000);
        return () => clearInterval(quote_interval);
    }, []);

    return (
        <div className="w-screen h-screen p-0 bg-gray-600 ">
            <div className="w-full h-full flex flex-col justify-center items-center  text-center ">
                <div className="text-white font-bold break-all text-3xl p-10">
                    {msg}
                </div>

                <div className="font-thin text-white break-all text-sm p-4">
                    {quote}
                </div>

                <div className="w-80 h-4 bg-gray-800 rounded-full dark:bg-gray-700">
                    <div
                        className="h-4 bg-blue-600 rounded-full dark:bg-blue-500"
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>
                <CopyRight />
            </div>
        </div>
    );
};

export default ProgressBar;
