import { useEffect, useMemo, useState } from "react";
import { FaArrowDown, FaArrowUp, FaBoxes, FaExclamationTriangle, FaHistory, FaWarehouse } from "react-icons/fa";
import api from "../services/api";
import ErrorAlert from "../components/ErrorAlert";
import PageHeader from "../components/PageHeader";
import PrimaryButton from "../components/PrimaryButton";
import SearchBar from "../components/SearchBar";
import StockAdjustmentModal from "../components/StockAdjustmentModal";

const currency = (value) => `KSh ${Number(value || 0).toLocaleString()}`;
const statusOf = (item) => (item.quantity <= 0 ? "out" : item.quantity <= 10 ? "low" : "in");

function MetricCard({ label, value, icon, tone }) {
    const colors = { blue: "bg-blue-50 text-blue-700", emerald: "bg-emerald-50 text-emerald-700", amber: "bg-amber-50 text-amber-700", red: "bg-red-50 text-red-700" };
    return <div className="card flex items-center gap-4 p-5"><div className={`flex h-10 w-10 items-center justify-center rounded-lg ${colors[tone]}`}>{icon}</div><div><p className="text-sm text-slate-500">{label}</p><p className="text-2xl font-bold text-slate-900">{value}</p></div></div>;
}

function StatusBadge({ status }) {
    const labels = { in: "In stock", low: "Low stock", out: "Out of stock" };
    const classes = { in: "badge badge-success", low: "badge badge-warning", out: "badge badge-danger" };
    return <span className={classes[status]}>{labels[status]}</span>;
}

export default function Stock() {
    const [stock, setStock] = useState([]);
    const [adjustments, setAdjustments] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("all");
    const [showAdjustModal, setShowAdjustModal] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => { loadInventory(); }, []);

    async function loadInventory() {
        try {
            const [stockResponse, adjustmentResponse, transactionResponse] = await Promise.all([
                api.get("/stock"), api.get("/stock/adjustments"), api.get("/reports/transactions")
            ]);
            setStock(stockResponse.data || []);
            setAdjustments(adjustmentResponse.data || []);
            setTransactions(transactionResponse.data || []);
            setError(null);
        } catch (loadError) {
            setError(loadError.response?.data?.message || "Unable to load inventory data.");
        }
    }

    const salesSpeed = useMemo(() => {
        const cutoff = new Date();
        cutoff.setDate(cutoff.getDate() - 30);
        const unitsByProduct = new Map();
        transactions.filter((sale) => new Date(sale.saleDate) >= cutoff).forEach((sale) => {
            (sale.items || []).forEach((item) => unitsByProduct.set(item.productId, (unitsByProduct.get(item.productId) || 0) + Number(item.quantity || 0)));
        });
        return unitsByProduct;
    }, [transactions]);

    const filteredStock = useMemo(() => stock.filter((item) => item.productName.toLowerCase().includes(search.toLowerCase()) && (filter === "all" || filter === statusOf(item))), [filter, search, stock]);
    const metrics = useMemo(() => ({
        totalValue: stock.reduce((total, item) => total + Number(item.quantity || 0) * Number(item.buyingPrice || 0), 0),
        units: stock.reduce((total, item) => total + Number(item.quantity || 0), 0),
        low: stock.filter((item) => statusOf(item) === "low").length,
        out: stock.filter((item) => statusOf(item) === "out").length
    }), [stock]);
    const reorderSuggestions = useMemo(() => stock.map((item) => {
        const soldLast30Days = salesSpeed.get(item.productId) || 0;
        return { ...item, soldLast30Days, suggestedQuantity: Math.max(0, Math.ceil((soldLast30Days / 30) * 14 - item.quantity)) };
    }).filter((item) => item.suggestedQuantity > 0).sort((a, b) => b.suggestedQuantity - a.suggestedQuantity).slice(0, 5), [salesSpeed, stock]);

    return <div className="space-y-8 pb-8">
        {error && <ErrorAlert message={error} onClose={() => setError(null)} />}
        <PageHeader title="Stock"><div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center"><SearchBar value={search} onChange={setSearch} placeholder="Search inventory..." /><PrimaryButton onClick={() => setShowAdjustModal(true)}><FaWarehouse className="mr-2 inline" /> Adjust stock</PrimaryButton></div></PageHeader>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <MetricCard label="Stock value" value={currency(metrics.totalValue)} icon={<FaWarehouse />} tone="blue" />
            <MetricCard label="Units on hand" value={metrics.units.toLocaleString()} icon={<FaBoxes />} tone="emerald" />
            <MetricCard label="Low stock" value={metrics.low} icon={<FaExclamationTriangle />} tone="amber" />
            <MetricCard label="Out of stock" value={metrics.out} icon={<FaExclamationTriangle />} tone="red" />
        </div>

        <section><div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><h2 className="text-lg font-bold text-slate-900">Inventory</h2><div className="flex flex-wrap gap-2" role="group" aria-label="Stock status filter">{[["all", "All"], ["in", "In stock"], ["low", "Low stock"], ["out", "Out of stock"]].map(([value, label]) => <button key={value} onClick={() => setFilter(value)} className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${filter === value ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"}`}>{label}</button>)}</div></div>
            <div className="card overflow-x-auto"><table className="w-full min-w-[720px]"><thead className="border-b border-slate-200 bg-slate-50"><tr><th className="p-4 text-left text-sm font-bold text-slate-700">Product</th><th className="p-4 text-left text-sm font-bold text-slate-700">Category</th><th className="p-4 text-right text-sm font-bold text-slate-700">Quantity</th><th className="p-4 text-right text-sm font-bold text-slate-700">Stock value</th><th className="p-4 text-left text-sm font-bold text-slate-700">Status</th></tr></thead><tbody>{filteredStock.length ? filteredStock.map((item) => <tr key={item.productId} className="border-t border-slate-100 hover:bg-slate-50"><td className="p-4 font-medium text-slate-900">{item.productName}</td><td className="p-4"><span className="badge badge-info">{item.category}</span></td><td className="p-4 text-right font-semibold text-slate-900">{item.quantity}</td><td className="p-4 text-right text-slate-700">{currency(item.quantity * item.buyingPrice)}</td><td className="p-4"><StatusBadge status={statusOf(item)} /></td></tr>) : <tr><td colSpan="5" className="p-10 text-center text-slate-500">No inventory matches this filter.</td></tr>}</tbody></table></div>
        </section>

        <div className="grid gap-8 xl:grid-cols-5"><section className="xl:col-span-2"><div className="mb-4 flex items-center gap-2"><FaExclamationTriangle className="text-amber-600" /><h2 className="text-lg font-bold text-slate-900">Reorder suggestions</h2></div><div className="card divide-y divide-slate-100">{reorderSuggestions.length ? reorderSuggestions.map((item) => <div key={item.productId} className="flex items-center justify-between gap-4 p-4"><div><p className="font-medium text-slate-900">{item.productName}</p><p className="text-sm text-slate-500">{item.soldLast30Days} sold in the last 30 days</p></div><span className="whitespace-nowrap text-sm font-bold text-blue-700">Order {item.suggestedQuantity}</span></div>) : <p className="p-6 text-sm text-slate-500">No reorder needs based on the last 30 days of sales.</p>}</div></section>
            <section className="xl:col-span-3"><div className="mb-4 flex items-center gap-2"><FaHistory className="text-slate-600" /><h2 className="text-lg font-bold text-slate-900">Adjustment history</h2></div><div className="card overflow-x-auto"><table className="w-full min-w-[760px]"><thead className="border-b border-slate-200 bg-slate-50"><tr><th className="p-3 text-left text-sm font-bold text-slate-700">When</th><th className="p-3 text-left text-sm font-bold text-slate-700">Product</th><th className="p-3 text-left text-sm font-bold text-slate-700">Change</th><th className="p-3 text-left text-sm font-bold text-slate-700">Before / after</th><th className="p-3 text-left text-sm font-bold text-slate-700">Reason</th><th className="p-3 text-left text-sm font-bold text-slate-700">By</th></tr></thead><tbody>{adjustments.length ? adjustments.map((item) => <tr key={item.id} className="border-t border-slate-100"><td className="p-3 text-sm text-slate-600">{new Date(item.adjustmentDate).toLocaleString()}</td><td className="p-3 text-sm font-medium text-slate-900">{item.productName}</td><td className="p-3"><span className={`inline-flex items-center gap-1 text-sm font-semibold ${item.adjustmentType === "IN" ? "text-emerald-700" : "text-red-700"}`}>{item.adjustmentType === "IN" ? <FaArrowUp /> : <FaArrowDown />}{item.quantity}</span></td><td className="p-3 text-sm text-slate-700">{item.quantityBefore} / {item.quantityAfter}</td><td className="p-3 text-sm text-slate-600">{item.reason}</td><td className="p-3 text-sm text-slate-600">{item.adjustedBy || "Unknown"}</td></tr>) : <tr><td colSpan="6" className="p-8 text-center text-sm text-slate-500">No stock adjustments recorded yet.</td></tr>}</tbody></table></div></section>
        </div>
        <StockAdjustmentModal open={showAdjustModal} onClose={() => setShowAdjustModal(false)} onSaved={loadInventory} />
    </div>;
}
