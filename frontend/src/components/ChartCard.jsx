export default function ChartCard({

    title,

    children

}) {

    return (

        <div className="card p-4 sm:p-6">

            <div className="mb-4 sm:mb-6">
                <h2 className="text-lg font-bold text-slate-900 sm:text-xl">

                    {title}

                </h2>
            </div>

            <div className="overflow-auto">
                {children}
            </div>

        </div>

    );

}