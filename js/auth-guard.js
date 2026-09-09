// ຟັງຊັນກວດສອບສິດການເຂົ້າເຖິງໜ້າເວັບ
export function protectPage(allowedRoles = []) {
    const userJson = localStorage.getItem('currentUser');
    
    // ຖ້າບໍ່ໄດ້ Login ໃຫ້ເດັ້ງໄປໜ້າ login.html
    if (!userJson) {
        alert('⚠️ ກະລຸນາເຂົ້າສູ່ລະບົບກ່ອນ!');
        window.location.href = 'login.html';
        return null;
    }

    const user = JSON.parse(userJson);

    // ຖ້າກຳນົດ Role ແລ້ວ User ບໍ່ມີສິດ ໃຫ້ເດັ້ງໄປ index.html
    if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
        alert('⛔ ທ່ານບໍ່ມີສິດເຂົ້າເຖິງໜ້ານີ້!');
        window.location.href = 'index.html';
        return null;
    }

    return user;
}

// ຟັງຊັນ Logout
export function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'login.html';
}