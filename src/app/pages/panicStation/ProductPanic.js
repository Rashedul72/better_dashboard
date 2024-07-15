import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaTrashAlt, FaEdit, FaSortAlphaDown, FaSortAlphaUp, FaSortNumericDown, FaSortNumericUp } from 'react-icons/fa';
import Image from 'next/image';

const quantityTypes = [
  'Bottle', 'box', 'case', 'Centimeter', 'dozen', 'feet', 'gallon', 
  'gram', 'inch', 'km', 'kg', 'liter', 'Ounce', 'pack', 'pair', 
  'piece', 'pound', 'roll', 'set', 'strip', 'ton', 'Unit'
];

const PanicProducts = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setcategories] = useState([]);
  const [subcategories, setsubcategories] = useState([]);
  const [editProduct, setEditProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [newImages, setNewImages] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState({ column: 'date', order: 'desc' });
  const productsPerPage = 15;
  

  useEffect(() => {
    axios.get('https://better-server-blush.vercel.app/products')
      .then(response => {
        // Add a createdAt field with a default value if it doesn't exist
        const productsWithDate = response.data.map(product => ({
          ...product,
          createdAt: product.createdAt ? new Date(product.createdAt) : new Date(0) // Assigning Unix epoch time for products without createdAt
        }));
  
        // Sort the products by createdAt in descending order
        const sortedProducts = productsWithDate.sort((a, b) => b.createdAt - a.createdAt);
  
        setProducts(sortedProducts);
        setFilteredProducts(sortedProducts);
      })
      .catch(err => console.error('Error fetching products:', err));
  
    axios.get('https://better-server-blush.vercel.app/subcategories')
      .then(response => setsubcategories(response.data))
      .catch(err => console.error('Error fetching categories:', err));
  }, []);


  useEffect(() => {
    const fetchCategories = async () => {
        try {
            const response = await axios.get('https://better-server-blush.vercel.app/categories');
            setcategories(response.data);
        } catch (err) {
            console.error('Error fetching categories:', err);
            setError('Failed to fetch categories');
        }
    };

    fetchCategories();
}, []);


  const handleDelete = (productId) => {
    axios.delete(`https://better-server-blush.vercel.app/products/${productId}`)
      .then(() => {
        const updatedProducts = products.filter(product => product._id !== productId);
        setProducts(updatedProducts);
        setFilteredProducts(updatedProducts);
      })
      .catch(err => console.error('Error deleting product:', err));
  };

  const handleEditClick = (product) => {
    setEditProduct(product);
    setShowModal(true);
    setNewImages([]); // Clear new images on edit start
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditProduct({ ...editProduct, [name]: value });
  };

  const handleImageRemove = (index) => {
    const updatedImages = editProduct.images.filter((_, i) => i !== index);
    setEditProduct({ ...editProduct, images: updatedImages });
  };

  const handleImageChange = (e) => {
    setNewImages([...newImages, ...Array.from(e.target.files)]);
  };

  const handleEditSave = async () => {
    const { _id, ...updatedProduct } = editProduct;

    try {
      const imageUrls = [];

      for (let i = 0; i < newImages.length; i++) {
        const formData = new FormData();
        formData.append('image', newImages[i]);
        const response = await axios.post('https://api.imgbb.com/1/upload?key=709857af4158efc43859168f6daa2479', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        imageUrls.push(response.data.data.url);
      }

      updatedProduct.images = [...editProduct.images, ...imageUrls];

      await axios.patch(`https://better-server-blush.vercel.app/products/${_id}`, updatedProduct);

      const updatedProducts = products.map(product =>
        product._id === editProduct._id ? { ...product, ...updatedProduct } : product
      );
      setProducts(updatedProducts);
      setFilteredProducts(updatedProducts);
      setShowModal(false);
    } catch (error) {
      console.error('Error updating product:', error.response ? error.response.data : error.message);
    } finally {
      setNewImages([]); // Clear new images after save
    }
  };

  const handleSearchChange = (e) => {
    const term = e.target.value.toLowerCase().trim();
    setSearchTerm(term);
    const filtered = products.filter(product =>
      product.name.toLowerCase().includes(term) ||
      product.barcode.toLowerCase().includes(term) ||
      product.sku.toLowerCase().includes(term)
    );
    setFilteredProducts(filtered);
  };
  

  const handleCategoryFilterChange = (e) => {
    const subcategory = e.target.value;
    setCategoryFilter(subcategory);
    if (subcategory === '') {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(product => product.subcategory === subcategory);
      setFilteredProducts(filtered);
    }
  };


  const handleSort = (column) => {
    let newOrder = 'asc';
    if (sortOrder.column === column && sortOrder.order === 'asc') {
      newOrder = 'desc';
    }
  
    const sortedProducts = [...filteredProducts].sort((a, b) => {
      if (column === 'name') {
        return newOrder === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
      } else if (column === 'price') {
        return newOrder === 'asc' ? a.price - b.price : b.price - a.price;
      } else if (column === 'createdAt') {
        return newOrder === 'asc' ? new Date(a.createdAt) - new Date(b.createdAt) : new Date(b.createdAt) - new Date(a.createdAt);
      }
      return 0; // Default case to prevent errors
    });
  
    setFilteredProducts(sortedProducts);
    setSortOrder({ column, order: newOrder });
  };
  


  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToPage = (page) => {
    setCurrentPage(page);
  };

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  return (
    <div className="bg-white rounded-lg shadow-2xl p-6 border-10 border-black">
      <h1 className="text-4xl font-bold mb-4 text-center">Product Management</h1>
      <div className="flex justify-between mb-5">
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="input input-bordered w-1/3"
        />
        <select
          value={categoryFilter}
          onChange={handleCategoryFilterChange}
          className="select select-bordered w-1/3"
        >
          <option value="">All Subcategories</option>
          {subcategories.sort((a, b) => a.name.localeCompare(b.name)).map(category => (
            <option key={category._id} value={category.name}>{category.name}</option>
          ))}
        </select>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-max divide-y divide-black">
          <thead className="bg-blue-100 items-center">
            <tr>
              <th className="p-3 font-semibold text-sm uppercase text-gray-800">Index</th>
              <th className="p-3 font-semibold text-sm uppercase text-gray-800">Images</th>
              <th className="p-3 font-bold text-sm uppercase text-gray-800">
                Name
                <button onClick={() => handleSort('name')} className="ml-2">
                  {sortOrder.column === 'name' && sortOrder.order === 'asc' ? <FaSortAlphaDown /> : <FaSortAlphaUp />}
                </button>
              </th>
              <th className="p-3 font-bold text-sm uppercase text-gray-800">
                Price
                <button onClick={() => handleSort('price')} className="ml-2">
                  {sortOrder.column === 'price' && sortOrder.order === 'asc' ? <FaSortNumericDown /> : <FaSortNumericUp />}
                </button>
              </th>
              <th className="p-3 font-semibold text-sm uppercase text-gray-800">Price (W)</th>
              <th className="p-3 font-semibold text-sm uppercase text-gray-800">(W) Quantity</th>
              <th className="p-3 font-semibold text-sm uppercase text-gray-800">Barcode</th>
              <th className="p-3 font-semibold text-sm uppercase text-gray-800">Category</th>
              <th className="p-3 font-semibold text-sm uppercase text-gray-800">Subcategory</th>
              <th className="p-3 font-semibold text-sm uppercase text-gray-800">SKU</th>
              <th className="p-3 font-semibold text-sm uppercase text-gray-800">Stock</th>
              <th className="p-3 font-semibold text-sm uppercase text-gray-800">Cost per Unit</th>
              <th className="p-3 font-semibold text-sm uppercase text-gray-800">Store Price</th>
              <th className="p-3 font-semibold text-sm uppercase text-gray-800">Quantity Type</th>
             
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-black">
            {currentProducts.map((product, index) => (
              <tr key={product._id} className="hover:bg-gray-100">
                <td className="p-3 text-sm text-center text-gray-800">{index + 1 + indexOfFirstProduct}</td>
                <td className="p-3 text-sm text-center text-gray-800">
                  {product.images.map((image, index) => (
                    <Image key={index} src={image} alt={`Product ${index}`} width={40} height={40} className="object-cover inline-block mx-1"  />
                  ))}
                </td>
                <td className="p-3 text-sm text-center text-gray-800">{product.name}</td>
                <td className="p-3 text-sm text-center text-gray-800">৳ {product.price}</td>
                <td className="p-3 text-sm text-center text-gray-800">৳ {product.wholesalePrice}</td>
                <td className="p-3 text-sm text-center text-gray-800">{product.wholesaleQuantity}</td>
                <td className="p-3 text-sm text-center text-gray-800">{product.barcode}</td>
                <td className="p-3 text-sm text-center text-gray-800">{product.category}</td>
                <td className="p-3 text-sm text-center text-gray-800">{product.subcategory}</td>
                <td className="p-3 text-sm text-center text-gray-800">{product.sku}</td>
                <td className="p-3 text-sm text-center text-gray-800">{product.stock}</td>
                <td className="p-3 text-sm text-center text-gray-800">৳ {product.costPerUnit}</td>
                <td className="p-3 text-sm text-center text-gray-800">৳ {product.storePrice}</td>
                <td className="p-3 text-sm text-center text-gray-800">{product.quantityType}</td>
               
              
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex justify-center space-x-2">
        <button onClick={prevPage} className="btn btn-sm btn-outline" disabled={currentPage === 1}>Previous</button>
        {Array.from({ length: totalPages }, (_, i) => (
          <button key={i} onClick={() => goToPage(i + 1)} className={`btn btn-sm ${currentPage === i + 1 ? 'btn-primary' : 'btn-outline'}`}>
            {i + 1}
          </button>
        ))}
        <button onClick={nextPage} className="btn btn-sm btn-outline" disabled={currentPage === totalPages}>Next</button>
      </div>

      {showModal && (
        <div className="modal modal-open">
          <div className="modal-box w-11/12 max-w-5xl">
            <h3 className="font-bold text-lg">Edit Product</h3>
            <div className="form-control">
              <label className="label">Name</label>
              <input type="text" name="name" value={editProduct.name} onChange={handleEditChange} className="input input-bordered" />
            </div>
            <div className="form-control">
              <label className="label">Price</label>
              <input type="number" name="price" value={editProduct.price} onChange={handleEditChange} className="input input-bordered" />
            </div>
            <div className="form-control">
              <label className="label">Price (WholeSale)</label>
              <input type="number" name="wholesalePrice" value={editProduct.wholesalePrice} onChange={handleEditChange} className="input input-bordered" />
            </div>
            <div className="form-control">
              <label className="label">Quantity (WholeSale)</label>
              <input type="number" name="wholesaleQuantity" value={editProduct.wholesaleQuantity} onChange={handleEditChange} className="input input-bordered" />
            </div>

            <div className="form-control">
              <label className="label">Barcode</label>
              <input type="text" name="barcode" value={editProduct.barcode} onChange={handleEditChange} className="input input-bordered" />
            </div>




            <div>
              <label className="block font-medium">Category</label>
              <select
                name="category"
                value={editProduct.category}
                onChange={handleEditChange}
                className="select select-bordered w-full"
              >
                {categories.map(category => (
                  <option key={category._id} value={category.name}>{category.name}</option>
                ))}
              </select>
            </div>
            

            <div>
              <label className="block font-medium">Subcategory</label>
              <select
                name="subcategory"
                value={editProduct.subcategory}
                onChange={handleEditChange}
                className="select select-bordered w-full"
              >
                {subcategories.map(category => (
                  <option key={category._id} value={category.name}>{category.name}</option>
                ))}
              </select>
            </div>



            <div className="form-control">
              <label className="label">SKU</label>
              <input type="text" name="sku" value={editProduct.sku} onChange={handleEditChange} className="input input-bordered" />
            </div>
            <div className="form-control">
              <label className="label">Stock</label>
              <input type="number" name="stock" value={editProduct.stock} onChange={handleEditChange} className="input input-bordered" />
            </div>
            <div className="form-control">
              <label className="label">Cost per Unit</label>
              <input type="number" name="costPerUnit" value={editProduct.costPerUnit} onChange={handleEditChange} className="input input-bordered" />
            </div>


            <div>
              <label className="block font-medium">Store Price</label>
              <input
                type="number"
                name="storePrice"
                value={editProduct.storePrice}
                onChange={handleEditChange}
                className="input input-bordered w-full"
              />
            </div>


            <div className="form-control">
              <label className="label">Quantity Type</label>
              <select 
              name="quantityType" 
              value={editProduct.quantityType} 
              onChange={handleEditChange} 
              className="select select-bordered">
                {quantityTypes.map((type, index) => (
                  <option key={index} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div className="form-control">
              <label className="label">Pick</label>
                    <select 
                      name="Pick" 
                      value={editProduct.Pick} 
                      onChange={handleEditChange} 
                      className="select select-bordered"
                    >
                      <option value="On">On</option>
                      <option value="Off">Off</option>
                    </select>
            </div>




            <div>
              <label className="block font-medium">Short Description</label>
              <input
                type="text"
                name="shortDescription"
                value={editProduct.shortDescription}
                onChange={handleEditChange}
                className="input input-bordered w-full"
              />
            </div>

            <div>
              <label className="block font-medium">Description</label>
              <input
                type="text"
                name="description"
                value={editProduct.description}
                onChange={handleEditChange}
                className="input input-bordered w-full"
              />
            </div>

            <div className="form-control">
              <label className="label">Images</label>
              {editProduct.images.map((image, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Image src={image} alt={`Product ${index}`} width={20} height={20}  />
                  <button onClick={() => handleImageRemove(index)} className="btn btn-sm btn-danger"><FaTrashAlt /></button>
                </div>
              ))}
              <input type="file" multiple onChange={handleImageChange} className="file-input file-input-bordered" />
            </div>
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

export default PanicProducts;
