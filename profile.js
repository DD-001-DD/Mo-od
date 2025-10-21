// profile.js - Premium animasiyaları ilə (YENİLƏNİB)
document.addEventListener('DOMContentLoaded', function() {
    console.log('Profil səhifəsi yüklənir...');
    
    // User data - localStorage-dan götürülür
    const userData = JSON.parse(localStorage.getItem('moodTrackerUserData') || '{}');
    const moodData = JSON.parse(localStorage.getItem('moodTrackerData_v1') || '[]');
    
    // Əgər userData boşdursa, default dəyərlər təyin et
    if (!userData.name) {
        userData.name = "İstifadəçi Adı";
        userData.email = "istifadeci@example.com";
        userData.language = "az";
        userData.theme = "light";
        userData.notifications = true;
        localStorage.setItem('moodTrackerUserData', JSON.stringify(userData));
    }
    
    // Dil tərcümələri
    const translations = {
        az: {
            headerTitle: "Profilim",
            entriesLabel: "Giriş",
            daysLabel: "Gün",
            avgLabel: "Ortalama",
            premiumTitle: "⭐ Premium Üzvlük",
            premiumDesc: "Əlavə xüsusiyyətlərin kilidini açın",
            upgradeText: "Yüksəlt",
            actionsTitle: "Sürətli Əməliyyatlar",
            moodHistoryText: "Köhnə Girişlər",
            exportText: "Məlumatları İxrac Et",
            remindersText: "Xatırlatmalar",
            goalsText: "Hədəflər",
            accountTitle: "Hesab İdarəetməsi",
            switchAccountText: "Başqa hesabdan giriş et",
            deleteAccountText: "Hesabı sil",
            settingsModalTitle: "Tənzimləmələr",
            languageLabel: "Dil",
            themeLabel: "Tema",
            themeLight: "Açıq",
            themeDark: "Qaranlıq",
            notificationsLabel: "Bildirişlər",
            avatarModalTitle: "Profil Şəkli",
            avatarModalDesc: "Şəkil əməliyyatını seçin",
            viewAvatarText: "Şəklə Baxmaq",
            changeAvatarText: "Yeni Şəkil Əlavə Et",
            deleteAvatarText: "Şəkli Silmək",
            closeAvatarText: "Bağla",
            confirmationTitle: "Əminsiniz?",
            confirmationMessage: "Bu əməliyyatı təsdiqləyirsiniz?"
        },
        en: {
            headerTitle: "My Profile",
            entriesLabel: "Entries",
            daysLabel: "Days",
            avgLabel: "Average",
            premiumTitle: "⭐ Premium Membership",
            premiumDesc: "Unlock additional features",
            upgradeText: "Upgrade",
            actionsTitle: "Quick Actions",
            moodHistoryText: "Old Entries",
            exportText: "Export Data",
            remindersText: "Reminders",
            goalsText: "Goals",
            accountTitle: "Account Management",
            switchAccountText: "Login with another account",
            deleteAccountText: "Delete account",
            settingsModalTitle: "Settings",
            languageLabel: "Language",
            themeLabel: "Theme",
            themeLight: "Light",
            themeDark: "Dark",
            notificationsLabel: "Notifications",
            avatarModalTitle: "Profile Picture",
            avatarModalDesc: "Choose picture action",
            viewAvatarText: "View Picture",
            changeAvatarText: "Add New Picture",
            deleteAvatarText: "Delete Picture",
            closeAvatarText: "Close",
            confirmationTitle: "Are you sure?",
            confirmationMessage: "Do you confirm this operation?"
        },
        ru: {
            headerTitle: "Мой Профиль",
            entriesLabel: "Записи",
            daysLabel: "Дни",
            avgLabel: "Среднее",
            premiumTitle: "⭐ Премиум",
            premiumDesc: "Откройте дополнительные функции",
            upgradeText: "Обновить",
            actionsTitle: "Быстрые Действия",
            moodHistoryText: "Старые Записи",
            exportText: "Экспорт Данных",
            remindersText: "Напоминания",
            goalsText: "Цели",
            accountTitle: "Управление Аккаунтом",
            switchAccountText: "Войти с другим аккаунтом",
            deleteAccountText: "Удалить аккаунт",
            settingsModalTitle: "Настройки",
            languageLabel: "Язык",
            themeLabel: "Тема",
            themeLight: "Светлая",
            themeDark: "Темная",
            notificationsLabel: "Уведомления",
            avatarModalTitle: "Фото Профиля",
            avatarModalDesc: "Выберите действие с фото",
            viewAvatarText: "Посмотреть Фото",
            changeAvatarText: "Добавить Новое Фото",
            deleteAvatarText: "Удалить Фото",
            closeAvatarText: "Закрыть",
            confirmationTitle: "Вы уверены?",
            confirmationMessage: "Подтверждаете это действие?"
        }
    };
    
    let currentLang = userData.language || 'az';
    let currentTheme = userData.theme || 'light';
    
    // Initialize
    initProfile();
    initEventListeners();
    applyTheme(currentTheme);
    updateLanguage();
    
    function initProfile() {
        console.log('Profil məlumatları yüklənir...');
        
        // Set user info
        document.getElementById('userName').textContent = userData.name || 'İstifadəçi Adı';
        document.getElementById('userEmail').textContent = userData.email || 'istifadeci@example.com';
        
        // Set avatar if exists
        if (userData.avatar) {
            document.getElementById('userAvatar').src = userData.avatar;
        }
        
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
        
        console.log('Profil uğurla yükləndi!');
    }
    
    function calculateAverageMood() {
        const moodEntries = moodData.filter(entry => entry.value);
        if (moodEntries.length === 0) return 0;
        
        const total = moodEntries.reduce((sum, entry) => sum + entry.value, 0);
        return total / moodEntries.length;
    }
    
    function updatePremiumStatus() {
        const premiumCard = document.getElementById('premiumCard');
        
        if (userData.premium) {
            premiumCard.innerHTML = `
                <div class="premium-info">
                    <h3 id="premiumTitle">⭐ Premium Aktiv</h3>
                    <p id="premiumDesc">Bütün xüsusiyyətlər aktivdir</p>
                </div>
                <a href="premium.html" class="upgrade-btn" style="background: #059669">
                    <span id="upgradeText">Aktiv</span>
                </a>
            `;
            updateLanguage();
        }
    }
    
    function loadSettings() {
        const languageSelect = document.getElementById('languageSelect');
        const themeSelect = document.getElementById('themeSelect');
        const notificationsToggle = document.getElementById('notificationsToggle');
        
        if (languageSelect) languageSelect.value = currentLang;
        if (themeSelect) themeSelect.value = currentTheme;
        if (notificationsToggle) notificationsToggle.checked = userData.notifications !== false;
    }
    
    function updateLanguage() {
        const t = translations[currentLang];
        
        // Bütün elementləri yenilə
        Object.keys(t).forEach(key => {
            const element = document.getElementById(key);
            if (element) {
                element.textContent = t[key];
            }
        });
    }
    
    function applyTheme(theme) {
        document.body.setAttribute('data-theme', theme);
        currentTheme = theme;
        userData.theme = theme;
        localStorage.setItem('moodTrackerUserData', JSON.stringify(userData));
    }
    
    // Confirmation Modal Functions - YENİ
    function showConfirmation(message, callback) {
        const modal = document.getElementById('confirmationModal');
        const messageEl = document.getElementById('confirmationMessage');
        const yesBtn = document.getElementById('confirmYes');
        const noBtn = document.getElementById('confirmNo');
        
        messageEl.textContent = message;
        modal.classList.add('active');
        
        const handleYes = function() {
            modal.classList.remove('active');
            yesBtn.removeEventListener('click', handleYes);
            noBtn.removeEventListener('click', handleNo);
            if (callback) callback(true);
        };
        
        const handleNo = function() {
            modal.classList.remove('active');
            yesBtn.removeEventListener('click', handleYes);
            noBtn.removeEventListener('click', handleNo);
            if (callback) callback(false);
        };
        
        yesBtn.addEventListener('click', handleYes);
        noBtn.addEventListener('click', handleNo);
    }
    
    function initEventListeners() {
        console.log('Button event-ləri əlavə edilir...');
        
        // Avatar Modal
        const userAvatar = document.getElementById('userAvatar');
        const avatarModal = document.getElementById('avatarModal');
        const editAvatarBtn = document.getElementById('editAvatarBtn');
        const avatarFileInput = document.getElementById('avatarFileInput');
        
        if (userAvatar && avatarModal) {
            userAvatar.addEventListener('click', function() {
                avatarModal.classList.add('active');
            });
        }
        
        if (editAvatarBtn && avatarFileInput) {
            editAvatarBtn.addEventListener('click', function() {
                avatarFileInput.click();
            });
        }
        
        // Avatar File Selection
        if (avatarFileInput) {
            avatarFileInput.addEventListener('change', function(e) {
                const file = e.target.files[0];
                if (file) {
                    if (file.type.startsWith('image/')) {
                        const reader = new FileReader();
                        reader.onload = function(e) {
                            userAvatar.src = e.target.result;
                            userData.avatar = e.target.result;
                            localStorage.setItem('moodTrackerUserData', JSON.stringify(userData));
                            showConfirmation('Profil şəkli uğurla dəyişdirildi! 📷', function() {
                                avatarModal.classList.remove('active');
                            });
                        };
                        reader.readAsDataURL(file);
                    } else {
                        showConfirmation('Zəhmət olmasa şəkil faylı seçin!', function() {});
                    }
                }
            });
        }
        
        // Avatar Modal Buttons
        const viewAvatarBtn = document.getElementById('viewAvatarBtn');
        const changeAvatarBtn = document.getElementById('changeAvatarBtn');
        const deleteAvatarBtn = document.getElementById('deleteAvatarBtn');
        const closeAvatarModalBtn = document.getElementById('closeAvatarModalBtn');
        
        if (viewAvatarBtn) {
            viewAvatarBtn.addEventListener('click', function() {
                window.open(userAvatar.src, '_blank');
            });
        }
        
        if (changeAvatarBtn) {
            changeAvatarBtn.addEventListener('click', function() {
                avatarFileInput.click();
            });
        }
        
        if (deleteAvatarBtn) {
            deleteAvatarBtn.addEventListener('click', function() {
                showConfirmation('Profil şəklini silmək istədiyinizə əminsiniz?', function(confirmed) {
                    if (confirmed) {
                        userAvatar.src = 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png';
                        delete userData.avatar;
                        localStorage.setItem('moodTrackerUserData', JSON.stringify(userData));
                        showConfirmation('Profil şəkli uğurla silindi!', function() {
                            avatarModal.classList.remove('active');
                        });
                    }
                });
            });
        }
        
        if (closeAvatarModalBtn) {
            closeAvatarModalBtn.addEventListener('click', function() {
                avatarModal.classList.remove('active');
            });
        }
        
        // Avatar Modal xaricində kliklə bağlamaq
        if (avatarModal) {
            avatarModal.addEventListener('click', function(e) {
                if (e.target === avatarModal) {
                    avatarModal.classList.remove('active');
                }
            });
        }
        
        // Edit Name - YENİ (Modal ilə)
        const editNameBtn = document.getElementById('editNameBtn');
        const editNameModal = document.getElementById('editNameModal');
        const nameInput = document.getElementById('nameInput');
        const saveNameBtn = document.getElementById('saveNameBtn');
        const cancelNameBtn = document.getElementById('cancelNameBtn');
        
        if (editNameBtn) {
            editNameBtn.addEventListener('click', function() {
                nameInput.value = userData.name || '';
                editNameModal.classList.add('active');
            });
        }
        
        if (saveNameBtn) {
            saveNameBtn.addEventListener('click', function() {
                const newName = nameInput.value.trim();
                if (newName) {
                    userData.name = newName;
                    localStorage.setItem('moodTrackerUserData', JSON.stringify(userData));
                    document.getElementById('userName').textContent = newName;
                    editNameModal.classList.remove('active');
                    showConfirmation('Ad uğurla dəyişdirildi! ✅', function() {});
                }
            });
        }
        
        if (cancelNameBtn) {
            cancelNameBtn.addEventListener('click', function() {
                editNameModal.classList.remove('active');
            });
        }
        
        // Edit Email - YENİ (Modal ilə)
        const editEmailBtn = document.getElementById('editEmailBtn');
        const editEmailModal = document.getElementById('editEmailModal');
        const emailInput = document.getElementById('emailInput');
        const saveEmailBtn = document.getElementById('saveEmailBtn');
        const cancelEmailBtn = document.getElementById('cancelEmailBtn');
        
        if (editEmailBtn) {
            editEmailBtn.addEventListener('click', function() {
                emailInput.value = userData.email || '';
                editEmailModal.classList.add('active');
            });
        }
        
        if (saveEmailBtn) {
            saveEmailBtn.addEventListener('click', function() {
                const newEmail = emailInput.value.trim();
                if (newEmail) {
                    userData.email = newEmail;
                    localStorage.setItem('moodTrackerUserData', JSON.stringify(userData));
                    document.getElementById('userEmail').textContent = newEmail;
                    editEmailModal.classList.remove('active');
                    showConfirmation('E-poçt uğurla dəyişdirildi! ✅', function() {});
                }
            });
        }
        
        if (cancelEmailBtn) {
            cancelEmailBtn.addEventListener('click', function() {
                editEmailModal.classList.remove('active');
            });
        }
        
        // Edit Modal xaricində kliklə bağlamaq
        const editModals = document.querySelectorAll('.edit-modal');
        editModals.forEach(modal => {
            modal.addEventListener('click', function(e) {
                if (e.target === modal) {
                    modal.classList.remove('active');
                }
            });
        });
        
        // Confirmation Modal xaricində kliklə bağlamaq
        const confirmationModal = document.getElementById('confirmationModal');
        if (confirmationModal) {
            confirmationModal.addEventListener('click', function(e) {
                if (e.target === confirmationModal) {
                    confirmationModal.classList.remove('active');
                }
            });
        }
        
        // Settings Modal
        const settingsBtn = document.getElementById('settingsBtn');
        const settingsModal = document.getElementById('settingsModal');
        const closeSettings = document.getElementById('closeSettings');
        
        if (settingsBtn && settingsModal) {
            settingsBtn.addEventListener('click', function() {
                settingsModal.classList.add('active');
            });
            
            closeSettings.addEventListener('click', function() {
                settingsModal.classList.remove('active');
            });
            
            settingsModal.addEventListener('click', function(e) {
                if (e.target === settingsModal) {
                    settingsModal.classList.remove('active');
                }
            });
        }
        
        // Dil dəyişmə
        const languageSelect = document.getElementById('languageSelect');
        if (languageSelect) {
            languageSelect.addEventListener('change', function() {
                currentLang = this.value;
                userData.language = currentLang;
                localStorage.setItem('moodTrackerUserData', JSON.stringify(userData));
                updateLanguage();
            });
        }
        
        // Tema dəyişmə
        const themeSelect = document.getElementById('themeSelect');
        if (themeSelect) {
            themeSelect.addEventListener('change', function() {
                applyTheme(this.value);
            });
        }
        
        // Bildirişlər
        const notificationsToggle = document.getElementById('notificationsToggle');
        if (notificationsToggle) {
            notificationsToggle.addEventListener('change', function() {
                userData.notifications = this.checked;
                localStorage.setItem('moodTrackerUserData', JSON.stringify(userData));
                showConfirmation(
                    this.checked ? 'Bildirişlər aktiv edildi 🔔' : 'Bildirişlər deaktiv edildi', 
                    function() {}
                );
            });
        }
        
        // YENİ Sürətli Əməliyyatlar
        const moodHistoryBtn = document.getElementById('moodHistoryBtn');
        const exportBtn = document.getElementById('exportBtn');
        const remindersBtn = document.getElementById('remindersBtn');
        const goalsBtn = document.getElementById('goalsBtn');
        
        if (moodHistoryBtn) {
            moodHistoryBtn.addEventListener('click', function() {
                showConfirmation('Köhnə girişlər səhifəsi açılacaq (Nümunə) 📈', function() {
                    // Burada köhnə girişlər səhifəsinə yönləndirmə əlavə edilə bilər
                });
            });
        }
        
        if (exportBtn) {
            exportBtn.addEventListener('click', function() {
                const dataStr = JSON.stringify(moodData, null, 2);
                const dataBlob = new Blob([dataStr], {type: 'application/json'});
                const url = URL.createObjectURL(dataBlob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'mood-tracker-backup.json';
                a.click();
                URL.revokeObjectURL(url);
                showConfirmation('Məlumatlar uğurla ixrac edildi! 📤', function() {});
            });
        }
        
        if (remindersBtn) {
            remindersBtn.addEventListener('click', function() {
                showConfirmation('Xatırlatmalar səhifəsi (Nümunə) ⏰', function() {});
            });
        }
        
        if (goalsBtn) {
            goalsBtn.addEventListener('click', function() {
                showConfirmation('Hədəflər səhifəsi (Nümunə) 🎯', function() {});
            });
        }
        
        // Hesabı sil - YENİ
        const deleteAccountBtn = document.getElementById('deleteAccountBtn');
        if (deleteAccountBtn) {
            deleteAccountBtn.addEventListener('click', function() {
                showConfirmation('HESABINIZ SİLİNƏCƏK! Bütün məlumatlarınız itəcək. Davam etmək istədiyinizə əminsiniz?', function(confirmed) {
                    if (confirmed) {
                        // Bütün məlumatları sil
                        localStorage.removeItem('moodTrackerUserData');
                        localStorage.removeItem('moodTrackerData_v1');
                        localStorage.removeItem('moodTrackerSettings');
                        
                        showConfirmation('Hesabınız uğurla silindi! Ana səhifəyə yönləndirilirsiniz...', function() {
                            window.location.href = 'index.html';
                        });
                    }
                });
            });
        }
        
        console.log('Bütün button event-ləri əlavə edildi!');
    }
});
