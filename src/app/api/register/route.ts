import { User } from "@/models/User";
import bcrypt from "bcrypt";
import dbConnect from "@/lib/dbConnect";

export async function POST(req: Request) {
  const body = await req.json();

  const email = body.email;

  try {
    await dbConnect();
  } catch (error) {
    return new Response(null, { status: 500, statusText: `${error}` });
  }

  const emailExists = await User.findOne({ email });
  if (emailExists) {
    return new Response(null, { status: 400, statusText: 'Email already exists' });
  }

  const pass = body.password;
  if (!pass?.length || pass.length < 5) {
    new Error('password must be at least 5 characters');
  }


  const notHashedPassword = pass;
  const salt = bcrypt.genSaltSync(10);
  body.password = bcrypt.hashSync(notHashedPassword, salt);

  const createdUser = await User.create(body);
  return Response.json(createdUser);
}