import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentAdmin } from '@/lib/admin-auth';

// ============ 1️⃣ جلب طلبات التوثيق ============
export async function GET(request) {
  try {
    const session = await getCurrentAdmin();
    if (!session) {
      return NextResponse.json({ error: 'غير مصرّح' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'pending';

    const where = {};
    if (status !== 'all') where.status = status;

    const verifications = await prisma.identityVerification.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    // جلب بيانات المستخدمين
    const userIds = verifications.map((v) => v.userId);
    const users = await prisma.user.findMany({
      where: { id: { in: userIds } },
      select: {
        id: true,
        username: true,
        email: true,
        fullName: true,
        isVerified: true,
        createdAt: true,
      },
    });

    const usersMap = users.reduce((acc, u) => {
      acc[u.id] = u;
      return acc;
    }, {});

    const result = verifications.map((v) => ({
      ...v,
      user: usersMap[v.userId] || null,
    }));

    return NextResponse.json({ verifications: result });
  } catch (error) {
    console.error('Admin verifications error:', error);
    return NextResponse.json({ verifications: [] });
  }
}

// ============ 2️⃣ معالجة طلب التوثيق (موافقة / رفض) + إرسال الإشعار ============
export async function PATCH(request) {
  try {
    const session = await getCurrentAdmin();
    if (!session) {
      return NextResponse.json({ error: 'غير مصرّح' }, { status: 401 });
    }

    const { id, status, notes } = await request.json(); // status: 'approved' أو 'rejected'

    if (!id || !['approved', 'rejected'].includes(status)) {
      return NextResponse.json({ error: 'بيانات غير صالحة' }, { status: 400 });
    }

    // 1. تحديث حالة طلب التوثيق
    const verification = await prisma.identityVerification.update({
      where: { id },
      data: {
        status,
        notes: notes || null,
        updatedAt: new Date(),
      },
    });

    // 2. تحديث حالة التوثيق في جدول المستخدم إذا تم القبول
    if (status === 'approved') {
      await prisma.user.update({
        where: { id: verification.userId },
        data: { isVerified: true },
      });
    }

    // 3. ✅ إنشاء الإشعار للمستخدم
    const isApproved = status === 'approved';
    await prisma.userNotification.create({
      data: {
        userId: verification.userId,
        type: 'kyc',
        title: isApproved ? 'تم توثيق حسابك بنجاح 🎉' : 'تم رفض طلب توثيق الهوية ⚠️',
        message: isApproved
          ? 'تهانينا! تم التحقق من هويتك بنجاح ويمكنك الآن استخدام كافة ميزات المنصة.'
          : `للأسف، تم رفض طلب التوثيق. ${notes ? `السبب: ${notes}` : 'يرجى إعادة إرسال مستندات واضحة.'}`,
        icon: isApproved ? 'shield-check' : 'shield-alert',
        priority: 'HIGH',
        actionUrl: '/dashboard/profile',
      },
    });

    return NextResponse.json({ success: true, verification });
  } catch (error) {
    console.error('Update verification error:', error);
    return NextResponse.json({ error: 'حدث خطأ أثناء معالجة الطلب' }, { status: 500 });
  }
}