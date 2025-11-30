import prisma from "@/lib/prisma";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

//Verify Coupon
export async function POST(request) {
  try {
    const { userId, has } = getAuth(request);
    const { code } = await request.json();

    const coupon = await prisma.coupon.findFirst({
      where: {
        code: code.toUpperCase(),
        expiresAt: { gt: new Date() },
      },
    });

    if (!coupon) {
      return NextResponse.json({ error: "Coupon not found" }, { status: 404 });
    }
  
    if (coupon.forMember) {
      const hasPlusPlan = has({ plan: "plus" });
      if (!hasPlusPlan) {
        return NextResponse.json(
          { error: "Coupon valid for Plus members only" },
          { status: 400 }
        );
      }
    }
    return NextResponse.json({ coupon });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: error.code || error.message },
      { status: 400 }
    );
  }
}
