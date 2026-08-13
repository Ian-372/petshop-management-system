import { FaArrowUp, FaArrowDown } from "react-icons/fa";

export default function DashboardCard({
    title,
    value,
    icon: Icon,
    color = "text-blue-600",
    trend = null,
    trendLabel = "",
    noTrendLabel = ""
}) {

    // Color mapping for icon backgrounds
    const colorBgMap = {
        "text-blue-600": "bg-blue-100",
        "text-emerald-600": "bg-emerald-100",
        "text-orange-600": "bg-orange-100",
        "text-purple-600": "bg-purple-100",
        "text-pink-600": "bg-pink-100",
    };

    const bgColor = colorBgMap[color] || "bg-slate-100";
    const isTrendPositive = trend && trend > 0;
    const trendColor = isTrendPositive ? "text-emerald-600" : "text-red-600";

    return (

        <div className="card p-6 hover:shadow-lg group">

            <div className="flex justify-between items-start">

                <div className="flex-1">

                    <p className="text-sm font-medium text-slate-500 mb-1">
                        {title}
                    </p>

                    <div className="flex items-baseline gap-2">
                        <h2 className="text-4xl font-bold text-slate-900">
                            {typeof value === 'number' ? value.toLocaleString() : value}
                        </h2>
                    </div>

                    {trend !== null ? (
                        <div className={`flex items-center gap-1 mt-3 ${trendColor}`}>
                            {isTrendPositive ? (
                                <FaArrowUp className="text-xs" />
                            ) : (
                                <FaArrowDown className="text-xs" />
                            )}
                            <span className="text-xs font-semibold">
                                {Math.abs(trend).toLocaleString(undefined, { maximumFractionDigits: 1 })}% {trendLabel}
                            </span>
                        </div>
                    ) : noTrendLabel ? (
                        <p className="mt-3 text-xs font-medium text-slate-400">{noTrendLabel}</p>
                    ) : null}

                </div>

                <div className={`${bgColor} ${color} text-4xl p-4 rounded-2xl group-hover:scale-110 transition-transform duration-300`}>
                    <Icon />
                </div>

            </div>

        </div>

    );

}
