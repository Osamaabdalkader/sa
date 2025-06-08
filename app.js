// الدوال المشتركة
const db = firebase.database();

// دالة لتنسيق التاريخ
function formatDate(timestamp) {
  if (!timestamp) return 'غير معروف';
  
  const date = new Date(timestamp);
  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };
  
  return date.toLocaleString('ar-EG', options);
}

// دالة لعرض الرسائل
function showMessage(elementId, message, isSuccess = true) {
  const el = document.getElementById(elementId);
  if (!el) return;
  
  el.textContent = message;
  el.className = isSuccess ? 'message success' : 'message error';
  el.style.display = 'block';
  
  setTimeout(() => el.style.display = 'none', 5000);
}

// دالة للتحقق من تسجيل الدخول
function checkAuth() {
  return localStorage.getItem('loggedIn') === 'true';
}

// دالة لتسجيل الخروج
function logout() {
  const userId = localStorage.getItem('userId');
  if (userId) {
    // تسجيل نشاط الخروج
    db.ref(`userActivities/${userId}`).push({
      action: 'logout',
      timestamp: firebase.database.ServerValue.TIMESTAMP
    });
  }
  
  localStorage.clear();
  window.location.href = 'login.html';
}

// دالة لحماية الصفحات
function protectPage() {
  if (!checkAuth()) {
    window.location.href = 'login.html';
  }
}