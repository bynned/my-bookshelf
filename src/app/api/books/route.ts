import { NextResponse } from "next/server";
import { connectToDB } from "../../../lib/mongodb";
import Book from "../../../models/book";

export async function GET() {
  await connectToDB();
  const books = await Book.find();
  return NextResponse.json(books);
}

export async function POST(req: Request) {
  await connectToDB();
  const data = await req.json();
  const saved = await Book.insertMany(data);
  return NextResponse.json(saved, { status: 201 });
}
