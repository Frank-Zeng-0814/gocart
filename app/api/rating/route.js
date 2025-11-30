import prisma from "@/lib/prisma";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

//Add new rating
export async function POST(request) {
  try {
    const { userId } = getAuth(request);
    const { orderId, productId, rating, review } = await request.json();

    const order = await prisma.order.findUnique({
      where: { id: orderId, userId },
    });

    if (!order) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    const isAlreadyRated = await prisma.rating.findFirst({
      where: { productId, orderId },
    });
    if (isAlreadyRated) {
      return NextResponse.json(
        { message: "Product already rated for this order" },
        { status: 400 }
      );
    }

    const newRating = await prisma.rating.create({
      data: { userId, orderId, productId, rating, review },
      include: {
        user: {
          select: { name: true, image: true },
        },
      },
    });
    return NextResponse.json(
      { message: "Rating added successfully", rating: newRating },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: error.code || error.message },
      { status: 400 }
    );
  }
}

//Get all ratings for a user
export async function GET(request) {
  try {
    const { userId } = getAuth(request);
    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const ratings = await prisma.rating.findMany({
      where: { userId },
    });
    return NextResponse.json({ ratings });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: error.code || error.message },
      { status: 400 }
    );
  }
}
