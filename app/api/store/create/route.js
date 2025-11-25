import imagekit from "@/configs/imagekit";
import prisma from "@/lib/prisma";
import { getAuth, clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

//Create the store
export async function POST(request) {
  try {
    const { userId } = getAuth(request);
    //Get the data from the form
    const formData = await request.formData();

    const name = formData.get("name");
    const username = formData.get("username");
    const description = formData.get("description");
    const email = formData.get("email");
    const contact = formData.get("contact");
    const address = formData.get("address");
    const image = formData.get("image");

    if (
      !name ||
      !username ||
      !description ||
      !email ||
      !contact ||
      !address ||
      !image
    ) {
      return NextResponse.json(
        { error: "Missing store info" },
        { status: 400 }
      );
    }

    //Check if user have already registered a store
    const store = await prisma.store.findFirst({
      where: { userId },
    });
    //Send status if user have already registered a store
    if (store) {
      return NextResponse.json({ status: store.status });
    }

    //Check if username is already taken
    const isUsernameTaken = await prisma.store.findFirst({
      where: { username: username.toLowerCase() },
    });
    if (isUsernameTaken) {
      return NextResponse.json(
        { error: "Username already taken" },
        { status: 400 }
      );
    }


    //Image upload to ImageKit
    const buffer = Buffer.from(await image.arrayBuffer());
    const response = await imagekit.upload({
      file: buffer,
      fileName: image.name,
      folder: "logos",
    });

    const optimizedImage = imagekit.url({
      path: response.filePath,
      transformation: [
        { quality: "auto" },
        { format: "webp" },
        { width: "512" },
      ],
    });

    const newStore = await prisma.store.create({
      data: {
        userId,
        name,
        description,
        username: username.toLowerCase(),
        email,
        contact,
        address,
        logo: optimizedImage,
      },
    });

    return NextResponse.json({ message: "Applied , waiting for approval" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: error.code || error.message },
      { status: 400 }
    );
  }
}

//Check if user has already resigtered a store
export async function GET(request) {
  try {
    const { userId } = getAuth(request);

    //Check if user have already registered a store
    const store = await prisma.store.findFirst({
      where: { userId },
    });
    //Send status if user have already registered a store
    if (store) {
      return NextResponse.json({ status: store.status });
    }

    return NextResponse.json({ status: "Not registered" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: error.code || error.message },
      { status: 400 }
    );
  }
}
