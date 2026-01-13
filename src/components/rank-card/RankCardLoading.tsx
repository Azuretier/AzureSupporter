import { motion } from 'framer-motion';

export function RankCardLoading() {
  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-4xl"
      >
        {/* Main Card Skeleton */}
        <div className="relative overflow-hidden rounded-3xl bg-white/80 backdrop-blur-xl shadow-2xl border border-gray-100">
          {/* Gradient Overlay Animation */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
            animate={{
              x: ['-100%', '200%'],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />

          {/* Header Section */}
          <div className="relative p-8 bg-gradient-to-br from-purple-500/10 via-indigo-500/10 to-blue-500/10">
            <div className="flex items-center gap-6">
              {/* Avatar Skeleton */}
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse" />
                <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse" />
              </div>

              {/* User Info Skeleton */}
              <div className="flex-1 space-y-3">
                <div className="h-8 w-48 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg animate-pulse" />
                <div className="h-5 w-32 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg animate-pulse" />
              </div>

              {/* Rank Badge Skeleton */}
              <div className="flex flex-col items-end gap-2">
                <div className="h-6 w-24 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full animate-pulse" />
                <div className="h-8 w-32 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg animate-pulse" />
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="relative p-8 space-y-6">
            {/* XP Progress Bar */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <div className="h-4 w-24 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse" />
                <div className="h-4 w-32 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse" />
              </div>
              <div className="h-3 w-full bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-purple-400 via-indigo-400 to-blue-400"
                  animate={{
                    width: ['20%', '80%', '20%'],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                />
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="p-4 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 space-y-2">
                  <div className="h-4 w-16 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse" />
                  <div className="h-8 w-20 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse" />
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="relative px-8 pb-8">
            <div className="h-4 w-40 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse mx-auto" />
          </div>
        </div>

        {/* Loading Text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-6 text-center"
        >
          <p className="text-gray-600 font-medium">
            <motion.span
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              Loading rank card...
            </motion.span>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
