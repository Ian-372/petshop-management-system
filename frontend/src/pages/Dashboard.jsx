import { useEffect, useState } from "react";

import api from "../services/api";
import ErrorAlert from "../components/ErrorAlert";

import DashboardCard from "../components/DashboardCard";
import ChartCard from "../components/ChartCard";
import TableCard from "../components/TableCard";

import {

    FaBox,
    FaUsers,
    FaShoppingCart,
    FaMoneyBillWave,
    FaFileInvoiceDollar,
    FaChartLine,
    FaStar,
    FaExclamationTriangle,
    FaTimesCircle

} from "react-icons/fa";

import {

    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Tooltip,
    Legend

} from "chart.js";

import { Bar } from "react-chartjs-2";

ChartJS.register(

    CategoryScale,
    LinearScale,
    BarElement,
    Tooltip,
    Legend

);

export default function Dashboard() {

    const [stats, setStats] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {

        loadDashboard();

    }, []);

    async function loadDashboard() {

        try {

            const response = await api.get("/dashboard");

            setStats(response.data);
            setError(null);

        }

        catch (error) {

            const errorMessage = error.response?.data?.message || error.message || "Failed to load dashboard";
            setError(errorMessage);
            console.error(errorMessage);

        }

    }

    if (!stats) {

        return (

            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-slate-200 to-slate-300 rounded-full mx-auto mb-4 animate-pulse"></div>
                    <p className="text-slate-600 font-medium">Loading dashboard...</p>
                </div>

            </div>

        );

    }

    const chartData = {

        labels: [

            "Products",

            "Customers",

            "Sales",

            "Purchases"

        ],

        datasets: [

            {

                label: "Business Overview",

                data: [

                    stats.totalProducts,

                    stats.totalCustomers,

                    stats.totalSales,

                    stats.totalPurchases

                ]

            }

        ]

    };

    return (

        <div className="space-y-8 pb-8">

            {error && <ErrorAlert message={error} onClose={() => setError(null)} />}

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="mb-1 text-2xl font-bold text-slate-900 sm:text-3xl lg:text-4xl">
                        Dashboard
                    </h1>
                    <p className="text-slate-500 text-sm">
                        Welcome back! Here's your business overview.
                    </p>
                </div>
            </div>

            {/* KPI CARDS */}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 xl:grid-cols-4">

                <DashboardCard

                    title="Total Products"

                    value={stats.totalProducts}

                    icon={FaBox}

                    color="text-blue-600"

                    noTrendLabel="No historical comparison data"

                />

                <DashboardCard

                    title="Total Customers"

                    value={stats.totalCustomers}

                    icon={FaUsers}

                    color="text-emerald-600"

                    noTrendLabel="No historical comparison data"

                />

                <DashboardCard

                    title="Total Sales"

                    value={stats.totalSales}

                    icon={FaShoppingCart}

                    color="text-orange-600"

                    trend={stats.salesGrowthPercentage ?? null}

                    trendLabel="vs last month"

                    noTrendLabel="No sales in the previous month"

                />

                <DashboardCard

                    title="Revenue"

                    value={`KSh ${stats.salesRevenue.toLocaleString()}`}

                    icon={FaMoneyBillWave}

                    color="text-purple-600"

                    trend={stats.revenueGrowthPercentage ?? null}

                    trendLabel="vs last month"

                    noTrendLabel="No revenue in the previous month"

                />

            </div>

            {/* SECOND ROW */}

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

                <ChartCard title="Business Overview">

                    <Bar data={chartData} />

                </ChartCard>

                <TableCard title="Business Summary">

                    <div className="space-y-3">

                        {/* Purchase Cost */}
                        <div className="flex justify-between items-center p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors group">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <FaFileInvoiceDollar className="text-blue-600" />
                                </div>
                                <span className="font-medium text-slate-700">Purchase Cost</span>
                            </div>
                            <span className="font-bold text-slate-900 text-lg">
                                KSh {(stats.purchaseCost / 1000).toFixed(0)}K
                            </span>
                        </div>

                        {/* Revenue */}
                        <div className="flex justify-between items-center p-4 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-colors group">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <FaMoneyBillWave className="text-emerald-600" />
                                </div>
                                <span className="font-medium text-slate-700">Revenue</span>
                            </div>
                            <span className="font-bold text-emerald-700 text-lg">
                                KSh {(stats.salesRevenue / 1000).toFixed(0)}K
                            </span>
                        </div>

                        {/* Profit */}
                        <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors group border-l-4 border-green-500">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <FaChartLine className="text-green-600" />
                                </div>
                                <span className="font-medium text-slate-700">Total Profit</span>
                            </div>
                            <span className="font-bold text-green-700 text-lg">
                                KSh {(stats.profit / 1000).toFixed(0)}K
                            </span>
                        </div>

                        {/* Loyalty Customers */}
                        <div className="flex justify-between items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors group">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <FaStar className="text-purple-600" />
                                </div>
                                <span className="font-medium text-slate-700">Loyalty Customers</span>
                            </div>
                            <span className="font-bold text-purple-700 text-lg">
                                {stats.loyaltyCustomers}
                            </span>
                        </div>

                        {/* Total Loyalty Points */}
                        <div className="flex justify-between items-center p-4 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors group">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <FaStar className="text-indigo-600" />
                                </div>
                                <span className="font-medium text-slate-700">Total Loyalty Points</span>
                            </div>
                            <span className="font-bold text-indigo-700 text-lg">
                                {stats.totalLoyaltyPoints}
                            </span>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            {/* Low Stock Products */}
                            <div className="flex justify-between items-center p-4 bg-amber-50 rounded-lg hover:bg-amber-100 transition-colors group border-l-4 border-amber-500">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 bg-amber-100 rounded flex items-center justify-center group-hover:scale-110 transition-transform">
                                        <FaExclamationTriangle className="text-amber-600 text-xs" />
                                    </div>
                                    <span className="font-medium text-amber-900 text-sm">Low Stock</span>
                                </div>
                                <span className="font-bold text-amber-700">
                                    {stats.lowStockProducts}
                                </span>
                            </div>

                            {/* Out Of Stock Products */}
                            <div className="flex justify-between items-center p-4 bg-red-50 rounded-lg hover:bg-red-100 transition-colors group border-l-4 border-red-500">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 bg-red-100 rounded flex items-center justify-center group-hover:scale-110 transition-transform">
                                        <FaTimesCircle className="text-red-600 text-xs" />
                                    </div>
                                    <span className="font-medium text-red-900 text-sm">Out of Stock</span>
                                </div>
                                <span className="font-bold text-red-700">
                                    {stats.outOfStockProducts}
                                </span>
                            </div>
                        </div>

                    </div>

                </TableCard>

            </div>

        </div>

    );

}
