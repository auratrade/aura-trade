import { z } from 'zod';

// ============ قواعد كلمة المرور ============
// 8 أحرف على الأقل، حرف كبير، حرف صغير، رقم
const passwordSchema = z
  .string()
  .min(8, 'كلمة المرور يجب أن تكون 8 أحرف على الأقل')
  .max(100, 'كلمة المرور طويلة جداً')
  .regex(/[a-z]/, 'يجب أن تحتوي على حرف صغير واحد على الأقل')
  .regex(/[A-Z]/, 'يجب أن تحتوي على حرف كبير واحد على الأقل')
  .regex(/[0-9]/, 'يجب أن تحتوي على رقم واحد على الأقل');

// ============ البريد الإلكتروني ============
const emailSchema = z
  .string()
  .min(1, 'البريد الإلكتروني مطلوب')
  .email('البريد الإلكتروني غير صالح')
  .max(255, 'البريد الإلكتروني طويل جداً')
  .transform((val) => val.toLowerCase().trim());

// ============ اسم المستخدم ============
const usernameSchema = z
  .string()
  .min(3, 'اسم المستخدم يجب أن يكون 3 أحرف على الأقل')
  .max(30, 'اسم المستخدم يجب أن يكون 30 حرفاً كحد أقصى')
  .regex(
    /^[a-zA-Z0-9_.-]+$/,
    'اسم المستخدم يجب أن يحتوي فقط على أحرف، أرقام، _ . -'
  )
  .transform((val) => val.trim());

// ============ الاسم الكامل ============
const fullNameSchema = z
  .string()
  .min(2, 'الاسم يجب أن يكون حرفين على الأقل')
  .max(100, 'الاسم طويل جداً')
  .regex(/^[\u0600-\u06FF\sa-zA-Z-]+$/, 'الاسم يحتوي على رموز غير مسموحة')
  .transform((val) => val.trim());

// ============ كود الإحالة ============
const referralCodeSchema = z
  .string()
  .regex(/^AURA-[A-Z0-9]{6}$/, 'كود الإحالة غير صالح')
  .optional()
  .or(z.literal(''))
  .transform((val) => (val === '' ? undefined : val));

// ============ OTP (6 أرقام) ============
const otpSchema = z
  .string()
  .length(6, 'رمز التحقق يجب أن يكون 6 أرقام')
  .regex(/^\d{6}$/, 'رمز التحقق يجب أن يكون أرقاماً فقط');

// ============================================================
//                    SCHEMAS الرئيسية
// ============================================================

// ============ التسجيل الكامل ============
export const registerSchema = z
  .object({
    fullName: fullNameSchema,
    email: emailSchema,
    username: usernameSchema,
    password: passwordSchema,
    confirmPassword: z.string(),
    referralCode: referralCodeSchema,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'كلمتا المرور غير متطابقتين',
    path: ['confirmPassword'],
  });

// ============ إرسال OTP ============
export const sendOtpSchema = z.object({
  email: emailSchema,
  name: z.string().optional(),
});

// ============ التحقق من OTP ============
export const verifyOtpSchema = z.object({
  email: emailSchema,
  code: otpSchema,
});

// ============ تسجيل الدخول ============
export const loginSchema = z.object({
  emailOrUsername: z
    .string()
    .min(1, 'البريد الإلكتروني أو اسم المستخدم مطلوب')
    .max(255)
    .transform((val) => val.trim()),
  password: z.string().min(1, 'كلمة المرور مطلوبة'),
});

// ============ التحقق من الهوية ============
export const verifyIdentitySchema = z.object({
  idType: z.enum(['national_id', 'residence', 'passport'], {
    errorMap: () => ({ message: 'نوع الوثيقة غير صالح' }),
  }),
  hasFrontImage: z.boolean().refine((v) => v === true, {
    message: 'الصورة الأمامية مطلوبة',
  }),
  hasBackImage: z.boolean(),
  hasSelfieImage: z.boolean().refine((v) => v === true, {
    message: 'صورة السيلفي مطلوبة',
  }),
  agree: z.boolean().refine((v) => v === true, {
    message: 'يجب الموافقة على الشروط',
  }),
});

// ============ الإيداع ============
export const depositSchema = z.object({
  amount: z
    .number({ invalid_type_error: 'المبلغ يجب أن يكون رقماً' })
    .positive('المبلغ يجب أن يكون أكبر من صفر')
    .min(10, 'الحد الأدنى للإيداع 10 USDT')
    .max(1000000, 'المبلغ كبير جداً'),
  network: z.enum(['USDT - TRC20', 'USDT - ERC20', 'USDT - BEP20']),
  txid: z
    .string()
    .min(10, 'هاش المعاملة غير صالح')
    .max(200, 'هاش المعاملة طويل جداً')
    .transform((val) => val.trim()),
});

// ============ السحب ============
export const withdrawSchema = z.object({
  amount: z
    .number({ invalid_type_error: 'المبلغ يجب أن يكون رقماً' })
    .positive('المبلغ يجب أن يكون أكبر من صفر')
    .min(20, 'الحد الأدنى للسحب 20 USDT'),
  network: z.enum(['USDT - TRC20', 'USDT - ERC20', 'USDT - BEP20']),
  address: z
    .string()
    .min(20, 'عنوان المحفظة غير صالح')
    .max(100, 'عنوان المحفظة غير صالح')
    .transform((val) => val.trim()),
  pin: z
    .string()
    .length(4, 'رمز PIN يجب أن يكون 4 أرقام')
    .regex(/^\d{4}$/, 'رمز PIN يجب أن يكون أرقاماً فقط'),
});

// ============================================================
//                 دوال مساعدة
// ============================================================

/**
 * تحويل أخطاء Zod إلى كائن بسيط { field: message }
 */
/**
 * تحويل أخطاء Zod إلى كائن بسيط { field: message }
 * يدعم Zod v3 و v4 (errors / issues)
 */
export function formatZodErrors(zodError) {
  const errors = {};

  // ✅ Zod v3: .errors | Zod v4: .issues
  const issues = zodError?.issues || zodError?.errors || [];

  issues.forEach((err) => {
    const field = err.path?.join('.') || '_';
    if (!errors[field]) {
      errors[field] = err.message;
    }
  });

  return errors;
}

/**
 * الحصول على أول رسالة خطأ فقط
 */
export function getFirstError(zodError) {
  const issues = zodError?.issues || zodError?.errors || [];
  return issues[0]?.message || 'خطأ في المدخلات';
}