require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Post = require('./models/Post');

const sampleUsers = [
  {
    username: 'alexrivers',
    email: 'alex@example.com',
    password: 'password123',
    bio: 'Full-stack engineer passionate about React, Node.js and distributed systems.',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    role: 'admin',
  },
  {
    username: 'sophiachen',
    email: 'sophia@example.com',
    password: 'password123',
    bio: 'Product Designer and Frontend architect crafting fluid user experiences.',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
    role: 'user',
  },
];

const samplePosts = [
  {
    title: 'Mastering Modern Full-Stack Development with React 19 and Node.js',
    summary:
      'Explore the architectural shifts in React 19, server actions, and how to build responsive, robust REST APIs with Node.js and MongoDB.',
    content: `Building scalable web applications requires a solid understanding of both frontend dynamics and backend resilience. In this guide, we dive into building robust REST APIs with Node.js and pairing them with high-performance React client applications.

### Key Architectural Pillars
1. **Decoupled Architecture**: Keep presentation logic cleanly isolated from business rules and database queries.
2. **Stateless Authentication**: Using JSON Web Tokens (JWT) allows your API servers to scale horizontally without sticky sessions.
3. **Optimistic UI Updates**: Delivering instantaneous feedback for user actions like comments and likes keeps user engagement high.

### Data Flow in Action
When a user submits a blog article, our frontend sends a secure bearer token. Express verifies the token signature, checks author validity against MongoDB, sanitizes the payload, and persists the article with automatic slug and reading time calculations.

Modern JavaScript tooling like Vite combined with Express ensures development cycles remain blazing fast!`,
    coverImage: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80',
    tags: ['React', 'NodeJS', 'FullStack', 'WebDev'],
    category: 'Engineering',
    readingTime: 4,
  },
  {
    title: 'Designing Intuitive User Interfaces: Principles for Modern Web Apps',
    summary:
      'A deep dive into typography hierarchy, micro-interactions, responsive grids, and design tokens that elevate a web application.',
    content: `Great interfaces feel invisible. When users can navigate your application effortlessly, they focus entirely on their content rather than figuring out how the buttons work.

### 1. Visual Hierarchy and Spacing
Consistently applying a standard 8px grid scale simplifies styling decisions across navigation bars, cards, and input controls. Combine this with crisp sans-serif typography to create readability at any viewport size.

### 2. Micro-Interactions that Delight
Subtle hover effects on buttons, animated transition states during loading, and clear validation messages reduce friction and communicate state changes with confidence.

### 3. Accessible Color Contrasts
Always check color combinations against WCAG AA standards. High contrast ensures readability in both bright daylight and low-light environments.`,
    coverImage: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=80',
    tags: ['UI/UX', 'Design', 'CSS', 'Tailwind'],
    category: 'Design',
    readingTime: 3,
  },
  {
    title: 'Database Indexing Strategies in MongoDB for High-Traffic Applications',
    summary:
      'How compound indexes, text indexes, and query profiling can turn sluggish queries into millisecond responses.',
    content: `When building blog platforms or social feeds, query volume expands rapidly. A collection with millions of posts can experience significant latency without an optimized indexing strategy.

### Essential Indexing Techniques
- **Single Field vs Compound Indexes**: Indexing fields like \`createdAt: -1\` accelerates chronological feed queries. Compound indexes such as \`{ author: 1, createdAt: -1 }\` make author profile queries instantaneous.
- **Text Search & Regex**: For lightweight search functionality across titles and summaries, indexed regex or text indexes prevent costly table scans.
- **Projection**: Always project only the required fields when fetching list feeds, saving memory and bandwidth.`,
    coverImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80',
    tags: ['MongoDB', 'Database', 'Backend', 'Performance'],
    category: 'Database',
    readingTime: 5,
  },
  {
    title: 'State Management and Custom Hooks in React 2026',
    summary:
      'How to organize client state cleanly using React Context, custom hooks, and modern caching strategies without unnecessary overhead.',
    content: `Managing state cleanly is one of the most critical decisions in frontend engineering. Over-engineering with heavyweight state libraries is often unnecessary when custom hooks and modern React primitives provide all the tools needed.

### Custom Hooks for Authentication and Fetching
By wrapping standard fetch operations inside custom hooks like \`useAuth\` or \`useFetch\`, components remain purely focused on presentation. Error handling, token refresh, and loading states are encapsulated in reusable logic.

Always prioritize simple, maintainable state architectures!`,
    coverImage: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=1200&q=80',
    tags: ['React', 'JavaScript', 'StateManagement'],
    category: 'Engineering',
    readingTime: 4,
  },
];

const seedData = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/blogapp';
    console.log(`Connecting to MongoDB at: ${mongoUri}`);
    await mongoose.connect(mongoUri);

    console.log('Clearing existing users and posts...');
    await User.deleteMany({});
    await Post.deleteMany({});

    console.log('Creating demo users...');
    const createdUsers = [];
    for (const u of sampleUsers) {
      const user = await User.create(u);
      createdUsers.push(user);
    }
    console.log(`Created ${createdUsers.length} users.`);

    console.log('Creating sample posts...');
    for (let i = 0; i < samplePosts.length; i++) {
      const author = createdUsers[i % createdUsers.length];
      const otherUser = createdUsers[(i + 1) % createdUsers.length];

      const postData = {
        ...samplePosts[i],
        author: author._id,
        likes: [otherUser._id],
        comments: [
          {
            user: otherUser._id,
            text: 'Outstanding article! The insights on architecture and clean code are super helpful.',
            createdAt: new Date(Date.now() - 3600000 * (i + 1)),
          },
        ],
      };

      await Post.create(postData);
    }

    console.log('Database seeded successfully!');
    console.log('----------------------------------------------------');
    console.log('Demo Login Credentials:');
    console.log('User 1: alex@example.com / password123');
    console.log('User 2: sophia@example.com / password123');
    console.log('----------------------------------------------------');

    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error.message);
    process.exit(1);
  }
};

seedData();
