// app/api/register/route.ts
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(request: Request) {
    try {
        const { email, password } = await request.json();

        if (!email || !password) {
            return NextResponse.json(
                { message: 'Email and password are required' },
                { status: 400 }
            );
        }

        // MongoDB'ye bağlan
        await connectToDatabase();

        // Kullanıcıyı veritabanında ara
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json(
                { message: 'User already exists' },
                { status: 400 }
            );
        }

        // Şifreyi güvenli hale getir
        const hashedPassword = await bcrypt.hash(password, 12);

        // Yeni kullanıcıyı oluştur
        const newUser = new User({
            email,
            password: hashedPassword,
        });

        await newUser.save();
        return NextResponse.json(
            { message: 'User registered successfully' },
            { status: 201 }
        );

    } catch (error) {
        console.error('Registration error:', error);
        return NextResponse.json(
            { message: 'Internal Server Error' },
            { status: 500 }
        );
    }
}