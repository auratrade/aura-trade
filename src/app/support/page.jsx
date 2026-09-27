import {
  MessageCircle, Clock, Headphones,
  Send, Shield, CheckCircle2, ArrowLeft
} from 'lucide-react';
import Link from 'next/link';
import styles from './support.module.css';

export const metadata = {
  title: 'خدمة العملاء | AURA TRADE & INVEST',
  description: 'تواصل مع فريق خدمة عملاء AURA TRADE & INVEST عبر بوت تيليجرام',
};

const CONTACT_METHODS = [
  {
    icon: Send,
    title: 'بوت تيليجرام',
    value: '@auratrade77_bot',
    link: 'https://t.me/auratrade77_bot',
    desc: 'تواصل مباشر مع خدمة العملاء 24/7',
    color: '#22d3ee',
  },
];

const FAQ = [
  {
    q: 'كم يستغرق التحقق من الهوية؟',
    a: 'عادةً من 5 إلى 30 دقيقة. في حالات نادرة قد يستغرق حتى 24 ساعة.',
  },
  {
    q: 'ما هو الحد الأدنى للإيداع؟',
    a: 'الحد الأدنى هو 60 USDT عبر شبكة TRC20 أو ERC20.',
  },
  {
    q: 'كيف أسحب أرباحي؟',
    a: 'اذهب إلى قسم السحب، أدخل عنوان محفظتك والمبلغ، وسيتم المعالجة خلال 24 ساعة.',
  },
  {
    q: 'هل رسوم السحب ثابتة؟',
    a: 'نعم، 1 USDT لكل عملية سحب.',
  },
];

export default function SupportPage() {
  return (
    <div className={styles.page}>
      <div className={styles.glow} />

      <div className={`${styles.container} container`}>
        {/* Hero */}
        <div className={styles.hero}>
          <div className={styles.heroIcon}>
            <Headphones size={32} />
          </div>
          <h1 className={styles.heroTitle}>خدمة العملاء</h1>
          <p className={styles.heroDesc}>
            فريق AURA TRADE & INVEST جاهز لمساعدتك على مدار الساعة.
            تواصل معنا عبر بوت تيليجرام الرسمي.
          </p>
        </div>

        {/* Contact Methods */}
        <div className={styles.contactsGrid}>
          {CONTACT_METHODS.map((c, i) => {
            const Icon = c.icon;
            return (
              <a
                key={i}
                href={c.link}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.contactCard}
              >
                <div
                  className={styles.contactIcon}
                  style={{ background: c.color + '22', color: c.color }}
                >
                  <Icon size={22} />
                </div>
                <div className={styles.contactInfo}>
                  <div className={styles.contactLabel}>{c.title}</div>
                  <div className={styles.contactValue}>{c.value}</div>
                  <div className={styles.contactDesc}>{c.desc}</div>
                </div>
              </a>
            );
          })}
        </div>

        {/* Working Hours */}
        <div className={styles.infoSection}>
          <div className={styles.sectionHead}>
            <Clock size={18} />
            <h2 className={styles.sectionTitle}>ساعات العمل</h2>
          </div>
          <div className={styles.hoursGrid}>
           
           
            <div className={`${styles.hoursCard} ${styles.activeNow}`}>
              <span className={styles.hoursDay}>
                <span className={styles.dot} />
                الدعم الطارئ
              </span>
              <span className={styles.hoursTime}>24 ساعة / 7 أيام</span>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className={styles.infoSection}>
          <div className={styles.sectionHead}>
            <Shield size={18} />
            <h2 className={styles.sectionTitle}>الأسئلة الشائعة</h2>
          </div>
          <div className={styles.faqList}>
            {FAQ.map((item, i) => (
              <details key={i} className={styles.faqItem}>
                <summary className={styles.faqQuestion}>
                  <span>{item.q}</span>
                  <span className={styles.faqChevron}>+</span>
                </summary>
                <div className={styles.faqAnswer}>{item.a}</div>
              </details>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className={styles.cta}>
          <CheckCircle2 size={24} className="text-green" />
          <div>
            <b>لم تجد ما تبحث عنه؟</b>
            <span>راسلنا على بوت تيليجرام وسنكون سعداء بمساعدتك.</span>
          </div>
          <a
            href="https://t.me/auratrade77_bot"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.ctaBtn}
          >
            <Send size={14} />
            فتح البوت
          </a>
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