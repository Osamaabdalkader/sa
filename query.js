async function loadSickLeaves() {
  try {
    const userId = localStorage.getItem('userId');
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const dateFrom = document.getElementById('dateFrom').value;
    const dateTo = document.getElementById('dateTo').value;
    
    const snapshot = await db.ref(`sickLeaves/${userId}`).orderByChild('timestamp').once('value');
    const tbody = document.getElementById('dataBody');
    tbody.innerHTML = '';
    
    if (!snapshot.exists()) {
      tbody.innerHTML = '<tr><td colspan="7" style="text-align:center">لا توجد سجلات</td></tr>';
      return;
    }
    
    let records = [];
    snapshot.forEach(child => {
      const record = child.val();
      records.push({
        key: child.key,
        ...record
      });
    });
    
    // تطبيق الفلاتر
    records = records.filter(record => {
      // فلترة البحث
      const matchesSearch = !searchTerm || 
        record.patientName.toLowerCase().includes(searchTerm) || 
        record.patientId.toLowerCase().includes(searchTerm);
      
      // فلترة التاريخ
      const matchesDate = (!dateFrom || record.fromDate >= dateFrom) && 
                         (!dateTo || record.toDate <= dateTo);
      
      return matchesSearch && matchesDate;
    });
    
    // عرض النتائج
    if (records.length === 0) {
      tbody.innerHTML = '<tr><td colspan="7" style="text-align:center">لا توجد نتائج مطابقة</td></tr>';
      return;
    }
    
    // الترتيب من الأحدث إلى الأقدم
    records.reverse().forEach(record => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${record.patientId}</td>
        <td>${record.patientName}</td>
        <td>${record.fromDate}</td>
        <td>${record.toDate}</td>
        <td>${record.duration} يوم</td>
        <td>د. ${record.doctorName}</td>
        <td>${formatDate(record.timestamp)}</td>
      `;
      tbody.appendChild(row);
    });
    
  } catch (error) {
    console.error('حدث خطأ في تحميل البيانات:', error);
    showMessage('message', 'حدث خطأ في تحميل البيانات: ' + error.message, false);
  }
}

// أحداث البحث والفلترة
document.getElementById('searchBtn').addEventListener('click', loadSickLeaves);
document.getElementById('filterBtn').addEventListener('click', loadSickLeaves);

// تحميل البيانات عند فتح الصفحة
window.addEventListener('DOMContentLoaded', () => {
  loadSickLeaves();
  
  // تعيين التواريخ الافتراضية (الشهر الحالي)
  const today = new Date();
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
  const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  
  document.getElementById('dateFrom').value = firstDay.toISOString().split('T')[0];
  document.getElementById('dateTo').value = lastDay.toISOString().split('T')[0];
});