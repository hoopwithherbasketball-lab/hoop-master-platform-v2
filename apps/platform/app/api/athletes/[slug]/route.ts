import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;

    if (!slug) {
      return NextResponse.json(
        { error: 'Athlete slug is required' },
        { status: 400 }
      );
    }

    const athlete = await prisma.athlete.findUnique({
      where: {
        slug: slug,
      },
      include: {
        stats: true,
        media: true,
        openRunEvents: {
          include: {
            openRunEvent: true, // Joins the pivot table to get the actual Open Run details
          },
        },
      },
    });

    if (!athlete) {
      return NextResponse.json(
        { error: 'Athlete not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(athlete, { status: 200 });
  } catch (error) {
    console.error('Error fetching athlete profile:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
