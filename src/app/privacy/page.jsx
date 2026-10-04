import { Shield, Lock, Eye, Database, Users, Cookie, FileText, ArrowLeft, Mail } from 'lucide-react';
import Link from 'next/link';
import styles from './privacy.module.css';

export const metadata = {
  title: 'سياسة الخصوصية | AURA TRADE & INVEST',
  description: 'سياسة الخصوصية وحماية البيانات في منصة AURA TRADE & INVEST',
};

const SECTIONS = [
  {
    icon: FileText,
    title: '1. مقدمة',
    content: `مرحباً بك في AURA TRADE & INVEST. نحن نأخذ خصوصيتك على محمل الجد ونلتزم بحماية بياناتك الشخصية. توضح هذه السياسة كيفية جمعنا واستخدامنا وحمايتنا لمعلوماتك عند استخدام منصتنا.`,
  },
  {
    icon: Database,
    title: '2. المعلومات التي نجمعها',
    content: `نجمع الأنواع التالية من المعلومات:

• معلومات الحساب: الاسم الكامل، البريد الإلكتروني، اسم المستخدم.
• معلومات التحقق: صور وثائق الهوية (اختياري، تُحذف بعد التحقق).
• المعلومات المالية: سجل الإيداعات والسحوبات والمعاملات.
• المعلومات التقنية: عنوان IP، نوع المتصفح، نظام التشغيل.
• الكوكيز: لتحسين تجربة المستخدم وحفظ التفضيلات.`,
  },
  {
    icon: Eye,
    title: '3. كيف نستخدم معلوماتك',
    content: `نستخدم معلوماتك للأغراض التالية:

• إنشاء حسابك وإدارته.
• التحقق من هويتك وفق متطلبات مكافحة غسل الأموال.
• معالجة الإيداعات والسحوبات والمعاملات.
• تحسين خدماتنا وتطوير المنصة.
• التواصل معك بخصوص حسابك والدعم الفني.
• الامتثال للمتطلبات القانونية.`,
  },
  {
    icon: Lock,
    title: '4. حماية البيانات',
    content: `نتخذ إجراءات أمنية متقدمة لحماية بياناتك:

• تشفير SSL/TLS لجميع الاتصالات.
• تشفير كلمات المرور بخوارزميات قوية (bcrypt).
• تخزين البيانات على خوادم آمنة مع نسخ احتياطية.
• وصول محدود للموظفين المصرح لهم فقط.
• مراقبة أمنية على مدار الساعة.`,
  },
  {
    icon: Users,
    title: '5. مشاركة المعلومات',
    content: `نحن لا نبيع بياناتك الشخصية لأي طرف ثالث. قد نشارك المعلومات فقط في الحالات التالية:

• مع مزودي الخدمة الضروريين (مثل خدمات الدفع).
• عند الطلب القانوني من السلطات المختصة.
• لحماية حقوقنا وممتلكاتنا أو سلامة المستخدمين.
• في حالة الاندماج أو الاستحواذ (مع إشعارك مسبقاً).`,
  },
  {
    icon: Cookie,
    title: '6. ملفات تعريف الارتباط (Cookies)',
    content: `نستخدم ملفات تعريف الارتباط لتحسين تجربتك:

• ملفات ضرورية: لتسجيل الدخول والوظائف الأساسية.
• ملفات تحليلية: لفهم كيفية استخدام المنصة.
• ملفات تفضيلات: لحفظ إعداداتك (اللغة، الثيم).

يمكنك تعطيل الكوكيز من إعدادات المتصفح، لكن قد يؤثر ذلك على بعض الوظائف.`,
  },
  {
    icon: Shield,
    title: '7. حقوقك',
    content: `لديك الحقوق التالية:

• الوصول إلى بياناتك الشخصية.
• تصحيح أي معلومات غير دقيقة.
• حذف حسابك وبياناتك (وفقاً للمتطلبات القانونية).
• الاعتراض على معالجة بياناتك.
• تصدير بياناتك بصيغة قابلة للقراءة.

للتواصل بخصوص حقوقك: privacy@aura-trade.com`,
  },
];

export default function PrivacyPage() {
  return (
    <div className={styles.page}>
      <div className={styles.glow} />

      <div className={`${styles.container} container`}>
        {/* Hero */}
        <div className={styles.hero}>
          <div className={styles.heroIcon}>
            <Shield size={32} />
          </div>
          <h1 className={styles.heroTitle}>سياسة الخصوصية</h1>
          <p className={styles.heroDesc}>
            نحن نحمي خصوصيتك وبياناتك. اقرأ السياسة التالية لتعرف كيف نتعامل مع معلوماتك.
          </p>
          <div className={styles.heroMeta}>
            آخر تحديث: يناير 2026
          </div>
        </div>

        {/* Sections */}
        <div className={styles.sections}>
          {SECTIONS.map((s, i) => {
            const Icon = s.icon;
            return (
              <div key={i} className={styles.section}>
                <div className={styles.sectionHead}>
                  <div className={styles.sectionIcon}>
                    <Icon size={18} />
                  </div>
                  <h2 className={styles.sectionTitle}>{s.title}</h2>
                </div>
                <div className={styles.sectionContent}>
                  {s.content.split('\n').map((line, j) => (
                    <p key={j} className={line.trim() === '' ? styles.spacer : ''}>
                      {line}
                    </p>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Contact */}
        <div className={styles.contactBox}>
          <Mail size={20} />
          <div>
            <b>هل لديك أسئلة حول الخصوصية؟</b>
            <span>راسلنا على privacy@aura-trade.com وسنرد خلال 48 ساعة.</span>
          </div>
        </div>

        {/* Back */}
        <Link href="/dashboard" className={styles.backLink}>
          <ArrowLeft size={14} />
          العودة إلى الرئيسية
        </Link>
      </div>
    </div>
  );
}