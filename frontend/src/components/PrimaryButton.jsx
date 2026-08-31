export default function PrimaryButton({

    children,
    onClick,
    type = "button",
    disabled = false,
    className = ""

}) {

    return (

        <button

            type={type}

            onClick={onClick}

            disabled={disabled}

            className={`btn-primary disabled:cursor-not-allowed disabled:opacity-50 ${className}`}

        >

            {children}

        </button>

    );

}