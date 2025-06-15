async function loadSickLeave() {
  const serviceCode = document.getElementById('serviceCode').value.trim();
  const patientId = document.getElementById('patientId').value.trim();
  const messageDiv = document.getElementById('message');
  const resultsContainer = document.getElementById('resultsContainer');
  const tbody = document.getElementById('dataBody');
  
  // إخفاء النتائج السابقة والرسائل
  resultsContainer.style.display = 'none';
  messageDiv.style.display = 'none';
  tbody.innerHTML = '';
  
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
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${record.serviceCode}</td>
          <td>${record.patientId}</td>
          <td>${record.patientName}</td>
          <td>${record.sickLeaveDate}</td>
          <td>${record.fromDate}</td>
          <td>${record.toDate}</td>
          <td>${record.duration} يوم</td>
          <td>${record.doctorName}</td>
          <td>${record.jobTitle}</td>
        `;
        tbody.appendChild(row);
      }
    });
    
    if (found) {
      resultsContainer.style.display = 'block';
    } else {
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

// تفعيل البحث عند الضغط على انتر
document.getElementById('patientId').addEventListener('keypress', (e) => {
  if (e.key === 'Enter') loadSickLeave();
});
