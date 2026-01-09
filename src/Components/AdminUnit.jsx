import React, { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, X, Check, Search, Boxes } from "lucide-react";

export default function AdminUnit() {
    const API_URL = import.meta.env.VITE_API_BASE_URL;

    const [units, setUnits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    const [showAddModal, setShowAddModal] = useState(false);
    const [newUnitName, setNewUnitName] = useState("");

    const [editingId, setEditingId] = useState(null);
    const [editingName, setEditingName] = useState("");

    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    // DELETE MODAL STATES
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteUnitId, setDeleteUnitId] = useState(null);

    useEffect(() => {
        fetchUnits();
    }, []);

    const fetchUnits = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/unit/get-all-units`);
            const data = await res.json();
            setUnits(data);
        } catch (err) {
            setError("Failed to load units");
        } finally {
            setLoading(false);
        }
    };

    const handleAddUnit = async () => {
        if (!newUnitName.trim()) {
            setError("Unit name cannot be empty");
            return;
        }

        try {
            const res = await fetch(`${API_URL}/unit/add-unit`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ unitName: newUnitName }),
            });

            const data = await res.json();

            if (res.status >= 400) {
                setError(data.message || "Failed to add unit");
                return;
            }

            setSuccessMessage("Unit added successfully");
            setShowAddModal(false);
            setNewUnitName("");
            fetchUnits();
            setTimeout(() => setSuccessMessage(""), 3000);
        } catch (err) {
            setError("Failed to add unit");
        }
    };

    const handleUpdateUnit = async (unitId) => {
        if (!editingName.trim()) {
            setError("Unit name cannot be empty");
            return;
        }

        try {
            const res = await fetch(`${API_URL}/unit/update-unit`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ unitId, unitName: editingName }),
            });

            const data = await res.json();

            if (res.status >= 400) {
                setError(data.message || "Failed to update unit");
                return;
            }

            setSuccessMessage("Unit updated successfully");
            setEditingId(null);
            setEditingName("");
            fetchUnits();
            setTimeout(() => setSuccessMessage(""), 3000);
        } catch (err) {
            setError("Failed to update unit");
        }
    };

    // ❗ OPEN DELETE MODAL
    const openDeleteModal = (unitId) => {
        setDeleteUnitId(unitId);
        setShowDeleteModal(true);
    };

    // ❗ DELETE CONFIRMATION ACTION
    const handleDeleteUnit = async () => {
        try {
            const res = await fetch(`${API_URL}/unit/delete-unit/${deleteUnitId}`, {
                method: "DELETE",
            });

            const data = await res.json();

            if (res.status >= 400) {
                setError(data.message || "Failed to delete unit");
                return;
            }

            setSuccessMessage(data.message);
            setShowDeleteModal(false);
            setDeleteUnitId(null);
            fetchUnits();
            setTimeout(() => setSuccessMessage(""), 3000);
        } catch (err) {
            setError("Failed to delete unit");
        }
    };

    const filteredUnits = units.filter((u) =>
        u.unitName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gray-50 p-1 md:p-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <h1 className="text-3xl font-bold text-gray-800">Unit Management</h1>
                <p className="text-gray-500 mt-1">Manage your product units</p>

                {/* Top Bar */}
                <div className="flex flex-col gap-2 md:flex-row justify-between items-center mt-6 mb-6">
                    {/* Search */}
                    <div className="relative w-full md:w-10/12">
                        <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            placeholder="Search units..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                        />
                    </div>

                    {/* Add Button */}
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="flex items-center justify-center  gap-2 bg-emerald-500 text-white px-5 py-2 rounded-lg hover:bg-emerald-700 transition w-full md:w-auto"
                    >
                        <Plus className="w-5 h-5" />
                        Add Unit
                    </button>
                </div>

                {/* Success Alert */}
                {successMessage && (
                    <div className="bg-green-50 border-l-4 border-green-600 p-4 mb-4 text-green-700 rounded">
                        {successMessage}
                    </div>
                )}

                {/* Table */}
                <div className="bg-white shadow-md rounded-lg overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-gray-100 border-b">
                            <tr>
                                <th className="text-left px-6 py-3 text-sm font-semibold text-gray-700">#</th>
                                <th className="text-left px-6 py-3 text-sm font-semibold text-gray-700">Unit Name</th>
                                <th className="text-right px-6 py-3 text-sm font-semibold text-gray-700">Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="3" className="text-center py-6 text-gray-500 text-sm">
                                        Loading...
                                    </td>
                                </tr>
                            ) : filteredUnits.length === 0 ? (
                                <tr>
                                    <td colSpan="3" className="text-center py-6 text-gray-500 text-sm">
                                        No units found
                                    </td>
                                </tr>
                            ) : (
                                filteredUnits.map((unit, index) => (
                                    <tr key={unit.unitId} className="border-b hover:bg-gray-50">
                                        <td className="px-6 py-4 font-semibold text-gray-700">{index + 1}</td>

                                        <td className="px-6 py-4">
                                            {editingId === unit.unitId ? (
                                                <input
                                                    value={editingName}
                                                    onChange={(e) => setEditingName(e.target.value)}
                                                    className="border border-gray-300 rounded px-2 py-1 w-full focus:ring-green-500 focus:border-green-500"
                                                    autoFocus
                                                />
                                            ) : (
                                                <span className="font-medium text-gray-800">
                                                    {unit.unitName}
                                                </span>
                                            )}
                                        </td>

                                        <td className="px-6 py-4 flex justify-end gap-3">
                                            {editingId === unit.unitId ? (
                                                <>
                                                    <button
                                                        onClick={() => handleUpdateUnit(unit.unitId)}
                                                        className="text-green-600 hover:text-green-700"
                                                    >
                                                        <Check className="w-5 h-5" />
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setEditingId(null);
                                                            setEditingName("");
                                                        }}
                                                        className="text-gray-500 hover:text-gray-700"
                                                    >
                                                        <X className="w-5 h-5" />
                                                    </button>
                                                </>
                                            ) : (
                                                <>
                                                    <button
                                                        onClick={() => {
                                                            setEditingId(unit.unitId);
                                                            setEditingName(unit.unitName);
                                                        }}
                                                        className="text-blue-600 hover:text-blue-700"
                                                    >
                                                        <Pencil className="w-5 h-5" />
                                                    </button>

                                                    <button
                                                        onClick={() => openDeleteModal(unit.unitId)}
                                                        className="text-red-600 hover:text-red-700"
                                                    >
                                                        <Trash2 className="w-5 h-5" />
                                                    </button>
                                                </>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Stats */}
                <div className="mt-6 bg-white shadow-md rounded-lg p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm">Total Units</p>
                            <p className="text-3xl font-bold text-gray-800 mt-1">{units.length}</p>
                        </div>

                        <div className="bg-emerald-500 p-4 rounded-lg">
                            <Boxes className="w-8 h-8 text-white" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Add Unit Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/10 backdrop-blur-xs bg-opacity-40 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">

                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-gray-800">Add Unit</h2>
                            <button
                                onClick={() => {
                                    setShowAddModal(false);
                                    setNewUnitName("");
                                }}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <input
                            type="text"
                            value={newUnitName}
                            onChange={(e) => setNewUnitName(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-4 focus:ring-green-500 focus:border-green-500"
                            placeholder="Enter unit name"
                            autoFocus
                        />

                        {error && (
                            <div className="bg-red-50 border-l-4 border-red-500 p-1 mb-4 text-red-700 rounded">
                                {error}
                            </div>
                        )}
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => {
                                    setShowAddModal(false);
                                    setNewUnitName("");
                                }}
                                className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={handleAddUnit}
                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                            >
                                Add Unit
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black/30 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full">
                        <h2 className="text-xl font-semibold text-gray-800 mb-3">Delete Unit?</h2>
                        <p className="text-gray-600 mb-6">
                            Are you sure you want to delete this unit? This action cannot be undone.
                        </p>

                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={handleDeleteUnit}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
