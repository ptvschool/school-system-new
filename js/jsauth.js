import { auth, db } from './firebase-config.js';
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Check สถานะการ Login ແລະ สิดในทุกๆ หน้า
export function checkAuth(requiredRoles = []) {
    onAuthStateChanged(auth, async (user) => {
        if (!user) {
            // ຖ້າອອບຈາກລະບົບ ຫຼື ຍັງບໍ່ Login ໃຫ້ເດັ້ງໄປ login.html
            if (!window.location.pathname.endsWith('login.html')) {
                window.location.href = 'login.html';
            }
        } else {
            // ດຶງຂໍ້ມູນ Role ຈາກ Firestore
            const userDoc = await getDoc(doc(db, "users", user.uid));
            if (userDoc.exists()) {
                const userData = userDoc.data();
                localStorage.setItem('currentUser', JSON.stringify({
                    uid: user.uid,
                    email: user.email,
                    name: userData.name || 'User',
                    role: userData.role || 'teacher'
                }));

                // ຖ້າໜ້ານັ້ນຕ້ອງການ Role ສະເພາະ (ເຊັ່ນ: users.html ເຂົ້າໄດ້ແຕ່ admin)
                if (requiredRoles.length > 0 && !requiredRoles.includes(userData.role)) {
                    alert('⛔ ທ່ານບໍ່ມີສິດເຂົ້າເຖິງໜ້ານີ້!');
                    window.location.href = 'index.html';
                }
            } else {
                alert('⚠️ ບໍ່ພົບຂໍ້ມູນຜູ້ໃຊ້ໃນ Firestore');
                logoutUser();
            }
        }
    });
}

// ຟັງຊັນ Logout
export function logoutUser() {
    signOut(auth).then(() => {
        localStorage.removeItem('currentUser');
        window.location.href = 'login.html';
    });
}