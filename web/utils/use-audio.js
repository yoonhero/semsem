import { useState, useEffect } from 'react';

const useAudio = (url) => {
    const [audio, setAudio] = useState();
    const [playing, setPlaying] = useState(false);

    const toggle = () => setPlaying(!playing);

    useEffect(() => {
        setAudio(new Audio(url));
    }, []);

    useEffect(() => {
        playing ? audio?.play() : audio?.pause();
    }, [playing]);

    useEffect(() => {
        audio?.addEventListener('ended', () => setPlaying(false));
        return () => {
            audio?.removeEventListener('ended', () => setPlaying(false));
        };
    }, [audio]);

    return [playing, toggle];
};

export { useAudio };
