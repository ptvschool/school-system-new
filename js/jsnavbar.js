import { db } from './firebase-config.js';
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

export async function checkPagePermissions() {
    const loggedInUserId = localStorage.getItem('userId');
    const userRole = localStorage.getItem('userRole');

    // 1. ຖ້າບໍ່ໄດ້ Login -> ເດ້ງໄປໜ້າ Login ທັນທີ
    if (!loggedInUserId) {
        window.location.href = 'login.html';
        return;
    }

    // ຊ່ອນເມນູທຸກໂຕໄວ້ກ່ອນ ເພື່ອປ້ອງກັນ UI Flash
    const menuItems = document.querySelectorAll('[data-perm]');
    menuItems.forEach(item => item.style.display = 'none');

    // 2. ຖ້າເປັນ Admin -> ເປີດໃຫ້ເຫັນທຸກເມນູ
    if (userRole === 'admin') {
        menuItems.forEach(el => el.style.display = 'flex');
        return;
    }

    try {
        // 3. ດຶງຂໍ້ມູນ Permissions ຈາກ Firestore
        const userDoc = await getDoc(doc(db, "users", loggedInUserId));
        
        if (userDoc.exists()) {
            const userData = userDoc.data();

            // ກວດສອບສະຖານະ ຖ້າຖືກ ປິດການໃຊ້ງານ (Inactive) -> ເດິກອອກຈາກລະບົບ
            if (userData.status === 'inactive') {
                alert('⚠️ ບັນຊີຂອງທ່ານຖືກປິດການໃຊ້ງານ temporarily!');
                localStorage.clear();
                window.location.href = 'login.html';
                return;
            }

            const allowedPerms = userData.permissions || [];

            // 4. ສະແດງ ເມນູ ເເພາະໂຕທີ່ມີສິດ
            menuItems.forEach(item => {
                const permKey = item.getAttribute('data-perm');
                if (allowedPerms.includes(permKey)) {
                    item.style.display = 'flex';
                }
            });

            // 5. ກວດສິດການເຂົ້າເຖິງໜ້າປະຈຸບັນ
            const pathName = window.location.pathname;
            let pageName = pathName.substring(pathName.lastIndexOf('/') + 1).replace('.html', '') || 'index';

            const permMapping = {
                'index': 'dashboard',
                'register': 'register',
                'payment-dashboard': 'payment',
                'teacher-payroll': 'payroll',
                'settings': 'settings',
                'users': 'users'
            };

            const requiredPerm = permMapping[pageName];

            // ຖ້າພະຍາຍາມເຂົ້າໜ້າທີ່ບໍ່ມີສິດ
            if (requiredPerm && !allowedPerms.includes(requiredPerm)) {
                alert('⚠️ ທ່ານບໍ່ມີສິດເຂົ້າເຖິງໜ້ານີ້!');

                // ຫາໜ້າທຳອິດທີ່ຜູ້ໃຊ້ນັ້ນ ມີສິດເຂົ້າເຖິງ ເພື່ອ Redirect ໄປ (ແກ້ Infinite Loop)
                const firstAllowedPage = Object.keys(permMapping).find(page => allowedPerms.includes(permMapping[page]));
                
                if (firstAllowedPage) {
                    window.location.href = `${firstAllowedPage}.html`;
                } else {
                    alert('⚠️ ບັນຊີຂອງທ່ານບໍ່ມີສິດເຂົ້າເຖິງເມນູໃດໆໃນລະບົບ!');
                    localStorage.clear();
                    window.location.href = 'login.html';
                }
            }
        } else {
            // ຖ້າຫາ User ບໍ່ເຫັນໃນ DB -> ອອກຈາກລະບົບ
            localStorage.clear();
            window.location.href = 'login.html';
        }
    } catch (error) {
        console.error("Error checking permissions:", error);
    }
}

// ເອີ້ນໃຊ້ງານທັນທີເມື່ອໂຫຼດ DOM
document.addEventListener('DOMContentLoaded', checkPagePermissions);