import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';

export function RankCardSkeleton() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl"
      >
        <Card className="relative overflow-hidden border-border/50 shadow-2xl bg-card/50 backdrop-blur-xl">
          {/* Animated gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10" />
          <div className="absolute inset-0">
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent"
              animate={{
                x: ['-100%', '100%'],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'linear',
              }}
            />
          </div>

          <div className="relative p-8 md:p-12 space-y-8">
            {/* Header skeleton */}
            <div className="flex items-center gap-6">
              {/* Avatar skeleton */}
              <motion.div
                className="relative w-24 h-24 md:w-32 md:h-32 rounded-full bg-muted/50 overflow-hidden"
                animate={{
                  opacity: [0.5, 0.8, 0.5],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20" />
              </motion.div>

              {/* Text skeleton */}
              <div className="flex-1 space-y-3">
                <motion.div
                  className="h-8 w-48 bg-muted/50 rounded-lg"
                  animate={{
                    opacity: [0.5, 0.8, 0.5],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: 0.1,
                  }}
                />
                <motion.div
                  className="h-6 w-32 bg-muted/30 rounded-lg"
                  animate={{
                    opacity: [0.5, 0.8, 0.5],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: 0.2,
                  }}
                />
              </div>
            </div>

            {/* Stats skeleton */}
            <div className="grid grid-cols-3 gap-4">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="space-y-2"
                  animate={{
                    opacity: [0.5, 0.8, 0.5],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: 0.3 + i * 0.1,
                  }}
                >
                  <div className="h-4 w-16 bg-muted/30 rounded" />
                  <div className="h-6 w-20 bg-muted/50 rounded" />
                </motion.div>
              ))}
            </div>

            {/* Progress bar skeleton */}
            <div className="space-y-3">
              <motion.div
                className="h-4 w-24 bg-muted/30 rounded"
                animate={{
                  opacity: [0.5, 0.8, 0.5],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: 0.6,
                }}
              />
              <div className="relative h-6 bg-muted/30 rounded-full overflow-hidden">
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-primary/30 to-accent/30"
                  animate={{
                    x: ['-100%', '100%'],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'linear',
                  }}
                />
              </div>
            </div>

            {/* Loading text */}
            <motion.div
              className="text-center pt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <p className="text-sm text-muted-foreground font-medium">
                Loading rank card data...
              </p>
            </motion.div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
