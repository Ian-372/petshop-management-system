import { useEffect, useState } from "react";
import api from "../services/api";
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

        }

        catch (error) {

            console.error(error);

            alert("Failed to load reports.");

        }

        finally {

            setLoading(false);

        }

    }

    if (loading) {

        return <div className="p-8">Loading reports...</div>;

    }

    return (

        <div className="space-y-8">

            <h1 className="text-3xl font-bold">
                Reports
            </h1>

            <div className="grid grid-cols-4 gap-6">

                <div className="bg-white shadow rounded-lg p-5">

                    <h3>Total Sales</h3>

                    <p className="text-3xl font-bold">

                        {summary.totalSales}

                    </p>

                </div>

                <div className="bg-white shadow rounded-lg p-5">

                    <h3>Total Revenue</h3>

                    <p className="text-3xl font-bold">

                        KSh {summary.totalRevenue.toFixed(2)}

                    </p>

                </div>

                <div className="bg-white shadow rounded-lg p-5">

                    <h3>Items Sold</h3>

                    <p className="text-3xl font-bold">

                        {summary.totalItemsSold}

                    </p>

                </div>

                <div className="bg-white shadow rounded-lg p-5">

                    <h3>Average Sale</h3>

                    <p className="text-3xl font-bold">

                        KSh {summary.averageSale.toFixed(2)}

                    </p>

                </div>

            </div>
            <div className="bg-white shadow rounded-lg p-6">

                <h2 className="text-xl font-semibold mb-6">

                    Revenue Trend

                </h2>

                <Line data={revenueChartData} />

            </div>

            <div className="bg-white shadow rounded-lg p-6">

                <h2 className="text-xl font-semibold mb-4">

                    Daily Sales

                </h2>

                <table className="w-full">

                    <thead>

                        <tr>

                            <th className="text-left">Date</th>

                            <th>Sales</th>

                            <th>Revenue</th>

                        </tr>

                    </thead>

                    <tbody>

                        {

                            dailySales.map(day => (

                                <tr key={day.date}>

                                    <td>{day.date}</td>

                                    <td className="text-center">

                                        {day.numberOfSales}

                                    </td>

                                    <td className="text-center">

                                        KSh {day.revenue.toFixed(2)}

                                    </td>

                                </tr>

                            ))

                        }

                    </tbody>

                </table>

            </div>

            <div className="bg-white shadow rounded-lg p-6">

                <h2 className="text-xl font-semibold mb-4">

                    Top Selling Products

                </h2>

                <table className="w-full">

                    <thead>

                        <tr>

                            <th className="text-left">

                                Product

                            </th>

                            <th>Qty Sold</th>

                            <th>Revenue</th>

                        </tr>

                    </thead>

                    <tbody>

                        {

                            products.map(product => (

                                <tr key={product.productId}>

                                    <td>

                                        {product.productName}

                                    </td>

                                    <td className="text-center">

                                        {product.quantitySold}

                                    </td>

                                    <td className="text-center">

                                        KSh {product.revenueGenerated.toFixed(2)}

                                    </td>

                                </tr>

                            ))

                        }

                    </tbody>

                </table>

            </div>

        </div>

    );

}