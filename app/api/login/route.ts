import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '@/models/User';

interface RequestBody {
  email: string;
  password: string;
  rememberMe: boolean; // Beni hatırla durumu
}

export async function POST(req: Request) {
  const { email, password, rememberMe }: RequestBody = await req.json();

  if (!email || !password) {
    return NextResponse.json({ message: 'Email and password are required' }, { status: 400 });
  }

  // Veritabanına bağlan
  await connectToDatabase();

  // Kullanıcıyı veritabanında ara
  const user = await User.findOne({ email });

  if (!user) {
    return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
  }

  // Şifreyi doğrula
  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
  }

  // Token'ın süresi, "Beni hatırla" seçeneğine bağlı olarak ayarlanacak
  const expiresIn = rememberMe ? '7d' : '1m'; // "Beni hatırla" seçeneği ile 7 gün, yoksa 1 saat

  // JWT token oluştur
  const token = jwt.sign(
    { userId: user._id, email: user.email },
    process.env.JWT_SECRET!,
    { expiresIn }
  );
  console.log(token);
  const decoded = jwt.decode(token);
  console.log(decoded);

  return NextResponse.json({ token });
}
