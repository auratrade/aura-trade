import {
  Mail, Phone, MessageCircle, Clock, MapPin, Headphones,
  Send, Globe, Shield, CheckCircle2, ArrowLeft
} from 'lucide-react';
import Link from 'next/link';
import styles from './support.module.css';

export const metadata = {
  title: 'الدعم الفني | AURA TRADE & INVEST',
  description: 'تواصل مع فريق دعم AURA TRADE & INVEST عبر البريد أو الهاتف',
};

const CONTACT_METHODS = [
  {
    icon: Mail,
    title: 'البريد الإلكتروني',
    value: 'support@aura-trade.com',
    link: 'mailto:support@aura-trade.com',
    desc: 'الرد خلال 24 ساعة',
    color: '#22d3ee',
  },
  {
    icon: Phone,
    title: 'الهاتف',
    value: '+963 999 123 456',
    link: 'tel:+963999123456',
    desc: 'السبت - الخميس: 9ص - 6م',
    color: '#16c784',
  },
  {
    icon: MessageCircle,
    title: 'واتساب',
    value: '+963 999 123 456',
    link: 'https://wa.me/963999123456',
    desc: 'دعم سريع 24/7',
    color: '#f5b041',
  },
  {
    icon: Send,
    title: 'تيليجرام',
    value: '@AuraTradeSupport',
    link: 'https://t.me/AuraTradeSupport',
    desc: 'قناة رسمية للإعلانات',
    color: '#8b5cf6',
  },
];

const FAQ = [
  {
    q: 'كم يستغرق التحقق من الهوية؟',
    a: 'عادةً من 5 إلى 30 دقيقة. في حالات نادرة قد يستغرق حتى 24 ساعة.',
  },
  {
    q: 'ما هو الحد الأدنى للإيداع؟',
    a: 'الحد الأدنى هو 10 USDT عبر شبكة TRC20 أو ERC20.',
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
          <h1 className={styles.heroTitle}>الدعم الفني</h1>
          <p className={styles.heroDesc}>
            فريق AURA TRADE & INVEST جاهز لمساعدتك على مدار الساعة.
            اختر طريقة التواصل الأنسب لك.
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
                target={c.link.startsWith('http') ? '_blank' : undefined}
                rel={c.link.startsWith('http') ? 'noopener noreferrer' : undefined}
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
            <div className={styles.hoursCard}>
              <span className={styles.hoursDay}>السبت - الخميس</span>
              <span className={styles.hoursTime}>9:00 صباحاً - 6:00 مساءً</span>
            </div>
            <div className={styles.hoursCard}>
              <span className={styles.hoursDay}>الجمعة</span>
              <span className={styles.hoursTime}>مغلق</span>
            </div>
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
            <span>راسلنا وسنكون سعداء بمساعدتك.</span>
          </div>
          <a href="mailto:support@aura-trade.com" className={styles.ctaBtn}>
            <Mail size={14} />
            تواصل معنا
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