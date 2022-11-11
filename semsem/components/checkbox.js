const CheckBox = ({ checked, onClickFunc, text }) => {
    return (
        <label
            htmlFor="default-toggle"
            className="inline-flex relative items-center cursor-pointer"
        >
            <input
                type="checkbox"
                checked={checked}
                onClick={() => onClickFunc()}
                id="default-toggle"
                className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300  rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-gray-600"></div>
            <span className="ml-3 text-md font-medium text-white hidden sm:block">
                {text}
            </span>
        </label>
    );
};

export { CheckBox };
