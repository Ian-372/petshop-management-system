export default function PageHeader({

    title,
    buttonText,
    onButtonClick,
    children

}) {

    return (

        <div className="mb-8">

            <div className="flex items-center justify-between mb-5">

                <h1 className="text-3xl font-bold text-slate-800">

                    {title}

                </h1>

                {

                    buttonText && (

                        <button

                            onClick={onButtonClick}

                            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg font-semibold transition"

                        >

                            + {buttonText}

                        </button>

                    )

                }

            </div>

            {

                children

            }

        </div>

    );

}