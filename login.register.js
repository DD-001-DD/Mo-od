// Tema dəyişdir funksiyası
document.addEventListener('DOMContentLoaded', function() {
    const themeBtn = document.getElementById('theme-btn');
    const themeIcon = themeBtn.querySelector('i');
    
    // Əgər localStorage-da tema seçimi saxlanılıbsa
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.body.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
    
    // Tema dəyişdir butonunun klik hadisəsi
    themeBtn.addEventListener('click', function() {
        const currentTheme = document.body.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        document.body.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    });
    
    // Tema ikonunu yenilə
    function updateThemeIcon(theme) {
        if (theme === 'dark') {
            themeIcon.className = 'fas fa-sun';
        } else {
            themeIcon.className = 'fas fa-moon';
        }
    }
    
    // Form dəyişdirmə funksiyası
    const toggleButtons = document.querySelectorAll('.toggle-btn');
    const forms = document.querySelectorAll('.form');
    
    toggleButtons.forEach(button => {
        button.addEventListener('click', function() {
            const formToShow = this.getAttribute('data-form');
            
            // Aktiv düyməni dəyişdir
            toggleButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Aktiv formu dəyişdir
            forms.forEach(form => {
                form.classList.remove('active');
                if (form.id === `${formToShow}-form`) {
                    form.classList.add('active');
                }
            });
        });
    });
    
    // Giriş formunun təqibi
    const loginForm = document.getElementById('login-form');
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        
        // Burada giriş məntiqi olardı
        console.log('Giriş cəhdi:', { email, password });
        showNotification('Giriş uğurla tamamlandı!', 'success');
    });
    
    // Qeydiyyat formunun təqibi
    const registerForm = document.getElementById('register-form');
    registerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = document.getElementById('register-name').value;
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;
        const confirmPassword = document.getElementById('register-confirm').value;
        
        // Şifrə təsdiqi
        if (password !== confirmPassword) {
            showNotification('Şifrələr uyğun gəlmir!', 'error');
            return;
        }
        
        // Burada qeydiyyat məntiqi olardı
        console.log('Qeydiyyat cəhdi:', { name, email, password });
        showNotification('Qeydiyyat uğurla tamamlandı!', 'success');
    });
    
    // Sosial giriş butonları
    const googleButtons = document.querySelectorAll('.google-btn');
    const facebookButtons = document.querySelectorAll('.facebook-btn');
    
    googleButtons.forEach(button => {
        button.addEventListener('click', function() {
            showNotification('Google ilə giriş seçildi', 'info');
            // Google giriş məntiqi burada olardı
        });
    });
    
    facebookButtons.forEach(button => {
        button.addEventListener('click', function() {
            showNotification('Facebook ilə giriş seçildi', 'info');
            // Facebook giriş məntiqi burada olardı
        });
    });
    
    // Bildiriş göstərmə funksiyası
    function showNotification(message, type) {
        // Əvvəlki bildirişləri təmizlə
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        // Stil tətbiq et
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            z-index: 10000;
            animation: slideIn 0.3s ease;
            max-width: 300px;
        `;
        
        // Tipə görə rəng seç
        if (type === 'success') {
            notification.style.backgroundColor = '#27ae60';
        } else if (type === 'error') {
            notification.style.backgroundColor = '#e74c3c';
        } else {
            notification.style.backgroundColor = '#3498db';
        }
        
        document.body.appendChild(notification);
        
        // 3 saniyədən sonra bildirişi sil
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
    
    // Bildiriş animasiyası üçün CSS əlavə et
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
});

// Əsas səhifəyə qayıt funksiyası
function goToHome() {
    showNotification('Əsas səhifəyə yönləndirilir...', 'info');
    // Burada əsas səhifəyə yönləndirmə məntiqi olardı
    // Məsələn: window.location.href = 'index.html';
}
