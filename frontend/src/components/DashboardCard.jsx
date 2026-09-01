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
        "text-blue-600": "bg-cyan-400/15",
        "text-emerald-600": "bg-emerald-400/15",
        "text-orange-600": "bg-amber-400/15",
        "text-purple-600": "bg-rose-400/15",
        "text-pink-600": "bg-pink-400/15",
    };

    const bgColor = colorBgMap[color] || "bg-[#263832]";
    const isTrendPositive = trend && trend > 0;
    const trendColor = isTrendPositive ? "text-emerald-600" : "text-red-600";

    return (

        <div className="card group p-4 sm:p-5">

            <div className="flex items-start justify-between gap-3">

                <div className="flex-1">

                    <p className="text-sm font-medium text-slate-400 mb-1">
                        {title}
                    </p>

                    <div className="flex items-baseline gap-2">
                        <h2 className="break-words text-2xl font-bold text-slate-100 sm:text-3xl">
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

                <div className={`${bgColor} ${color} flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-xl transition-transform duration-200 group-hover:scale-105 sm:h-12 sm:w-12 sm:text-2xl`}>
                    <Icon />
                </div>

            </div>

        </div>

    );

}
