import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Subcategory = () => {
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [filteredSubcategories, setFilteredSubcategories] = useState([]);
  const [subcategoryName, setSubcategoryName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [editSubcategory, setEditSubcategory] = useState(null);
  const [newSubcategoryName, setNewSubcategoryName] = useState('');
  const [newSelectedCategory, setNewSelectedCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoriesResponse = await axios.get('https://better-server-blush.vercel.app/categories');
        setCategories(categoriesResponse.data);

        const subcategoriesResponse = await axios.get('https://better-server-blush.vercel.app/subcategories');
        setSubcategories(subcategoriesResponse.data);
        setFilteredSubcategories(subcategoriesResponse.data);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Error fetching data');
      }
    };

    fetchData();
  }, []);

  const handleAddSubcategory = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://better-server-blush.vercel.app/subcategories', {
        name: subcategoryName,
        category: selectedCategory
      });
      setSubcategories((prevSubcategories) => [response.data.subcategory, ...prevSubcategories]);
      setFilteredSubcategories((prevSubcategories) => [response.data.subcategory, ...prevSubcategories]);
      setSuccessMessage('Subcategory added successfully');
      setSubcategoryName('');
      setError(null);
    } catch (err) {
      console.error('Error adding subcategory:', err);
      setError('Error adding subcategory');
      setSuccessMessage('');
    }
  };

  const handleEditSubcategory = async () => {
    try {
      const response = await axios.put(`https://better-server-blush.vercel.app/subcategories/${editSubcategory._id}`, {
        name: newSubcategoryName,
        category: newSelectedCategory
      });
      const updatedSubcategories = subcategories.map(sub =>
        sub._id === response.data.subcategory._id ? response.data.subcategory : sub
      );
      setSubcategories(updatedSubcategories);
      setFilteredSubcategories(updatedSubcategories);
      setSuccessMessage('Subcategory updated successfully');
      setError(null);
      closeEditModal();
    } catch (err) {
      console.error('Error updating subcategory:', err);
      setError('Error updating subcategory');
      setSuccessMessage('');
    }
  };

  const handleDeleteSubcategory = async (id) => {
    try {
      await axios.delete(`https://better-server-blush.vercel.app/subcategories/${id}`);
      const filteredSubcategories = subcategories.filter(sub => sub._id !== id);
      setSubcategories(filteredSubcategories);
      setFilteredSubcategories(filteredSubcategories);
      setSuccessMessage('Subcategory deleted successfully');
      setError(null);
    } catch (err) {
      console.error('Error deleting subcategory:', err);
      setError('Error deleting subcategory');
      setSuccessMessage('');
    }
  };

  const openEditModal = (subcategory) => {
    setEditModalOpen(true);
    setEditSubcategory(subcategory);
    setNewSubcategoryName(subcategory.name);
    setNewSelectedCategory(subcategory.category);
  };

  const closeEditModal = () => {
    setEditModalOpen(false);
    setEditSubcategory(null);
    setNewSubcategoryName('');
    setNewSelectedCategory('');
  };

  const openFilterModal = () => {
    setFilterModalOpen(true);
  };

  const closeFilterModal = () => {
    setFilterModalOpen(false);
    setFilterCategory('');
  };

  const handleFilter = () => {
    const filtered = subcategories.filter(sub => {
      return (!filterCategory || sub.category === filterCategory) && (!searchTerm || sub.name.toLowerCase().includes(searchTerm.toLowerCase()));
    });
    setFilteredSubcategories(filtered);
    closeFilterModal();
  };

  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    const filtered = subcategories.filter(sub => sub.name.toLowerCase().includes(term.toLowerCase()));
    setFilteredSubcategories(filtered);
  };

  return (
    <div className="max-w-4xl mx-auto my-8 p-8 bg-white rounded-lg shadow-lg">
      <h1 className="text-4xl font-bold mb-4 text-center">Subcategory Management</h1>
      <form onSubmit={handleAddSubcategory} className="max-w-sm mx-auto mb-8">
        <div className="mb-4">
          <label htmlFor="subcategoryName" className="block text-sm font-medium text-gray-700">Subcategory Name:</label>
          <input
            type="text"
            id="subcategoryName"
            value={subcategoryName}
            onChange={(e) => setSubcategoryName(e.target.value)}
            required
            className="mt-1 p-2 block w-full border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="categorySelect" className="block text-sm font-medium text-gray-700">Category:</label>
          <select
            id="categorySelect"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            required
            className="mt-1 p-2 block w-full border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="">Select a Category</option>
            {categories.map((category) => (
              <option key={category._id} value={category._id}>{category.name}</option>
            ))}
          </select>
        </div>
        {error && <p className="text-red-500">{error}</p>}
        {successMessage && <p className="text-green-500">{successMessage}</p>}
        <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50">Add Subcategory</button>
      </form>

      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Search by name"
          value={searchTerm}
          onChange={handleSearch}
          className="p-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
        <button
          onClick={openFilterModal}
          className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-50"
        >
          Filter
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="table-auto min-w-full bg-white border">
          <thead>
            <tr>
              <th className="py-2 px-4 border">ID</th>
              <th className="py-2 px-4 border">Name</th>
              <th className="py-2 px-4 border">Category</th>
              <th className="py-2 px-4 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredSubcategories.map((subcategory) => (
              <tr key={subcategory._id}>
                <td className="py-2 px-4 border text-center">{subcategory._id}</td>
                <td className="py-2 px-4 border text-center">{subcategory.name}</td>
                <td className="py-2 px-4 border text-center">
                  {categories.find((cat) => cat._id === subcategory.category)?.name || 'Unknown'}
                </td>
                <td className="py-2 px-4 border text-center">
                  <button
                    onClick={() => openEditModal(subcategory)}
                    className="bg-blue-500 text-white px-3 py-1 rounded-md mr-2 hover:bg-blue-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm('Are you sure you want to delete this subcategory?')) {
                        handleDeleteSubcategory(subcategory._id);
                      }
                    }}
                    className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-10">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
          <div className="bg-white p-4 rounded-md z-20">
            <h2 className="text-lg font-medium mb-4">Edit Subcategory</h2>
            <label htmlFor="editSubcategoryName" className="block text-sm font-medium text-gray-700 mb-1">Subcategory Name:</label>
            <input
              type="text"
              id="editSubcategoryName"
              value={newSubcategoryName}
              onChange={(e) => setNewSubcategoryName(e.target.value)}
              required
              className="mt-1 p-2 block w-full border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
            <label htmlFor="editCategorySelect" className="block text-sm font-medium text-gray-700 mt-3 mb-1">Category:</label>
            <select
              id="editCategorySelect"
              value={newSelectedCategory}
              onChange={(e) => setNewSelectedCategory(e.target.value)}
              required
              className="mt-1 p-2 block w-full border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="">Select a Category</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>{category.name}</option>
              ))}
            </select>
            <div className="mt-4 flex justify-end">
              <button
                onClick={handleEditSubcategory}
                className="bg-indigo-600 text-white px-4 py-2 rounded-md mr-2 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50"
              >
                Save Changes
              </button>
              <button
                onClick={closeEditModal}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {filterModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-10">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
          <div className="bg-white p-4 rounded-md z-20">
            <h2 className="text-lg font-medium mb-4">Filter Subcategories</h2>
            <label htmlFor="filterCategorySelect" className="block text-sm font-medium text-gray-700 mb-1">Category:</label>
            <select
              id="filterCategorySelect"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              required
              className="mt-1 p-2 block w-full border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="">Select a Category</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>{category.name}</option>
              ))}
            </select>
            <div className="mt-4 flex justify-end">
              <button
                onClick={handleFilter}
                className="bg-indigo-600 text-white px-4 py-2 rounded-md mr-2 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50"
              >
                Apply Filter
              </button>
              <button
                onClick={closeFilterModal}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Subcategory;
