import { User } from "@/models/User";
import bcrypt from "bcrypt";
import dbConnect from "@/lib/dbConnect";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const email = body.email;

  try {
    await dbConnect();
  } catch (error) {
    return NextResponse.json({ errorMessage: error } , { status: 500 });
  }

  const emailExists = await User.findOne({ email });
  if (emailExists) {
    return NextResponse.json({ errorMessage: 'Email already exists' }, { status: 400 });
  }

  const pass = body.password;
  if (!pass?.length || pass.length < 5) {
    return NextResponse.json({ errorMessage: 'Password must be at least 5 characters long' }, { status: 400 });
  }


  const notHashedPassword = pass;
  const salt = bcrypt.genSaltSync(10);
  body.password = bcrypt.hashSync(notHashedPassword, salt);

  const createdUser = await User.create(body);
  return NextResponse.json({ user: createdUser }, { status: 200 });
}