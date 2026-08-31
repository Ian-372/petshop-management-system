export default function PageHeader({

    title,
    buttonText,
    onButtonClick,
    children

}) {

    return (

        <div className="mb-6">

            <div className="mb-5 flex flex-col gap-3 sm:mb-6 sm:flex-row sm:items-center sm:justify-between">

                <div>
                    <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl lg:text-4xl">

                        {title}

                    </h1>
                </div>

                {

                    buttonText && (

                        <button

                            onClick={onButtonClick}

                            className="btn-primary w-full sm:w-auto"

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