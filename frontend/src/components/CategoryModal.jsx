import { useEffect, useState } from "react";

import api from "../services/api";

import PrimaryButton from "./PrimaryButton";
import SecondaryButton from "./SecondaryButton";

export default function CategoryModal({

    open,
    onClose

}) {

    const [categories, setCategories] = useState([]);

    const [name, setName] = useState("");

    useEffect(() => {

        if (open) {

            loadCategories();

        }

    }, [open]);

    async function loadCategories() {

        try {

            const response = await api.get("/categories");

            setCategories(response.data);

        }

        catch (error) {

            console.error(error);

        }

    }

    async function addCategory(e) {

        e.preventDefault();

        if (!name.trim()) {

            alert("Category name is required.");

            return;

        }

        try {

            await api.post("/categories", {

                name

            });

            setName("");

            loadCategories();

        }

        catch (error) {

            console.error(error);

            alert("Unable to create category.");

        }

    }

    async function deleteCategory(id) {

        if (!window.confirm("Delete this category?")) {

            return;

        }

        try {

            await api.delete(`/categories/${id}`);

            loadCategories();

        }

        catch (error) {

            console.error(error);

            alert("Unable to delete category.");

        }

    }

    if (!open) return null;

    return (

        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">

            <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-8">

                <h2 className="text-2xl font-bold mb-6">

                    Manage Categories

                </h2>

                <form

                    onSubmit={addCategory}

                    className="flex gap-3 mb-6"

                >

                    <input

                        className="flex-1 border rounded-lg p-3"

                        placeholder="Category Name"

                        value={name}

                        onChange={(e) => setName(e.target.value)}

                    />

                    <PrimaryButton

                        type="submit"

                    >

                        Add

                    </PrimaryButton>

                </form>

                <div className="space-y-2 max-h-72 overflow-y-auto">

                    {

                        categories.map(category => (

                            <div

                                key={category.id}

                                className="flex justify-between items-center border rounded-lg p-3"

                            >

                                <span>

                                    {category.name}

                                </span>

                                <button

                                    onClick={() => deleteCategory(category.id)}

                                    className="text-red-600 hover:text-red-800 font-semibold"

                                >

                                    Delete

                                </button>

                            </div>

                        ))

                    }

                </div>

                <div className="mt-6 flex justify-end">

                    <SecondaryButton

                        onClick={onClose}

                    >

                        Close

                    </SecondaryButton>

                </div>

            </div>

        </div>

    );

}