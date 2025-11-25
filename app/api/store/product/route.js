import imagekit from "@/configs/imagekit";
import prisma from "@/lib/prisma";
import authSeller from "@/middleware/authSeller";
import { getAuth } from "@clerk/nextjs/server";
import { err } from "inngest/types";
import { NextResponse } from "next/server";

//Add new product
export async function POST(request) {
  try {
    const { userId } = getAuth(request);
    const { storeId } = authSeller(userId);

    if (!storeId) {
      return NextResponse.json({ error: "Not authorized", status: 401 });
    }

    //Get the data from the form
    const formData = await request.formData();

    const name = formData.get("name");
    const description = formData.get("description");
    const mrp = Number(formData.get("mrp"));
    const price = Number(formData.get("price"));
    const category = formData.get("category");
    const images = formData.getAll("images");

    if (
      !name ||
      !description ||
      !mrp ||
      !price ||
      !category ||
      images.length < 1
    ) {
      return NextResponse.json(
        { error: "missing product details" },
        { status: 400 }
      );
    }

    //Uploading the images to ImageKit
    const imageUrl = await Promise.all(
      images.map(async (image) => {
        const buffer = Buffer.from(await image.arrayBuffer());
        const response = await imagekit.upload({
          file: buffer,
          fileName: image.name,
          folder: "products",
        });
        const url = imagekit.url({
          path: response.filePath,
          transformations: [
            { quality: "auto" },
            { format: "webp" },
            { width: "1024" },
          ],
        });
        return url;
      })
    );

    await prisma.product.create({
      data: {
        name,
        description,
        mrp,
        price,
        category,
        images: imageUrl,
        storeId,
      },
    });
    return NextResponse.json({ message: "Product added successfully" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: error.code || error.message },
      { status: 400 }
    );
  }
}

// Get all products for a seller
export async function GET(request) {
  try {
    const { userId } = getAuth(request);
    const { storeId } = authSeller(userId);
    if (!storeId) {
      return NextResponse.json({ error: "Not authorized" }, { status: 401 });
    }
    const products = await prisma.product.findMany({ where: { storeId } });
    return NextResponse.json({ products });
  } catch (error) {
    return NextResponse.json(
      { error: error.code || error.message },
      { status: 400 }
    );
  }
}
