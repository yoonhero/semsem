import Image from 'next/image';

const ImageCard = ({ imgSrc, onClickEvent, idx, selected }) => {
    return (
        <div
            className="flex flex-col items-center justify-center padding-3 text-white text-xl "
            onClick={() => onClickEvent(idx)}
        >
            <Image
                className="cursor-pointer transform transition hover:scale-105 duration-300 ease-out"
                src={imgSrc}
                height={500}
                width={(500 / 1722) * 618}
            />
            {selected && 'selected!'}
        </div>
    );
};

export { ImageCard };
