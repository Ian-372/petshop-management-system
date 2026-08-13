export default function ChartCard({

    title,

    children

}) {

    return (

        <div className="card p-6">

            <div className="mb-6">
                <h2 className="text-xl font-bold text-slate-900">

                    {title}

                </h2>
            </div>

            <div className="overflow-auto">
                {children}
            </div>

        </div>

    );

}