import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentAdmin, logAdminAction } from '@/lib/admin-auth';

export async function POST(request, { params }) {
  try {
    const session = await getCurrentAdmin();
    if (!session) {
      return NextResponse.json({ error: 'غير مصرّح' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { action, reason } = body;

    if (!['approve', 'reject'].includes(action)) {
      return NextResponse.json(
        { error: 'الإجراء غير صالح' },
        { status: 400 }
      );
    }

    const verification = await prisma.identityVerification.findUnique({
      where: { id },
    });

    if (!verification) {
      return NextResponse.json(
        { error: 'الطلب غير موجود' },
        { status: 404 }
      );
    }

    if (verification.status !== 'pending') {
      return NextResponse.json(
        { error: 'تمت معالجة الطلب بالفعل' },
        { status: 400 }
      );
    }

    const ip =
      request.headers.get('x-forwarded-for') ||
      request.headers.get('x-real-ip') ||
      'unknown';

    if (action === 'approve') {
      // ✅ موافقة — فعّل الحساب + احذف الصور
      await prisma.$transaction(async (tx) => {
        // 1) فعّل المستخدم
        await tx.user.update({
          where: { id: verification.userId },
          data: { isVerified: true },
        });

        // 2) احذف الصور + حدّث الحالة
        await tx.identityVerification.update({
          where: { id },
          data: {
            status: 'approved',
            frontImage: '',      // ✅ حذف الصور
            backImage: null,
            selfieImage: '',
            reviewedBy: session.admin.id,
            reviewedAt: new Date(),
          },
        });

        // 3) إشعار المستخدم
        await tx.userNotification.create({
          data: {
            userId: verification.userId,
            type: 'system',
            title: '✅ تم توثيق حسابك!',
            message: 'مبروك! تمت الموافقة على التحقق من هويتك. يمكنك الآن استخدام كل ميزات المنصة.',
            icon: 'shield',
            priority: 'high',
            actionUrl: '/dashboard',
          },
        });
      });

      await logAdminAction({
        adminId: session.admin.id,
        action: 'approve_verification',
        targetType: 'user',
        targetId: verification.userId,
        ipAddress: ip,
      });

      return NextResponse.json({ success: true, action: 'approved' });
    } else {
      // ❌ رفض — احذف الصور
      await prisma.$transaction(async (tx) => {
        await tx.identityVerification.update({
          where: { id },
          data: {
            status: 'rejected',
            reason: reason || 'لم يتم قبول الوثائق',
            frontImage: '',      // ✅ حذف الصور
            backImage: null,
            selfieImage: '',
            reviewedBy: session.admin.id,
            reviewedAt: new Date(),
          },
        });

        // إشعار المستخدم
        await tx.userNotification.create({
          data: {
            userId: verification.userId,
            type: 'system',
            title: '❌ تم رفض التحقق من هويتك',
            message: reason || 'لم يتم قبول الوثائق المرفوعة. يمكنك المحاولة مرة أخرى.',
            icon: 'info',
            priority: 'high',
            actionUrl: '/verify-identity',
          },
        });
      });

      await logAdminAction({
        adminId: session.admin.id,
        action: 'reject_verification',
        targetType: 'user',
        targetId: verification.userId,
        details: { reason },
        ipAddress: ip,
      });

      return NextResponse.json({ success: true, action: 'rejected' });
    }
  } catch (error) {
    console.error('Admin verification action error:', error);
    return NextResponse.json({ error: 'حدث خطأ' }, { status: 500 });
  }
}