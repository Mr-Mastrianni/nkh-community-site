import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Create default admin user
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@neferkali.com' },
    update: {},
    create: {
      email: 'admin@neferkali.com',
      name: 'Admin User',
      role: 'SUPER_ADMIN',
      profile: {
        create: {
          bio: 'System Administrator',
          interests: JSON.stringify(['healing', 'cosmic', 'spiritual']),
          practiceLevel: 'advanced'
        }
      }
    },
  })

  console.log('Created admin user:', adminUser)

  // Create some sample blog posts
  const samplePosts = [
    {
      title: 'Cosmic Healing Practices for Spiritual Growth',
      slug: 'cosmic-healing-practices',
      content: '<p>Discover ancient cosmic healing practices that can accelerate your spiritual growth and connect you with universal energies.</p>',
      excerpt: 'Discover ancient cosmic healing practices that can accelerate your spiritual growth.',
      tags: JSON.stringify(['healing', 'cosmic', 'spiritual']),
      status: 'PUBLISHED' as const,
      publishedAt: new Date('2025-07-15T10:00:00Z'),
    },
    {
      title: 'Understanding Your Cosmic Connection',
      slug: 'cosmic-connection',
      content: '<p>Learn how to strengthen your connection to cosmic energies and align with universal consciousness.</p>',
      excerpt: 'Learn how to strengthen your connection to cosmic energies.',
      tags: JSON.stringify(['connection', 'cosmic', 'energy']),
      status: 'DRAFT' as const,
    },
    {
      title: 'Meditation Techniques for Cosmic Awareness',
      slug: 'meditation-cosmic-awareness',
      content: '<p>Explore powerful meditation techniques designed to expand your cosmic awareness and spiritual perception.</p>',
      excerpt: 'Explore powerful meditation techniques to expand your cosmic awareness.',
      tags: JSON.stringify(['meditation', 'awareness', 'techniques']),
      status: 'SCHEDULED' as const,
      scheduledFor: new Date('2025-07-25T08:00:00Z'),
    },
  ]

  for (const postData of samplePosts) {
    const wordCount = postData.content.replace(/<[^>]*>/g, '').split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / 200);

    await prisma.blogPost.upsert({
      where: { slug: postData.slug },
      update: {},
      create: {
        ...postData,
        authorId: adminUser.id,
        readingTime,
        wordCount,
        publishedAt: postData.status === 'PUBLISHED' ? postData.publishedAt : null,
      },
    })
  }

  console.log('Created sample blog posts')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })