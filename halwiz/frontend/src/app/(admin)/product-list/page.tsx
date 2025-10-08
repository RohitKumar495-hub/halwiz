    'use client'
    import React, { useState, ChangeEvent, FormEvent, useEffect, useRef } from 'react';
    import { IoSearchOutline } from "react-icons/io5";
    import { FaPlus } from "react-icons/fa6";
    import { FaRegEdit } from "react-icons/fa";
    import { MdDelete } from "react-icons/md";
    import { RxCross2 } from "react-icons/rx";
    import AdminGuard from '../components/AdminGuard';
    import axios from "axios";
    import { ToastContainer, toast } from 'react-toastify';
    import 'react-toastify/dist/ReactToastify.css';
    import BASE_URL from "@/config/axios";

    const axiosInstance = axios.create({ baseURL: BASE_URL });

    interface Product {
    _id: string;
    name: string;
    status: string;
    originalPrice: number;
    discountPrice: number;
    discountPercent: number;
    stock: number;
    description: string;
    category: string;
    images: string[];
    }

    interface FormDataType {
    name: string;
    quantity: string;
    price: string;
    discountPercent: string;
    description: string;
    category: string;
    newImages: File[];
    existingImages: string[];
    }

    interface DeleteModalProps {
    productId: string;
    productName: string;
    onClose: () => void;
    onDelete: (id: string) => void;
    }

    const DeleteModal: React.FC<DeleteModalProps> = ({ productId, productName, onClose, onDelete }) => (
    <div className="fixed inset-0 bg-black/70 grid place-items-center z-50">
        <div className="w-full max-w-sm bg-white p-4 rounded-md shadow grid gap-4">
        <h2 className="text-lg font-medium text-center">
            Are you sure you want to delete <span className="font-semibold">{productName}</span>?
        </h2>
        <div className="flex justify-center gap-4">
            <button
            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
            onClick={() => onDelete(productId)}
            >
            Confirm
            </button>
            <button
            className="bg-gray-300 px-4 py-2 rounded-md hover:bg-gray-400"
            onClick={onClose}
            >
            Cancel
            </button>
        </div>
        </div>
    </div>
    );

    const ProductListPage: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [openModal, setOpenModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [formData, setFormData] = useState<FormDataType>({
        name: "",
        quantity: "",
        price: "",
        discountPercent: "0",
        description: "",
        category: "",
        newImages: [],
        existingImages: []
    });
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [productToDelete, setProductToDelete] = useState<{ id: string; name: string } | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const fetchProducts = async () => {
        try {
        const token = localStorage.getItem("authToken");
        const res = await axiosInstance.get('/auth/get-product', {
            headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data.success) {
            const mappedProducts: Product[] = res.data.products.map((p: any) => ({
            _id: p._id,
            name: p.name,
            status: p.status || "active",
            originalPrice: p.originalPrice,
            discountPrice: p.discountPrice,
            discountPercent: p.discountPercent,
            stock: p.quantity,
            description: p.description,
            category: p.category || "",
            images: p.images || []
            }));
            setProducts(mappedProducts);
        }
        } catch (err: any) {
        toast.error(err.response?.data?.message || "Failed to fetch products");
        }
    };

    useEffect(() => { fetchProducts(); }, []);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
        setFormData({ ...formData, newImages: [...formData.newImages, ...Array.from(e.target.files)] });
        if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    const removeNewImage = (index: number) => {
        const updated = formData.newImages.filter((_, i) => i !== index);
        setFormData({ ...formData, newImages: updated });
    };

    const removeExistingImage = (url: string) => {
        setFormData({
        ...formData,
        existingImages: formData.existingImages.filter(img => img !== url)
        });
    };

    const handleEditClick = (product: Product) => {
        setSelectedProduct(product);
        setFormData({
        name: product.name,
        quantity: String(product.stock),
        price: String(product.originalPrice),
        discountPercent: String(product.discountPercent),
        description: product.description,
        category: product.category,
        newImages: [],
        existingImages: product.images
        });
        setOpenModal(true);
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const token = localStorage.getItem("authToken");
        if (!token) return toast.error("❌ You are not logged in!");
        const isAdmin = localStorage.getItem("isAdmin") === "true";
        if (!isAdmin) return toast.error("❌ Only admins can add/edit products!");

        try {
        const data = new FormData();
        if (selectedProduct) data.append("_id", selectedProduct._id);
        data.append("name", formData.name);
        data.append("quantity", formData.quantity);
        data.append("originalPrice", formData.price);
        data.append("discountPercent", formData.discountPercent || "0");
        data.append("description", formData.description);
        data.append("category", formData.category);

        // Append new images
        formData.newImages.forEach(file => data.append("images", file));

        // Send existing images that are not deleted
        data.append("existingImages", JSON.stringify(formData.existingImages));

        const url = selectedProduct ? "/auth/update-product" : "/auth/add-product";
        const method = selectedProduct ? axiosInstance.put : axiosInstance.post;

        const res = await method(url, data, {
            headers: { "Content-Type": "multipart/form-data", Authorization: `Bearer ${token}` },
        });

        if (res.data.success) {
            toast.success(selectedProduct ? "Product updated successfully!" : "Product added successfully!");
            setOpenModal(false);
            setSelectedProduct(null);
            setFormData({ name: "", quantity: "", price: "", discountPercent: "0", description: "", category: "", newImages: [], existingImages: [] });
            fetchProducts();
        }
        } catch (err: any) {
        toast.error(err.response?.data?.message || "Failed to add/update product");
        }
    };

    const handleDeleteClick = (id: string, name: string) => {
        setProductToDelete({ id, name });
        setDeleteModalOpen(true);
    };

    const handleConfirmDelete = async (id: string) => {
        try {
        const token = localStorage.getItem("authToken");
        const res = await axiosInstance.post('/auth/delete-product', { id }, {
            headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data.success) {
            toast.success("Product deleted successfully!");
            setDeleteModalOpen(false);
            setProductToDelete(null);
            fetchProducts();
        }
        } catch (err: any) {
        toast.error(err.response?.data?.message || "Failed to delete product");
        }
    };

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (statusFilter === "all" || product.status === statusFilter)
    );

    return (
        <AdminGuard>
        <div className='p-4 grid gap-8'>
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar />

            {/* Top Bar */}
            <div className='bg-white p-2 flex flex-col lg:flex-row justify-between lg:items-center gap-4'>
            <div className='rounded-md flex flex-col lg:flex-row lg:gap-10 gap-4'>
                <div className='border border-gray-300 flex items-center p-1 gap-4 lg:w-xs rounded-md'>
                <IoSearchOutline size={20} className='text-gray-300' />
                <input type="text" placeholder='Search products...' value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className='rounded outline-none'/>
                </div>
                <div>
                <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className='border border-gray-300 p-1 outline-none rounded-md'>
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="in-active">In Active</option>
                    <option value="pending">Pending</option>
                </select>
                </div>
            </div>
            <div className='bg-[#f5a70c] w-fit p-2 flex gap-2 text-white items-center font-semibold cursor-pointer rounded-md hover:bg-amber-600' onClick={() => { setSelectedProduct(null); setOpenModal(true); }}>
                <FaPlus size={20} /><button className='cursor-pointer'>Add Product</button>
            </div>
            </div>

            {/* Products Grid */}
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6'>
            {filteredProducts.length > 0 ? filteredProducts.map(product => (
                <div key={product._id} className='w-xs p-2 border border-gray-300 rounded-md grid gap-3'>
                <div className='flex gap-1 overflow-x-auto'>
                    {product.images.map((img, idx) => (
                    <img key={idx} src={img} alt={product.name} className='w-24 h-24 object-cover rounded-md'/>
                    ))}
                </div>
                <div className='grid gap-2'>
                    <div className='flex justify-between'>
                    <h1 className='text-lg font-medium'>{product.name}</h1>
                    <div className='w-fit p-1 bg-gray-200 rounded-3xl px-2 py-1'>
                        <p className='capitalize'>{product.status}</p>
                    </div>
                    </div>
                    <p className='text-gray-500 text-sm line-clamp-2'>{product.description}</p>
                    <p className='text-gray-400 text-sm'>Category: {product.category}</p>
                    <div className='flex justify-between items-center'>
                    <div className='flex flex-col'>
                        {product.discountPercent > 0 && (
                        <p className='text-gray-500 text-sm line-through'>₹{product.originalPrice}</p>
                        )}
                        <p className='font-semibold text-2xl text-green-600'>
                        ₹{product.discountPrice}
                        </p>
                        {product.discountPercent > 0 && (
                        <p className='text-red-500 text-sm'>-{product.discountPercent}%</p>
                        )}
                    </div>
                    <p>Stock : {product.stock}</p>
                    </div>
                    <div className='flex items-center justify-between'>
                    <div className='bg-[#f5a70c] w-fit p-2 flex gap-2 text-white items-center font-semibold cursor-pointer rounded-md hover:bg-amber-600'
                        onClick={() => handleEditClick(product)}>
                        <FaRegEdit size={20} /><button className='cursor-pointer'>Edit Product</button>
                    </div>
                    <div className='cursor-pointer hover:bg-red-200 w-fit p-1 rounded flex items-center'
                        onClick={() => handleDeleteClick(product._id, product.name)}>
                        <MdDelete size={25}/>
                    </div>
                    </div>
                </div>
                </div>
            )) : <p className='col-span-3 text-center text-gray-500'>No products found</p>}
            </div>

            {/* Add/Edit Product Modal */}
            {openModal && (
            <div className="fixed inset-0 bg-black/70 grid place-items-center z-50">
                <div className="w-full max-w-md bg-white p-4 rounded-md shadow grid gap-4">
                <div className='flex justify-between items-center'>
                    <h1 className='text-lg font-medium'>{selectedProduct ? "Update Product" : "Add Product"}</h1>
                    <button className='cursor-pointer hover:text-red-500' onClick={() => { setOpenModal(false); setSelectedProduct(null); }}>
                    <RxCross2 size={20}/>
                    </button>
                </div>

                <form className='grid gap-4' onSubmit={handleSubmit}>
                    {/* Existing Images Preview */}
                    {formData.existingImages.length > 0 && (
                    <div className='flex gap-2 overflow-x-auto'>
                        {formData.existingImages.map((url, idx) => (
                        <div key={idx} className='relative w-20 h-20 border rounded-md overflow-hidden'>
                            <img src={url} alt="Existing" className='w-full h-full object-cover'/>
                            <button type="button" className='absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 hover:bg-red-700' onClick={() => removeExistingImage(url)}>
                            <RxCross2 size={12}/>
                            </button>
                        </div>
                        ))}
                    </div>
                    )}

                    {/* New Images Preview */}
                    {formData.newImages.length > 0 && (
                    <div className='flex gap-2 overflow-x-auto'>
                        {formData.newImages.map((file, idx) => (
                        <div key={idx} className='relative w-20 h-20 border rounded-md overflow-hidden'>
                            <img src={URL.createObjectURL(file)} alt="Preview" className='w-full h-full object-cover'/>
                            <button type="button" className='absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 hover:bg-red-700' onClick={() => removeNewImage(idx)}>
                            <RxCross2 size={12}/>
                            </button>
                        </div>
                        ))}
                    </div>
                    )}

                    <input type="file" name="image" accept="image/*" multiple onChange={handleFileChange} className='border p-1 rounded w-full' ref={fileInputRef}/>
                    <input type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder='Product Name' className='border p-1 rounded w-full'/>
                    <input type="number" name="quantity" value={formData.quantity} onChange={handleInputChange} placeholder='Product Quantity' className='border p-1 rounded w-full'/>
                    <input type="number" name="price" value={formData.price} onChange={handleInputChange} placeholder='Product Price' className='border p-1 rounded w-full'/>
                    <input type="number" name="discountPercent" value={formData.discountPercent} onChange={handleInputChange} placeholder='Discount %' min={0} max={100} className='border p-1 rounded w-full'/>
                    <input type="text" name="description" value={formData.description} onChange={handleInputChange} placeholder='Product Description' className='border p-1 rounded w-full'/>
                    <input type="text" name="category" value={formData.category} onChange={handleInputChange} placeholder='Product Category' className='border p-1 rounded w-full'/>

                    <button type="submit" className='bg-[#f5a70c] w-fit px-4 py-2 flex gap-2 text-white items-center font-semibold cursor-pointer rounded-md hover:bg-amber-600'>
                    <FaPlus size={20}/> {selectedProduct ? "Update Product" : "Add Product"}
                    </button>
                </form>
                </div>
            </div>
            )}

            {/* Delete Modal */}
            {deleteModalOpen && productToDelete && (
            <DeleteModal
                productId={productToDelete.id}
                productName={productToDelete.name}
                onClose={() => setDeleteModalOpen(false)}
                onDelete={handleConfirmDelete}
            />
            )}
        </div>
        </AdminGuard>
    );
    };

    export default ProductListPage;
