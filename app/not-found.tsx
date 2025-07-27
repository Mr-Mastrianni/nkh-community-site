import Link from 'next/link';
import CosmicBackground from '@/components/CosmicBackground';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center relative">
      <CosmicBackground />
      
      <div className="text-center">
        <div className="cosmic-card p-12 max-w-md">
          <div className="text-6xl mb-6">
            <i className="fas fa-compass text-spiritual-purple"></i>
          </div>
          
          <h1 className="text-4xl font-bold text-3d mb-4">
            404
          </h1>
          
          <h2 className="text-xl font-medium mb-4">
            Path Not Found
          </h2>
          
          <p className="text-cosmic-light/80 mb-8">
            The spiritual path you're seeking doesn't exist in our realm. 
            Let us guide you back to your journey.
          </p>
          
          <Link href="/" className="cosmic-button">
            <i className="fas fa-home mr-2"></i>
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
}