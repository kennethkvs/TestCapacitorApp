import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { hash } from "bcrypt";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, phoneNumber, password } = body;

    const isUserExist = await prisma.user.findUnique({
      where: { email: email },
    });

    if (isUserExist) {
      return NextResponse.json(
        {
          user: null,
          message: "User already exists",
        },
        { status: 400 },
      );
    }

    const hashPassword = await hash(password, 10);
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        phoneNumber,
        password: hashPassword,
      },
    });
    const { password: _, ...userWOPassword } = newUser;

    return NextResponse.json({ user: userWOPassword, message: "User created" });
  } catch (error) {
    return NextResponse.json({ message: "An error occurred" }, { status: 500 });
  }
}
