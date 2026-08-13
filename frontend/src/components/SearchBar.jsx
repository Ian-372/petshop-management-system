import { FaSearch } from "react-icons/fa";

export default function SearchBar({

    value,
    onChange,
    placeholder

}) {

    return (

        <div className="relative">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input

                type="text"

                placeholder={placeholder}

                value={value}

                onChange={(e) => onChange(e.target.value)}

                className="w-full md:w-96 pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1 transition-smooth placeholder-slate-500"

            />
        </div>

    );

}