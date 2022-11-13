import Link from 'next/link';

const CopyRight = () => {
    return (
        <div className="fixed bottom-2">
            <div className="flex flex-row gap-2 animate-bounce text-white text-sm">
                Copyright 2022 ©{' '}
                <Link href="https://github.com/yoonhero">
                    <p className="cursor-pointer font-bold text-md text-gray-100">
                        Yoonhero
                    </p>
                </Link>{' '}
                with ROMELA
            </div>
        </div>
    );
};

export { CopyRight };
