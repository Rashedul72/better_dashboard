"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Image from 'next/image';

const quantityTypes = [
  'Bottle', 'box', 'case', 'Centimeter', 'dozen', 'feet', 'gallon', 
  'gram', 'inch', 'km', 'kg', 'liter', 'Ounce', 'pack', 'pair', 
  'piece', 'pound', 'roll', 'set', 'strip', 'ton', 'Unit'
];

const InputProductsForm = () => {
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [wholesalePrice, setWholesalePrice] = useState('');
  const [wholesaleQuantity, setWholesaleQuantity] = useState('');
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubcategory, setSelectedSubcategory] = useState(''); // New state for subcategory
  const [filteredSubcategories, setFilteredSubcategories] = useState([]);
  const [sku, setSku] = useState('');
  const [barcode, setBarcode] = useState('');
  const [stock, setStock] = useState('');
  const [costPerUnit, setCostPerUnit] = useState('');
  const [storePrice, setStorePrice] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [description, setDescription] = useState('');
  const [expirationDate, setExpirationDate] = useState('');
  const [selectedQuantityType, setSelectedQuantityType] = useState('');
  const [selectedPick, setSelectedPick] = useState('Off'); // Default to 'Off'
  const [images, setImages] = useState([]);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchCategoriesAndSubcategories = async () => {
      try {
        const [categoriesResponse, subcategoriesResponse] = await Promise.all([
          axios.get('https://better-server-blush.vercel.app/categories'),
          axios.get('https://better-server-blush.vercel.app/subcategories')
        ]);
        setCategories(categoriesResponse.data);
        setSubcategories(subcategoriesResponse.data);
      } catch (err) {
        console.error('Error fetching categories and subcategories:', err);
      }
    };

    fetchCategoriesAndSubcategories();
  }, []);

  const handleCategoryChange = (e) => {
    const selectedCategoryId = e.target.value;
    setSelectedCategory(selectedCategoryId);
    const filtered = subcategories.filter(subcategory => subcategory.category === selectedCategoryId);
    setFilteredSubcategories(filtered);
    setSelectedSubcategory(''); // Reset subcategory when category changes
  };

  const handleSubcategoryChange = (e) => {
    setSelectedSubcategory(e.target.value);
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + images.length > 5) {
      setError('You can only upload up to 5 images.');
      e.target.value = ''; // Clear the file input
      return;
    }
    setImages([...images, ...files]);
    setError(null);
  };

  const handleRemoveImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Resolve category and subcategory names
      const selectedCategoryObject = categories.find(cat => cat._id === selectedCategory);
      const selectedSubcategoryObject = filteredSubcategories.find(subcat => subcat._id === selectedSubcategory);
  
      // Upload images to imgbb
      const imageUploadPromises = images.map(async (image) => {
        const formData = new FormData();
        formData.append('image', image);
        const response = await axios.post('https://api.imgbb.com/1/upload?key=709857af4158efc43859168f6daa2479', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        return response.data.data.url;
      });
  
      const imageUrls = await Promise.all(imageUploadPromises);
  
      // Prepare product data with image URLs and resolved names
      const productData = {
        name: productName,
        price: productPrice,
        wholesalePrice: wholesalePrice,
        wholesaleQuantity: wholesaleQuantity,
        category: selectedCategoryObject ? selectedCategoryObject.name : '', // Use category name
        subcategory: selectedSubcategoryObject ? selectedSubcategoryObject.name : '', // Use subcategory name
        sku: sku,
        barcode: barcode,
        stock: stock,
        costPerUnit: costPerUnit,
        storePrice: storePrice,
        shortDescription: shortDescription,
        description: description,
        expirationDate: expirationDate,
        quantityType: selectedQuantityType,
        Pick: selectedPick,
        images: imageUrls
      };
  
      // Send product data to backend
      const response = await axios.post('https://better-server-blush.vercel.app/addproducts', productData);
  
      setSuccessMessage('Product added successfully');
      setProductName('');
      setProductPrice('');
      setWholesalePrice('');
      setWholesaleQuantity('');
      setSelectedCategory('');
      setSelectedSubcategory(''); // Reset subcategory
      setSku('');
      setBarcode('');
      setStock('');
      setCostPerUnit('');
      setStorePrice('');
      setShortDescription('');
      setDescription('');
      setExpirationDate('');
      setSelectedQuantityType('');
      setSelectedPick('Off');
      setImages([]);
      setError(null);
    } catch (err) {
      console.error('Error adding product:', err);
      setError('Failed to add product');
      setSuccessMessage('');
    }
  };
  

  return (
    <div className="max-w-8xl mx-auto my-8 p-8 bg-white rounded-lg shadow-lg">
      <h1 className="text-4xl font-bold mb-4 text-center">New Product Form</h1>
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto my-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="mb-4">
          <label htmlFor="productName" className="block text-sm font-medium text-black">Product Name:</label>
          <input
            type="text"
            id="productName"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            required
            className="mt-1 p-2 block w-full border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="productPrice" className="block text-sm font-medium text-black">Product Price:</label>
          <input
            type="number"
            id="productPrice"
            value={productPrice}
            onChange={(e) => setProductPrice(e.target.value)}
            required
            className="mt-1 p-2 block w-full border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="wholesalePrice" className="block text-sm font-medium text-black">Wholesale Price:</label>
          <input
            type="number"
            id="wholesalePrice"
            value={wholesalePrice}
            onChange={(e) => setWholesalePrice(e.target.value)}
            required
            className="mt-1 p-2 block w-full border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="wholesaleQuantity" className="block text-sm font-medium text-black">Wholesale Quantity:</label>
          <p className="text-xs text-gray-500">No of items in 1 carton.</p>
          <input
            type="number"
            id="wholesaleQuantity"
            value={wholesaleQuantity}
            onChange={(e) => setWholesaleQuantity(e.target.value)}
            required
            className="mt-1 p-2 block w-full border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="category" className="block text-sm font-medium text-black">Category:</label>
          <select
            id="category"
            value={selectedCategory}
            onChange={handleCategoryChange}
            required
            className="mt-1 p-2 block w-full border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="">Select a Category</option>
            {categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label htmlFor="subcategory" className="block text-sm font-medium text-black">Subcategory :</label>
          <p className="text-xs text-gray-500">Please create a category, then subcategory first before selecting a subcategory.</p>
          <select
            id="subcategory"
            value={selectedSubcategory}
            onChange={handleSubcategoryChange}
            required
            className="mt-1 p-2 block w-full border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="">Select a Subcategory</option>
            {filteredSubcategories.map((subcategory) => (
              <option key={subcategory._id} value={subcategory._id}>
                {subcategory.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label htmlFor="sku" className="block text-sm font-medium text-black">SKU:</label>
          <input
            type="text"
            id="sku"
            value={sku}
            onChange={(e) => setSku(e.target.value)}
            required
            className="mt-1 p-2 block w-full border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="barcode" className="block text-sm font-medium text-black">Barcode:</label>
          <input
            type="text"
            id="barcode"
            value={barcode}
            onChange={(e) => setBarcode(e.target.value)}
            required
            className="mt-1 p-2 block w-full border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="stock" className="block text-sm font-medium text-black">Stock:</label>
          <input
            type="number"
            id="stock"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            required
            className="mt-1 p-2 block w-full border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="costPerUnit" className="block text-sm font-medium text-black">Cost Per Unit:</label>
          <input
            type="number"
            id="costPerUnit"
            value={costPerUnit}
            onChange={(e) => setCostPerUnit(e.target.value)}
            required
            className="mt-1 p-2 block w-full border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="storePrice" className="block text-sm font-medium text-black">Store Price:</label>
          <input
            type="number"
            id="storePrice"
            value={storePrice}
            onChange={(e) => setStorePrice(e.target.value)}
            required
            className="mt-1 p-2 block w-full border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="shortDescription" className="block text-sm font-medium text-black">Short Description:</label>
          <input
            type="text"
            id="shortDescription"
            value={shortDescription}
            onChange={(e) => setShortDescription(e.target.value)}
            required
            className="mt-1 p-2 block w-full border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="description" className="block text-sm font-medium text-black">Description:</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="mt-1 p-2 block w-full border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="expirationDate" className="block text-sm font-medium text-black">Expiration Date:</label>
          <input
            type="date"
            id="expirationDate"
            value={expirationDate}
            onChange={(e) => setExpirationDate(e.target.value)}
            required
            className="mt-1 p-2 block w-full border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="quantityType" className="block text-sm font-medium text-black">Quantity Type:</label>
          <select
            id="quantityType"
            value={selectedQuantityType}
            onChange={(e) => setSelectedQuantityType(e.target.value)}
            required
            className="mt-1 p-2 block w-full border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="">Select a Quantity Type</option>
            {quantityTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label htmlFor="pick" className="block text-sm font-medium text-black">Pick:</label>
          <select
            id="pick"
            value={selectedPick}
            onChange={(e) => setSelectedPick(e.target.value)}
            required
            className="mt-1 p-2 block w-full border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="On">On</option>
            <option value="Off">Off</option>
          </select>
        </div>

        <div className="mb-4 col-span-2">
          <label htmlFor="images" className="block text-sm font-medium text-black">Images:</label>
          <input
            type="file"
            id="images"
            multiple
            onChange={handleImageChange}
            accept="image/*"
            className="mt-1 p-2 block w-full border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
          {images.length > 0 && (
            <div className="mt-4">
              <h3 className="text-sm font-medium text-black">Selected Images:</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                {images.map((image, index) => (
                  <div key={index} className="relative">
                    <Image
                      src={URL.createObjectURL(image)}
                      alt={`Selected ${index + 1}`}
                      width={100}
                      height={100}
                      className="object-cover rounded-md"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                    >
                      X
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
          {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        </div>

        <div className="col-span-2 text-center">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-md shadow-md hover:bg-blue-600"
          >
            Add Product
          </button>
          {successMessage && <p className="text-green-500 mt-2">{successMessage}</p>}
        </div>
      </form>
    </div>
  );
};

export default InputProductsForm;
