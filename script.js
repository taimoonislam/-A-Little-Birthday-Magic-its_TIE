
"use strict";

/* =========================================
   A LITTLE BIRTHDAY MAGIC — its_TIE
   Main interactions, language, themes,
   birthday journey, memories, quiz and sound.
========================================= */

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

const body = document.body;

const state = {
    language: "en",
    recipient: "",
    currentSection: "welcome",
    giftOpened: false,
    candlesBlown: false,
    quizIndex: 0,
    quizScore: 0,
    quizAnswered: false,
    quizFinished: false,
    soundEnabled: false,
    darkMode: false,
    customColor: "#d9658d",
    photos: [],
    audioContext: null,
    musicTimer: null,
    musicNodes: [],
    musicGain: null,
    noteIndex: 0,
    toastTimer: null
};

/* =========================================
   TRANSLATIONS: ENGLISH, BANGLA, BANGLISH
========================================= */

const translations = {
    en: {
        brand: "A little birthday magic",
        soundOff: "Sound off",
        soundOn: "Sound on",
        chooseColors: "Choose your colors ♡",
        colorTheme: "Color theme",
        ownColor: "Your own color",
        themeNote: "Choose a color to personalize your birthday page.",
        musicVolume: "Music volume",

        welcomeEyebrow: "✧ A SPECIAL LITTLE SURPRISE ✧",
        todayAboutYou: "Today is all about you",
        happyBirthday: "Happy Birthday",
        heroDescription: "A tiny corner of the internet, filled with love, smiles and a little birthday magic.",
        birthdayStar: "Who is the birthday star?",
        namePlaceholder: "Enter their name...",
        letsBegin: "Let's begin",

        letterEyebrow: "A LITTLE NOTE FOR YOU",
        dearBirthdayStar: "Dear Birthday Star,",
        letterContent: "Today is a reminder that the world became a little brighter the day you arrived. May your days be filled with unexpected happiness, kind people, warm hugs and beautiful memories.",
        personalMessageLabel: "Add your personal message",
        messagePlaceholder: "Write something from your heart...",
        back: "Back",
        giftAwaits: "A little gift awaits",

        giftEyebrow: "SOMETHING JUST FOR YOU",
        giftHeading: "A little box of happiness",
        giftHint: "Tap the gift and see what's hiding inside.",
        giftMessageHeading: "A wish wrapped just for you! ♡",
        giftMessageText: "May this new chapter bring you peaceful mornings, brave dreams, genuine smiles and countless reasons to feel loved.",
        openMemories: "Open the memories",

        memoriesEyebrow: "LITTLE MOMENTS, BIG FEELINGS",
        memoriesHeading: "Our memory corner",
        memoriesDescription: "Add your favorite photos and make this page feel personal. Your selected photos stay in this browser session.",
        choosePhotos: "Choose your favorite photos",
        photoTypes: "JPG, PNG or WebP · Select multiple photos",
        emptyMemories: "Your lovely memories will appear here.",
        removePhoto: "Remove photo",
        quizNext: "A tiny birthday quiz",

        quizEyebrow: "JUST FOR FUN",
        quizHeading: "A little birthday quiz",
        quizDescription: "No pressure, just a few happy questions.",
        question: "Question",
        score: "Score",
        nextQuestion: "Next question",
        finishQuiz: "See my result",
        quizResult: "Quiz complete! Your score: {score} out of {total}. Every answer deserves a celebration! ♡",
        selectAnswer: "Choose an answer first.",
        correctAnswer: "Lovely choice! That's right! ♡",
        wrongAnswer: "Nice try! Every answer makes this day special. ♡",

        cakeEyebrow: "MAKE A LITTLE WISH",
        cakeHeading: "Your birthday cake is ready",
        cakeDescription: "Take a breath, make a wish and blow out the candles.",
        blowCandles: "Blow out the candles",
        candlesDone: "Wish made! May something wonderful come your way. ✨",
        lastSurprise: "One last surprise",

        finalEyebrow: "A FINAL LITTLE WISH",
        finalMessage: "May you always find little reasons to smile, courage to follow your dreams, and people who make your heart feel at home.",
        finalWish: "May your next chapter be your sweetest one yet.",
        celebrateAgain: "Celebrate one more time",
        copyLink: "Copy website link",
        startAgain: "Start again",
        footerText: "Made with love, a little sparkle and a birthday wish.",

        toastName: "Please enter the birthday star's name first. ♡",
        toastCopied: "Website link copied! Share the birthday magic. ♡",
        toastCopyFailed: "Couldn't copy automatically. Please copy the link from your browser's address bar.",
        toastPhoto: "Photos added to your memory corner! ♡",
        toastPhotoLimit: "You can add up to 20 photos.",
        toastPhotoType: "Please choose JPG, PNG or WebP images.",
        toastGift: "Your little surprise is open! 🎁",
        toastRestart: "Your birthday journey is ready to begin again. ♡",
        toastSoundUnavailable: "Sound couldn't start in this browser. Please try again.",
        toastPhotoRemoved: "Photo removed.",
        giftAria: "Open your birthday gift",
        darkMode: "Switch light/dark mode",
        themeMode: "Customize colors"
    },

    bn: {
        brand: "একটু জন্মদিনের জাদু",
        soundOff: "সাউন্ড বন্ধ",
        soundOn: "সাউন্ড চালু",
        chooseColors: "নিজের পছন্দের রং বেছে নাও ♡",
        colorTheme: "রঙের থিম",
        ownColor: "নিজের পছন্দের রং",
        themeNote: "জন্মদিনের পেজটিকে নিজের মতো সাজাতে একটি রং বেছে নাও।",
        musicVolume: "গানের আওয়াজ",

        welcomeEyebrow: "✧ তোমার জন্য ছোট্ট একটি সারপ্রাইজ ✧",
        todayAboutYou: "আজকের দিনটা শুধু তোমার",
        happyBirthday: "শুভ জন্মদিন",
        heroDescription: "ভালোবাসা, হাসি আর একটু জন্মদিনের জাদুতে ভরা ইন্টারনেটের ছোট্ট একটি জায়গা।",
        birthdayStar: "আজকের জন্মদিনের তারকার নাম কী?",
        namePlaceholder: "নাম লিখো...",
        letsBegin: "চলো শুরু করি",

        letterEyebrow: "তোমার জন্য ছোট্ট একটি চিঠি",
        dearBirthdayStar: "প্রিয় জন্মদিনের তারকা,",
        letterContent: "তোমার আগমনে পৃথিবীটা একটু বেশি সুন্দর হয়েছিল। তোমার প্রতিটি দিন ভরে উঠুক অপ্রত্যাশিত আনন্দ, ভালো মানুষ, উষ্ণ আলিঙ্গন আর সুন্দর স্মৃতিতে।",
        personalMessageLabel: "নিজের মনের কথাও লিখে দাও",
        messagePlaceholder: "মন থেকে কিছু লিখো...",
        back: "পেছনে",
        giftAwaits: "তোমার জন্য উপহার আছে",

        giftEyebrow: "শুধু তোমার জন্য",
        giftHeading: "এক বাক্স ছোট্ট সুখ",
        giftHint: "উপহারে ট্যাপ করো, ভেতরে কী আছে দেখো।",
        giftMessageHeading: "তোমার জন্য মোড়ানো একটি শুভকামনা! ♡",
        giftMessageText: "তোমার জীবনের নতুন অধ্যায় নিয়ে আসুক শান্ত সকাল, সাহসী স্বপ্ন, খাঁটি হাসি আর ভালোবাসা অনুভব করার অসংখ্য কারণ।",
        openMemories: "স্মৃতির পাতায় চলো",

        memoriesEyebrow: "ছোট্ট মুহূর্ত, অনেক অনুভূতি",
        memoriesHeading: "আমাদের স্মৃতির কোণ",
        memoriesDescription: "নিজের পছন্দের ছবি যোগ করে পেজটিকে আরও ব্যক্তিগত করে তোলো। ছবিগুলো এই ব্রাউজার সেশনে থাকবে।",
        choosePhotos: "পছন্দের ছবি বেছে নাও",
        photoTypes: "JPG, PNG অথবা WebP · একাধিক ছবি বেছে নিতে পারো",
        emptyMemories: "তোমার সুন্দর স্মৃতিগুলো এখানে দেখা যাবে।",
        removePhoto: "ছবি সরাও",
        quizNext: "ছোট্ট জন্মদিনের কুইজ",

        quizEyebrow: "শুধু মজার জন্য",
        quizHeading: "একটি ছোট্ট জন্মদিনের কুইজ",
        quizDescription: "চাপ নেই, কয়েকটি মজার প্রশ্ন মাত্র।",
        question: "প্রশ্ন",
        score: "স্কোর",
        nextQuestion: "পরের প্রশ্ন",
        finishQuiz: "ফলাফল দেখো",
        quizResult: "কুইজ শেষ! তোমার স্কোর: {score}/{total}। প্রতিটি উত্তরই উদযাপনের যোগ্য! ♡",
        selectAnswer: "আগে একটি উত্তর বেছে নাও।",
        correctAnswer: "দারুণ পছন্দ! উত্তরটি সঠিক! ♡",
        wrongAnswer: "ভালো চেষ্টা! প্রতিটি উত্তরই এই দিনটিকে বিশেষ করে। ♡",

        cakeEyebrow: "একটি ইচ্ছে করো",
        cakeHeading: "তোমার জন্মদিনের কেক তৈরি",
        cakeDescription: "একটু শ্বাস নাও, একটি ইচ্ছে করো, তারপর মোমবাতিগুলো নিভিয়ে দাও।",
        blowCandles: "মোমবাতি নিভিয়ে দাও",
        candlesDone: "ইচ্ছে করা হয়ে গেছে! তোমার জীবনে সুন্দর কিছু আসুক। ✨",
        lastSurprise: "শেষ একটি সারপ্রাইজ",

        finalEyebrow: "শেষ ছোট্ট একটি শুভকামনা",
        finalMessage: "তোমার হাসির ছোট ছোট কারণ থাকুক, স্বপ্নের পেছনে ছোটা সাহস থাকুক, আর এমন মানুষ থাকুক যাদের কাছে মনটা শান্তি পায়।",
        finalWish: "তোমার জীবনের পরের অধ্যায়টি হোক সবচেয়ে মিষ্টি।",
        celebrateAgain: "আরেকবার উদযাপন করি",
        copyLink: "ওয়েবসাইটের লিংক কপি",
        startAgain: "আবার শুরু করো",
        footerText: "ভালোবাসা, একটু ঝিলিক আর জন্মদিনের শুভকামনায় তৈরি।",

        toastName: "আগে জন্মদিনের তারকার নাম লিখো। ♡",
        toastCopied: "ওয়েবসাইটের লিংক কপি হয়েছে! শেয়ার করে দাও। ♡",
        toastCopyFailed: "স্বয়ংক্রিয়ভাবে কপি হয়নি। ব্রাউজারের address bar থেকে লিংক কপি করো।",
        toastPhoto: "স্মৃতির কোণে ছবি যোগ হয়েছে! ♡",
        toastPhotoLimit: "সর্বোচ্চ ২০টি ছবি যোগ করতে পারবে।",
        toastPhotoType: "JPG, PNG অথবা WebP ছবি বেছে নাও।",
        toastGift: "তোমার ছোট্ট সারপ্রাইজ খুলে গেছে! 🎁",
        toastRestart: "জন্মদিনের যাত্রা আবার শুরু করার জন্য প্রস্তুত। ♡",
        toastSoundUnavailable: "এই ব্রাউজারে সাউন্ড চালু করা যায়নি। আবার চেষ্টা করো।",
        toastPhotoRemoved: "ছবি সরানো হয়েছে।",
        giftAria: "জন্মদিনের উপহার খোলো",
        darkMode: "লাইট/ডার্ক মোড বদলাও",
        themeMode: "রং সাজাও"
    },

    banglish: {
        brand: "A little birthday magic",
        soundOff: "Sound off",
        soundOn: "Sound on",
        chooseColors: "Tomar pochonder rong beche nao ♡",
        colorTheme: "Color theme",
        ownColor: "Nijer pochonder rong",
        themeNote: "Birthday page nijer moto sajate ekta rong beche nao.",
        musicVolume: "Music volume",

        welcomeEyebrow: "✧ Tomar jonno chotto ekta surprise ✧",
        todayAboutYou: "Ajker dintaa shudhu tomar",
        happyBirthday: "Happy Birthday",
        heroDescription: "Bhalobasha, hashi ar ektu birthday magic diye bhora internet-er chotto ekta jayga.",
        birthdayStar: "Birthday star-er naam ki?",
        namePlaceholder: "Naam lekho...",
        letsBegin: "Cholo shuru kori",

        letterEyebrow: "Tomar jonno chotto ekta chithi",
        dearBirthdayStar: "Dear Birthday Star,",
        letterContent: "Tomar agomone prithibita aro ektu shundor hoyechilo. Tomar protita din bhore uthuk unexpected happiness, bhalo manush, warm hugs ar shundor memories diye.",
        personalMessageLabel: "Nijer moner kothao likhe dao",
        messagePlaceholder: "Mon theke kichu lekho...",
        back: "Pichhone",
        giftAwaits: "Tomar jonno gift ache",

        giftEyebrow: "Shudhu tomar jonno",
        giftHeading: "Ek box chotto shukh",
        giftHint: "Gift-e tap koro, bhitore ki ache dekho.",
        giftMessageHeading: "Tomar jonno morano ekta wish! ♡",
        giftMessageText: "Tomar jiboner notun chapter niye ashuk peaceful mornings, brave dreams, genuine smiles ar bhalobasha pawar onek karon.",
        openMemories: "Memories dekhte cholo",

        memoriesEyebrow: "Chotto moments, boro feelings",
        memoriesHeading: "Amader memory corner",
        memoriesDescription: "Tomar favourite photo add kore page-ta aro personal koro. Photo ei browser session-e thakbe.",
        choosePhotos: "Favourite photo choose koro",
        photoTypes: "JPG, PNG ba WebP · Multiple photo choose korte paro",
        emptyMemories: "Tomar shundor memories ekhane dekhabe.",
        removePhoto: "Photo remove koro",
        quizNext: "Chotto birthday quiz",

        quizEyebrow: "Shudhu moja korar jonno",
        quizHeading: "Ekta chotto birthday quiz",
        quizDescription: "Kono pressure nei, koyekta moja question.",
        question: "Question",
        score: "Score",
        nextQuestion: "Next question",
        finishQuiz: "Result dekho",
        quizResult: "Quiz shesh! Tomar score: {score}/{total}. Protita answer celebrate korar moto! ♡",
        selectAnswer: "Age ekta answer choose koro.",
        correctAnswer: "Darun choice! Answer thik! ♡",
        wrongAnswer: "Bhalo try! Protita answer-i din-ta special kore.",

        cakeEyebrow: "Ekta wish koro",
        cakeHeading: "Tomar birthday cake ready",
        cakeDescription: "Ektu shash nao, ekta wish koro, tarpor candle-gulo nibhiye dao.",
        blowCandles: "Candle nibhiye dao",
        candlesDone: "Wish kora hoyeche! Tomar jibone shundor kichu ashuk. ✨",
        lastSurprise: "Shesh ekta surprise",

        finalEyebrow: "Shesh chotto ekta wish",
        finalMessage: "Tomar hashar chotto chotto karon thakuk, shopner pichhone cholar shahosh thakuk, ar emon manush thakuk jader kache mon shanti pay.",
        finalWish: "Tomar jiboner next chapter-ta hok shobcheye sweet.",
        celebrateAgain: "Abar celebrate kori",
        copyLink: "Website link copy",
        startAgain: "Abar shuru koro",
        footerText: "Bhalobasha, ektu sparkle ar birthday wish diye banano.",

        toastName: "Age birthday star-er naam lekho. ♡",
        toastCopied: "Website link copy hoyeche! Share kore dao. ♡",
        toastCopyFailed: "Auto copy hoyni. Browser-er address bar theke link copy koro.",
        toastPhoto: "Memory corner-e photo add hoyeche! ♡",
        toastPhotoLimit: "Maximum 20-ta photo add korte parbe.",
        toastPhotoType: "JPG, PNG ba WebP photo choose koro.",
        toastGift: "Tomar chotto surprise open hoyeche! 🎁",
        toastRestart: "Birthday journey abar shuru korar jonno ready. ♡",
        toastSoundUnavailable: "Ei browser-e sound chalu hoyni. Abar try koro.",
        toastPhotoRemoved: "Photo remove hoyeche.",
        giftAria: "Birthday gift open koro",
        darkMode: "Light/dark mode change koro",
        themeMode: "Color customize koro"
    }
};

/* =========================================
   QUIZ DATA
========================================= */

const quizQuestions = [
    {
        question: {
            en: "What deserves an extra celebration today?",
            bn: "আজ কোন বিষয়টি সবচেয়ে বেশি উদযাপনের যোগ্য?",
            banglish: "Aj kon bishoy-ta shobcheye beshi celebrate korar moto?"
        },
        options: [
            { en: "Being you", bn: "তুমি যেমন, ঠিক তেমন হওয়া", banglish: "Tumi jemon, thik temon howa" },
            { en: "A random Monday", bn: "একটি সাধারণ সোমবার", banglish: "Ekta normal Monday" },
            { en: "Doing the laundry", bn: "কাপড় ধোয়া", banglish: "Kapoor dhowa" }
        ],
        answer: 0
    },
    {
        question: {
            en: "What is the best birthday gift?",
            bn: "জন্মদিনের সবচেয়ে সুন্দর উপহার কোনটি?",
            banglish: "Birthday-r shobcheye shundor gift konta?"
        },
        options: [
            { en: "A box with nothing inside", bn: "ভেতরে কিছু নেই এমন বাক্স", banglish: "Bhitore kichu nei emon box" },
            { en: "Love, memories and thoughtful surprises", bn: "ভালোবাসা, স্মৃতি আর সুন্দর সারপ্রাইজ", banglish: "Bhalobasha, memories ar shundor surprise" },
            { en: "An unfinished to-do list", bn: "অসমাপ্ত কাজের তালিকা", banglish: "Unfinished to-do list" }
        ],
        answer: 1
    },
    {
        question: {
            en: "What should the new year of life bring?",
            bn: "জীবনের নতুন বছর কী নিয়ে আসুক?",
            banglish: "Jiboner notun bochor ki niye ashuk?"
        },
        options: [
            { en: "More stress", bn: "আরও দুশ্চিন্তা", banglish: "Aro stress" },
            { en: "Less sleep forever", bn: "চিরদিন কম ঘুম", banglish: "Chirodin kom ghum" },
            { en: "Joy, growth and beautiful memories", bn: "আনন্দ, উন্নতি আর সুন্দর স্মৃতি", banglish: "Anondo, growth ar shundor memories" }
        ],
        answer: 2
    },
    {
        question: {
            en: "What should you remember on a difficult day?",
            bn: "কঠিন দিনে কোন কথাটি মনে রাখা উচিত?",
            banglish: "Kothin dine kon kothata mone rakha uchit?"
        },
        options: [
            { en: "You deserve kindness, too", bn: "তুমিও ভালো ব্যবহার পাওয়ার যোগ্য", banglish: "Tumio bhalo behavior pawar joggo" },
            { en: "You must be perfect", bn: "তোমাকে নিখুঁত হতেই হবে", banglish: "Tomake perfect hotei hobe" },
            { en: "Never take a break", bn: "কখনো বিশ্রাম নেওয়া যাবে না", banglish: "Kokhono break neowa jabe na" }
        ],
        answer: 0
    },
    {
        question: {
            en: "One final birthday question: are you loved?",
            bn: "শেষ জন্মদিনের প্রশ্ন: তুমি কি ভালোবাসা পাও?",
            banglish: "Shesh birthday question: tumi ki bhalobasha pao?"
        },
        options: [
            { en: "Absolutely. Never forget it.", bn: "অবশ্যই। কখনো ভুলে যেও না।", banglish: "Obosshoi. Kokhono bhule jeo na." },
            { en: "Only on birthdays", bn: "শুধু জন্মদিনে", banglish: "Shudhu birthday-te" },
            { en: "Let me check my calendar", bn: "ক্যালেন্ডার দেখে নিই", banglish: "Calendar dekhe nei" }
        ],
        answer: 0
    }
];

/* =========================================
   LANGUAGE HELPERS
========================================= */

function t(key) {
    return translations[state.language]?.[key]
        ?? translations.en[key]
        ?? key;
}

function translated(value) {
    if (value && typeof value === "object") {
        return value[state.language] ?? value.en ?? "";
    }
    return value ?? "";
}

function applyLanguage(language) {
    if (!translations[language]) language = "en";

    state.language = language;
    document.documentElement.lang = language === "bn" ? "bn" : "en";

    $$("[data-i18n]").forEach((element) => {
        const key = element.dataset.i18n;
        if (translations[language][key] !== undefined) {
            element.textContent = translations[language][key];
        }
    });

    const nameInput = $("#recipient-name");
    const messageInput = $("#personal-message");

    if (nameInput) nameInput.placeholder = t("namePlaceholder");
    if (messageInput) messageInput.placeholder = t("messagePlaceholder");

    const soundLabel = $("#sound-label");
    if (soundLabel) {
        soundLabel.textContent = state.soundEnabled ? t("soundOn") : t("soundOff");
    }

    const themeToggle = $("#theme-toggle");
    if (themeToggle) themeToggle.title = t("themeMode");

    const modeToggle = $("#mode-toggle");
    if (modeToggle) {
        modeToggle.title = t("darkMode");
        modeToggle.setAttribute("aria-label", t("darkMode"));
    }

    const giftBox = $("#gift-box");
    if (giftBox) giftBox.setAttribute("aria-label", t("giftAria"));

    const photoInput = $("#memory-photos");
    if (photoInput) {
        photoInput.setAttribute("aria-label", t("choosePhotos"));
    }

    updateMessageCount();
    renderPhotos();
    renderQuiz();

    if (state.quizFinished) {
        showQuizResult();
    }

    updateFinalMessage();

    try {
        localStorage.setItem("birthday-language", language);
    } catch (error) {
        // The site still works when browser storage is unavailable.
    }
}

/* =========================================
   TOAST NOTIFICATION
========================================= */

function showToast(message) {
    const toast = $("#toast");
    if (!toast) return;

    toast.textContent = message;
    toast.classList.add("show");

    clearTimeout(state.toastTimer);

    state.toastTimer = setTimeout(() => {
        toast.classList.remove("show");
    }, 2800);
}

/* =========================================
   BIRTHDAY NAME AND MESSAGE
========================================= */

function getRecipientName() {
    return state.recipient.trim() || (
        state.language === "bn"
            ? "জন্মদিনের তারকা"
            : state.language === "banglish"
                ? "Birthday Star"
                : "Birthday Star"
    );
}

function updateFinalMessage() {
    const finalName = $("#final-name");
    if (finalName) finalName.textContent = getRecipientName();

    const customMessage = $("#personal-message")?.value.trim();
    const finalMessage = $("#final-message");

    if (finalMessage) {
        finalMessage.textContent = customMessage || t("finalMessage");
    }
}

function updateMessageCount() {
    const message = $("#personal-message");
    const counter = $("#message-count");

    if (message && counter) {
        counter.textContent = `${message.value.length} / 500`;
    }
}

/* =========================================
   NAVIGATION
========================================= */

const sectionOrder = [
    "welcome",
    "letter",
    "gift",
    "memories",
    "quiz",
    "cake",
    "final"
];

function showSection(name) {
    if (!sectionOrder.includes(name)) return;

    state.currentSection = name;

    $$(".birthday-section").forEach((section) => {
        section.classList.toggle(
            "active",
            section.dataset.section === name
        );
    });

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

    if (name === "final") {
        updateFinalMessage();
    }
}

function goNext() {
    const currentIndex = sectionOrder.indexOf(state.currentSection);
    if (currentIndex < sectionOrder.length - 1) {
        showSection(sectionOrder[currentIndex + 1]);
    }
}

function goBack() {
    const currentIndex = sectionOrder.indexOf(state.currentSection);
    if (currentIndex > 0) {
        showSection(sectionOrder[currentIndex - 1]);
    }
}

/* =========================================
   THEME PANEL AND PRESET COLORS
========================================= */

function toggleThemePanel() {
    const panel = $("#theme-panel");
    if (!panel) return;

    panel.hidden = !panel.hidden;

    const musicPanel = $("#music-panel");
    if (musicPanel) musicPanel.hidden = true;
}

function setTheme(theme) {
    const validThemes = ["pink", "lavender", "midnight", "peach", "custom"];
    if (!validThemes.includes(theme)) theme = "pink";

    body.dataset.theme = theme;

    const picker = $("#theme-color-picker");
    if (picker && theme === "custom") {
        picker.value = state.customColor;
    }

    try {
        localStorage.setItem("birthday-theme", theme);
    } catch (error) {
        // Ignore storage restrictions.
    }
}

function setCustomColor(color) {
    if (!/^#[0-9a-f]{6}$/i.test(color)) return;

    state.customColor = color;
    body.style.setProperty("--custom-color", color);
    body.style.setProperty("--primary", color);

    setTheme("custom");

    try {
        localStorage.setItem("birthday-custom-color", color);
    } catch (error) {
        // Ignore storage restrictions.
    }
}

/* =========================================
   LIGHT / DARK MODE
========================================= */

function setDarkMode(enabled) {
    state.darkMode = Boolean(enabled);

    body.classList.toggle("dark-mode", state.darkMode);

    const icon = $("#mode-icon");
    if (icon) icon.textContent = state.darkMode ? "☀" : "☾";

    const button = $("#mode-toggle");
    if (button) {
        button.setAttribute("aria-pressed", String(state.darkMode));
    }

    try {
        localStorage.setItem("birthday-dark-mode", String(state.darkMode));
    } catch (error) {
        // Ignore storage restrictions.
    }
}

/* =========================================
   SOUND: SYNTHESIZED BACKGROUND MELODY
   No external MP3 is required for this fallback.
========================================= */


/* =========================================
   FIXED BIRTHDAY SOUND SYSTEM
========================================= */

function ensureAudio() {
    const AudioContextClass =
        window.AudioContext || window.webkitAudioContext;

    if (!AudioContextClass) {
        throw new Error("Web Audio is not supported.");
    }

    if (!state.audioContext || state.audioContext.state === "closed") {
        state.audioContext = new AudioContextClass();
        state.musicGain = state.audioContext.createGain();
        state.musicGain.gain.value = 0.08;
        state.musicGain.connect(state.audioContext.destination);
    }

    if (state.audioContext.state === "suspended") {
        return state.audioContext.resume();
    }

    return Promise.resolve();
}

const melody = [
    523.25, 659.25, 783.99, 659.25,
    587.33, 698.46, 880.00, 698.46,
    523.25, 659.25, 783.99, 1046.50,
    880.00, 783.99, 659.25, 587.33
];

function playNote(frequency, duration = 0.42) {
    if (!state.audioContext || !state.musicGain || !state.soundEnabled) return;

    const ctx = state.audioContext;
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();
    const now = ctx.currentTime;

    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(frequency, now);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.18, now + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    oscillator.connect(gain);
    gain.connect(state.musicGain);

    oscillator.start(now);
    oscillator.stop(now + duration + 0.05);

    state.musicNodes.push(oscillator);

    oscillator.addEventListener("ended", () => {
        state.musicNodes = state.musicNodes.filter(node => node !== oscillator);
        oscillator.disconnect();
        gain.disconnect();
    }, { once: true });
}

function playMelodyStep() {
    if (!state.soundEnabled) return;

    playNote(melody[state.noteIndex % melody.length]);
    state.noteIndex = (state.noteIndex + 1) % melody.length;
}

function updateMusicVolume() {
    if (!state.audioContext || !state.musicGain) return;

    const slider = $("#music-volume");
    const volume = Number(slider?.value ?? 25) / 100;

    state.musicGain.gain.setTargetAtTime(
        volume * 0.22,
        state.audioContext.currentTime,
        0.05
    );
}

function triggerUserChime() {
    if (!state.audioContext || state.audioContext.state !== "running") return;

    const notes = [659.25, 783.99, 1046.5];
    notes.forEach((frequency, index) => {
        window.setTimeout(() => {
            playSound(frequency, 0.25, "triangle");
        }, index * 170);
    });
}

async function startSound() {
    try {
        await ensureAudio();

        state.soundEnabled = true;
        state.noteIndex = 0;
        updateMusicVolume();

        if (state.musicTimer) {
            clearInterval(state.musicTimer);
        }

        triggerUserChime();
        playMelodyStep();
        state.musicTimer = window.setInterval(playMelodyStep, 420);

        updateSoundButton();
    } catch (error) {
        console.error("Could not start birthday sound:", error);
        state.soundEnabled = false;
        updateSoundButton();
        showToast(t("toastSoundUnavailable"));
    }
}

function stopSound() {
    state.soundEnabled = false;

    if (state.musicTimer) {
        clearInterval(state.musicTimer);
        state.musicTimer = null;
    }

    state.musicNodes.forEach(node => {
        try {
            node.stop();
        } catch (_) {
            // The note has already stopped.
        }
    });

    state.musicNodes = [];
    updateSoundButton();
}

function updateSoundButton() {
    const label = $("#sound-label");
    const icon = $("#sound-icon");
    const button = $("#sound-toggle");

    if (label) label.textContent = state.soundEnabled ? t("soundOn") : t("soundOff");
    if (icon) icon.textContent = state.soundEnabled ? "♫" : "♪";

    if (button) {
        button.setAttribute("aria-pressed", String(state.soundEnabled));
    }
}

/* Short sound effects */
function playSound(frequency = 523.25, duration = 0.2, type = "sine") {
    if (!state.audioContext || state.audioContext.state !== "running") return;

    const ctx = state.audioContext;
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();
    const now = ctx.currentTime;

    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, now);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.10, now + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    oscillator.connect(gain);
    gain.connect(ctx.destination);

    oscillator.start(now);
    oscillator.stop(now + duration + 0.04);

    oscillator.addEventListener("ended", () => {
        oscillator.disconnect();
        gain.disconnect();
    }, { once: true });
}

function playSoundEffect(effect = "correct") {
    const patterns = {
        correct: [659.25, 783.99],
        wrong: [293.66, 246.94],
        gift: [523.25, 659.25, 783.99],
        celebration: [523.25, 659.25, 783.99, 1046.5]
    };

    const notes = patterns[effect] || patterns.correct;

    // Browser audio must first be unlocked by a user click.
    if (!state.soundEnabled || !state.audioContext) return;

    notes.forEach((frequency, index) => {
        window.setTimeout(() => {
            if (state.soundEnabled && state.audioContext?.state === "running") {
                playSound(frequency, 0.22, "sine");
            }
        }, index * 150);
    });
}


/* =========================================
   GIFT
========================================= */

function openGift() {
    const giftBox = $("#gift-box");
    const giftMessage = $("#gift-message");
    const giftEmoji = $("#gift-emoji");

    if (!giftBox || !giftMessage) return;

    state.giftOpened = !state.giftOpened;

    giftBox.classList.toggle("opened", state.giftOpened);
    giftBox.setAttribute("aria-expanded", String(state.giftOpened));

    giftMessage.hidden = !state.giftOpened;

    if (giftEmoji) {
        giftEmoji.textContent = state.giftOpened ? "💝" : "🎁";
    }

    if (state.giftOpened) {
        launchConfetti(45);
        playSoundEffect("gift");
        showToast(t("toastGift"));
    }
}

/* =========================================
   PHOTO MEMORIES
========================================= */

function renderPhotos() {
    const preview = $("#photo-preview");
    if (!preview) return;

    preview.replaceChildren();

    if (state.photos.length === 0) {
        const empty = document.createElement("div");
        empty.className = "empty-memory";

        const icon = document.createElement("span");
        icon.textContent = "🌷";

        const paragraph = document.createElement("p");
        paragraph.textContent = t("emptyMemories");

        empty.append(icon, paragraph);
        preview.append(empty);
        return;
    }

    state.photos.forEach((photo, index) => {
        const card = document.createElement("div");
        card.className = "photo-card";

        const image = document.createElement("img");
        image.src = photo.url;
        image.alt = photo.name || `Memory ${index + 1}`;
        image.loading = "lazy";

        const removeButton = document.createElement("button");
        removeButton.type = "button";
        removeButton.className = "remove-photo";
        removeButton.textContent = "×";
        removeButton.setAttribute("aria-label", `${t("removePhoto")} ${index + 1}`);

        removeButton.addEventListener("click", () => {
            const removed = state.photos.splice(index, 1)[0];

            if (removed?.url) {
                URL.revokeObjectURL(removed.url);
            }

            renderPhotos();
            showToast(t("toastPhotoRemoved"));
        });

        card.append(image, removeButton);
        preview.append(card);
    });
}

function addPhotos(fileList) {
    const files = [...fileList];
    if (!files.length) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    const validFiles = files.filter((file) =>
        allowedTypes.includes(file.type)
    );

    if (validFiles.length !== files.length) {
        showToast(t("toastPhotoType"));
    }

    const remaining = 20 - state.photos.length;

    if (remaining <= 0) {
        showToast(t("toastPhotoLimit"));
        return;
    }

    if (validFiles.length > remaining) {
        showToast(t("toastPhotoLimit"));
    }

    validFiles.slice(0, remaining).forEach((file) => {
        state.photos.push({
            name: file.name,
            url: URL.createObjectURL(file)
        });
    });

    renderPhotos();

    if (validFiles.length > 0) {
        showToast(t("toastPhoto"));
    }
}

/* =========================================
   QUIZ
========================================= */

function renderQuiz() {
    const questionElement = $("#quiz-question");
    const optionsElement = $("#quiz-options");
    const counter = $("#quiz-counter");
    const score = $("#quiz-score");
    const progress = $("#quiz-progress");
    const nextButton = $("#quiz-next");
    const feedback = $("#quiz-feedback");

    if (!questionElement || !optionsElement) return;

    if (state.quizFinished) {
        questionElement.textContent = t("quizHeading");
        optionsElement.replaceChildren();

        if (counter) {
            counter.textContent =
                `${t("question")} ${quizQuestions.length}/${quizQuestions.length}`;
        }

        if (score) score.textContent = `${t("score")}: ${state.quizScore}`;

        if (progress) progress.style.width = "100%";

        if (nextButton) {
            nextButton.disabled = false;
            nextButton.textContent = t("lastSurprise") + " →";
        }

        if (feedback) feedback.textContent = "";

        return;
    }

    const question = quizQuestions[state.quizIndex];
    if (!question) return;

    questionElement.textContent = translated(question.question);
    optionsElement.replaceChildren();

    if (counter) {
        counter.textContent =
            `${t("question")} ${state.quizIndex + 1}/${quizQuestions.length}`;
    }

    if (score) {
        score.textContent = `${t("score")}: ${state.quizScore}`;
    }

    if (progress) {
        progress.style.width =
            `${(state.quizIndex / quizQuestions.length) * 100}%`;
    }

    if (nextButton) {
        nextButton.disabled = !state.quizAnswered;
        nextButton.textContent =
            state.quizIndex === quizQuestions.length - 1
                ? t("finishQuiz")
                : t("nextQuestion") + " →";
    }

    if (feedback) feedback.textContent = "";

    question.options.forEach((option, index) => {
        const button = document.createElement("button");

        button.type = "button";
        button.className = "quiz-option";
        button.textContent = translated(option);
        button.disabled = state.quizAnswered;

        button.addEventListener("click", () => {
            answerQuiz(index);
        });

        optionsElement.append(button);
    });
}

function answerQuiz(selectedIndex) {
    if (state.quizAnswered || state.quizFinished) return;

    const question = quizQuestions[state.quizIndex];
    const isCorrect = selectedIndex === question.answer;

    state.quizAnswered = true;

    if (isCorrect) state.quizScore += 1;

    const optionButtons = $$(".quiz-option");

    optionButtons.forEach((button, index) => {
        button.disabled = true;

        if (index === question.answer) {
            button.classList.add("correct");
        }

        if (index === selectedIndex && !isCorrect) {
            button.classList.add("incorrect");
        }

        if (index === selectedIndex) {
            button.classList.add("selected");
        }
    });

    const feedback = $("#quiz-feedback");
    if (feedback) {
        feedback.textContent = isCorrect
            ? t("correctAnswer")
            : t("wrongAnswer");
    }

    const score = $("#quiz-score");
    if (score) score.textContent = `${t("score")}: ${state.quizScore}`;

    const nextButton = $("#quiz-next");
    if (nextButton) nextButton.disabled = false;

    playSoundEffect(isCorrect ? "correct" : "wrong");
}

function showQuizResult() {
    const feedback = $("#quiz-feedback");
    const question = $("#quiz-question");
    const options = $("#quiz-options");
    const counter = $("#quiz-counter");
    const progress = $("#quiz-progress");
    const nextButton = $("#quiz-next");

    if (question) question.textContent = t("quizHeading");
    if (options) options.replaceChildren();

    if (counter) {
        counter.textContent =
            `${t("question")} ${quizQuestions.length}/${quizQuestions.length}`;
    }

    if (progress) progress.style.width = "100%";

    if (feedback) {
        feedback.textContent = t("quizResult")
            .replace("{score}", String(state.quizScore))
            .replace("{total}", String(quizQuestions.length));
    }

    if (nextButton) {
        nextButton.disabled = false;
        nextButton.textContent = t("lastSurprise") + " →";
    }
}

function advanceQuiz() {
    if (state.quizFinished) {
        showSection("cake");
        return;
    }

    if (!state.quizAnswered) {
        showToast(t("selectAnswer"));
        return;
    }

    if (state.quizIndex < quizQuestions.length - 1) {
        state.quizIndex += 1;
        state.quizAnswered = false;
        renderQuiz();
        return;
    }

    state.quizFinished = true;
    showQuizResult();
}

/* =========================================
   CAKE AND CANDLES
========================================= */

function blowCandles() {
    if (state.candlesBlown) {
        launchConfetti(25);
        return;
    }

    state.candlesBlown = true;

    const cakeScene = $(".cake-scene");
    if (cakeScene) cakeScene.classList.add("blown");

    const result = $("#candle-result");
    if (result) result.textContent = t("candlesDone");

    const button = $("#blow-candles");
    if (button) button.disabled = true;

    playSoundEffect("celebration");
    launchConfetti(100);
}

/* =========================================
   CONFETTI
========================================= */

function launchConfetti(amount = 60) {
    const colors = [
        "#d9658d",
        "#9475d8",
        "#f5bd87",
        "#f6a9c5",
        "#9f96ff",
        "#f7d6e5"
    ];

    for (let i = 0; i < amount; i += 1) {
        const piece = document.createElement("div");

        piece.className = "confetti-piece";
        piece.style.left = `${Math.random() * 100}vw`;
        piece.style.backgroundColor =
            colors[Math.floor(Math.random() * colors.length)];
        piece.style.setProperty("--fall-duration", `${2 + Math.random() * 3}s`);
        piece.style.setProperty("--drift", `${Math.random() * 180 - 90}px`);
        piece.style.animationDelay = `${Math.random() * 0.7}s`;
        piece.style.transform = `rotate(${Math.random() * 360}deg)`;

        document.body.append(piece);

        window.setTimeout(() => piece.remove(), 6000);
    }
}

/* =========================================
   COPY WEBSITE URL
========================================= */

async function copyWebsiteLink() {
    const websiteLink = window.location.href;

    try {
        if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(websiteLink);
            showToast(t("toastCopied"));
            return;
        }

        const temporaryInput = document.createElement("textarea");
        temporaryInput.value = websiteLink;
        temporaryInput.setAttribute("readonly", "");
        temporaryInput.style.position = "fixed";
        temporaryInput.style.opacity = "0";
        temporaryInput.style.pointerEvents = "none";

        document.body.append(temporaryInput);
        temporaryInput.select();

        const copied = document.execCommand("copy");
        temporaryInput.remove();

        if (copied) {
            showToast(t("toastCopied"));
        } else {
            showToast(t("toastCopyFailed"));
        }
    } catch (error) {
        showToast(t("toastCopyFailed"));
    }
}

/* =========================================
   RESTART THE JOURNEY
========================================= */

function restartJourney() {
    state.recipient = "";
    state.currentSection = "welcome";
    state.giftOpened = false;
    state.candlesBlown = false;
    state.quizIndex = 0;
    state.quizScore = 0;
    state.quizAnswered = false;
    state.quizFinished = false;

    const recipientInput = $("#recipient-name");
    const personalMessage = $("#personal-message");
    const giftMessage = $("#gift-message");
    const giftBox = $("#gift-box");
    const giftEmoji = $("#gift-emoji");
    const candleResult = $("#candle-result");
    const blowButton = $("#blow-candles");
    const cakeScene = $(".cake-scene");

    if (recipientInput) recipientInput.value = "";
    if (personalMessage) personalMessage.value = "";

    if (giftMessage) giftMessage.hidden = true;

    if (giftBox) {
        giftBox.classList.remove("opened");
        giftBox.setAttribute("aria-expanded", "false");
    }

    if (giftEmoji) giftEmoji.textContent = "🎁";
    if (candleResult) candleResult.textContent = "";
    if (blowButton) blowButton.disabled = false;
    if (cakeScene) cakeScene.classList.remove("blown");

    state.photos.forEach((photo) => {
        if (photo.url) URL.revokeObjectURL(photo.url);
    });
    state.photos = [];

    updateMessageCount();
    renderPhotos();
    renderQuiz();
    updateFinalMessage();
    showSection("welcome");

    showToast(t("toastRestart"));
}

/* =========================================
   RESTORE SAVED SETTINGS
========================================= */

function restoreSettings() {
    try {
        const savedLanguage = localStorage.getItem("birthday-language");
        const savedTheme = localStorage.getItem("birthday-theme");
        const savedColor = localStorage.getItem("birthday-custom-color");
        const savedDark = localStorage.getItem("birthday-dark-mode");

        if (savedLanguage && translations[savedLanguage]) {
            state.language = savedLanguage;
        }

        if (savedColor && /^#[0-9a-f]{6}$/i.test(savedColor)) {
            state.customColor = savedColor;
            body.style.setProperty("--custom-color", savedColor);
            const picker = $("#theme-color-picker");
            if (picker) picker.value = savedColor;
        }

        if (savedTheme) {
            setTheme(savedTheme);
        }

        setDarkMode(savedDark === "true");

        const languageSelect = $("#language-select");
        if (languageSelect) {
            languageSelect.value = state.language;
        }

        const themeSelect = $("#preset-theme");
        if (themeSelect) {
            themeSelect.value = body.dataset.theme || "pink";
        }
    } catch (error) {
        applyLanguage("en");
    }
}

/* =========================================
   EVENT LISTENERS
========================================= */

function bindEvents() {
    $("#language-select")?.addEventListener("change", (event) => {
        applyLanguage(event.target.value);
    });

    $("#theme-toggle")?.addEventListener("click", toggleThemePanel);

    $("#mode-toggle")?.addEventListener("click", () => {
        setDarkMode(!state.darkMode);
    });

    $("#preset-theme")?.addEventListener("change", (event) => {
        setTheme(event.target.value);
    });

    $("#theme-color-picker")?.addEventListener("input", (event) => {
        setCustomColor(event.target.value);

        const themeSelect = $("#preset-theme");
        if (themeSelect) themeSelect.value = "custom";
    });

    $("#sound-toggle")?.addEventListener("click", async () => {
        if (state.soundEnabled) {
            stopSound();
        } else {
            await startSound();
        }
    });

    $("#sound-toggle")?.addEventListener("contextmenu", (event) => {
        event.preventDefault();

        const panel = $("#music-panel");
        if (!panel) return;

        panel.hidden = !panel.hidden;

        const themePanel = $("#theme-panel");
        if (themePanel) themePanel.hidden = true;
    });

    $("#music-volume")?.addEventListener("input", updateMusicVolume);

    $("#start-button")?.addEventListener("click", () => {
        const name = $("#recipient-name")?.value.trim() || "";

        if (!name) {
            showToast(t("toastName"));
            $("#recipient-name")?.focus();
            return;
        }

        state.recipient = name;
        updateFinalMessage();
        showSection("letter");
        playSoundEffect("correct");
    });

    $("#recipient-name")?.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            $("#start-button")?.click();
        }
    });

    $("#personal-message")?.addEventListener("input", () => {
        updateMessageCount();
        updateFinalMessage();
    });

    $("#letter-next")?.addEventListener("click", goNext);
    $("#gift-next")?.addEventListener("click", goNext);
    $("#memories-next")?.addEventListener("click", goNext);
    $("#cake-next")?.addEventListener("click", goNext);

    $$("[data-back]").forEach((button) => {
        button.addEventListener("click", goBack);
    });

    $("#gift-box")?.addEventListener("click", openGift);

    $("#memory-photos")?.addEventListener("change", (event) => {
        addPhotos(event.target.files);
        event.target.value = "";
    });

    $("#quiz-next")?.addEventListener("click", advanceQuiz);

    $("#blow-candles")?.addEventListener("click", blowCandles);

    $("#celebrate-button")?.addEventListener("click", () => {
        launchConfetti(120);
        playSoundEffect("celebration");
    });

    $("#copy-button")?.addEventListener("click", copyWebsiteLink);

    $("#restart-button")?.addEventListener("click", restartJourney);

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            const themePanel = $("#theme-panel");
            const musicPanel = $("#music-panel");

            if (themePanel) themePanel.hidden = true;
            if (musicPanel) musicPanel.hidden = true;
        }
    });

    document.addEventListener("click", (event) => {
        const themePanel = $("#theme-panel");
        const themeToggle = $("#theme-toggle");
        const musicPanel = $("#music-panel");
        const soundToggle = $("#sound-toggle");

        if (
            themePanel &&
            !themePanel.hidden &&
            !themePanel.contains(event.target) &&
            !themeToggle?.contains(event.target)
        ) {
            themePanel.hidden = true;
        }

        if (
            musicPanel &&
            !musicPanel.hidden &&
            !musicPanel.contains(event.target) &&
            !soundToggle?.contains(event.target)
        ) {
            musicPanel.hidden = true;
        }
    });
}

/* =========================================
   INITIALIZE
========================================= */

function initializeBirthdayPage() {
    restoreSettings();
    bindEvents();
    applyLanguage(state.language);

    const themePanel = $("#theme-panel");
    const musicPanel = $("#music-panel");

    if (themePanel) themePanel.hidden = true;
    if (musicPanel) musicPanel.hidden = true;

    renderQuiz();
    renderPhotos();
    updateMessageCount();
    updateFinalMessage();
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeBirthdayPage, {
        once: true
    });
} else {
    initializeBirthdayPage();
}
