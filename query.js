async function loadSickLeave() {
  const serviceCode = document.getElementById('serviceCode').value.trim();
  const patientId = document.getElementById('patientId').value.trim();
  const messageDiv = document.getElementById('message');
  const resultsContainer = document.getElementById('resultsContainer');
  
  // إخفاء النتائج السابقة والرسائل
  resultsContainer.style.display = 'none';
  messageDiv.style.display = 'none';
  
  // التحقق من إدخال الحقلين معاً
  if (!serviceCode || !patientId) {
    showMessage('message', 'يجب إدخال كود الخدمة ورقم الهوية معاً', false);
    return;
  }

  try {
    const userId = localStorage.getItem('userId');
    const snapshot = await db.ref(`sickLeaves/${userId}`)
      .orderByChild('serviceCode')
      .equalTo(serviceCode)
      .once('value');
    
    if (!snapshot.exists()) {
      showMessage('message', 'لا توجد نتائج مطابقة', false);
      return;
    }
    
    let found = false;
    
    snapshot.forEach(child => {
      const record = child.val();
      
      // التحقق من مطابقة رقم الهوية أيضاً
      if (record.patientId === patientId) {
        found = true;
        // تعبئة البيانات في العناصر
        document.getElementById('result-serviceCode').textContent = record.serviceCode;
        document.getElementById('result-patientId').textContent = record.patientId;
        document.getElementById('result-patientName').textContent = record.patientName;
        document.getElementById('result-sickLeaveDate').textContent = record.sickLeaveDate;
        document.getElementById('result-fromDate').textContent = record.fromDate;
        document.getElementById('result-toDate').textContent = record.toDate;
        document.getElementById('result-duration').textContent = `${record.duration} يوم`;
        document.getElementById('result-doctorName').textContent = record.doctorName;
        document.getElementById('result-jobTitle').textContent = record.jobTitle;
        
        resultsContainer.style.display = 'block';
      }
    });
    
    if (!found) {
      showMessage('message', 'لا توجد نتائج مطابقة', false);
    }
    
  } catch (error) {
    showMessage('message', 'حدث خطأ: ' + error.message, false);
  }
}

// أحداث الاستعلام
document.getElementById('searchBtn').addEventListener('click', loadSickLeave);
document.getElementById('clearBtn').addEventListener('click', () => {
  document.getElementById('serviceCode').value = '';
  document.getElementById('patientId').value = '';
  document.getElementById('resultsContainer').style.display = 'none';
  document.getElementById('message').style.display = 'none';
});

// زر الإدخال الجديد
document.getElementById('newEntryBtn').addEventListener('click', () => {
  window.location.href = 'index.html';
});

// تفعيل البحث عند الضغط على انتر
document.getElementById('patientId').addEventListener('keypress', (e) => {
  if (e.key === 'Enter') loadSickLeave();
});
