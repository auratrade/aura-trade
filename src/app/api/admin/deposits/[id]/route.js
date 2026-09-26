import { NextResponse } from 'next/server';

import {
  getCurrentAdmin,
  logAdminAction,
} from '@/lib/admin-auth';

import { prisma } from '@/lib/prisma';

import { updateUserBalances } from '@/lib/balance';

import { activateReferral } from '@/lib/referral';

// ============================================================
// الموافقة / الرفض
// ============================================================

export async function POST(
  request,
  { params }
) {
  try {
    const session =
      await getCurrentAdmin();

    if (!session) {
      return NextResponse.json(
        {
          error: 'غير مصرّح',
        },
        {
          status: 401,
        }
      );
    }

    const { id } = await params;

    const body =
      await request.json();

    const {
      action,
      reason,
    } = body;

    if (
      !['approve', 'reject'].includes(
        action
      )
    ) {
      return NextResponse.json(
        {
          error:
            'الإجراء غير صالح',
        },
        {
          status: 400,
        }
      );
    }

    // ============================================================
    // جلب المعاملة
    // ============================================================

    const tx =
      await prisma.transaction.findUnique({
        where: {
          id,
        },
        include: {
          user: {
            select: {
              id: true,
              username: true,
            },
          },
        },
      });

    if (!tx) {
      return NextResponse.json(
        {
          error:
            'العملية غير موجودة',
        },
        {
          status: 404,
        }
      );
    }

    if (tx.status !== 'pending') {
      return NextResponse.json(
        {
          error:
            'العملية معالجة بالفعل',
        },
        {
          status: 400,
        }
      );
    }

    const ip =
      request.headers.get(
        'x-forwarded-for'
      ) ||
      request.headers.get(
        'x-real-ip'
      ) ||
      'unknown';

    // ============================================================
    // APPROVE
    // ============================================================

    if (action === 'approve') {
      let referralResult = null;

      // ==========================================================
      // كل عمليات الموافقة الأساسية + تفعيل الإحالة
      // داخل Transaction واحدة
      // ==========================================================

      await prisma.$transaction(
        async (prismaTx) => {
          // ------------------------------------------------------
          // 1️⃣ تحديث المعاملة
          // ------------------------------------------------------

          const updatedTransaction =
            await prismaTx.transaction.updateMany(
              {
                where: {
                  id,
                  status: 'pending',
                },
                data: {
                  status: 'completed',
                },
              }
            );

          // في حال تمت معالجة العملية بالتوازي
          if (
            updatedTransaction.count !== 1
          ) {
            throw new Error(
              'TRANSACTION_ALREADY_PROCESSED'
            );
          }

          // ------------------------------------------------------
          // 2️⃣ تحديث إجمالي الإيداعات
          // ------------------------------------------------------

          await prismaTx.user.update({
            where: {
              id: tx.userId,
            },
            data: {
              totalDeposited: {
                increment: tx.amount,
              },
            },
          });

          // ------------------------------------------------------
          // 3️⃣ تفعيل الإحالة إن وجدت
          //
          // هذه النقطة لا تحدث إلا بعد موافقة الإيداع.
          // ------------------------------------------------------

          referralResult =
            await activateReferral(
              tx.userId,
              prismaTx
            );
        }
      );

      // ==========================================================
      // إشعار المستخدم
      // ==========================================================

      await prisma.userNotification.create({
        data: {
          userId: tx.userId,
          title:
            'تم تأكيد الإيداع 💰',
          message: `تمت إضافة مبلغ $${tx.amount} بنجاح إلى حسابك.`,
          type: 'deposit',
          icon: 'arrow-down-left',
          priority: 'MEDIUM',
          actionUrl: '/dashboard',
          isRead: false,
        },
      });

      // ==========================================================
      // إعادة حساب الأرصدة
      // ==========================================================

      await updateUserBalances(
        tx.userId
      );

      // ==========================================================
      // تسجيل عملية الأدمن
      // ==========================================================

      await logAdminAction({
        adminId:
          session.admin.id,

        action:
          'approve_deposit',

        targetType:
          'transaction',

        targetId:
          id,

        details: {
          amount: tx.amount,
          userId: tx.userId,

          referralActivated:
            !!referralResult?.activated,

          referralCount:
            referralResult?.newCount ||
            null,

          referralTier:
            referralResult?.newTier ||
            null,
        },

        ipAddress: ip,
      });

      return NextResponse.json({
        success: true,
        action: 'approved',

        referral:
          referralResult || null,
      });
    }

    // ============================================================
    // REJECT
    // ============================================================

    await prisma.transaction.update({
      where: {
        id,
      },
      data: {
        status: 'rejected',
        reason:
          reason ||
          'لم يتم التحقق من التحويل',
      },
    });

    // ============================================================
    // إشعار المستخدم بالرفض
    // ============================================================

    await prisma.userNotification.create({
      data: {
        userId: tx.userId,

        title:
          'تم رفض طلب الإيداع ❌',

        message: `تم رفض طلب الإيداع بمبلغ $${tx.amount}.`,

        type: 'deposit',

        icon: 'x-circle',

        priority: 'MEDIUM',

        actionUrl: '/dashboard',

        isRead: false,
      },
    });

    // ============================================================
    // تسجيل عملية الأدمن
    // ============================================================

    await logAdminAction({
      adminId:
        session.admin.id,

      action:
        'reject_deposit',

      targetType:
        'transaction',

      targetId:
        id,

      details: {
        amount: tx.amount,
        reason,
      },

      ipAddress: ip,
    });

    return NextResponse.json({
      success: true,
      action: 'rejected',
    });
  } catch (error) {
    console.error(
      'Admin deposit action error:',
      error
    );

    if (
      error?.message ===
      'TRANSACTION_ALREADY_PROCESSED'
    ) {
      return NextResponse.json(
        {
          error:
            'العملية معالجة بالفعل',
        },
        {
          status: 400,
        }
      );
    }

    return NextResponse.json(
      {
        error:
          'حدث خطأ',
      },
      {
        status: 500,
      }
    );
  }
}