 // modal.js محدث مع كل الميزات الجديدة + Titles الموسعة
const modalContainer = document.getElementById('modal-container');

function createModal(title, contentHTML, onSaveCallback) {
  const modal = document.createElement('div');
  modal.classList.add('modal', 'fade-in');
  modal.innerHTML = `
    <div class="modal-content glass-card slide-up card-3d">
      <h3>${title}</h3>
      ${contentHTML}
      <div class="modal-actions">
        <button class="btn" id="modal-save">Save</button>
        <button class="btn" id="modal-close">Close</button>
      </div>
    </div>`;
  modalContainer.appendChild(modal);

  // إغلاق المودال
  modal.querySelector('#modal-close').onclick = () => modal.remove();

  // حفظ البيانات عند الضغط على Save
  modal.querySelector('#modal-save').onclick = () => {
    onSaveCallback();
    modal.remove();
  };

  // حركة 3D للمودال عند تحريك الماوس
  const card = modal.querySelector('.card-3d');
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * 10;
    const rotateY = ((x - centerX) / centerX) * 10;
    card.style.transform = `rotateX(${-rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = 'rotateX(0deg) rotateY(0deg) scale(1)';
  });
}

// مثال مودال لإضافة مستخدم جديد باليوزر + باسورد فقط + أدوار موسعة + Titles حديثة
function showAddUserModal() {
  const rolesByTeam = {
    Marketing: [
      'Marketing Lead',
      'Content Creator',
      'Copywriter',
      'Social Media Manager',
      'SEO Specialist',
      'Brand Strategist'
    ],
    Sales: [
      'Sales Lead',
      'Sales Executive',
      'Account Manager',
      'Business Development Manager',
      'Key Account Manager'
    ],
    Management: [
      'Founder',
      'Director',
      'Supervisor',
      'Operations Manager',
      'Project Manager',
      'General Manager'
    ],
    Support: [
      'Support Lead',
      'Support Agent',
      'Customer Success Manager',
      'Technical Support Specialist'
    ],
    Development: [
      'Dev Lead',
      'Frontend Developer',
      'Backend Developer',
      'Fullstack Developer',
      'QA Engineer',
      'UI/UX Designer'
    ]
  };

  createModal('إضافة مستخدم جديد', `
    <input id="new-user-username" placeholder="اسم المستخدم"/>
    <input id="new-user-password" placeholder="كلمة المرور"/>
    <select id="new-user-team">
      <option value="Marketing">Marketing</option>
      <option value="Sales">Sales</option>
      <option value="Management">Management</option>
      <option value="Support">Support</option>
      <option value="Development">Development</option>
    </select>
    <select id="new-user-role">
      <option value="">اختر الدور بعد اختيار الفريق</option>
    </select>
  `, async () => {
    const username = document.getElementById('new-user-username').value;
    const password = document.getElementById('new-user-password').value;
    const team = document.getElementById('new-user-team').value;
    const role = document.getElementById('new-user-role').value;

    if (!username || !password || !team || !role) {
      alert('الرجاء تعبئة كل الحقول!');
      return;
    }

    // إنشاء الحساب باليوزر + باسورد فقط (إيميل وهمي)
    await supabase.auth.signUp({ email: `${username}@onvo.local`, password });
    await supabase.from('users').insert([{ username, team, role }]);
    alert(`تم إضافة المستخدم ${username} كـ ${role} في فريق ${team}`);
  });

  // تحديث قائمة الأدوار عند تغيير الفريق
  const teamSelect = modalContainer.querySelector('#new-user-team');
  const roleSelect = modalContainer.querySelector('#new-user-role');
  teamSelect.addEventListener('change', () => {
    const team = teamSelect.value;
    const roles = rolesByTeam[team] || [];
    roleSelect.innerHTML = roles.map(r => `<option value="${r}">${r}</option>`).join('');
  });
}
