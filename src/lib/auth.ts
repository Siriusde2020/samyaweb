import { NextRequest } from 'next/server';
import jwt, { type Secret, type SignOptions } from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
const JWT_SECRET: Secret = process.env.JWT_SECRET || 'dev-secret-change-in-production';

export interface TokenPayload {
  userId: string;
  email: string;
  role: string;
}

export function signToken(payload: TokenPayload): string {
  const options: SignOptions = { expiresIn: '7d' };
  return jwt.sign(payload as object, JWT_SECRET, options);
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch {
    return null;
  }
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function getAuthUser(request: NextRequest) {
  const token =
    request.cookies.get('auth-token')?.value ||
    request.headers.get('authorization')?.replace('Bearer ', '');

  if (!token) return null;

  const payload = verifyToken(token);
  if (!payload) return null;

  try {
    const { prisma } = await import('./db');
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        avatar: true,
        subscription: { select: { plan: true, status: true } },
      },
    });
    return user;
  } catch {
    // Database not available - return payload data
    return { id: payload.userId, email: payload.email, name: null, role: payload.role, avatar: null, subscription: null };
  }
}
