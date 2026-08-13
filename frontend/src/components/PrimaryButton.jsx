export default function PrimaryButton({

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

            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"

        >

            {children}

        </button>

    );

}