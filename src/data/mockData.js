export const user = {
  name: 'Alexander Vance',
  userId: 'AV-882701',
  joinedAt: '2024-03-15',
  verified: true,
  avatar: 'AV',
  totals: {
    totalValue: 0,
    available: 0,
    locked: 0,
    profit: 0,
    profitPct: 0,
  },
};


export const LEVELS = [
  {
    key: 'starter',
    name: 'مبتدئ',
    levelNumber: 0,
    minReferrals: 0,
    commission: 5,
    color: '#7d8aab',
    icon: 'user',
  },
  {
    key: 'vip1',
    name: 'VIP 1',
    levelNumber: 1,
    minReferrals: 5,
    commission: 10,
    color: '#cd7f32', // برونزي
    icon: 'crown',
  },
  {
    key: 'vip2',
    name: 'VIP 2',
    levelNumber: 2,
    minReferrals: 30,
    commission: 15,
    color: '#c0c0c0', // فضي
    icon: 'crown',
  },
  {
    key: 'vip3',
    name: 'VIP 3',
    levelNumber: 3,
    minReferrals: 100,
    commission: 20,
    color: '#f5b041', // ذهبي
    icon: 'crown',
  },
];

export const depositBalance = 0;
export const MISSION_REWARD_PERCENT = 2; // نسبة الربح لكل مهمة


export const markets = [
  { symbol: 'BTC/USDT', price: 69149.29, change: -1.85, up: false },
  { symbol: 'AAPL', price: 229.87, change: 1.85, up: true },
  { symbol: 'TSLA', price: 248.98, change: 3.08, up: true },
  { symbol: 'NVDA', price: 134.25, change: 3.85, up: true },
  { symbol: 'EUR/USD', price: 1.0445, change: 0.12, up: true },
];

export const activePair = {
  symbol: 'BTC/USDT',
  price: 69149.29,
  change: -1.85,
  high: 70412.18,
  low: 68190.20,
  volume: '34.6K',
};

export const candles = [
  { o: 69000, h: 69500, l: 68200, c: 68800, v: 60 },
  { o: 68800, h: 69200, l: 67800, c: 68500, v: 75 },
  { o: 68500, h: 69100, l: 68000, c: 68900, v: 55 },
  { o: 68900, h: 69800, l: 68600, c: 69600, v: 80 },
  { o: 69600, h: 70200, l: 69000, c: 69200, v: 65 },
  { o: 69200, h: 69700, l: 68400, c: 68600, v: 70 },
  { o: 68600, h: 69000, l: 67800, c: 68200, v: 90 },
  { o: 68200, h: 68900, l: 68000, c: 68700, v: 60 },
  { o: 68700, h: 69400, l: 68300, c: 69100, v: 55 },
  { o: 69100, h: 69900, l: 68800, c: 69700, v: 75 },
  { o: 69700, h: 70100, l: 69000, c: 69300, v: 65 },
  { o: 69300, h: 69800, l: 68500, c: 68900, v: 70 },
  { o: 68900, h: 69400, l: 68300, c: 69100, v: 85 },
  { o: 69100, h: 69600, l: 68600, c: 68800, v: 60 },
  { o: 68800, h: 69300, l: 68000, c: 68600, v: 55 },
  { o: 68600, h: 69000, l: 67900, c: 68400, v: 70 },
  { o: 68400, h: 68900, l: 68000, c: 68700, v: 65 },
  { o: 68700, h: 69200, l: 68200, c: 69000, v: 60 },
  { o: 69000, h: 69500, l: 68500, c: 69100, v: 75 },
  { o: 69100, h: 69800, l: 68800, c: 69600, v: 80 },
];

export const orderBook = {
  sells: [
    { price: 69170.20, amount: 0.0856, total: 5918.56 },
    { price: 69165.00, amount: 0.1240, total: 8576.46 },
    { price: 69155.00, amount: 0.0851, total: 5885.13 },
    { price: 69149.29, amount: 0.0411, total: 2844.02 },
  ],
  buys: [
    { price: 69130.00, amount: 0.0920, total: 6360.00 },
    { price: 69123.50, amount: 0.2154, total: 14889.30 },
    { price: 69110.80, amount: 0.0892, total: 6164.90 },
    { price: 69100.00, amount: 0.1420, total: 9812.20 },
  ],
};

export const stocks = [
  { symbol: 'NVDA', name: 'NVIDIA Corp.', price: 134.25, change: 3.85, up: true, sparkline: [130,131,132,131.5,133,134,133.8,134.25] },
  { symbol: 'AAPL', name: 'Apple Inc.', price: 229.87, change: 1.85, up: true, sparkline: [226,227,228,227.5,228.5,229,229.5,229.87] },
  { symbol: 'TSLA', name: 'Tesla Inc.', price: 248.98, change: 3.08, up: true, sparkline: [240,242,244,243,245,247,248,248.98] },
];

export const swapDefault = {
  from: { symbol: 'USDT', amount: 5000, balance: 320150 },
  to: { symbol: 'BTC', amount: 0.0546, rate: 1, rateLabel: '1 BTC = 69,149.02 USDT' },
  rate: '1 BTC = 69,149.02 USDT',
  slippage: '0.10%',
  route: 'ALBA DEX Liquidity Pool → Native TRC20',
  min: '0.001 BTC',
  fee: '0.5%',
  priceImpact: '0.03%',
};

export const vipPackages = [
  {
    tier: 'VIP 1', name: 'BRONZE',
    minAmount: 500, dailyRate: '1.85%', dailyUSD: 9.25,
    monthlyRate: '55.5%', monthlyUSD: 277.50,
    duration: '30 يوم', lock: '7 أيام', active: false,
    features: ['دفع يومي', 'سحب فوري', 'حد أقصى 5,000'],
  },
  {
    tier: 'VIP 2', name: 'SILVER',
    minAmount: 2500, dailyRate: '2.45%', dailyUSD: 61.25,
    monthlyRate: '73.5%', monthlyUSD: 1837.50,
    duration: '45 يوم', lock: '14 يوم', active: true,
    progress: 65,
    features: ['دفع يومي', 'سحب فوري', 'دعم أولوية'],
  },
  {
    tier: 'VIP 3', name: 'GOLD',
    minAmount: 10000, dailyRate: '3.25%', dailyUSD: 325,
    monthlyRate: '97.5%', monthlyUSD: 9750,
    duration: '60 يوم', lock: '30 يوم', active: false,
    features: ['دفع يومي', 'سحب فوري', 'مدير حساب'],
  },
];

export const missions = [
  {
    id: 'm1',
    title: 'شراء سهم NVIDIA',
    description: 'قم بشراء سهم NVIDIA (NVDA) بسعر السوق الحالي وأكمل المهمة',
    symbol: 'NVDA',
    name: 'NVIDIA Corp.',
    price: 134.25,
    change: 3.85,
    up: true,
    sparkline: [130, 131, 132, 131.5, 133, 134, 133.8, 134.25],
    icon: 'chart',
    difficulty: 'سهل',
    timeEstimate: '30 ثانية',
  },
  {
    id: 'm2',
    title: 'شراء سهم Apple',
    description: 'قم بشراء سهم Apple (AAPL) بسعر السوق الحالي وأكمل المهمة',
    symbol: 'AAPL',
    name: 'Apple Inc.',
    price: 229.87,
    change: 1.85,
    up: true,
    sparkline: [226, 227, 228, 227.5, 228.5, 229, 229.5, 229.87],
    icon: 'shield',
    difficulty: 'سهل',
    timeEstimate: '30 ثانية',
  },
  {
    id: 'm3',
    title: 'شراء سهم Tesla',
    description: 'قم بشراء سهم Tesla (TSLA) بسعر السوق الحالي وأكمل المهمة',
    symbol: 'TSLA',
    name: 'Tesla Inc.',
    price: 248.98,
    change: 3.08,
    up: true,
    sparkline: [240, 242, 244, 243, 245, 247, 248, 248.98],
    icon: 'wallet',
    difficulty: 'متوسط',
    timeEstimate: '45 ثانية',
  },
  {
    id: 'm4',
    title: 'شراء سهم Microsoft',
    description: 'قم بشراء سهم Microsoft (MSFT) بسعر السوق الحالي وأكمل المهمة',
    symbol: 'MSFT',
    name: 'Microsoft Corp.',
    price: 415.30,
    change: 0.92,
    up: true,
    sparkline: [410, 411, 412, 413, 414, 415, 414.5, 415.30],
    icon: 'chart',
    difficulty: 'متوسط',
    timeEstimate: '45 ثانية',
  },
  {
    id: 'm5',
    title: 'شراء سهم Amazon',
    description: 'قم بشراء سهم Amazon (AMZN) بسعر السوق الحالي وأكمل المهمة',
    symbol: 'AMZN',
    name: 'Amazon.com Inc.',
    price: 185.60,
    change: 1.42,
    up: true,
    sparkline: [182, 183, 184, 183.5, 184.5, 185, 185.5, 185.60],
    icon: 'wallet',
    difficulty: 'سهل',
    timeEstimate: '30 ثانية',
  },
];

export const referral = {
  code: 'AURA-VIP-887',
  link: 'https://aura.trade/ref/AURA-VIP-887',
  totalReferrals: 0, // ← غيّر هذا الرقم لتجربة المستويات
  commission: '10%',
  earnings: 0,
};

export const teamStats = {
  total: 0,
  thisWeek: 0,
  level1Profit: 0,
  level2Profit: 0,
  totalVolume: 0,
  targetVolume: 100000,
  rate: '5%',
  maxRate: '10%',
};

export const securityStatus = [
  { key: '2fa', title: 'التحقق بخطوتين (2FA)', desc: 'Google Authenticator مُفعّل', enabled: true, action: 'إدارة المفاتيح' },
  { key: 'pin', title: 'رمز معاملة PIN', desc: '4 أرقام • محدّث', enabled: true, action: 'تغيير PIN' },
  { key: 'session', title: 'أمان الجلسات', desc: 'آخر دخول منذ 5 ساعات', enabled: true, action: 'تسجيل الخروج من جميع الجلسات' },
];

// ========== WALLET (Binance Manual) ==========
// ============================================================
//                    WALLET (Binance)
// ============================================================
export const binanceWallet = {
  // الشبكة الافتراضية
  defaultNetwork: 'BEP20',

  minDeposit: 10,
  minWithdraw: 20,
  withdrawFee: 1,

  warning: 'يجب إرسال USDT على الشبكة المختارة فقط. أي شبكة أخرى تعني فقدان الأموال.',

  // ============ الشبكات المدعومة ============
  networks: [
    {
      key: 'BEP20',
      name: 'BNB Smart Chain',
      nameAr: 'شبكة BSC (BEP20)',
      symbol: 'USDT',
      address: '0xb85d38cd5274e92fed17728e644cb21ddb038fb6',
      color: '#f5b041',
      icon: '🟡',
      recommended: true,
      warning: 'الأسرع والأرخص — يُنصح بها',
    },
    {
      key: 'TRC20',
      name: 'Tron',
      nameAr: 'شبكة ترون (TRC20)',
      symbol: 'USDT',
      address: 'TDEtGUSbWXRgvudC7z65KsaifhVNQk5JrR',
      color: '#ea3943',
      icon: '🔴',
      recommended: false,
      warning: 'رسوم منخفضة — شائعة',
    },
    {
      key: 'ERC20',
      name: 'Ethereum',
      nameAr: 'شبكة إيثريوم (ERC20)',
      symbol: 'USDT',
      address: '0xb85d38cd5274e92fed17728e644cb21ddb038fb6',
      color: '#7d8aab',
      icon: '⚪',
      recommended: false,
      warning: 'رسوم عالية — استخدمها فقط للضرورة',
    },
    {
      key: 'TON',
      name: 'The Open Network',
      nameAr: 'شبكة TON',
      symbol: 'USDT',
      address: 'UQBhqLfx0Zg-p4lvn-ViBgKIrwxOCYtQPNGbUOGeQEtfFHzm',
      color: '#22d3ee',
      icon: '🔵',
      recommended: false,
      warning: 'شبكة تيليجرام',
    },
    {
      key: 'KAIA',
      name: 'Kaia',
      nameAr: 'شبكة Kaia',
      symbol: 'USDT',
      address: '0xb85d38cd5274e92fed17728e644cb21ddb038fb6',
      color: '#16c784',
      icon: '🟢',
      recommended: false,
    },
    {
      key: 'opBNB',
      name: 'opBNB',
      nameAr: 'شبكة opBNB',
      symbol: 'USDT',
      address: '0xb85d38cd5274e92fed17728e644cb21ddb038fb6',
      color: '#f5b041',
      icon: '🟠',
      recommended: false,
      warning: 'شبكة BNB الطبقة الثانية',
    },
    {
      key: 'CELO',
      name: 'CELO',
      nameAr: 'شبكة CELO',
      symbol: 'USDT',
      address: '0xb85d38cd5274e92fed17728e644cb21ddb038fb6',
      color: '#f5b041',
      icon: '🟡',
      recommended: false,
    },
    {
      key: 'PLASMA',
      name: 'Plasma',
      nameAr: 'شبكة Plasma',
      symbol: 'USDT',
      address: '0xb85d38cd5274e92fed17728e644cb21ddb038fb6',
      color: '#8b5cf6',
      icon: '🟣',
      recommended: false,
    },
  ],
};

export const userBalance = {
  available: 0,
  locked: 0,
  pendingWithdraw: 0,
};

export const transactions = [];