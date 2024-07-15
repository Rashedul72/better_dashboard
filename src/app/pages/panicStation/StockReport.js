import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaTrashAlt, FaEdit } from 'react-icons/fa';

const ProductPanic = () => {
  const [products, setProducts] = useState([]);
  const [editProduct, setEditProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [newImage, setNewImage] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [entries, setEntries] = useState(10);

  useEffect(() => {
    axios.get('http://localhost:500/products')
      .then(response => setProducts(response.data))
      .catch(err => console.error('Error fetching products:', err));
  }, []);

  const handleDelete = (productId) => {
    axios.delete(`http://localhost:500/products/${productId}`)
      .then(() => setProducts(products.filter(product => product._id !== productId)))
      .catch(err => console.error('Error deleting product:', err));
  };

  const handleEditClick = (product) => {
    setEditProduct(product);
    setShowModal(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditProduct({ ...editProduct, [name]: value });
  };

  const handleImageChange = (e) => {
    setNewImage(e.target.files[0]);
  };

  const handleEditSave = () => {
    const formData = new FormData();
    formData.append('name', editProduct.name);
    formData.append('price', editProduct.price);
    if (newImage) {
      formData.append('image', newImage);
    }

    axios.put(`http://localhost:500/products/${editProduct._id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    .then(response => {
      setProducts(products.map(product => (product._id === editProduct._id ? response.data : product)));
      setShowModal(false);
    })
    .catch(err => console.error('Error updating product:', err));
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  ).slice(0, entries);

  return (
    <div className="product-panic-container p-4 bg-blue-100 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-center text-blue-800">Products</h2>

      <div className="flex justify-between mb-4">
        <div className="flex items-center">
          <span className="mr-2">Show</span>
          <select
            value={entries}
            onChange={(e) => setEntries(Number(e.target.value))}
            className="px-4 py-2 rounded-lg border focus:outline-none focus:border-blue-500"
          >
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
          <span className="ml-2">Products</span>
        </div>

        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:border-blue-500"
            placeholder="Search products..."
          />
          <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-500 text-white px-4 py-2 rounded-lg">
            Search
          </button>
        </div>
      </div>

      <table className="w-full border-collapse border border-black bg-white">
        <thead>
          <tr>
            <th className="p-3 font-semibold uppercase bg-gray-100 border border-black">Images</th>
            <th className="p-3 font-semibold uppercase bg-gray-100 border border-black">Name</th>
            <th className="p-3 font-semibold uppercase bg-gray-100 border border-black">Price</th>
            <th className="p-3 font-semibold uppercase bg-gray-100 border border-black">Category</th>
            <th className="p-3 font-semibold uppercase bg-gray-100 border border-black">Stock</th>
            <th className="p-3 font-semibold uppercase bg-gray-100 border border-black">Cost per Unit</th>
            <th className="p-3 font-semibold uppercase bg-gray-100 border border-black">Store Price</th>
            <th className="p-3 font-semibold uppercase bg-gray-100 border border-black">Expiration Date</th>
            <th className="p-3 font-semibold uppercase bg-gray-100 border border-black">Quantity Type</th>
            <th className="p-3 font-semibold uppercase bg-gray-100 border border-black">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredProducts.map(product => (
            <tr key={product._id} className="border-t border-black">
              <td className="p-3 border border-black">
                {product.images && product.images.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {product.images.map((image, index) => (
                      <img
                        key={index}
                        src={`data:image/jpeg;base64,${image.img}`}
                        alt={product.name}
                        className="w-20 object-cover"
                      />
                    ))}
                  </div>
                ) : (
                  'No Images'
                )}
              </td>
              <td className="p-3 border border-black">{product.name}</td>
              <td className="p-3 border border-black">৳{product.price}</td>
              <td className="p-3 border border-black">{product.category}</td>
              <td className="p-3 border border-black">{product.stock}</td>
              <td className="p-3 border border-black">৳{product.costPerUnit}</td>
              <td className="p-3 border border-black">৳{product.storePrice}</td>
              <td className="p-3 border border-black">{product.expirationDate}</td>
              <td className="p-3 border border-black">{product.quantityType}</td>
              <td className="p-3 border border-black">
                <button onClick={() => handleEditClick(product)} className="text-blue-500 hover:text-blue-700 mr-2">
                  <FaEdit />
                </button>
                <button onClick={() => handleDelete(product._id)} className="text-red-500 hover:text-red-700">
                  <FaTrashAlt />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h2 className="font-bold text-lg">Edit Product</h2>
            <label className="block mt-4">
              <span className="text-gray-700">Name</span>
              <input 
                type="text" 
                name="name" 
                value={editProduct.name} 
                onChange={handleEditChange} 
                className="input input-bordered w-full mt-1" 
              />
            </label>
            <label className="block mt-4">
              <span className="text-gray-700">Price</span>
              <input 
                type="number" 
                name="price" 
                value={editProduct.price} 
                onChange={handleEditChange} 
                className="input input-bordered w-full mt-1" 
              />
            </label>
            <label className="block mt-4">
              <span className="text-gray-700">Image</span>
              <input 
                type="file" 
                name="image" 
                onChange={handleImageChange} 
                className="input input-bordered w-full mt-1" 
              />
            </label>
            <div className="modal-action">
              <button onClick={handleEditSave} className="btn btn-primary">Save</button>
              <button onClick={() => setShowModal(false)} className="btn">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductPanic;
