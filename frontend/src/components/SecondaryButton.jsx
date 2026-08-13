export default function SecondaryButton({

    children,
    onClick,
    type = "button",
    disabled = false

}) {

    return (

        <button

            type={type}

            onClick={onClick}

            disabled={disabled}

            className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"

        >

            {children}

        </button>

    );

}