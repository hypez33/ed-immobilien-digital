import { supabase } from '@/lib/supabase';

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  date: string | null;
  category: string | null;
  cover: string | null;
  content: string | null;
  status: 'draft' | 'published';
  created_at: string;
  updated_at: string;
}

export interface CreateBlogPostPayload {
  slug: string;
  title: string;
  excerpt?: string;
  date?: string;
  category?: string;
  cover?: string;
  content?: string;
  status?: 'draft' | 'published';
}

export interface UpdateBlogPostPayload {
  slug?: string;
  title?: string;
  excerpt?: string;
  date?: string;
  category?: string;
  cover?: string;
  content?: string;
  status?: 'draft' | 'published';
}

// Get all published posts (public)
export async function getPublishedPosts(): Promise<BlogPost[]> {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('status', 'published')
    .order('date', { ascending: false });

  if (error) {
    console.error('Error fetching published posts:', error);
    return [];
  }

  return (data || []) as BlogPost[];
}

// Get all posts (admin only)
export async function getAllPosts(): Promise<BlogPost[]> {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .order('date', { ascending: false });

  if (error) {
    console.error('Error fetching all posts:', error);
    return [];
  }

  return (data || []) as BlogPost[];
}

// Get single post by slug (public)
export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .maybeSingle();

  if (error) {
    console.error('Error fetching post by slug:', error);
    return null;
  }

  return data as BlogPost | null;
}

// Create new post (admin only)
export async function createPost(payload: CreateBlogPostPayload): Promise<BlogPost> {
  const { data, error } = await supabase
    .from('blog_posts')
    .insert({
      slug: payload.slug,
      title: payload.title,
      excerpt: payload.excerpt || null,
      date: payload.date || new Date().toISOString().slice(0, 10),
      category: payload.category || null,
      cover: payload.cover || null,
      content: payload.content || null,
      status: payload.status || 'draft',
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating post:', error);
    throw error;
  }

  return data as BlogPost;
}

// Update post (admin only)
export async function updatePost(id: string, payload: UpdateBlogPostPayload): Promise<BlogPost> {
  const { data, error } = await supabase
    .from('blog_posts')
    .update(payload)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating post:', error);
    throw error;
  }

  return data as BlogPost;
}

// Upsert post (admin only) - for compatibility with existing code
export async function upsertPost(post: CreateBlogPostPayload & { id?: string }): Promise<BlogPost> {
  if (post.id) {
    // Check if post exists
    const { data: existing } = await supabase
      .from('blog_posts')
      .select('id')
      .eq('id', post.id)
      .maybeSingle();

    if (existing) {
      return updatePost(post.id, post);
    }
  }

  return createPost(post);
}

// Delete post (admin only)
export async function deletePost(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('blog_posts')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting post:', error);
    throw error;
  }

  return true;
}
