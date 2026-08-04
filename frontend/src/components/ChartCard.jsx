export default function ChartCard({

    title,

    children

}) {

    return (

        <div className="bg-white rounded-xl shadow-md p-5">

            <h2 className="text-xl font-semibold mb-4">

                {title}

            </h2>

            {children}

        </div>

    );

}