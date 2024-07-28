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
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 text-center">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">Edit Subcategory</h3>
                    <div className="mt-2">
                      <label htmlFor="newSubcategoryName" className="block text-sm font-medium text-gray-700">New Subcategory Name:</label>
                      <input
                        type="text"
                        id="newSubcategoryName"
                        value={newSubcategoryName}
                        onChange={(e) => setNewSubcategoryName(e.target.value)}
                        required
                        className="mt-1 p-2 block w-full border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                      <label htmlFor="newCategorySelect" className="block text-sm font-medium text-gray-700">New Category:</label>
                      <select
                        id="newCategorySelect"
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
                    </div>
                  </div>
                </div>
              </div>
              {error && <p className="text-red-500">{error}</p>}
              {successMessage && <p className="text-green-500">{successMessage}</p>}
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  onClick={handleEditSubcategory}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Save
                </button>
                <button
                  onClick={closeEditModal}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {filterModalOpen && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 text-center">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">Filter Subcategories</h3>
                    <div className="mt-2">
                      <label htmlFor="filterCategory" className="block text-sm font-medium text-gray-700">Filter by Category:</label>
                      <select
                        id="filterCategory"
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value)}
                        className="mt-1 p-2 block w-full border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      >
                        <option value="">Select a Category</option>
                        {categories.map((category) => (
                          <option key={category._id} value={category._id}>{category.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              {error && <p className="text-red-500">{error}</p>}
              {successMessage && <p className="text-green-500">{successMessage}</p>}
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  onClick={handleFilter}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Apply
                </button>
                <button
                  onClick={closeFilterModal}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Subcategory;
