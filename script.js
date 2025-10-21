/* Core state & helpers */
const STORAGE_KEY = 'moodTrackerData_v1';
const USER_DATA_KEY = 'moodTrackerUserData';
const moodMap = {
    5: {az:'Çox xoşbəxt', en:'Very Happy', ru:'Очень счастлив'},
    4: {az:'Yaxşı', en:'Good', ru:'Хорошо'},
    3: {az:'Neytral', en:'Neutral', ru:'Нейтрально'},
    2: {az:'Kədərli', en:'Sad', ru:'Грустно'},
    1: {az:'Çox pis', en:'Very Bad', ru:'Очень плохо'}
};
const qs = s => document.querySelector(s);
const qsa = s => Array.from(document.querySelectorAll(s));
let data = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
let userData = JSON.parse(localStorage.getItem(USER_DATA_KEY) || '{}');
let selected = null;
let chartInst = null;
let currentLang = userData.language || 'az';
let currentTheme = userData.theme || 'light';

/* AI Chat Translations */
const chatTranslations = {
    az: {
        chatTitle: "💬 Mood AI",
        aiWelcome: "Mood AI:",
        aiWelcomeText: "Salam! Mən sizin mood köməkçisiniz. 🫂 Bugün özünüzü necə hiss edirsiniz?",
        quickMotivation: "🚀 Motivasiya",
        quickSad: "😔 Pis hiss", 
        quickStress: "😫 Stress",
        quickTalk: "💭 Danışmaq",
        chatPlaceholder: "Mənə yazın...",
        typing: "Mood AI yazır..."
    },
    en: {
        chatTitle: "💬 Mood AI", 
        aiWelcome: "Mood AI:",
        aiWelcomeText: "Hello! I'm your mood assistant. 🫂 How are you feeling today?",
        quickMotivation: "🚀 Motivation",
        quickSad: "😔 Feel bad",
        quickStress: "😫 Stress", 
        quickTalk: "💭 Talk",
        chatPlaceholder: "Write to me...",
        typing: "Mood AI is typing..."
    },
    ru: {
        chatTitle: "💬 Mood AI",
        aiWelcome: "Mood AI:",
        aiWelcomeText: "Привет! Я ваш помощник по настроению. 🫂 Как вы себя чувствуете сегодня?",
        quickMotivation: "🚀 Мотивация",
        quickSad: "😔 Плохо себя чувствую",
        quickStress: "😫 Стресс",
        quickTalk: "💭 Поговорить", 
        chatPlaceholder: "Напишите мне...",
        typing: "Mood AI печатает..."
    }
};

/* AI Chat System */
const aiResponses = {
    motivation: {
        az: [
            "🚀 **Siz əlasınız!** Hər gün kiçik addımlarla irəliləyirsiniz. ✨\n\n*Xatırlayın:*\n• Hər səhər 3 şeyə minnətdar olun\n• Kiçik qələbələri qeyd edin\n• Özünüzə mərhəmət göstərin",
            "💪 **Güclüsünüz!** Bu an keçəcək, amma sizin gücünüz qalacaq.\n\n*Məsləhət:* 5 dəqiqə dərin nəfəs məşqi edin və özünüzə 'Mən bacarıram' deyin.",
            "🌟 **Sizdə potensial var!** Mood məlumatlarınıza görə, həftəsonları daha enerjili olursunuz. Bu həftəsonu sevdiyiniz bir fəaliyyət planlaşdırın!"
        ],
        en: [
            "🚀 **You're amazing!** You're progressing with small steps every day. ✨\n\n*Remember:*\n• Be grateful for 3 things every morning\n• Note small victories\n• Show yourself compassion",
            "💪 **You're strong!** This moment will pass, but your strength will remain.\n\n*Tip:* Do 5 minutes of deep breathing and tell yourself 'I can do this'.",
            "🌟 **You have potential!** According to your mood data, you're more energetic on weekends. Plan an activity you love this weekend!"
        ],
        ru: [
            "🚀 **Вы прекрасны!** Вы прогрессируете маленькими шагами каждый день. ✨\n\n*Помните:*\n• Будьте благодарны за 3 вещи каждое утро\n• Отмечайте маленькие победы\n• Проявляйте сострадание к себе",
            "💪 **Вы сильны!** Этот момент пройдет, но ваша сила останется.\n\n*Совет:* Сделайте 5 минут глубокого дыхания и скажите себе 'Я могу это сделать'.",
            "🌟 **У вас есть потенциал!** Согласно вашим данным о настроении, вы более энергичны по выходным. Запланируйте любимое занятие на эти выходные!"
        ]
    },
    sad: {
        az: [
            "🫂 **Bunu hiss etdiyiniz üçün təəssüf edirəm.** Kədərli hisslər çox ağır ola bilər.\n\n*Təklif:*\n• Sevimli musiqinizi dinləyin\n• Təbiətə çıxıb təzə hava alın\n• Dostunuzla söhbət edin",
            "😔 **Bu hisslər keçəcək.** Mood məlumatlarınıza görə, belə günlər nadir hallarda olur.\n\n*Fəaliyyət:* 10 dəqiqə gündəlik yazmaq kömək edə bilər.",
            "💙 **Sizi anlayıram.** Bəzən hər şey ağır gəlir. Xatırlayın, kömək istəmək güc əlamətidir."
        ],
        en: [
            "🫂 **I'm sorry you're feeling this way.** Sad feelings can be very heavy.\n\n*Suggestion:*\n• Listen to your favorite music\n• Go outside for fresh air\n• Talk to a friend",
            "😔 **These feelings will pass.** According to your mood data, such days are rare.\n\n*Activity:* 10 minutes of journaling might help.",
            "💙 **I understand you.** Sometimes everything feels heavy. Remember, asking for help is a sign of strength."
        ],
        ru: [
            "🫂 **Мне жаль, что вы так себя чувствуете.** Грустные чувства могут быть очень тяжелыми.\n\n*Предложение:*\n• Послушайте любимую музыку\n• Выйдите на свежий воздух\n• Поговорите с другом",
            "😔 **Эти чувства пройдут.** Согласно вашим данным о настроении, такие дни бывают редко.\n\n*Активность:* 10 минут ведения дневника могут помочь.",
            "💙 **Я понимаю вас.** Иногда все кажется тяжелым. Помните, просьба о помощи - это признак силы."
        ]
    },
    stress: {
        az: [
            "😮‍💨 **Stress idarəsi çətin ola bilər.** Gəlin birlikdə həll yolu tapaq.\n\n*Dərhal kömək:*\n• 4-7-8 nəfəs texnikası: 4 saniyə nəfəs al, 7 saxla, 8-də burax\n• 5 dəqiqə meditasiya\n• Stres topu ilə oynayın",
            "🏃‍♂️ **Stressdən qaçmaq üçün fəaliyyət:**\n• Qısa gəzintiyə çıxın\n• Otağı təmizləyin\n• Sevimli bir içki hazırlayın",
            "📊 **Mood statistikası:** Stress səviyyəniz bu həftə artıb. Gəlin stress idarə üsulları haqqında danışaq."
        ],
        en: [
            "😮‍💨 **Stress management can be difficult.** Let's find a solution together.\n\n*Immediate help:*\n• 4-7-8 breathing technique: inhale 4s, hold 7s, exhale 8s\n• 5 minutes meditation\n• Play with a stress ball",
            "🏃‍♂️ **Activity to escape stress:*\n• Take a short walk\n• Clean the room\n• Prepare a favorite drink",
            "📊 **Mood statistics:** Your stress level has increased this week. Let's talk about stress management methods."
        ],
        ru: [
            "😮‍💨 **Управление стрессом может быть трудным.** Давайте вместе найдем решение.\n\n*Немедленная помощь:*\n• Техника дыхания 4-7-8: вдох 4с, задержка 7с, выдох 8с\n• 5 минут медитации\n• Поиграйте с антистрессовым мячом",
            "🏃‍♂️ **Активность для снятия стресса:*\n• Совершите короткую прогулку\n• Уберите комнату\n• Приготовьте любимый напиток",
            "📊 **Статистика настроения:** Уровень вашего стресса увеличился на этой неделе. Давайте поговорим о методах управления стрессом."
        ]
    },
    talk: {
        az: [
            "💭 **Danışmaq gözəl fikirdir!** Burada sizi dinləməyə hazıram. 🎧\n\nNəyi paylaşmaq istəyirsiniz? Hissləriniz, düşüncələriniz, yaxud baş verənlər...",
            "👂 **Sizi dinləyirəm.** Bu təhlükəsiz məkandır, hər şeyi açıqca deyə bilərsiniz.\n\nNə ürəyinizi ağırlaşdırır?",
            "🤝 **Buradayam.** Bəzən danışmaq həllin yarısıdır. Hissləriniz haqqında danışmaq istəyirsiniz?"
        ],
        en: [
            "💭 **Talking is a great idea!** I'm here to listen to you. 🎧\n\nWhat would you like to share? Your feelings, thoughts, or what's happening...",
            "👂 **I'm listening to you.** This is a safe space, you can say anything openly.\n\nWhat's weighing on your heart?",
            "🤝 **I'm here.** Sometimes talking is half the solution. Would you like to talk about your feelings?"
        ],
        ru: [
            "💭 **Говорить - это отличная идея!** Я здесь, чтобы слушать вас. 🎧\n\nЧто вы хотите рассказать? Ваши чувства, мысли или то, что происходит...",
            "👂 **Я слушаю вас.** Это безопасное пространство, вы можете говорить все открыто.\n\nЧто тяготит ваше сердце?",
            "🤝 **Я здесь.** Иногда разговор - это половина решения. Хотите поговорить о своих чувствах?"
        ]
    },
    general: {
        az: [
            "🤗 **Sizi görmək gözəldir!** Bugün özünüzü necə hiss edirsiniz? Mood-unuz haqqında danışmaq istəyirsinizmi?",
            "💫 **Gününüz xoş keçsin!** Kömək etmək üçün buradayam. Hansı mövzuda dəstək lazımdır?",
            "🌞 **Salam!** Mood köməkçiniz olaraq, sizə dəstək olmaq üçün buradayam. Nə üzərində işləmək istəyirsiniz?"
        ],
        en: [
            "🤗 **Great to see you!** How are you feeling today? Would you like to talk about your mood?",
            "💫 **Have a nice day!** I'm here to help. What support do you need?",
            "🌞 **Hello!** As your mood assistant, I'm here to support you. What would you like to work on?"
        ],
        ru: [
            "🤗 **Рад видеть вас!** Как вы себя чувствуете сегодня? Хотите поговорить о вашем настроении?",
            "💫 **Хорошего дня!** Я здесь, чтобы помочь. Какая поддержка вам нужна?",
            "🌞 **Привет!** Как ваш помощник по настроению, я здесь, чтобы поддержать вас. Над чем вы хотите поработать?"
        ]
    }
};

function updateChatLanguage() {
    const t = chatTranslations[currentLang];
    
    // Update chat interface
    qs('#chatTitle').textContent = t.chatTitle;
    qs('#aiWelcome').textContent = t.aiWelcome;
    qs('#aiWelcomeText').textContent = t.aiWelcomeText;
    qs('#chatInput').placeholder = t.chatPlaceholder;
    
    // Update quick action buttons
    qs('#quickMotivation').textContent = t.quickMotivation;
    qs('#quickSad').textContent = t.quickSad;
    qs('#quickStress').textContent = t.quickStress;
    qs('#quickTalk').textContent = t.quickTalk;
}

function addMessage(text, isUser = false) {
    const messagesContainer = qs('#chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isUser ? 'user-message' : 'ai-message'}`;
    
    const time = new Date().toLocaleTimeString('az-AZ', { 
        hour: '2-digit', 
        minute: '2-digit' 
    });
    
    messageDiv.innerHTML = `
        <div class="message-content">${text}</div>
        <div class="message-time">${time}</div>
    `;
    
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function showTypingIndicator() {
    const indicator = document.createElement('div');
    indicator.className = 'message ai-message typing-indicator active';
    indicator.id = 'typingIndicator';
    indicator.innerHTML = `<div class="message-content"><em>${chatTranslations[currentLang].typing}</em></div>`;
    qs('#chatMessages').appendChild(indicator);
    qs('#chatMessages').scrollTop = qs('#chatMessages').scrollHeight;
}

function hideTypingIndicator() {
    const indicator = qs('#typingIndicator');
    if (indicator) indicator.remove();
}

function getAIResponse(userMessage, action = null) {
    showTypingIndicator();
    
    setTimeout(() => {
        hideTypingIndicator();
        
        let response;
        if (action) {
            const responses = aiResponses[action][currentLang];
            response = responses[Math.floor(Math.random() * responses.length)];
        } else if (userMessage.toLowerCase().includes('salam') || userMessage.toLowerCase().includes('hello') || userMessage.toLowerCase().includes('привет')) {
            const responses = aiResponses.general[currentLang];
            response = responses[Math.floor(Math.random() * responses.length)];
        } else if (userMessage.toLowerCase().includes('təşəkkür') || userMessage.toLowerCase().includes('thanks') || userMessage.toLowerCase().includes('спасибо')) {
            response = currentLang === 'az' ? 
                "🌟 **Xoşunuza gəldiyinə sevindim!** Hər zaman kömək etməyə hazıram. Başqa sualınız var?\n\n*Xatırlayın:* Gündəlik mood tracking sizin emosional sağlamlığınız üçün çox faydalıdır!" :
                currentLang === 'en' ?
                "🌟 **Glad you liked it!** I'm always ready to help. Do you have another question?\n\n*Remember:* Daily mood tracking is very beneficial for your emotional health!" :
                "🌟 **Рад, что вам понравилось!** Я всегда готов помочь. У вас есть другой вопрос?\n\n*Помните:* Ежедневное отслеживание настроения очень полезно для вашего эмоционального здоровья!";
        } else {
            response = currentLang === 'az' ?
                "🤔 **Başa düşdüm.** Bu mövzu haqqında daha çox danışmaq istəyirsiniz? Və ya başqa bir mövzuda kömək lazımdır?\n\n*Təklif:* Əgər xüsusi bir problemdən danışmaq istəyirsinizsə, 'danışmaq istəyirəm' seçimindən istifadə edin." :
                currentLang === 'en' ?
                "🤔 **I understand.** Would you like to talk more about this topic? Or do you need help with another topic?\n\n*Suggestion:* If you want to talk about a specific problem, use the 'I want to talk' option." :
                "🤔 **Я понимаю.** Хотите поговорить больше на эту тему? Или вам нужна помощь по другой теме?\n\n*Предложение:* Если вы хотите поговорить о конкретной проблеме, используйте опцию 'Хочу поговорить'.";
        }
        
        addMessage(response);
    }, 1500 + Math.random() * 1000);
}

function initChat() {
    const chatSidebar = qs('#chatSidebar');
    const toggleBtn = qs('#toggleChat');
    const chatOpenBtn = qs('#chatOpenBtn');
    const mainContent = qs('#mainContent');
    const sendBtn = qs('#sendMessage');
    const chatInput = qs('#chatInput');
    const quickBtns = qsa('.quick-btn');
    
    // Toggle chat sidebar
    toggleBtn.addEventListener('click', () => {
        chatSidebar.classList.toggle('collapsed');
        mainContent.classList.toggle('expanded');
        toggleBtn.textContent = chatSidebar.classList.contains('collapsed') ? '+' : '−';
    });
    
    // Open chat from button - YENİ
    chatOpenBtn.addEventListener('click', () => {
        chatSidebar.classList.remove('collapsed');
        mainContent.classList.remove('expanded');
        toggleBtn.textContent = '−';
    });
    
    // Send message
    function sendMessage() {
        const text = chatInput.value.trim();
        if (text) {
            addMessage(text, true);
            chatInput.value = '';
            getAIResponse(text);
        }
    }
    
    sendBtn.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });
    
    // Quick actions
    quickBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const action = btn.dataset.action;
            const text = btn.textContent;
            addMessage(text, true);
            getAIResponse(text, action);
        });
    });
    
    // Initial chat language update
    updateChatLanguage();
}

/* Profil Dropdown - YENİLƏNİB */
function initProfileDropdown() {
    const profileBtn = qs('#profileBtn');
    const dropdownMenu = qs('#dropdownMenu');
    const langBtns = qsa('.lang-btn');
    const themeBtns = qsa('.theme-btn');
    
    // Load user data
    updateProfileDropdown();
    
    // Toggle dropdown
    profileBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        dropdownMenu.style.display = dropdownMenu.style.display === 'block' ? 'none' : 'block';
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', () => {
        dropdownMenu.style.display = 'none';
    });
    
    // Prevent dropdown from closing when clicking inside
    dropdownMenu.addEventListener('click', (e) => {
        e.stopPropagation();
    });
    
    // Language selection - YENİ
    langBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const selectedLang = btn.dataset.lang;
            
            // Update active state
            langBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Change language
            currentLang = selectedLang;
            userData.language = currentLang;
            localStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));
            
            // Update UI
            updateChatLanguage();
            onLanguageChange();
        });
    });
    
    // Theme selection - YENİ
    themeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const selectedTheme = btn.dataset.theme;
            
            // Update active state
            themeBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Change theme
            applyTheme(selectedTheme);
        });
    });
    
    // Exit button
    const logoutBtn = dropdownMenu.querySelector('.dropdown-item.logout');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (confirm(currentLang === 'az' ? 'Hesabdan çıxmaq istədiyinizə əminsiniz?' : 
                        currentLang === 'en' ? 'Are you sure you want to logout?' : 
                        'Вы уверены, что хотите выйти?')) {
                window.location.href = 'login.register.html';
            }
        });
    }
}

function updateProfileDropdown() {
    // Update profile image
    const headerProfileImg = qs('#headerProfileImg');
    const dropdownProfileImg = qs('#dropdownProfileImg');
    const dropdownUserName = qs('#dropdownUserName');
    const dropdownUserEmail = qs('#dropdownUserEmail');
    
    if (userData.avatar) {
        headerProfileImg.src = userData.avatar;
        dropdownProfileImg.src = userData.avatar;
    }
    
    if (userData.name) {
        dropdownUserName.textContent = userData.name;
    }
    
    if (userData.email) {
        dropdownUserEmail.textContent = userData.email;
    }
    
    // Update active language button
    const langBtns = qsa('.lang-btn');
    langBtns.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.lang === currentLang);
    });
    
    // Update active theme button
    const themeBtns = qsa('.theme-btn');
    themeBtns.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.theme === currentTheme);
    });
}

/* Theme Functions - YENİ */
function applyTheme(theme) {
    document.body.setAttribute('data-theme', theme);
    currentTheme = theme;
    userData.theme = currentTheme;
    localStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));
    
    // Update chart if exists
    if (chartInst) {
        renderAll();
    }
}

/* DOM refs */
const pills = qsa('.pill');
const note = qs('#note');
const saveBtn = qs('#saveEntry');
const stickerBtn = qs('#stickerBtn');
const wordCount = qs('#wordCount');
const notesList = qs('#notesList');
const notesInput = qs('#noteInput');
const addNoteBtn = qs('#addNote');
const addStickerBtn = qs('#addSticker');
const filterDate = qs('#filterDate');
const resetFilter = qs('#resetFilter');
const statsSummary = qs('#statsSummary');
const chartCanvas = qs('#moodChart');

/* Init */
function init(){
    // Apply saved theme
    applyTheme(currentTheme);
    
    // AI Chat initialization
    initChat();
    
    // Profile Dropdown initialization
    initProfileDropdown();
    
    // pill selection
    pills.forEach(p => p.addEventListener('click', () => {
        pills.forEach(x=>x.classList.remove('selected'));
        p.classList.add('selected');
        selected = parseInt(p.dataset.value,10);
    }));

    // existing data rendering
    renderAll();

    // events
    saveBtn.addEventListener('click', onSave);
    note.addEventListener('input', updateWordCount);
    addNoteBtn.addEventListener('click', onAddNote);
    addStickerBtn.addEventListener('click', onAddSticker);
    resetFilter && resetFilter.addEventListener('click', ()=>{ filterDate.value=''; renderAll(); });
    filterDate && filterDate.addEventListener('change', () => renderAll());

    // Set today's date as default in filter
    if(filterDate) {
        const today = new Date().toISOString().split('T')[0];
        filterDate.value = today;
    }
}

/* ... (qalan funksiyalar eyni qalır) ... */

/* Helpers */
function persist(){ localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); }

function updateWordCount(){
    const wc = note.value.trim() ? note.value.trim().split(/\s+/).length : 0;
    wordCount.textContent = wc + ' söz';
}

function getLocalizedText(key) {
    const texts = {
        az: {save: 'Yadda saxla', addNote: 'Qeyd əlavə et', placeholder: 'Qeyd əlavə et...', selectMood: 'Əhval seçin.', emptyNote: 'Qeyd boşdur', confirmDelete: 'Həqiqətən silinsin?', entries: 'Girişlər'},
        en: {save: 'Save', addNote: 'Add note', placeholder: 'Add note...', selectMood: 'Select mood.', emptyNote: 'Note is empty', confirmDelete: 'Really delete?', entries: 'Entries'},
        ru: {save: 'Сохранить', addNote: 'Добавить заметку', placeholder: 'Добавить заметку...', selectMood: 'Выберите настроение.', emptyNote: 'Заметка пустая', confirmDelete: 'Удалить?', entries: 'Записи'}
    };
    return texts[currentLang][key] || texts.az[key];
}

/* Save entry */
function onSave(){
    if (!selected){ alert(getLocalizedText('selectMood')); return; }
    const text = note.value.trim();
    const now = new Date();
    const rec = { 
        id: Date.now(), 
        value: selected, 
        label: moodMap[selected][currentLang], 
        text, 
        date: now.toISOString().split('T')[0], 
        time: now.toLocaleTimeString() 
    };
    data.push(rec);
    persist();
    note.value=''; 
    updateWordCount(); 
    pills.forEach(x=>x.classList.remove('selected')); 
    selected=null;
    renderAll();
}

/* Notes (additional) */
function onAddNote(){
    const txt = notesInput.value.trim();
    if (!txt){ alert(getLocalizedText('emptyNote')); return; }
    const now = new Date();
    const rec = { 
        id: Date.now(), 
        type:'note', 
        text: txt, 
        sticker:'📝', 
        date: now.toISOString().split('T')[0], 
        time: now.toLocaleTimeString() 
    };
    data.push(rec); 
    persist(); 
    notesInput.value=''; 
    renderAll();
}

function onAddSticker(){
    const sticker = prompt('Sticker (emoji) daxil et, məsələn 😊') || '😊';
    const now = new Date();
    const rec = { 
        id: Date.now(), 
        type:'note', 
        text: '', 
        sticker: sticker, 
        date: now.toISOString().split('T')[0], 
        time: now.toLocaleTimeString() 
    };
    data.push(rec); 
    persist(); 
    renderAll();
}

/* Render entries / notes */
function renderAll(){
    // filter
    const f = filterDate && filterDate.value;
    const filtered = f ? data.filter(d => d.date === f) : data.slice();

    // render notes list (reverse newest first)
    notesList.innerHTML = '';
    filtered.slice().reverse().forEach(item => {
        const el = document.createElement('div');
        el.className = 'note-item';
        const sticker = item.sticker || (item.value ? (item.value>=4?'😊':'😢') : '📝');
        const meta = item.time ? `${item.date} ${item.time}` : item.date;
        const label = item.label || (item.type === 'note' ? 'Qeyd' : moodMap[item.value]?.[currentLang] || 'Əhval');
        
        el.innerHTML = `<div class="note-sticker">${sticker}</div>
                        <div class="note-body"><div class="note-meta">${label} • ${meta}</div>
                        <div class="note-text">${escapeHtml(item.text || '')}</div></div>
                        <div class="note-actions"><button class="dot-btn" data-id="${item.id}">⋮</button></div>`;
        notesList.appendChild(el);

        // attach menu handler
        el.querySelector('.dot-btn').addEventListener('click', e => openMenu(e, item));
    });

    // render chart & stats
    drawChart(filtered.filter(it => it.value));
    renderSummary(filtered.filter(it => it.value));
}

/* Menu: edit / delete */
function openMenu(e, item){
    closeMenus();
    const template = qs('#menuTemplate').content.cloneNode(true);
    const menu = template.querySelector('.menu');
    document.body.appendChild(menu);
    
    // position
    const rect = e.target.getBoundingClientRect();
    menu.style.position='fixed';
    menu.style.left = (rect.left - 80) + 'px';
    menu.style.top = (rect.top + 20) + 'px';
    menu.style.zIndex = '1000';

    // handlers
    menu.querySelector('.menu-edit').addEventListener('click', () => {
        const newText = prompt('Yeni mətn:', item.text || '');
        if (newText !== null){
            const idx = data.findIndex(d=>d.id===item.id);
            if (idx>-1){ data[idx].text = newText; persist(); renderAll(); }
        }
        menu.remove();
    });
    
    menu.querySelector('.menu-delete').addEventListener('click', () => {
        if (confirm(getLocalizedText('confirmDelete'))){
            data = data.filter(d => d.id !== item.id); persist(); renderAll();
        }
        menu.remove();
    });

    // close on outside click
    setTimeout(()=>{ document.addEventListener('click', docClick); }, 10);
    function docClick(ev){
        if (!menu.contains(ev.target)){ 
            menu.remove(); 
            document.removeEventListener('click', docClick); 
        }
    }
}

function closeMenus(){ qsa('.menu').forEach(m=>m.remove()); }

/* Chart functions */
function drawChart(items){
    const series = items.slice(-30); // last 30
    if (series.length === 0) {
        if (chartInst) chartInst.destroy();
        chartCanvas.innerHTML = '<div style="text-align:center;padding:40px;color:#6b7280">Məlumat yoxdur</div>';
        return;
    }
    
    const labels = series.map((s,i)=> `${s.date.split('-').slice(1).join('/')}`);
    const values = series.map(s => s.value);

    if (chartInst) chartInst.destroy();
    const ctx = chartCanvas.getContext('2d');

    chartInst = new Chart(ctx, {
        type:'line',
        data:{ 
            labels, 
            datasets:[{ 
                label:'Mood', 
                data: values, 
                borderWidth: 3, 
                fill: false, 
                tension: 0.35, 
                pointRadius: 4,
                borderColor: 'rgba(25,118,210,0.9)',
                backgroundColor: 'rgba(25,118,210,0.1)',
                pointBackgroundColor: 'rgba(25,118,210,1)'
            }]
        },
        options:{
            responsive:true,
            scales:{ 
                y:{
                    min:1,
                    max:5,
                    ticks:{
                        stepSize:1,
                        callback: v => ({1:'😢',2:'☹️',3:'😐',4:'🙂',5:'😀'}[v]||v)
                    }
                } 
            },
            plugins:{legend:{display:false}}
        }
    });
}

/* Summary */
function renderSummary(items){
    const counts = {5:0,4:0,3:0,2:0,1:0};
    items.forEach(it => counts[it.value] = (counts[it.value]||0) + 1);
    const total = Object.values(counts).reduce((a,b)=>a+b,0);
    statsSummary.textContent = `${getLocalizedText('entries')}: ${total} • 😀:${counts[5]} 🙂:${counts[4]} 😐:${counts[3]} ☹️:${counts[2]} 😢:${counts[1]}`;
}

/* Language change */
function onLanguageChange(){
    const map = {
        az: {
            entry:'Bugünkü əhval', 
            stats:'Əhval Statistikası', 
            notes:'Əlavə Qeydlər', 
            save:'Yadda saxla', 
            add:'Qeyd əlavə et',
            placeholder: 'Qısa qeyd (təxminən 100 sözə qədər)',
            reset: 'Sıfırla',
            sticker: 'Sticker əlavə et'
        },
        en: {
            entry:'How are you feeling today?', 
            stats:'Mood Statistics', 
            notes:'Additional Notes', 
            save:'Save', 
            add:'Add note',
            placeholder: 'Short note (about 100 words)',
            reset: 'Reset',
            sticker: 'Add sticker'
        },
        ru: {
            entry:'Какое у тебя настроение?', 
            stats:'Статистика настроения', 
            notes:'Дополнительные заметки', 
            save:'Сохранить', 
            add:'Добавить заметку',
            placeholder: 'Короткая заметка (около 100 слов)',
            reset: 'Сбросить',
            sticker: 'Добавить стикер'
        }
    };
    const t = map[currentLang] || map.az;
    qs('#entry-heading').textContent = t.entry;
    qs('.stats-card h3') && (qs('.stats-card h3').textContent = t.stats);
    qs('.notes-header h3') && (qs('.notes-header h3').textContent = t.notes);
    saveBtn && (saveBtn.textContent = t.save);
    addNoteBtn && (addNoteBtn.textContent = t.add);
    stickerBtn && (stickerBtn.textContent = t.sticker);
    resetFilter && (resetFilter.textContent = t.reset);
    note && (note.placeholder = t.placeholder);
    notesInput && (notesInput.placeholder = t.placeholder + '...');
    
    // Update all existing data labels
    data.forEach(item => {
        if (item.value && moodMap[item.value]) {
            item.label = moodMap[item.value][currentLang];
        }
    });
    
    // Update chat language
    updateChatLanguage();
    
    renderAll();
}

/* Utils */
function escapeHtml(s){ 
    return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); 
}

/* start */
document.addEventListener('DOMContentLoaded', init);
