import React, { useState, useEffect } from 'react';
import { Shield, Lock, Users, Database, LogOut, Plus, Trash2, Edit, AlertCircle, CheckCircle, Loader } from 'lucide-react';

// API Configuration
const API_BASE_URL = 'http://localhost:5000/api/v1';

// API Service
const api = {
  // Auth endpoints
  async register(username, email, password) {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password, role: 'user' })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Registration failed');
    return data;
  },

  async login(username, password) {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Login failed');
    return data;
  },

  async getMe(token) {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to get user');
    return data;
  },

  // Product endpoints
  async getProducts(token) {
    const response = await fetch(`${API_BASE_URL}/products`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to fetch products');
    return data;
  },

  async createProduct(token, product) {
    const response = await fetch(`${API_BASE_URL}/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(product)
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to create product');
    return data;
  },

  async updateProduct(token, id, product) {
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(product)
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to update product');
    return data;
  },

  async deleteProduct(token, id) {
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to delete product');
    return data;
  },

  // User endpoints (admin only)
  async getUsers(token) {
    const response = await fetch(`${API_BASE_URL}/users`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to fetch users');
    return data;
  }
};

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(null);
  const [view, setView] = useState('login');
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  // Forms
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [registerForm, setRegisterForm] = useState({ username: '', password: '', email: '' });
  const [productForm, setProductForm] = useState({ name: '', price: '', description: '', stock: '', category: '' });
  const [editingProduct, setEditingProduct] = useState(null);

  // Load user data when token exists
  useEffect(() => {
    if (token) {
      loadUserData();
    }
  }, [token]);

  // Load products and users when user is set
  useEffect(() => {
    if (user && token) {
      loadProducts();
      if (user.role === 'admin') {
        loadUsers();
      }
    }
  }, [user, token]);

  const loadUserData = async () => {
    try {
      const response = await api.getMe(token);
      setUser(response.data);
    } catch (err) {
      console.error('Failed to load user:', err);
      handleLogout();
    }
  };

  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await api.getProducts(token);
      setProducts(response.data || []);
    } catch (err) {
      showMessage(err.message, true);
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async () => {
    try {
      const response = await api.getUsers(token);
      setUsers(response.data || []);
    } catch (err) {
      console.error('Failed to load users:', err);
    }
  };

  const showMessage = (msg, isError = false) => {
    if (isError) {
      setError(msg);
      setSuccess('');
    } else {
      setSuccess(msg);
      setError('');
    }
    setTimeout(() => {
      setError('');
      setSuccess('');
    }, 5000);
  };

const handleLogin = async (e) => {
  e.preventDefault();
  setLoading(true);
  
  // ADD THIS DEBUG
  console.log('Frontend sending:', {
    username: loginForm.username,
    password: loginForm.password
  });
  
  try {
    const response = await api.login(loginForm.username, loginForm.password);
    // ... rest of code
      setToken(response.token);
      localStorage.setItem('token', response.token);
      setUser(response.user);
      setView('dashboard');
      showMessage(`Welcome back, ${response.user.username}!`);
      setLoginForm({ username: '', password: '' });
    } catch (err) {
      showMessage(err.message, true);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.register(
        registerForm.username,
        registerForm.email,
        registerForm.password
      );
      setToken(response.token);
      localStorage.setItem('token', response.token);
      setUser(response.user);
      setView('dashboard');
      showMessage('Registration successful! Welcome!');
      setRegisterForm({ username: '', password: '', email: '' });
    } catch (err) {
      showMessage(err.message, true);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.createProduct(token, {
        name: productForm.name,
        price: parseFloat(productForm.price),
        description: productForm.description,
        stock: parseInt(productForm.stock) || 0,
        category: productForm.category
      });
      setProductForm({ name: '', price: '', description: '', stock: '', category: '' });
      await loadProducts();
      showMessage('Product created successfully!');
    } catch (err) {
      showMessage(err.message, true);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.updateProduct(token, editingProduct.id, {
        name: productForm.name,
        price: parseFloat(productForm.price),
        description: productForm.description,
        stock: parseInt(productForm.stock) || 0,
        category: productForm.category
      });
      setEditingProduct(null);
      setProductForm({ name: '', price: '', description: '', stock: '', category: '' });
      await loadProducts();
      showMessage('Product updated successfully!');
    } catch (err) {
      showMessage(err.message, true);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    
    setLoading(true);
    try {
      await api.deleteProduct(token, id);
      await loadProducts();
      showMessage('Product deleted successfully!');
    } catch (err) {
      showMessage(err.message, true);
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      price: product.price,
      description: product.description || '',
      stock: product.stock || 0,
      category: product.category || ''
    });
  };

  const cancelEdit = () => {
    setEditingProduct(null);
    setProductForm({ name: '', price: '', description: '', stock: '', category: '' });
  };

  const handleLogout = () => {
    setToken(null);
    setUser(null);
    setView('login');
    setProducts([]);
    setUsers([]);
    localStorage.removeItem('token');
    showMessage('Logged out successfully');
  };

  if (!token || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
          <div className="flex items-center justify-center mb-6">
            <Shield className="w-12 h-12 text-indigo-600" />
          </div>
          <h1 className="text-3xl font-bold text-center mb-2 text-gray-800">RBAC System</h1>
          <p className="text-center text-gray-600 mb-6">Secure API with JWT Authentication</p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4 flex items-start gap-2">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4 flex items-start gap-2">
              <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <span>{success}</span>
            </div>
          )}

          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setView('login')}
              className={`flex-1 py-2 rounded transition ${view === 'login' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
            >
              Login
            </button>
            <button
              onClick={() => setView('register')}
              className={`flex-1 py-2 rounded transition ${view === 'register' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
            >
              Register
            </button>
          </div>

          {view === 'login' ? (
            <div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2 font-medium">Username</label>
                <input
                  type="text"
                  value={loginForm.username}
                  onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                  onKeyPress={(e) => e.key === 'Enter' && handleLogin(e)}
                  className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  disabled={loading}
                />
              </div>
              <div className="mb-6">
                <label className="block text-gray-700 mb-2 font-medium">Password</label>
                <input
                  type="password"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                  onKeyPress={(e) => e.key === 'Enter' && handleLogin(e)}
                  className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  disabled={loading}
                />
              </div>
              <button
                onClick={handleLogin}
                disabled={loading}
                className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? <Loader className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </div>
          ) : (
            <div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2 font-medium">Username</label>
                <input
                  type="text"
                  value={registerForm.username}
                  onChange={(e) => setRegisterForm({ ...registerForm, username: e.target.value })}
                  className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  disabled={loading}
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2 font-medium">Email</label>
                <input
                  type="email"
                  value={registerForm.email}
                  onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                  className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  disabled={loading}
                />
              </div>
              <div className="mb-6">
                <label className="block text-gray-700 mb-2 font-medium">Password</label>
                <input
                  type="password"
                  value={registerForm.password}
                  onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                  className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  disabled={loading}
                />
                <p className="text-xs text-gray-500 mt-1">Must contain uppercase, lowercase, and number</p>
              </div>
              <button
                onClick={handleRegister}
                disabled={loading}
                className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? <Loader className="w-4 h-4 animate-spin" /> : null}
                {loading ? 'Registering...' : 'Register'}
              </button>
            </div>
          )}

          <div className="mt-6 p-4 bg-blue-50 rounded text-sm border border-blue-200">
            <p className="font-semibold mb-2 text-blue-900">💡 Backend Connection</p>
            <p className="text-blue-700">Make sure your backend is running on:</p>
            <code className="block mt-1 text-xs bg-blue-100 p-2 rounded">http://localhost:5000</code>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-indigo-600 text-white p-4 shadow-lg">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Shield className="w-6 h-6" />
            <h1 className="text-xl font-bold">Product Management Dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="bg-indigo-700 px-3 py-1 rounded text-sm">
              {user.username} ({user.role})
            </span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-indigo-700 px-4 py-2 rounded hover:bg-indigo-800 transition"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto p-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4 flex items-start gap-2">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4 flex items-start gap-2">
            <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <span>{success}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center gap-3 mb-2">
              <Database className="w-8 h-8 text-blue-600" />
              <h3 className="text-lg font-semibold">Products</h3>
            </div>
            <p className="text-3xl font-bold text-gray-800">{products.length}</p>
            <p className="text-sm text-gray-600">Total products</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center gap-3 mb-2">
              <Shield className="w-8 h-8 text-green-600" />
              <h3 className="text-lg font-semibold">Your Role</h3>
            </div>
            <p className="text-3xl font-bold text-gray-800 capitalize">{user.role}</p>
            <p className="text-sm text-gray-600">Access level</p>
          </div>

          {user.role === 'admin' && (
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center gap-3 mb-2">
                <Users className="w-8 h-8 text-purple-600" />
                <h3 className="text-lg font-semibold">Users</h3>
              </div>
              <p className="text-3xl font-bold text-gray-800">{users.length}</p>
              <p className="text-sm text-gray-600">Registered users</p>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">
            {editingProduct ? 'Edit Product' : 'Create New Product'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Product Name *"
              value={productForm.name}
              onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
              className="px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
              disabled={loading}
            />
            <input
              type="number"
              placeholder="Price *"
              value={productForm.price}
              onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
              className="px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
              disabled={loading}
              step="0.01"
            />
            <input
              type="text"
              placeholder="Category"
              value={productForm.category}
              onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
              className="px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
              disabled={loading}
            />
            <input
              type="number"
              placeholder="Stock"
              value={productForm.stock}
              onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
              className="px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
              disabled={loading}
            />
            <input
              type="text"
              placeholder="Description"
              value={productForm.description}
              onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
              className="md:col-span-2 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
              disabled={loading}
            />
          </div>
          <div className="flex gap-2 mt-4">
            <button
              onClick={editingProduct ? handleUpdateProduct : handleCreateProduct}
              disabled={loading}
              className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700 transition flex items-center gap-2 disabled:opacity-50"
            >
              {loading ? <Loader className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
              {editingProduct ? 'Update Product' : 'Create Product'}
            </button>
            {editingProduct && (
              <button
                onClick={cancelEdit}
                disabled={loading}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
              >
                Cancel
              </button>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Products List</h2>
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader className="w-8 h-8 animate-spin text-indigo-600" />
            </div>
          ) : products.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No products found. Create your first product!</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left">ID</th>
                    <th className="px-4 py-2 text-left">Name</th>
                    <th className="px-4 py-2 text-left">Category</th>
                    <th className="px-4 py-2 text-left">Price</th>
                    <th className="px-4 py-2 text-left">Stock</th>
                    <th className="px-4 py-2 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id} className="border-t hover:bg-gray-50">
                      <td className="px-4 py-2">{product.id}</td>
                      <td className="px-4 py-2 font-medium">{product.name}</td>
                      <td className="px-4 py-2">{product.category || '-'}</td>
                      <td className="px-4 py-2">${parseFloat(product.price).toFixed(2)}</td>
                      <td className="px-4 py-2">{product.stock}</td>
                      <td className="px-4 py-2">
                        <div className="flex gap-2">
                          {(user.role === 'admin' || product.createdBy === user.id) && (
                            <button
                              onClick={() => startEdit(product)}
                              className="text-blue-600 hover:text-blue-800 p-1"
                              title="Edit"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                          )}
                          {user.role === 'admin' && (
                            <button
                              onClick={() => handleDeleteProduct(product.id)}
                              className="text-red-600 hover:text-red-800 p-1"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {user.role === 'admin' && users.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6 mt-6">
            <h2 className="text-xl font-bold mb-4">User Management (Admin Only)</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left">ID</th>
                    <th className="px-4 py-2 text-left">Username</th>
                    <th className="px-4 py-2 text-left">Email</th>
                    <th className="px-4 py-2 text-left">Role</th>
                    <th className="px-4 py-2 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id} className="border-t hover:bg-gray-50">
                      <td className="px-4 py-2">{u.id}</td>
                      <td className="px-4 py-2 font-medium">{u.username}</td>
                      <td className="px-4 py-2">{u.email}</td>
                      <td className="px-4 py-2">
                        <span className={`px-2 py-1 rounded text-sm ${
                          u.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="px-4 py-2">
                        <span className={`px-2 py-1 rounded text-sm ${
                          u.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {u.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}