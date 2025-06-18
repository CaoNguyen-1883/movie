import { useParams } from 'react-router-dom';

const MovieDetailPage = () => {
  const { slug } = useParams();

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold">Movie Detail Page</h1>
      <p className="mt-4 text-lg">Slug: {slug}</p>
    </div>
  );
};

export default MovieDetailPage; 