import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Image from 'next/image';

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);
  const [categoryName, setCategoryName] = useState('');
  const [categoryImage, setCategoryImage] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editedCategory, setEditedCategory] = useState(null);
  const [categoryImagePreview, setCategoryImagePreview] = useState(null);
  const [editedCategoryImage, setEditedCategoryImage] = useState(null);
  const [editedCategoryImagePreview, setEditedCategoryImagePreview] = useState(null);

  // Function to fetch categories
  const fetchCategories = async () => {
    try {
      const response = await axios.get('https://better-server-test.vercel.app/categories');
      console.log('Fetched categories:', response.data);

      // Sort categories by updated_time or created_time
      const sortedCategories = response.data.sort((a, b) => {
        const timeA = new Date(a.updated_time || a.created_time);
        const timeB = new Date(b.updated_time || b.created_time);
        return timeB - timeA;
      });

      setCategories(sortedCategories);
      setError(null);
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError('Error fetching categories');
    }
  };

  // Function to add a category
  const handleAddCategory = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', categoryName);
    if (categoryImage) {
      formData.append('image', categoryImage);
    }

    try {
      const response = await axios.post('https://better-server-blush.vercel.app/addcategories', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Category added response:', response.data);
      
      // Update categories state
      setCategories([response.data.category, ...categories]);
      setSuccessMessage('Category added successfully');
      setCategoryName('');
      setCategoryImage(null);
      setError(null);
    } catch (err) {
      console.error('Error adding category:', err);
      setError('Error adding category');
      setSuccessMessage('');
    }
  };

  // Function to delete a category
  const handleDeleteCategory = async (id) => {
    try {
      const response = await axios.delete(`https://better-server-blush.vercel.app/categories/${id}`);
      console.log('Category deleted response:', response.data);

      if (response.status === 200) {
        // Update categories state
        const updatedCategories = categories.filter((category) => category._id !== id);
        setCategories(updatedCategories);
        setSuccessMessage('Category deleted successfully');
        setError(null);
      } else {
        setError('Failed to delete category');
      }
    } catch (err) {
      console.error('Error deleting category:', err);
      setError('Error deleting category');
    }
  };

  // Function to open edit modal
  const openEditModal = (category) => {
    setEditedCategory(category);
    setEditedCategoryImage(null);
    setEditedCategoryImagePreview(null);
    setModalOpen(true);
  };

  // Function to close edit modal
  const closeEditModal = () => {
    setModalOpen(false);
    setEditedCategory(null);
    setEditedCategoryImage(null);
    setEditedCategoryImagePreview(null);
  };

 // Function to handle save edit
const handleSaveEdit = async (e) => {
  e.preventDefault();

  try {
    const formData = new FormData();
    formData.append('name', editedCategory.name);

    if (editedCategoryImage) {
      // Upload new image to imgbb
      const imgbbFormData = new FormData();
      imgbbFormData.append('image', editedCategoryImage);

      const imgbbResponse = await axios.post('https://api.imgbb.com/1/upload?key=709857af4158efc43859168f6daa2479', imgbbFormData);
      const newImageUrl = imgbbResponse.data.data.url;
      formData.append('image', newImageUrl);

      // Update the editedCategory with new image URL
      setEditedCategory({ ...editedCategory, img: newImageUrl });
    }

    const response = await axios.patch(`https://better-server-blush.vercel.app/categories/${editedCategory._id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    console.log('Category updated response:', response.data);

    if (response.status === 200) {
      // Update categories state
      const updatedCategories = categories.map((cat) =>
        cat._id === editedCategory._id ? response.data.category : cat
      ).sort((a, b) => {
        const timeA = new Date(a.updated_time || a.created_time);
        const timeB = new Date(b.updated_time || b.created_time);
        return timeB - timeA;
      });
      setCategories(updatedCategories);
      setSuccessMessage('Category updated successfully');
      closeEditModal();
    } else {
      setError('Failed to update category');
    }
  } catch (err) {
    console.error('Error updating category:', err);
    setError('Error updating category');
  }
};



  // Handle image change for add category
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setCategoryImage(file);
    setCategoryImagePreview(URL.createObjectURL(file));
  };

  // Handle image change for edit category
  const handleEditedImageChange = (e) => {
    const file = e.target.files[0];
    setEditedCategoryImage(file);
    setEditedCategoryImagePreview(URL.createObjectURL(file));
  };

  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className="max-w-8xl mx-auto my-8 p-8 bg-white rounded-lg">
      <h1 className="text-4xl font-bold mb-4 text-center">Category Management</h1>
      <form onSubmit={handleAddCategory} className="max-w-sm mx-auto my-8 space-y-4">
        <div>
          <label htmlFor="categoryName" className="block text-sm font-medium text-gray-700">Category Name:</label>
          <input
            type="text"
            id="categoryName"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            required
            className="input input-bordered w-full"
          />
        </div>
        <div>
          <label htmlFor="categoryImage" className="block text-sm font-medium text-gray-700">Category Image:</label>
          <input
            type="file"
            id="categoryImage"
            onChange={handleImageChange}
            className="file-input file-input-bordered w-full"
          />
        </div>
        {categoryImagePreview && (
          <div>
            <img src={categoryImagePreview} alt="Category Preview" className="w-32 h-32 object-cover"/>
          </div>
        )}
        {error && <p className="text-red-500">{error}</p>}
        {successMessage && <p className="text-green-500">{successMessage}</p>}
        <button type="submit" className="btn btn-primary w-full">Add Category</button>
      </form>

      <div className="overflow-x-auto">
        {categories.length === 0 ? (
          <p>Loading categories...</p>
        ) : (
          <table className="table w-full">
            <thead>
              <tr>
                <th className="p-3 text-sm text-center">Row</th>
                <th className="p-3 text-sm text-center">ID</th>
                <th className="p-3 text-sm text-center">Name</th>
                <th className="p-3 text-sm text-center">Image</th>
                <th className="p-3 text-sm text-center">Created At</th>
                <th className="p-3 text-sm text-center">Updated At</th>
                <th className="p-3 text-sm text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category, index) => (
                category && category._id && (
                  <tr key={category._id}>
                    <td className="p-3 text-sm text-center text-gray-800">{index + 1}</td>
                    <td className="p-3 text-sm text-center">{category._id}</td>
                    <td className="p-3 text-sm text-center">{category.name}</td>
                    <td className="p-3 text-sm text-center">
                      {category.img && (
                        <Image
                          src={category.img}
                          alt={category.name}
                          width={100}
                          height={100}
                          className="w-12 h-12 object-cover"
                        />
                      )}
                    </td>
                    <td className="p-3 text-sm text-center">{new Date(category.created_time).toLocaleString()}</td>
                    <td className="p-3 text-sm text-center">
                      {category.updated_time ? new Date(category.updated_time).toLocaleString() : 'N/A'}
                    </td>
                    <td>
                      <button onClick={() => openEditModal(category)} className="btn btn-info btn-sm mr-2">Edit</button>
                      <button onClick={() => handleDeleteCategory(category._id)} className="btn btn-error btn-sm">Delete</button>
                    </td>
                  </tr>
                )
              ))}
            </tbody>
          </table>
        )}
      </div>

      {modalOpen && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h2 className="text-xl font-bold mb-4">Edit Category</h2>
            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <label htmlFor="editCategoryName" className="block text-sm font-medium text-gray-700">Category Name:</label>
                <input
                  type="text"
                  id="editCategoryName"
                  value={editedCategory.name}
                  onChange={(e) => setEditedCategory({ ...editedCategory, name: e.target.value })}
                  required
                  className="input input-bordered w-full"
                />
              </div>
              <div>
                <label htmlFor="editCategoryImage" className="block text-sm font-medium text-gray-700">Category Image:</label>
                <input
                  type="file"
                  id="editCategoryImage"
                  onChange={handleEditedImageChange}
                  className="file-input file-input-bordered w-full"
                />
              </div>
              {editedCategoryImagePreview ? (
                <div>
                  <img src={editedCategoryImagePreview} alt="Edited Category Preview" className="w-32 h-32 object-cover"/>
                </div>
              ) : (
                editedCategory.img && (
                  <div>
                    <img src={editedCategory.img} alt="Current Category" className="w-32 h-32 object-cover"/>
                  </div>
                )
              )}
              {error && <p className="text-red-500">{error}</p>}
              {successMessage && <p className="text-green-500">{successMessage}</p>}
              <div className="modal-action">
                <button type="button" onClick={closeEditModal} className="btn">Cancel</button>
                <button type="submit" className="btn btn-primary">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryManagement;
