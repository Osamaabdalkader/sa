document.getElementById('dataEntryForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  // التحقق من صحة التواريخ
  const fromDate = new Date(document.getElementById('fromDate').value);
  const toDate = new Date(document.getElementById('toDate').value);
  
  if (toDate < fromDate) {
    showMessage('message', 'لا يمكن أن يكون تاريخ النهاية قبل تاريخ البداية', false);
    return;
  }
  
  const userId = localStorage.getItem('userId');
  if (!userId) return logout();

  try {
    // جمع بيانات النموذج
    const sickLeaveData = {
      serviceCode: document.getElementById('serviceCode').value,
      patientId: document.getElementById('patientId').value,
      patientName: document.getElementById('patientName').value,
      sickLeaveDate: document.getElementById('sickLeaveDate').value,
      fromDate: document.getElementById('fromDate').value,
      toDate: document.getElementById('toDate').value,
      duration: parseInt(document.getElementById('duration').value),
      doctorName: document.getElementById('doctorName').value,
      jobTitle: document.getElementById('jobTitle').value,
      enteredBy: userId,
      timestamp: firebase.database.ServerValue.TIMESTAMP
    };

    // حفظ البيانات في قاعدة البيانات
    await db.ref(`sickLeaves/${userId}`).push(sickLeaveData);
    
    // عرض رسالة النجاح
    showMessage('message', 'تم حفظ بيانات الإجازة بنجاح!', true);
    
    // إعادة تعيين النموذج
    document.getElementById('dataEntryForm').reset();
    
    // تعيين التاريخ الحالي كافتراضي
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('sickLeaveDate').value = today;
    
    // تسجيل النشاط
    db.ref(`userActivities/${userId}`).push({
      action: 'sick_leave_entry',
      details: `تم إدخال إجازة لـ: ${sickLeaveData.patientName}`,
      timestamp: firebase.database.ServerValue.TIMESTAMP
    });
    
  } catch (error) {
    showMessage('message', 'حدث خطأ: ' + error.message, false);
  }
});