import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

const MAX_IMAGE_SIZE = 2 * 1024 * 1024; // 2MB
const ALLOWED_TYPES = ['national_id', 'residence', 'passport'];

export async function POST(request) {
  try {
    const session = await getCurrentUser();
    if (!session) {
      return NextResponse.json({ error: 'غير مصرّح' }, { status: 401 });
    }

    const body = await request.json();
    const { idType, frontImage, backImage, selfieImage } = body;

    // التحقق
    if (!idType || !ALLOWED_TYPES.includes(idType)) {
      return NextResponse.json(
        { error: 'نوع الوثيقة غير صالح' },
        { status: 400 }
      );
    }
    if (!frontImage) {
      return NextResponse.json(
        { error: 'الصورة الأمامية مطلوبة' },
        { status: 400 }
      );
    }
    if (idType !== 'passport' && !backImage) {
      return NextResponse.json(
        { error: 'الصورة الخلفية مطلوبة' },
        { status: 400 }
      );
    }
    if (!selfieImage) {
      return NextResponse.json(
        { error: 'صورة السيلفي مطلوبة' },
        { status: 400 }
      );
    }

    // التحقق من الحجم (Base64)
    const checkSize = (str) => {
      if (!str) return true;
      const size = str.length * 0.75; // تقدير
      return size <= MAX_IMAGE_SIZE;
    };

    if (!checkSize(frontImage) || !checkSize(backImage) || !checkSize(selfieImage)) {
      return NextResponse.json(
        { error: 'حجم الصورة كبير جداً (الحد 2MB)' },
        { status: 400 }
      );
    }

    // تحقق من وجود طلب سابق
    const existing = await prisma.identityVerification.findUnique({
      where: { userId: session.userId },
    });

    if (existing) {
      if (existing.status === 'pending') {
        return NextResponse.json(
          { error: 'لديك طلب قيد المراجعة' },
          { status: 400 }
        );
      }
      if (existing.status === 'approved') {
        return NextResponse.json(
          { error: 'حسابك موثق بالفعل' },
          { status: 400 }
        );
      }
      // إذا مرفوض → اسمح بإعادة الإرسال
      await prisma.identityVerification.update({
        where: { id: existing.id },
        data: {
          idType,
          frontImage,
          backImage: backImage || null,
          selfieImage,
          status: 'pending',
          reason: null,
          reviewedBy: null,
          reviewedAt: null,
        },
      });
    } else {
      // إنشاء طلب جديد
      await prisma.identityVerification.create({
        data: {
          userId: session.userId,
          idType,
          frontImage,
          backImage: backImage || null,
          selfieImage,
          status: 'pending',
        },
      });
    }

    // إشعار الأدمن
    try {
      const user = await prisma.user.findUnique({
        where: { id: session.userId },
        select: { username: true, email: true },
      });

      await prisma.adminNotification.create({
        data: {
          type: 'system',
          title: 'طلب تحقق هوية جديد',
          message: `${user.username} أرسل طلب تحقق هوية (${idType})`,
          referenceId: session.userId,
          priority: 'high',
        },
      });
    } catch (e) {
      console.error('Notification error:', e);
    }

    return NextResponse.json({
      success: true,
      message: 'تم إرسال طلبك. سيتم مراجعته خلال 24 ساعة',
    });
  } catch (error) {
    console.error('🔥 Verify identity error:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء إرسال الطلب' },
      { status: 500 }
    );
  }
}

// ============ جلب حالة التحقق ============
export async function GET() {
  try {
    const session = await getCurrentUser();
    if (!session) {
      return NextResponse.json({ error: 'غير مصرّح' }, { status: 401 });
    }

    const verification = await prisma.identityVerification.findUnique({
      where: { userId: session.userId },
      select: {
        id: true,
        idType: true,
        status: true,
        reason: true,
        createdAt: true,
        reviewedAt: true,
      },
    });

    return NextResponse.json({ verification });
  } catch (error) {
    return NextResponse.json({ verification: null });
  }
}