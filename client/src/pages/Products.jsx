import React, { useEffect, useState } from 'react';
import API from '../api';
import ProductCard from '../components/ProductCard';
import ProductLightbox from '../components/ProductLightbox';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import CustomDropdown from '../components/CustomDropdown';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(['All Products']);
  const [activeCategory, setActiveCategory] = useState('All Products');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = activeCategory !== 'All Products' && activeCategory !== 'All' ? { category: activeCategory } : {};
        const response = await API.getProducts(params);
        const nextProducts = response.data.data || [];
        setProducts(nextProducts);

        if (activeCategory === 'All Products' || activeCategory === 'All') {
          const nextCategories = [...new Set(nextProducts.map((product) => product.category).filter(Boolean))];
          setCategories(['All Products', ...nextCategories]);
        }
      } catch (err) {
        setError('Failed to fetch products. Please try reloading.');
        console.error('Error fetching products:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [activeCategory]);

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen">
      {/* 1. Header Section */}
      <section className="bg-slate-900 border-b border-slate-800 py-16 text-center relative overflow-hidden">
        <div className="absolute inset-0 industrial-grid opacity-15"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-display font-black text-3xl sm:text-5xl text-white tracking-tight">
            Our <span className="text-sky-400">Products</span>
          </h1>
          <p className="mt-4 text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Explore our stainless steel cabinets, trolleys, workstations, tables, and cleanroom equipment.
          </p>
        </div>
      </section>

      {/* 2. Products Grid Section */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 border-b border-slate-800 pb-6 flex justify-center">
          <div className="w-full max-w-sm">
            <CustomDropdown
              id="product-category"
              options={categories}
              value={activeCategory}
              onChange={(val) => setActiveCategory(val)}
              placeholder="Select Category"
            />
          </div>
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : error ? (
          <div className="text-center text-red-400 font-bold p-8 bg-red-500/10 border border-red-500/20 rounded-2xl max-w-xl mx-auto">
            {error}
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                onImageClick={() => setSelectedProduct(product)}
              />
            ))}
          </div>
        ) : (
          <EmptyState message="No Products Found" description="No products are currently available in this category." />
        )}
      </section>

      {selectedProduct && (
        <ProductLightbox product={selectedProduct} onClose={() => setSelectedProduct(null)} />
      )}
    </div>
  );
};

export default Products;
