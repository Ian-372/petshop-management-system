export default function SecondaryButton({

    children,
    onClick,
    type = "button"

}) {

    return (

        <button

            type={type}

            onClick={onClick}

            className="bg-slate-200 hover:bg-slate-300 text-slate-800 px-5 py-3 rounded-lg font-semibold transition"

        >

            {children}

        </button>

    );

}