'use client';

import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
// import PostForm from '../../../components/PostForm';

interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
}

export default function EditPage() {
  const router = useRouter();
  const { id } = useParams();
  const [post, setPost] = useState<Post | null>(null);

  useEffect(() => {
    if (!id) return;
    // fetch(`https://jsonplaceholder.typicode.com/posts/${id}`)
    //   .then(res => res.json())
    //   .then(data => setPost(data));
    console.log("no data")
  }, [id]);

  async function handleEdit(data: { title: string; body: string }) {
    if (!post) return;
    await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`, {
      method: 'PUT',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify({ ...data, userId: post.userId }),
    });
    router.push('/');
  }

  if (!post) return <div>Loading...</div>;

  return (
    <div>
      <h1>✏️ Edit Post</h1>
      <PostForm initialData={{ title: post.title, body: post.body }} onSubmit={handleEdit} />
    </div>
  );
}
