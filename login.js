document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const userCode = document.getElementById('userCode').value;
  
  try {
    // البحث عن المستخدم بالكود السري
    const snapshot = await db.ref('system/users').orderByChild('code').equalTo(userCode).once('value');
    
    if (snapshot.exists()) {
      snapshot.forEach(childSnapshot => {
        const userId = childSnapshot.key;
        const userData = childSnapshot.val();
        
        // حفظ بيانات الجلسة
        localStorage.setItem('loggedIn', 'true');
        localStorage.setItem('userId', userId);
        localStorage.setItem('userName', userData.name);
        localStorage.setItem('userRole', userData.role || 'user');
        
        // تسجيل نشاط الدخول
        db.ref(`userActivities/${userId}`).push({
          action: 'login',
          timestamp: firebase.database.ServerValue.TIMESTAMP
        });
        
        // تحديث آخر دخول
        db.ref(`system/users/${userId}`).update({
          lastLogin: firebase.database.ServerValue.TIMESTAMP
        });
        
        // توجيه للصفحة الرئيسية
        window.location.href = 'index.html';
      });
    } else {
      showMessage('message', 'كود الدخول غير صحيح', false);
    }
  } catch (error) {
    showMessage('message', 'حدث خطأ: ' + error.message, false);
  }
});