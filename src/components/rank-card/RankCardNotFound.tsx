import { motion } from 'framer-motion';
import { MagnifyingGlass, ArrowLeft } from '@phosphor-icons/react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface RankCardNotFoundProps {
  displayName: string;
}

export function RankCardNotFound({ displayName }: RankCardNotFoundProps) {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md"
      >
        <Card className="p-8 text-center bg-white/80 backdrop-blur-xl shadow-2xl border border-gray-100">
          {/* Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1, type: 'spring', stiffness: 200, damping: 15 }}
            className="mx-auto w-24 h-24 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center mb-6"
          >
            <MagnifyingGlass className="w-12 h-12 text-gray-400" weight="bold" />
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-2">User Not Found</h2>
            <p className="text-gray-600 mb-6">
              We couldn't find a user with the display name{' '}
              <span className="font-semibold text-gray-900">"{decodeURIComponent(displayName)}"</span>
            </p>

            <div className="space-y-3">
              <p className="text-sm text-gray-500">
                Please check that:
              </p>
              <ul className="text-sm text-left text-gray-600 space-y-2 bg-gray-50 rounded-lg p-4">
                <li className="flex items-start gap-2">
                  <span className="text-purple-500">•</span>
                  <span>The display name is spelled correctly</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-500">•</span>
                  <span>The user is a member of this guild</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-500">•</span>
                  <span>The user has sent at least one message</span>
                </li>
              </ul>
            </div>

            <Button
              onClick={() => navigate('/')}
              className="mt-6 w-full"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Home
            </Button>
          </motion.div>
        </Card>
      </motion.div>
    </div>
  );
}
