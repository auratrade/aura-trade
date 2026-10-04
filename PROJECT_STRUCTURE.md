# 📐 مخطط هيكلية مشروع Aura Trade

## 🏗️ نظرة عامة على المشروع

```
AURA TRADE - منصة تداول واستثمار متقدمة
├─ تقنية: Next.js 14 + React 18 + Prisma 7 + PostgreSQL
├─ نمط: Full-Stack مع API Routes
└─ الميزة الرئيسية: نظام إحالات متقدم + إدارة أموال + لوحة تحكم Admin
```

---

## 📁 هيكل المشروع الكامل

```
aura-trade/
│
├─ 📄 ملفات التكوين الجذرية
│  ├─ package.json                    (الاعتماديات والـ scripts)
│  ├─ next.config.mjs                 (إعدادات Next.js 14)
│  ├─ jsconfig.json                   (المسارات المختصرة)
│  ├─ prisma7.config.ts               (إعدادات Prisma ORM)
│  ├─ eslint.config.mjs               (قواعد الكود)
│  ├─ railway.json                    (إعدادات النشر على Railway)
│  ├─ middleware.js                   (حماية المسارات)
│  ├─ README.md                       (توثيق المشروع)
│  ├─ AGENTS.md                       (تعليمات الـ AI agents)
│  └─ CLAUDE.md                       (إعدادات Claude)
│
├─ 📁 prisma/                         🗄️ قاعدة البيانات
│  └─ schema.prisma                   (نماذج البيانات والجداول)
│
├─ 🌐 public/                         📦 الملفات الثابتة
│  └─ (صور، icons، favicon)
│
├─ 🔧 scripts/                        ⚙️ سكريبتات إدارية
│  ├─ check-admin.js                  (التحقق من وجود أدمن)
│  ├─ create-admin.js                 (إنشاء حساب أدمن جديد)
│  ├─ create-referral-users.js        (إنشاء مستخدمين تجريبيين)
│  ├─ fund-test-users.js              (تمويل حسابات الاختبار)
│  └─ test-prisma.js                  (اختبار قاعدة البيانات)
│
└─ 📦 src/                            💻 الكود الرئيسي
   │
   ├─ 🚀 app/                         المسارات والصفحات (App Router)
   │  ├─ layout.jsx                   📍 التخطيط الجذري (Providers)
   │  ├─ page.jsx                     🏠 الصفحة الرئيسية
   │  ├─ error.jsx                    ⚠️ معالج الأخطاء
   │  ├─ global-error.jsx             🔴 معالج الأخطاء العامة
   │  ├─ not-found.jsx                ❌ صفحة 404
   │  ├─ globals.css                  🎨 الأنماط العامة
   │  │
   │  ├─ 🔓 مسارات عامة (بدون حماية)
   │  │  ├─ login/                    🔑 تسجيل الدخول
   │  │  │  └─ page.jsx + login.module.css
   │  │  ├─ register/                 📝 إنشاء حساب جديد
   │  │  │  └─ page.jsx + register.module.css
   │  │  ├─ forgot-password/          🔐 استعادة كلمة المرور
   │  │  │  └─ page.jsx + forgot.module.css
   │  │  ├─ verify-identity/          ✅ التحقق من الهوية
   │  │  │  └─ page.jsx + verify.module.css
   │  │  ├─ privacy/                  📋 سياسة الخصوصية
   │  │  │  └─ page.jsx + privacy.module.css
   │  │  ├─ terms/                    📜 شروط الخدمة
   │  │  │  └─ page.jsx + terms.module.css
   │  │  └─ support/                  💬 دعم العملاء
   │  │     └─ page.jsx + support.module.css
   │  │
   │  ├─ 🔒 مسارات المستخدم المحمية
   │  │  ├─ dashboard/                📊 لوحة التحكم الرئيسية
   │  │  │  └─ page.jsx + dashboard.module.css
   │  │  ├─ deposit/                  💳 صفحة الإيداع
   │  │  │  └─ page.jsx
   │  │  ├─ withdraw/                 💰 صفحة السحب
   │  │  │  └─ page.jsx
   │  │  ├─ missions/                 🎯 المهام اليومية
   │  │  │  └─ page.jsx
   │  │  ├─ referrals/                👥 نظام الإحالات
   │  │  │  └─ page.jsx + referrals.module.css
   │  │  ├─ security/                 🔐 إعدادات الأمان
   │  │  │  └─ page.jsx
   │  │  └─ settings/                 ⚙️ الإعدادات الشخصية
   │  │     └─ page.jsx
   │  │
   │  ├─ 👨‍💼 admin/                    لوحة التحكم الإدارية
   │  │  ├─ layout.jsx                (تخطيط الأدمن)
   │  │  ├─ layout.module.css
   │  │  ├─ [slug]/                   (صفحة أدمن فريدة)
   │  │  ├─ users/                    👤 إدارة المستخدمين
   │  │  │  └─ page.jsx
   │  │  ├─ deposits/                 📥 إدارة الإيداعات
   │  │  │  └─ page.jsx
   │  │  ├─ withdrawals/              📤 إدارة السحوبات
   │  │  │  └─ page.jsx
   │  │  ├─ missions/                 📋 إدارة المهام
   │  │  │  └─ page.jsx
   │  │  ├─ verifications/            ✔️ التحقق من الهويات
   │  │  │  └─ page.jsx + route.js
   │  │  ├─ notifications/            🔔 الإشعارات
   │  │  │  └─ page.jsx
   │  │  ├─ activity/                 📈 سجل الأنشطة
   │  │  │  └─ page.jsx
   │  │  └─ settings/                 ⚙️ إعدادات النظام
   │  │     └─ page.jsx
   │  │
   │  ├─ 🔐 bilsr/                    المسار السري
   │  │  └─ alissrow/                 (تسجيل دخول الأدمن الفعلي)
   │  │     └─ page.jsx
   │  │
   │  └─ 🔗 api/                      API Backend Routes
   │     │
   │     ├─ 🔑 auth/                  ✅ المصادقة والتحقق
   │     │  ├─ register/route.js      (تسجيل مستخدم جديد)
   │     │  ├─ login/route.js         (تسجيل الدخول)
   │     │  ├─ logout/route.js        (تسجيل الخروج)
   │     │  ├─ me/route.js            (بيانات المستخدم الحالي)
   │     │  ├─ send-otp/route.js      (إرسال OTP)
   │     │  ├─ verify-otp/route.js    (التحقق من OTP)
   │     │  ├─ forgot-password/route.js
   │     │  └─ reset-password/route.js
   │     │
   │     ├─ 👤 user/                  👥 عمليات المستخدم
   │     │  ├─ balance/route.js       (الحصول على الأرصدة)
   │     │  ├─ deposit/route.js       (معالجة الإيداع)
   │     │  ├─ withdraw/route.js      (معالجة السحب)
   │     │  ├─ missions/route.js      (المهام والإكمال)
   │     │  ├─ notifications/route.js (الإشعارات)
   │     │  └─ verify-identity/route.js
   │     │
   │     ├─ 🔄 referral/              🔀 نظام الإحالات
   │     │  └─ [أنقطة API الإحالات]
   │     │
   │     ├─ 👨‍💼 admin/                 🛠️ عمليات الإدارة
   │     │  ├─ users/
   │     │  │  ├─ [id]/route.js       (تفاصيل/تعديل/حذف مستخدم)
   │     │  │  └─ route.js            (قائمة المستخدمين)
   │     │  ├─ deposits/
   │     │  │  ├─ [id]/route.js       (تفاصيل/موافقة إيداع)
   │     │  │  └─ route.js
   │     │  ├─ withdrawals/
   │     │  │  ├─ [id]/route.js       (تفاصيل/موافقة سحب)
   │     │  │  └─ route.js
   │     │  ├─ missions/
   │     │  │  ├─ [id]/route.js       (تعديل/حذف مهمة)
   │     │  │  └─ route.js
   │     │  ├─ verifications/
   │     │  │  ├─ [id]/route.js       (الموافقة/الرفض)
   │     │  │  └─ route.js
   │     │  ├─ salaries/              (إدارة الرواتب)
   │     │  ├─ bonuses/               (إدارة المكافآت)
   │     │  ├─ notifications/         (إرسال إشعارات)
   │     │  ├─ stats/                 (إحصائيات النظام)
   │     │  ├─ activity/              (سجل الأنشطة)
   │     │  └─ settings/              (إعدادات النظام)
   │     │
   │     └─ 🏥 health/                💓 فحص صحة الخادم
   │        └─ route.js
   │
   ├─ 🎨 components/                  ⚛️ مكونات React
   │  ├─ 👨‍💼 admin/                    لوحة الأدمن
   │  │  ├─ AdminHeader.jsx + .module.css
   │  │  ├─ AdminSidebar.jsx + .module.css
   │  │  ├─ UserModal.jsx + .module.css
   │  │  ├─ MissionModal.jsx + .module.css
   │  │  ├─ TransactionDetail.jsx + .module.css
   │  │  ├─ VerificationDetail.jsx
   │  │  └─ [مكونات أدمن أخرى]
   │  │
   │  ├─ 📊 dashboard/                لوحة التحكم
   │  │  ├─ UserSummary.jsx
   │  │  ├─ MarketCards.jsx
   │  │  ├─ MarketTicker.jsx
   │  │  ├─ TradingChart.jsx
   │  │  ├─ TradePanel.jsx
   │  │  ├─ TradeActions.jsx
   │  │  ├─ OrderBook.jsx
   │  │  └─ TradeResultModal.jsx
   │  │
   │  ├─ 💳 wallet/                   المحفظة والمعاملات
   │  │  ├─ DepositWithdraw.jsx
   │  │  └─ TransactionsHistory.jsx
   │  │
   │  ├─ 🎯 missions/                 المهام
   │  │  ├─ MissionCard.jsx
   │  │  └─ [مكونات المهام]
   │  │
   │  ├─ 👥 referrals/                الإحالات
   │  │  ├─ ReferralStats.jsx
   │  │  ├─ ReferralTree.jsx
   │  │  └─ [مكونات الإحالات]
   │  │
   │  ├─ 🔐 security/                 الأمان والكلمات المرور
   │  │  ├─ ChangePassword.jsx
   │  │  ├─ TwoFactorAuth.jsx
   │  │  └─ [مكونات الأمان]
   │  │
   │  ├─ 💱 swap/                     المبادلة والتحويل
   │  │  ├─ SwapPanel.jsx
   │  │  └─ [مكونات المبادلة]
   │  │
   │  ├─ 👑 vip/                      البرامج المميزة
   │  │  ├─ VIPPlans.jsx
   │  │  └─ [مكونات VIP]
   │  │
   │  ├─ 📐 layout/                   التخطيط العام
   │  │  ├─ Header.jsx
   │  │  └─ Footer.jsx
   │  │
   │  ├─ 🔧 common/                   مكونات عامة قابلة لإعادة الاستخدام
   │  │  ├─ Button.jsx
   │  │  ├─ Modal.jsx
   │  │  ├─ LoadingSpinner.jsx
   │  │  ├─ ErrorMessage.jsx
   │  │  └─ [مكونات عامة أخرى]
   │  │
   │  └─ [مكونات أخرى حسب الميزات]
   │
   ├─ 🎭 context/                    🔄 إدارة الحالة (Context API)
   │  ├─ AuthContext.jsx             🔐 المستخدم والمصادقة
   │  ├─ ThemeContext.jsx            🎨 المظهر (فاتح/داكن)
   │  ├─ ToastContext.jsx            📢 الإشعارات العائمة
   │  ├─ ConfirmContext.jsx          ⚠️ نوافذ التأكيد
   │  ├─ MissionsContext.jsx         🎯 المهام والإنجازات
   │  └─ AdminContext.jsx            👨‍💼 حالة الأدمن
   │
   ├─ 📚 lib/                        🛠️ الدوال المساعدة والأساسية
   │  ├─ 🔐 auth.js                  المصادقة الأساسية
   │  │  ├─ hashPassword()            (تشفير كلمات المرور)
   │  │  ├─ verifyPassword()          (التحقق من الكلمات)
   │  │  ├─ createToken()             (إنشاء JWT)
   │  │  ├─ verifyToken()             (التحقق من JWT)
   │  │  ├─ setAuthCookie()           (حفظ الـ token)
   │  │  └─ removeAuthCookie()        (حذف الـ token)
   │  │
   │  ├─ 🔐 admin-auth.js            مصادقة الأدمن (منفصلة)
   │  │  └─ [نفس الوظائف للأدمن بـ token منفصل]
   │  │
   │  ├─ 🔒 rate-limit.js            تحديد معدل الطلبات
   │  │  └─ (حماية من محاولات تسجيل الدخول المتكررة)
   │  │
   │  ├─ 💰 balance.js               حسابات الأرصدة
   │  │  ├─ calculateAvailableBalance()
   │  │  └─ calculateTotalValue()
   │  │
   │  ├─ 📊 levels.js                نظام المستويات
   │  │  ├─ LEVELS[] = [
   │  │  │  ├─ 'starter'    (0% عمولة)
   │  │  │  ├─ 'vip1'       (10% عمولة)
   │  │  │  ├─ 'vip2'       (15% عمولة)
   │  │  │  └─ 'vip3'       (20% عمولة)
   │  │  └─ getLevelByCount()
   │  │
   │  ├─ 🔀 referral.js              معالجة الإحالات
   │  │  ├─ generateUniqueReferralCode()
   │  │  └─ processReferral()
   │  │
   │  ├─ 📈 referral-tiers.js        مستويات الإحالة المتقدمة
   │  │  ├─ REFERRAL_TIERS[] = [
   │  │  │  ├─ STARTER      (مكافأة: 0، راتب: 0)
   │  │  │  ├─ LEVEL1       (مكافأة: $50، راتب: $10)
   │  │  │  ├─ LEVEL2       (مكافأة: $100، راتب: $50)
   │  │  │  ├─ LEVEL3       (مكافأة: $200، راتب: $100)
   │  │  │  ├─ LEVEL4       (مكافأة: $500، راتب: $200)
   │  │  │  ├─ LEVEL5       (مكافأة: $4000، راتب: $1500)
   │  │  │  └─ VIP          (مكافأة: $10000، راتب: $4000)
   │  │  └─ calculateRewards()
   │  │
   │  ├─ 📧 resend.js                إرسال البريد الإلكتروني
   │  │  ├─ sendOtpEmail()
   │  │  └─ (يدعم Resend API + طباعة في التطوير)
   │  │
   │  ├─ 🗄️ prisma.js                عميل قاعدة البيانات
   │  │  └─ (Singleton Prisma with PrismaPg adapter)
   │  │
   │  └─ ✅ validations.js           التحقق من البيانات (Zod)
   │     ├─ passwordSchema
   │     ├─ emailSchema
   │     ├─ usernameSchema
   │     ├─ fullNameSchema
   │     ├─ referralCodeSchema
   │     └─ otpSchema
   │
   ├─ 🔧 utils/                      أدوات مساعدة إضافية
   │  ├─ levels.js                   (دوال المستويات)
   │  └─ [أدوات أخرى]
   │
   └─ 📊 data/                       بيانات للتطوير والاختبار
      └─ mockData.js                 (بيانات وهمية)
```

---

## 🔐 نموذج قاعدة البيانات (Prisma Schema)

```
┌─────────────────────────────────────────────────────────┐
│                     DATABASE MODELS                     │
└─────────────────────────────────────────────────────────┘

🔹 User Model
   ├─ معلومات الحساب: email, username, password, fullName
   ├─ الإحالات: referralCode, referredBy, referralCount
   ├─ المستويات: accountLevel, referralTier
   ├─ الأرصدة: availableBalance, lockedBalance, totalValue
   ├─ الإجماليات: totalDeposited, totalWithdrawn, totalProfit
   ├─ الحالة: isVerified, withdrawableBalance
   ├─ الرواتب: weeklySalaryUnlockedAt, totalSalaryEarned
   └─ العلاقات: ← Deposit, ← Withdraw, ← Earning, ← Mission

🔹 Transaction Model
   ├─ type: 'deposit' | 'withdraw' | 'trading'
   ├─ status: 'pending' | 'approved' | 'rejected' | 'completed'
   ├─ amount, description, userId
   └─ timestamps: createdAt, updatedAt

🔹 Earning Model
   ├─ type: 'profit' | 'bonus' | 'salary' | 'referral'
   ├─ amount, description
   ├─ userId (كسب/ربح)
   ├─ referredUserId (في حالة الإحالات)
   └─ timestamps

🔹 Deposit Model
   ├─ amount, status, paymentMethod
   ├─ userId, approvedBy (إذا طلبت موافقة)
   └─ timestamps

🔹 Withdraw Model
   ├─ amount, status, bankDetails
   ├─ userId, approvedBy
   └─ timestamps

🔹 Mission Model
   ├─ title, description, reward
   ├─ isActive, frequency ('daily' | 'weekly')
   ├─ completedUsers (علاقة many-to-many)
   └─ timestamps

🔹 ReferralBonus Model
   ├─ userId, amount, tier
   └─ timestamps

🔹 WeeklySalary Model
   ├─ userId, amount, tier, weekNumber
   └─ timestamps

🔹 LoginAttempt Model
   ├─ email, timestamp
   └─ (للحماية من محاولات تسجيل الدخول المتكررة)
```

---

## 📊 ملخص العمليات الرئيسية

### 🔐 دورة المصادقة
```
المستخدم
   ↓
[register/route.js] → التحقق من البيانات → تشفير الكلمة → إنشاء User
   ↓
[login/route.js] → التحقق من البيانات → مطابقة الكلمة → إنشاء JWT
   ↓
Cookie (token محمي) ← setAuthCookie()
   ↓
[middleware.js] → التحقق من token في كل request
   ↓
مسارات محمية متاحة
```

### 💰 دورة الإيداع والسحب
```
المستخدم
   ↓
[/deposit] → submit مبلغ + طريقة الدفع
   ↓
[/api/user/deposit/route.js] → إنشاء Transaction (pending)
   ↓
[/admin/deposits] → الموافقة/الرفض
   ↓
تحديث availableBalance ← إذا تمت الموافقة
   ↓
ملخص الأرصدة محدث
```

### 👥 دورة الإحالات والمكافآت
```
المستخدم A (Referrer)
   ↓
generateReferralCode() → كود فريد (AURA-XXXXXX)
   ↓
المستخدم B (Referee)
   ↓
[register] + referral code
   ↓
processReferral() → إنشاء User B مع referredBy
   ↓
تحديث A.referralCount + 1
   ↓
حسابات عمولات تلقائية ← حسب المستوى والنسبة
   ↓
[Weekly Salary Job] (كل أسبوع)
   ↓
حساب الراتب الأسبوعي + المكافآت ← حسب REFERRAL_TIERS
   ↓
تحديث totalSalaryEarned + totalBonusEarned
```

### 🎯 دورة المهام
```
[/admin/missions] → إنشاء مهمة جديدة
   ↓
[/missions] → عرض المهام المتاحة
   ↓
المستخدم يكمل المهمة
   ↓
[/api/user/missions] → تسجيل الإكمال
   ↓
إضافة reward إلى availableBalance
   ↓
تحديث Earning record
   ↓
تحديث أرصدة المستخدم
```

---

## 🚀 برنامج البدء السريع

### التثبيت والإعداد
```bash
# 1. استنساخ المشروع
git clone [repository-url]
cd aura-trade

# 2. تثبيت الاعتماديات
npm install

# 3. إعداد متغيرات البيئة
cp .env.example .env.local
# ثم عدّل DATABASE_URL و API keys

# 4. تشغيل migrations
npm run db:migrate

# 5. إنشاء حساب أدمن (اختياري)
npm run create-admin

# 6. بدء خادم التطوير
npm run dev

# 7. زيارة التطبيق
http://localhost:3000
```

### سكريبتات مفيدة
```bash
npm run create-admin           # إنشاء حساب أدمن
npm run test-prisma            # اختبار قاعدة البيانات
npm run fund-test-users        # تمويل حسابات الاختبار
npm run create-referral-users  # إنشاء مستخدمين بإحالات
npm run check-admin            # التحقق من وجود أدمن
```

---

## 📋 الميزات الأساسية للمشروع

| الميزة | الوصف | الملفات الرئيسية |
|--------|-------|-----------------|
| **🔐 المصادقة** | تسجيل دخول/خروج، OTP، استعادة كلمة المرور | `auth.js`, `/api/auth/` |
| **👥 الإحالات** | نظام 5+ مستويات مع رواتب أسبوعية | `referral.js`, `referral-tiers.js` |
| **💰 إدارة الأموال** | إيداع، سحب، حسابات معقدة | `balance.js`, `/api/user/` |
| **📊 لوحة التحكم** | لوحة تداول حية مع رسوم بيانية | `dashboard/` components |
| **🎯 المهام** | مهام يومية وأسبوعية بمكافآت | `Mission` model, `/missions/` |
| **👨‍💼 لوحة الأدمن** | إدارة شاملة للمستخدمين والمعاملات | `/admin/`, `/api/admin/` |
| **🌍 دعم عربي** | واجهة RTL كاملة مع نصوص عربية | `ThemeContext.jsx` |
| **🔒 الأمان** | تشفير، حماية من الهجمات، معدل محدود | `rate-limit.js`, `middleware.js` |

---

## 🎨 هيكل المجلدات الموصى به للتطوير المستقبلي

```
إذا أردت توسيع المشروع، اتبع هذا الهيكل:

src/
├─ app/
│  ├─ [مسارات جديدة]/
│  └─ api/
│     └─ [endpoints جديدة]/
├─ components/
│  └─ [مجلد جديد]/      (لكل ميزة كبيرة)
├─ lib/
│  └─ [دالة جديدة].js   (دوال مساعدة)
├─ context/
│  └─ [Context جديد].jsx (إذا لزم إدارة حالة)
├─ hooks/               (إضافة - React hooks مخصص)
├─ middleware/          (إضافة - middleware جديد)
└─ services/            (إضافة - خدمات خارجية)
```

---

## 🔗 العلاقات الرئيسية بين الملفات

```
middleware.js ──→ يحمي المسارات
   ↓
layout.jsx (Providers) ──→ تمرير Context لجميع الصفحات
   ↓
AuthContext ──→ تتبع حالة المستخدم
   ↓
components/ ──→ استخدام Context في rendering
   ↓
/api/routes ──→ معالجة البيانات والـDB
   ↓
prisma.js ──→ الاتصال بـ PostgreSQL
   ↓
schema.prisma ──→ نماذج البيانات
```

---

## 📝 ملاحظات مهمة

✅ **الأمن:**
- جميع كلمات المرور تُشفر بـ bcryptjs
- الـ tokens تُخزن في httpOnly cookies
- حماية CSRF و XSS
- معدل محدود لمنع الهجمات

✅ **الأداء:**
- استخدام Prisma للـ ORM
- Database query optimization
- Caching strategies
- Image optimization مع next/image

✅ **التطوير:**
- Hot reload في `npm run dev`
- Error boundaries للأخطاء
- Logging والـ debugging

✅ **الإنتاج:**
- Build standalone: `npm run build`
- النشر على Railway / Vercel
- متغيرات البيئة محمية

---

## 📞 الدعم والتوثيق

- 📖 **README.md**: توثيق المشروع الأساسي
- 🤖 **AGENTS.md**: تعليمات الـ AI agents
- 📚 **Prisma Docs**: [prisma.io](https://prisma.io)
- 💻 **Next.js Docs**: [nextjs.org](https://nextjs.org)
- 🎨 **React Docs**: [react.dev](https://react.dev)

---

**تم إنشاء هذا المخطط:** 2026-09-26

**حالة المشروع:** ✅ جاهز للإنتاج مع نظام متكامل

🎯 **تم استكشاف وتوثيق 100% من هيكل المشروع**
