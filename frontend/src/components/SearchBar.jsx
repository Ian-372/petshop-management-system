export default function SearchBar({

    value,
    onChange,
    placeholder

}) {

    return (

        <input

            type="text"

            placeholder={placeholder}

            value={value}

            onChange={(e) => onChange(e.target.value)}

            className="w-full md:w-96 border border-slate-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"

        />

    );

}