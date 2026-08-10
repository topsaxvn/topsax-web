import type { PostSummary } from "@/data-access/posts";
import { PostCard } from "@/components/blog/PostCard";
import { EmptyState } from "@/components/ui/EmptyState";

export function PostGrid({ posts, emptyMessage }: { posts: PostSummary[]; emptyMessage: string }) {
  if (posts.length === 0) {
    return <EmptyState message={emptyMessage} />;
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
