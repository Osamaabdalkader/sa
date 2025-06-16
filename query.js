document.addEventListener("DOMContentLoaded", function() {
    const submitButton = document.getElementById('submit');
    const toggleButton = document.getElementById('toggleButton');
    const serviceCodeInput = document.getElementById('normalizedservicecode');
    const patientIdInput = document.getElementById('patientid');
    const resultsDiv = document.getElementById('resultsDiv');
    const alertError = document.getElementById('alerterror');
    const alertError2 = document.getElementById('alerterror2');

    async function handleInquiry() {
        const serviceCode = serviceCodeInput.value.trim();
        const patientId = patientIdInput.value.trim();

        if (serviceCode && patientId) {
            try {
                const userId = localStorage.getItem('userId');
                const snapshot = await db.ref(`sickLeaves/${userId}`)
                    .orderByChild('serviceCode')
                    .equalTo(serviceCode)
                    .once('value');

                let found = false;
                
                if (snapshot.exists()) {
                    snapshot.forEach(child => {
                        const record = child.val();
                        if (record.patientId === patientId) {
                            found = true;
                            // تعبئة البيانات في العناصر
                            document.getElementById('servicecodeResult').textContent = serviceCode;
                            document.getElementById('patientidResult').textContent = patientId;
                            document.getElementById('patientname').textContent = record.patientName;
                            document.getElementById('sickleavedate').textContent = record.sickLeaveDate;
                            document.getElementById('from1').textContent = record.fromDate;
                            document.getElementById('to1').textContent = record.toDate;
                            document.getElementById('duration').textContent = `${record.duration} يوم`;
                            document.getElementById('doctorname').textContent = record.doctorName;
                            document.getElementById('jobtitle').textContent = record.jobTitle;

                            resultsDiv.style.display = 'block';
                            alertError.style.display = 'none';
                            alertError2.style.display = 'none';
                            submitButton.style.display = 'none';
                            toggleButton.style.display = 'inline-block';
                        }
                    });
                }

                if (!found) {
                    alertError2.style.display = 'block';
                    resultsDiv.style.display = 'none';
                    alertError.style.display = 'none';
                }
            } catch (error) {
                alertError2.style.display = 'block';
                resultsDiv.style.display = 'none';
                alertError.style.display = 'none';
            }
        } else {
            alertError.style.display = 'block';
            alertError2.style.display = 'none';
            resultsDiv.style.display = 'none';
        }
    }

    submitButton.addEventListener('click', handleInquiry);
    toggleButton.addEventListener('click', () => {
        window.location.href = "index.html"; // الانتقال إلى صفحة الإدخال
    });

    // تفعيل البحث عند الضغط على انتر في حقل رقم الهوية
    patientIdInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleInquiry();
        }
    });
});
