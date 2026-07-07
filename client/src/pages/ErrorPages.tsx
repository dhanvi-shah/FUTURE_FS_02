import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/Button';

export const NotFoundPage = () => (
  <div className="min-h-screen flex items-center justify-center bg-background p-4">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center"
    >
      <p className="text-8xl font-bold gradient-text mb-4">404</p>
      <h1 className="text-2xl font-semibold mb-2">Page not found</h1>
      <p className="text-text-secondary mb-8 max-w-md">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <div className="flex gap-3 justify-center">
        <Button variant="secondary" onClick={() => window.history.back()} leftIcon={<ArrowLeft className="w-4 h-4" />}>
          Go Back
        </Button>
        <Link to="/dashboard">
          <Button leftIcon={<Home className="w-4 h-4" />}>Dashboard</Button>
        </Link>
      </div>
    </motion.div>
  </div>
);

export const ErrorPage = () => (
  <div className="min-h-screen flex items-center justify-center bg-background p-4">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center"
    >
      <p className="text-8xl font-bold text-red-400 mb-4">500</p>
      <h1 className="text-2xl font-semibold mb-2">Something went wrong</h1>
      <p className="text-text-secondary mb-8 max-w-md">
        We encountered an unexpected error. Please try again later.
      </p>
      <Button onClick={() => window.location.reload()}>Try Again</Button>
    </motion.div>
  </div>
);
