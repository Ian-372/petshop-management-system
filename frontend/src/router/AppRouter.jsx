import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "../pages/Login";

import Dashboard from "../pages/Dashboard";
import Products from "../pages/Products";
import Customers from "../pages/Customers";
import Suppliers from "../pages/Suppliers";
import Purchases from "../pages/Purchases";
import Sales from "../pages/Sales";
import Reports from "../pages/Reports";
import Settings from "../pages/Settings";

import MainLayout from "../layouts/MainLayout";
import ProtectedRoute from "./ProtectedRoute";

export default function AppRouter() {

    return (

        <BrowserRouter>

            <Routes>

                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/"
                    element={
                        <ProtectedRoute>
                            <MainLayout />
                        </ProtectedRoute>
                    }
                >

                    <Route index element={<Dashboard />} />

                    <Route path="products" element={<Products />} />

                    <Route path="customers" element={<Customers />} />

                    <Route path="suppliers" element={<Suppliers />} />

                    <Route path="purchases" element={<Purchases />} />

                    <Route path="sales" element={<Sales />} />

                    <Route path="reports" element={<Reports />} />

                    <Route path="settings" element={<Settings />} />

                </Route>

            </Routes>

        </BrowserRouter>

    );

}