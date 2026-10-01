import { useParams, useNavigate } from 'react-router-dom';
import { PageBuilder } from '@hoop-master/features';
import { Blocks } from '@hoop-master/ui';

export default function DynamicPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { usePageBuilder } = PageBuilder;
  const { page, blocks, loading } = usePageBuilder(slug);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!page || page.status !== 'published') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <h1 className="text-4xl font-bold text-slate-800 mb-4">404 - Page Not Found</h1>
        <button onClick={() => navigate('/')} className="text-orange-500 hover:underline">
          Return Home
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col w-full bg-white">
      {blocks.map((block) => (
        <Blocks.BlockRenderer key={block.id} block={block} />
      ))}
    </div>
  );
}
