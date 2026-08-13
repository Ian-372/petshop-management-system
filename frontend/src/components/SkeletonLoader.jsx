export default function SkeletonLoader({ count = 4, type = "card" }) {
    if (type === "card") {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                {Array.from({ length: count }).map((_, i) => (
                    <div key={i} className="card p-6">
                        <div className="space-y-4">
                            <div className="skeleton h-4 w-24"></div>
                            <div className="skeleton h-10 w-32"></div>
                            <div className="skeleton h-3 w-20"></div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (type === "table") {
        return (
            <div className="card p-6">
                <div className="skeleton h-6 w-32 mb-6"></div>
                <div className="space-y-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="flex gap-4">
                            <div className="skeleton h-4 flex-1"></div>
                            <div className="skeleton h-4 w-24"></div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {Array.from({ length: count }).map((_, i) => (
                <div key={i} className="skeleton h-12 w-full"></div>
            ))}
        </div>
    );
}
