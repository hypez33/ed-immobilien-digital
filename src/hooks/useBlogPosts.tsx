import { useEffect, useState } from 'react';
import { BlogPost } from '@/data/blog';
import { getPublicBlogPosts, getBlogPosts, subscribeToBlogPosts } from '@/lib/blogStore';

export function useBlogPosts({ publicOnly = false }: { publicOnly?: boolean } = {}) {
  const [posts, setPosts] = useState<BlogPost[]>(() =>
    publicOnly ? getPublicBlogPosts() : getBlogPosts()
  );

  useEffect(() => {
    return subscribeToBlogPosts((next) => {
      setPosts(publicOnly ? next.filter((post) => post.status !== 'draft') : next);
    });
  }, [publicOnly]);

  return posts;
}
