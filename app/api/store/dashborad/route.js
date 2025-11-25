import Rating from "@/components/Rating";
import prisma from "@/lib/prisma";
import authSeller from "@/middleware/authSeller";
import { getAuth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

//Get dashborad data for sellers(total orders, total earnings, total products)
export async function GET(request) {
  try {
    const { userId } = getAuth(request);
    const { storeId } = await authSeller(userId);

    //Get all orders for seller
    const orders = await prisma.order.findMany({
      where: { storeId },
    });

    //Get all products with rating for seller
    const products = await prisma.product.findMany({ where: { storeId } });
    const rating = await prisma.product.findMany({
      where: { productId: { in: products.map((product) => product.id) } },
      include: { user: true, product: true },
    });

    const dashboradData = {
      rating,
      totalOrder: orders.length,
      totalEarnings: Math.round(
        orders.reduce((acc, order) => acc + order.total, 0)
      ),
      totalProducts: products.length,
    };

    return NextRequest.json({ dashboradData });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { erro: error.code || error.message },
      { status: 400 }
    );
  }
}
