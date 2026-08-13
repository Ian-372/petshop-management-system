export default function PageHeader({

    title,
    buttonText,
    onButtonClick,
    children

}) {

    return (

        <div className="mb-8">

            <div className="flex items-center justify-between mb-6">

                <div>
                    <h1 className="text-4xl font-bold text-slate-900">

                        {title}

                    </h1>
                </div>

                {

                    buttonText && (

                        <button

                            onClick={onButtonClick}

                            className="btn-primary"

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