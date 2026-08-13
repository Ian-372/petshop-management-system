import { useEffect, useState } from "react";
import api from "../services/api";
import ErrorAlert from "../components/ErrorAlert";
import { FaChartLine, FaCreditCard, FaBoxes, FaShoppingCart } from "react-icons/fa";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend
} from "chart.js";

import { Line } from "react-chartjs-2";
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend
);

export default function Reports() {

    const [summary, setSummary] = useState(null);

    const [dailySales, setDailySales] = useState([]);

    const [products, setProducts] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const revenueChartData = {

        labels: dailySales
            .slice()
            .reverse()
            .map(day => day.date),

        datasets: [

            {

                label: "Revenue (KSh)",

                data: dailySales
                    .slice()
                    .reverse()
                    .map(day => day.revenue),

                borderColor: "#2563eb",

                backgroundColor: "rgba(37,99,235,0.2)",

                fill: true,

                tension: 0.4

            }

        ]

    };

    useEffect(() => {

        loadReports();

    }, []);

    async function loadReports() {

        try {

            const [summaryRes, dailyRes, productRes] = await Promise.all([

                api.get("/reports/summary"),

                api.get("/reports/daily"),

                api.get("/reports/products")

            ]);

            setSummary(summaryRes.data);

            setDailySales(dailyRes.data);

            setProducts(productRes.data);
            setError(null);

        }

        catch (error) {

            const errorMessage = error.response?.data?.message || error.message || "Failed to load reports";
            setError(errorMessage);
            console.error(errorMessage);

        }

        finally {

            setLoading(false);

        }

    }

    if (loading) {

        return (
            <div className="space-y-8">
                {error && <ErrorAlert message={error} onClose={() => setError(null)} />}
                <div>
                    <h1 className="text-4xl font-bold text-slate-900 mb-2">Reports</h1>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="card p-6">
                            <div className="space-y-4">
                                <div className="skeleton h-4 w-24"></div>
                                <div className="skeleton h-10 w-32"></div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="card p-6">
                    <div className="skeleton h-6 w-32 mb-6"></div>
                    <div className="skeleton h-80 w-full"></div>
                </div>
            </div>
        );

    }

    return (

        <div className="space-y-8 pb-8">

            {error && <ErrorAlert message={error} onClose={() => setError(null)} />}

            <div>
                <h1 className="text-4xl font-bold text-slate-900 mb-1">
                    Reports
                </h1>
                <p className="text-slate-500 text-sm">
                    Comprehensive business analytics and insights
                </p>
            </div>

            {/* KPI CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

                <div className="card p-6 group">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-slate-500 mb-1">Total Sales</p>
                            <h2 className="text-4xl font-bold text-slate-900">
                                {summary.totalSales.toLocaleString()}
                            </h2>
                        </div>
                        <div className="bg-blue-100 text-blue-600 text-2xl p-4 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                            <FaShoppingCart />
                        </div>
                    </div>
                </div>

                <div className="card p-6 group">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-slate-500 mb-1">Total Revenue</p>
                            <h2 className="text-4xl font-bold text-slate-900">
                                KSh {(summary.totalRevenue / 1000).toFixed(0)}K
                            </h2>
                            <p className="text-xs text-slate-500 mt-2">
                                {(summary.totalRevenue).toLocaleString()}
                            </p>
                        </div>
                        <div className="bg-emerald-100 text-emerald-600 text-2xl p-4 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                            <FaCreditCard />
                        </div>
                    </div>
                </div>

                <div className="card p-6 group">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-slate-500 mb-1">Items Sold</p>
                            <h2 className="text-4xl font-bold text-slate-900">
                                {summary.totalItemsSold.toLocaleString()}
                            </h2>
                        </div>
                        <div className="bg-orange-100 text-orange-600 text-2xl p-4 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                            <FaBoxes />
                        </div>
                    </div>
                </div>

                <div className="card p-6 group">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-slate-500 mb-1">Average Sale</p>
                            <h2 className="text-4xl font-bold text-slate-900">
                                KSh {summary.averageSale.toFixed(0)}
                            </h2>
                        </div>
                        <div className="bg-purple-100 text-purple-600 text-2xl p-4 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                            <FaChartLine />
                        </div>
                    </div>
                </div>

            </div>

            {/* REVENUE CHART */}
            <div className="card p-6">
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-slate-900 mb-1">
                        Revenue Trend
                    </h2>
                    <p className="text-sm text-slate-500">
                        Daily revenue performance over time
                    </p>
                </div>
                <div className="bg-gradient-to-b from-blue-50/50 to-transparent p-4 rounded-xl">
                    <Line data={revenueChartData} options={{
                        responsive: true,
                        maintainAspectRatio: true,
                        plugins: {
                            legend: {
                                labels: {
                                    color: '#64748B',
                                    font: { weight: '500' }
                                }
                            }
                        },
                        scales: {
                            y: {
                                ticks: { color: '#94A3B8' },
                                grid: { color: '#E2E8F0' }
                            },
                            x: {
                                ticks: { color: '#94A3B8' },
                                grid: { color: '#E2E8F0' }
                            }
                        }
                    }} />
                </div>
            </div>

            {/* DAILY SALES TABLE */}
            <div className="card overflow-hidden">
                <div className="p-6 border-b border-slate-100">
                    <h2 className="text-2xl font-bold text-slate-900 mb-1">
                        Daily Sales
                    </h2>
                    <p className="text-sm text-slate-500">
                        Sales activity for each day
                    </p>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">

                        <thead>

                            <tr className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">

                                <th className="text-left p-4 font-bold text-slate-700">Date</th>

                                <th className="text-center p-4 font-bold text-slate-700">Number of Sales</th>

                                <th className="text-center p-4 font-bold text-slate-700">Revenue</th>

                            </tr>

                        </thead>

                        <tbody>

                            {

                                dailySales.map((day, idx) => (

                                    <tr key={day.date} className={`border-t border-slate-100 transition-colors hover:bg-blue-50 ${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/40'}`}>

                                        <td className="p-4 font-medium text-slate-900">{day.date}</td>

                                        <td className="text-center p-4 text-slate-600">

                                            <span className="badge badge-info">
                                                {day.numberOfSales}
                                            </span>

                                        </td>

                                        <td className="text-center p-4 font-semibold text-slate-900">

                                            KSh {day.revenue.toFixed(2)}

                                        </td>

                                    </tr>

                                ))

                            }

                        </tbody>

                    </table>
                </div>

            </div>

            {/* TOP PRODUCTS TABLE */}
            <div className="card overflow-hidden">
                <div className="p-6 border-b border-slate-100">
                    <h2 className="text-2xl font-bold text-slate-900 mb-1">
                        Top Selling Products
                    </h2>
                    <p className="text-sm text-slate-500">
                        Best performing products by revenue
                    </p>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">

                        <thead>

                            <tr className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">

                                <th className="text-left p-4 font-bold text-slate-700">

                                    Product

                                </th>

                                <th className="text-center p-4 font-bold text-slate-700">

                                    Quantity Sold

                                </th>

                                <th className="text-center p-4 font-bold text-slate-700">

                                    Revenue

                                </th>

                            </tr>

                        </thead>

                        <tbody>

                            {

                                products.map((product, idx) => (

                                    <tr key={product.productId} className={`border-t border-slate-100 transition-colors hover:bg-blue-50 ${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/40'}`}>

                                        <td className="p-4 font-medium text-slate-900">

                                            {product.productName}

                                        </td>

                                        <td className="text-center p-4 text-slate-600">

                                            <span className="badge badge-success">
                                                {product.quantitySold}
                                            </span>

                                        </td>

                                        <td className="text-center p-4 font-semibold text-slate-900">

                                            KSh {product.revenueGenerated.toFixed(2)}

                                        </td>

                                    </tr>

                            ))

                        }

                    </tbody>

                </table>

            </div>

        </div>

        </div>

    );

}