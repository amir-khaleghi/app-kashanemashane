import db from '@/lib/db';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { error } from 'console';
import { NextResponse } from 'next/server';

export async function GET() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user || user === null || !user.id) {
    console.error(error);
    return NextResponse.json({ error: 'Invalid user' }, { status: 400 });
  }

  let dbUser = await db.user.findUnique({
    where: { id: user?.id },
  });

  if (!dbUser) {
    dbUser = await db.user.create({
      data: {
        email: user.email ?? '',
        firstName: user.given_name ?? '',
        lastName: user.family_name ?? '',
        id: user.id,
        profileImage:
          user?.picture ?? `https://avatar.vercel.sh/${user?.given_name}`,
      },
    });
  }

  return NextResponse.redirect('https://airbnb-clone.liara.run');
}