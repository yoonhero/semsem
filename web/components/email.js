const Email = () => {
    const [email, setEmail] = useState('');

    /* ------------------------------- User Email Form --------------------------------- */
    const onChange = (e) => {
        setEmail(e.target.value);
    };

    /* ----------------------- SEND Email to user ------------------------ */
    const sendEmail = () => {};

    return (
        <div className="fixed">
            <div className="flex flex-col gap-2">
                <input
                    onChange={(e) => onChange(e)}
                    value={email}
                    type="email"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-2xl rounded-2xl focus:ring-blue-500 focus:border-blue-500 block w-full p-4 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Your Email"
                />

                <button
                    onClick={() => setFinish(true)}
                    className="bg-blue-500 hover:bg-blue-700 text-xl text-white font-bold py-4 px-6 rounded-xl"
                >
                    Submit
                </button>
            </div>
        </div>
    );
};

export default Email;
