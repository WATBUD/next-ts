// app/[id]/page.js
import { notFound } from 'next/navigation';

const PostPage = async ({ params }) => {
  // Fetching a specific post based on the dynamic id parameter
  const res = await fetch(`https://jsonplaceholder.typicode.com/posts/${params.id}`);
  if (!res.ok) {
    notFound(); // Show 404 if the post is not found
  }
  const post = await res.json();

  return (
    <div>
      <h1>{post.title}</h1>
      <p>{post.body}</p>
    </div>
  );
};

export default PostPage;
