// profile.js
document.addEventListener('DOMContentLoaded', function() {
    // User data
    const userData = JSON.parse(localStorage.getItem('moodTrackerUserData') || '{}');
    const moodData = JSON.parse(localStorage.getItem('moodTrackerData_v1') || '[]');
    
    // Initialize
    initProfile();
    initEventListeners();
    
    function initProfile() {
        // Set user info
        document.getElementById('userName').textContent = userData.name || 'İstifadəçi Adı';
        document.getElementById('userEmail').textContent = userData.email || 'istifadeci@example.com';
        
        // Calculate stats
        const totalEntries = moodData.length;
        const uniqueDays = new Set(moodData.map(entry => entry.date)).size;
        const avgMood = calculateAverageMood();
        
        // Update stats
        document.getElementById('totalEntries').textContent = totalEntries;
        document.getElementById('streakDays').textContent = uniqueDays;
        document.getElementById('avgMood').textContent = avgMood.toFixed(1);
        
        // Update premium status
        updatePremiumStatus();
        
        // Load settings
        loadSettings();
    }
    
    function calculateAverageMood() {
        const moodEntries = moodData.filter(entry => entry.value);
        if (moodEntries.length === 0) return 0;
        
        const total = moodEntries.reduce((sum, entry) => sum + entry.value, 0);
        return total / moodEntries.length;
    }
    
    function updatePremiumStatus() {
        const premiumCard = document.getElementById('premiumCard');
        const upgradeBtn = document.getElementById('upgradeBtn');
        
        if (userData.premium) {
            premiumCard.innerHTML = `
                <div class="premium-info">
                    <h3>⭐ Premium Aktiv</h3>
                    <p>Bütün xüsusiyyətlər aktivdir</p>
                </div>
                <button class="upgrade-btn" style="background: #059669">Aktiv</button>
            `;
        }
    }
    
    function loadSettings() {
        document.getElementById('languageSelect').value = userData.language || 'az';
        document.getElementById('themeSelect').value = userData.theme || 'light';
        document.getElementById('dailyReminder').checked = userData.dailyReminder !== false;
    }
    
    function initEventListeners() {
        // Upgrade to Premium
        document.getElementById('upgradeBtn').addEventListener('click', function() {
            if (confirm('Premium üzvlüyə keçmək istəyirsiniz? (Nümunə funksiya)')) {
                userData.premium = true;
                localStorage.setItem('moodTrackerUserData', JSON.stringify(userData));
                updatePremiumStatus();
                alert('Təbriklər! Premium üzv oldunuz! 🎉');
            }
        });
        
        // Edit Profile
        document.getElementById('editProfileBtn').addEventListener('click', function() {
            const newName = prompt('Yeni adınız:', userData.name || '');
            if (newName) {
                userData.name = newName;
                localStorage.setItem('moodTrackerUserData', JSON.stringify(userData));
                document.getElementById('userName').textContent = newName;
                alert('Ad uğurla dəyişdirildi! ✅');
            }
            
            const newEmail = prompt('Yeni e-poçtunuz:', userData.email || '');
            if (newEmail) {
                userData.email = newEmail;
                localStorage.setItem('moodTrackerUserData', JSON.stringify(userData));
                document.getElementById('userEmail').textContent = newEmail;
                alert('E-poçt uğurla dəyişdirildi! ✅');
            }
        });
        
        // Export Data
        document.getElementById('exportDataBtn').addEventListener('click', function() {
            const dataStr = JSON.stringify(moodData, null, 2);
            const dataBlob = new Blob([dataStr], {type: 'application/json'});
            const url = URL.createObjectURL(dataBlob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'mood-tracker-data.json';
            a.click();
            URL.revokeObjectURL(url);
            alert('Məlumatlar uğurla ixrac edildi! 📁');
        });
        
        // Notifications
        document.getElementById('notificationsBtn').addEventListener('click', function() {
            const isEnabled = document.getElementById('dailyReminder').checked;
            alert(`Bildirişlər ${isEnabled ? 'açıqdır' : 'bağlıdır'} 🔔`);
        });
        
        // Privacy
        document.getElementById('privacyBtn').addEventListener('click', function() {
            alert('Məxfilik tənzimləmələri səhifəsi (Nümunə) 🔒');
        });
        
        // Settings changes
        document.getElementById('languageSelect').addEventListener('change', function() {
            userData.language = this.value;
            localStorage.setItem('moodTrackerUserData', JSON.stringify(userData));
            alert('Dil dəyişdirildi: ' + this.value);
        });
        
        document.getElementById('themeSelect').addEventListener('change', function() {
            userData.theme = this.value;
            localStorage.setItem('moodTrackerUserData', JSON.stringify(userData));
            alert('Tema dəyişdirildi: ' + this.value);
        });
        
        document.getElementById('dailyReminder').addEventListener('change', function() {
            userData.dailyReminder = this.checked;
            localStorage.setItem('moodTrackerUserData', JSON.stringify(userData));
        });
        
        // Delete Data
        document.getElementById('deleteDataBtn').addEventListener('click', function() {
            if (confirm('BÜTÜN məlumatlarınız silinəcək! Davam etmək istəyirsiniz?')) {
                localStorage.removeItem('moodTrackerData_v1');
                alert('Bütün məlumatlar uğurla silindi! ✅');
                location.reload();
            }
        });
        
        // Delete Account
        document.getElementById('deleteAccountBtn').addEventListener('click', function() {
            if (confirm('HESABINIZ TAMAMEN SİLİNƏCƏK! Bu əməliyyat geri alına bilməz. Əminsiniz?')) {
                localStorage.removeItem('moodTrackerData_v1');
                localStorage.removeItem('moodTrackerUserData');
                alert('Hesabınız uğurla silindi. Əsas səhifəyə yönləndirilirsiniz...');
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 2000);
            }
        });
        
        // Edit Avatar
        document.querySelector('.edit-avatar-btn').addEventListener('click', function() {
            alert('Profil şəkli dəyişmə funksiyası (Nümunə) 📷');
        });
        
        // Settings Button
        document.querySelector('.settings-btn').addEventListener('click', function() {
            alert('Əlavə tənzimləmələr səhifəsi (Nümunə) ⚙️');
        });
    }
});
