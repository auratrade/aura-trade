import { prisma } from './prisma';

/**
 * فحص Rate Limit
 * @param {Object} options
 * @param {string} options.identifier - البريد أو IP
 * @param {string} options.type - نوع العملية
 * @param {number} options.maxAttempts - الحد الأقصى
 * @param {number} options.windowMs - المدة بالمللي ثانية
 */
export async function checkRateLimit({
  identifier,
  type = 'login',
  maxAttempts = 5,
  windowMs = 15 * 60 * 1000,
}) {
  try {
    const since = new Date(Date.now() - windowMs);

    // تأكد أن prisma.loginAttempt موجود بحسب المسمى في schema.prisma
    const loginAttemptModel = prisma.loginAttempt || prisma.login_attempt;

    if (!loginAttemptModel) {
      console.error('🔥 Error: LoginAttempt model is not defined in Prisma schema.');
      // التمرير كتدبير احتياطي لعدم تعطيل الخدمة عند وجود خلل في الإعدادات
      return { allowed: true, remaining: maxAttempts, retryAfter: 0 };
    }

    // ✅ احسب المحاولات في النافذة الزمنية
    const count = await loginAttemptModel.count({
      where: {
        identifier,
        type,
        success: false, // نحسب الفاشلة فقط
        createdAt: { gte: since },
      },
    });

    if (count >= maxAttempts) {
      // احسب وقت الانتظار
      const lastAttempt = await loginAttemptModel.findFirst({
        where: {
          identifier,
          type,
          success: false,
          createdAt: { gte: since },
        },
        orderBy: { createdAt: 'desc' },
      });

      const lastCreatedAt = lastAttempt?.createdAt ? new Date(lastAttempt.createdAt) : new Date();
      const retryAt = new Date(lastCreatedAt.getTime() + windowMs);
      const retryAfter = Math.ceil((retryAt.getTime() - Date.now()) / 60000); // دقائق

      return {
        allowed: false,
        remaining: 0,
        retryAfter: Math.max(1, retryAfter),
      };
    }

    return {
      allowed: true,
      remaining: maxAttempts - count,
      retryAfter: 0,
    };
  } catch (error) {
    console.error('Rate limit check error:', error);
    // السماح بالمرور في حال حدوث خطأ غير متوقع حتى لا يتعطل الموقع بالكامل
    return { allowed: true, remaining: 1, retryAfter: 0 };
  }
}

/**
 * تسجيل محاولة
 */
export async function recordAttempt({
  identifier,
  type,
  success,
  ipAddress,
  userAgent,
}) {
  try {
    const loginAttemptModel = prisma.loginAttempt || prisma.login_attempt;
    if (!loginAttemptModel) return;

    await loginAttemptModel.create({
      data: {
        identifier,
        type,
        success,
        ipAddress,
        userAgent,
      },
    });
  } catch (e) {
    console.error('Record attempt error:', e);
  }
}

/**
 * مسح سجل المحاولات عند النجاح
 */
export async function clearAttempts({ identifier, type }) {
  try {
    const loginAttemptModel = prisma.loginAttempt || prisma.login_attempt;
    if (!loginAttemptModel) return;

    await loginAttemptModel.deleteMany({
      where: { identifier, type },
    });
  } catch (e) {
    console.error('Clear attempts error:', e);
  }
}

/**
 * الحصول على IP من الطلب
 */
export function getClientIP(request) {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    request.headers.get('cf-connecting-ip') ||
    'unknown'
  );
}