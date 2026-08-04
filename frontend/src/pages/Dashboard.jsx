import { useEffect, useState } from "react";

import api from "../services/api";

import DashboardCard from "../components/DashboardCard";
import ChartCard from "../components/ChartCard";
import TableCard from "../components/TableCard";

import {

    FaBox,
    FaUsers,
    FaShoppingCart,
    FaMoneyBillWave

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

    useEffect(() => {

        loadDashboard();

    }, []);

    async function loadDashboard() {

        try {

            const response = await api.get("/dashboard");

            setStats(response.data);

        }

        catch (error) {

            console.log(error);

        }

    }

    if (!stats) {

        return (

            <div className="text-2xl font-bold">

                Loading Dashboard...

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

        <div className="space-y-8">

            <h1 className="text-3xl font-bold">

                Dashboard

            </h1>

            {/* KPI CARDS */}

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

                <DashboardCard

                    title="Products"

                    value={stats.totalProducts}

                    icon={FaBox}

                    color="text-blue-600"

                />

                <DashboardCard

                    title="Customers"

                    value={stats.totalCustomers}

                    icon={FaUsers}

                    color="text-green-600"

                />

                <DashboardCard

                    title="Sales"

                    value={stats.totalSales}

                    icon={FaShoppingCart}

                    color="text-orange-600"

                />

                <DashboardCard

                    title="Revenue"

                    value={`KSh ${stats.salesRevenue.toLocaleString()}`}

                    icon={FaMoneyBillWave}

                    color="text-red-600"

                />

            </div>

            {/* SECOND ROW */}

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

                <ChartCard title="Business Overview">

                    <Bar data={chartData} />

                </ChartCard>

                <TableCard title="Business Summary">

                    <table className="w-full">

                        <tbody>

                            <tr className="border-b">

                                <td className="py-3 font-medium">

                                    Purchase Cost

                                </td>

                                <td className="text-right">

                                    KSh {stats.purchaseCost.toLocaleString()}

                                </td>

                            </tr>

                            <tr className="border-b">

                                <td className="py-3 font-medium">

                                    Revenue

                                </td>

                                <td className="text-right">

                                    KSh {stats.salesRevenue.toLocaleString()}

                                </td>

                            </tr>

                            <tr className="border-b">

                                <td className="py-3 font-medium">

                                    Profit

                                </td>

                                <td className="text-right font-bold text-green-600">

                                    KSh {stats.profit.toLocaleString()}

                                </td>

                            </tr>

                            <tr className="border-b">

                                <td className="py-3 font-medium">

                                    Loyalty Customers

                                </td>

                                <td className="text-right">

                                    {stats.loyaltyCustomers}

                                </td>

                            </tr>

                            <tr className="border-b">

                                <td className="py-3 font-medium">

                                    Total Loyalty Points

                                </td>

                                <td className="text-right">

                                    {stats.totalLoyaltyPoints}

                                </td>

                            </tr>

                            <tr className="border-b">

                                <td className="py-3 font-medium">

                                    Low Stock Products

                                </td>

                                <td className="text-right text-yellow-600 font-bold">

                                    {stats.lowStockProducts}

                                </td>

                            </tr>

                            <tr>

                                <td className="py-3 font-medium">

                                    Out Of Stock

                                </td>

                                <td className="text-right text-red-600 font-bold">

                                    {stats.outOfStockProducts}

                                </td>

                            </tr>

                        </tbody>

                    </table>

                </TableCard>

            </div>

        </div>

    );

}