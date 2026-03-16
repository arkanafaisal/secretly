// ==========================================
// src/utils/api.js
// ==========================================

const BASE_URL = '/api';

// Fungsi helper navigasi (tanpa reload)
export const navigate = (path) => {
  window.history.pushState({}, '', path);
  const navEvent = new PopStateEvent('popstate');
  window.dispatchEvent(navEvent);
};

// ==========================================
// 1. FETCH TANPA AUTH (Untuk Login/Register & Lupa Sandi)
// ==========================================
const fetchWithoutAuth = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, { 
      ...options, 
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      // Penting: Walau tanpa auth, kita butuh ini agar browser menyimpan 
      // cookie refreshToken yang dikirim server setelah login sukses
      credentials: 'include' 
    });
    
    const result = await response.json().catch(() => ({ 
      success: false, 
      message: 'Format response tidak valid dari server.' 
    }));

    if (response.status >= 500) {
      alert("Terjadi masalah pada server kami. Mohon coba lagi dalam beberapa menit.");
    } else if (response.status === 429) {
      alert("Anda melakukan permintaan terlalu cepat. Mohon tunggu sebentar lalu coba lagi.");
    }

    return { response, result };
  } catch (error) {
    console.error("Network Error:", error);
    alert("Koneksi gagal. Pastikan Anda terhubung ke internet dan backend aktif.");
    return { response: { ok: false, status: 0 }, result: { success: false, message: 'Gagal terhubung ke server.' } };
  }
};

// ==========================================
// 2. FETCH DENGAN AUTH (Ada logika 401 & 403)
// ==========================================
const fetchWithAuth = async (endpoint, options = {}) => {
  let token = localStorage.getItem('accessToken');
  const url = `${BASE_URL}${endpoint}`;
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  
  if (token) headers['accesstoken'] = token;

  try {
    let response = await fetch(url, { ...options, headers, credentials: 'include' });
    let result = await response.json().catch(() => ({ success: false, message: 'Format response tidak valid dari server.' }));

    // 401: Token expired, coba silent refresh
    if (response.status === 401) {
      console.warn("Access Token tidak valid (401). Mencoba silent refresh...");
      const refreshRes = await fetch(`${BASE_URL}/auth/refresh`, {
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
      });

      if (refreshRes.ok) {
        const refreshResult = await refreshRes.json();
        if (refreshResult.success && refreshResult.data) {
          token = refreshResult.data;
          localStorage.setItem('accessToken', token);
          
          headers['accesstoken'] = token;
          response = await fetch(url, { ...options, headers, credentials: 'include' });
          result = await response.json().catch(() => ({}));
          return { response, result };
        }
      }
      response = { ...response, status: 403 }; 
    }

    // 403: Refresh token expired / Session habis total
    if (response.status === 403) {
      console.error("Refresh Token tidak valid (403). Force Logout.");
      localStorage.removeItem('accessToken');
      navigate('/');
      return { response, result };
    }

    if (response.status >= 500) alert("Terjadi masalah pada server kami. Mohon coba lagi.");
    if (response.status === 429) alert("Terlalu banyak permintaan. Mohon tunggu sebentar.");

    return { response, result };

  } catch (error) {
    console.error("Network Error:", error);
    alert("Koneksi gagal. Pastikan Anda terhubung ke internet dan backend aktif.");
    return { response: { ok: false, status: 0 }, result: { success: false, message: 'Gagal terhubung ke server.' } };
  }
};

// ==========================================
// 3. OBJEK API
// ==========================================
const api = {
  auth: {
    login: (data) => fetchWithoutAuth('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
    register: (data) => fetchWithoutAuth('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
    logout: () => fetchWithAuth('/auth/logout', { method: 'POST' }),
    verifyEmail: (token) => fetchWithoutAuth(`/auth/verify-email/${token}`, { method: 'POST' }),
    resetPassword: (token, data) => fetchWithoutAuth(`/auth/reset-password/${token}`, { method: 'POST', body: JSON.stringify(data) }),
  },
  users: {
    getMe: () => fetchWithAuth('/users/me', { method: 'GET' }),
    toggleAllowMessages: (data) => fetchWithAuth('/users/me/allow-messages', { method: 'PUT', body: JSON.stringify(data) }),
    updateAvatar: (data) => fetchWithAuth('/users/me/avatar', { method: 'PUT', body: JSON.stringify(data) }),
    updateUsername: (data) => fetchWithAuth('/users/me/username', { method: 'PUT', body: JSON.stringify(data) }),
    updateBio: (data) => fetchWithAuth('/users/me/bio', { method: 'PUT', body: JSON.stringify(data) }),
    updateEmail: (data) => fetchWithAuth('/users/me/email', { method: 'PUT', body: JSON.stringify(data) }),
    updatePassword: (data) => fetchWithAuth('/users/me/password', { method: 'PUT', body: JSON.stringify(data) }),
    refreshPublicId: () => fetchWithAuth('/users/me/public-id', { method: 'POST' }),
    // Pembaruan: forgotPassword sekarang disetel menjadi fetchWithoutAuth
    forgotPassword: (data) => fetchWithoutAuth('/users/forgot-password', { method: 'POST', body: JSON.stringify(data) }),

    getMessages: (queryString = '') => fetchWithAuth(`/messages/me${queryString}`, { method: 'GET' }),
    updateMessage: (id, data) => fetchWithAuth(`/messages/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
    deleteMessage: (id) => fetchWithAuth(`/messages/${id}`, { method: 'DELETE' })
  },
  public: {
    getProfile: (publicId) => fetchWithoutAuth(`/users/${publicId}`, { method: 'GET' }),
    sendMessage: (publicId, data) => fetchWithoutAuth(`/messages/send/${publicId}`, { method: 'POST', body: JSON.stringify(data) })
  }
};

export default api;