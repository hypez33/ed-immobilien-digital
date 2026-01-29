import { blogPosts, BlogPost } from '@/data/blog';
import { addActivity } from '@/lib/activityStore';

const STORAGE_KEY = 'ed_blog_posts';
const UPDATE_EVENT = 'blog-storage';

const normalizePost = (post: BlogPost): BlogPost => {
  const createdAt = post.createdAt ?? post.date ?? new Date().toISOString();
  const updatedAt = post.updatedAt ?? post.date ?? createdAt;
  return {
    ...post,
    status: post.status ?? 'published',
    createdAt,
    updatedAt,
  };
};

export const getBlogPosts = (): BlogPost[] => {
  if (typeof window === 'undefined') {
    return blogPosts.map(normalizePost);
  }
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return blogPosts.map(normalizePost);
  }
  try {
    const parsed = JSON.parse(raw) as BlogPost[];
    if (!Array.isArray(parsed)) return blogPosts.map(normalizePost);
    return parsed.map(normalizePost);
  } catch {
    return blogPosts.map(normalizePost);
  }
};

export const getPublicBlogPosts = (): BlogPost[] =>
  getBlogPosts().filter((post) => post.status !== 'draft');

export const saveBlogPosts = (posts: BlogPost[]) => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
  window.dispatchEvent(new Event(UPDATE_EVENT));
};

export const upsertBlogPost = (post: BlogPost) => {
  const posts = getBlogPosts();
  const index = posts.findIndex((entry) => entry.id === post.id);
  const now = new Date().toISOString();
  if (index >= 0) {
    const current = posts[index];
    posts[index] = normalizePost({
      ...current,
      ...post,
      updatedAt: now,
    });
    addActivity('blog:update', `Beitrag aktualisiert: ${posts[index].title}`);
  } else {
    posts.unshift(
      normalizePost({
        ...post,
        createdAt: post.createdAt ?? now,
        updatedAt: now,
      })
    );
    addActivity('blog:create', `Beitrag erstellt: ${posts[0].title}`);
  }
  saveBlogPosts(posts);
  return posts;
};

export const deleteBlogPost = (id: string) => {
  const current = getBlogPosts();
  const removed = current.find((post) => post.id === id);
  const posts = current.filter((post) => post.id !== id);
  saveBlogPosts(posts);
  if (removed) {
    addActivity('blog:delete', `Beitrag gelöscht: ${removed.title}`);
  }
  return posts;
};

export const subscribeToBlogPosts = (callback: (posts: BlogPost[]) => void) => {
  if (typeof window === 'undefined') return () => {};
  const handler = () => callback(getBlogPosts());
  window.addEventListener('storage', handler);
  window.addEventListener(UPDATE_EVENT, handler);
  return () => {
    window.removeEventListener('storage', handler);
    window.removeEventListener(UPDATE_EVENT, handler);
  };
};
