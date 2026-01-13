import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Coffee, Heart, Users, Sparkle } from '@phosphor-icons/react';
import { KOFI_URL } from '@/lib/firebase/types';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from '@phosphor-icons/react';

export function DonatePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-3xl space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="relative overflow-hidden border-border/50 shadow-2xl bg-card/50 backdrop-blur-xl">
            {/* Animated background */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,oklch(0.45_0.15_265/0.15),transparent_50%)]" />

            <div className="relative p-8 md:p-12 space-y-8">
              {/* Header */}
              <motion.div
                className="text-center space-y-4"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="inline-flex p-6 bg-gradient-to-br from-primary/10 to-accent/10 rounded-3xl border border-border/50 backdrop-blur-sm">
                  <Coffee className="h-16 w-16 text-primary" weight="duotone" />
                </div>
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-br from-foreground to-foreground/60 bg-clip-text text-transparent">
                  Support Our Community
                </h1>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Your support helps us maintain and improve the Azure Community platform, 
                  keeping our servers running and our features growing.
                </p>
              </motion.div>

              {/* Benefits Grid */}
              <motion.div
                className="grid md:grid-cols-3 gap-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="p-6 rounded-xl bg-gradient-to-br from-primary/5 to-transparent border border-border/50 backdrop-blur-sm space-y-3">
                  <div className="inline-flex p-3 bg-primary/10 rounded-xl">
                    <Heart className="h-6 w-6 text-primary" weight="duotone" />
                  </div>
                  <h3 className="text-lg font-semibold">Community Love</h3>
                  <p className="text-sm text-muted-foreground">
                    Help maintain a welcoming and thriving community for everyone.
                  </p>
                </div>

                <div className="p-6 rounded-xl bg-gradient-to-br from-accent/5 to-transparent border border-border/50 backdrop-blur-sm space-y-3">
                  <div className="inline-flex p-3 bg-accent/10 rounded-xl">
                    <Users className="h-6 w-6 text-accent-foreground" weight="duotone" />
                  </div>
                  <h3 className="text-lg font-semibold">Server Hosting</h3>
                  <p className="text-sm text-muted-foreground">
                    Cover costs for reliable Discord bot hosting and database services.
                  </p>
                </div>

                <div className="p-6 rounded-xl bg-gradient-to-br from-success/5 to-transparent border border-border/50 backdrop-blur-sm space-y-3">
                  <div className="inline-flex p-3 bg-success/10 rounded-xl">
                    <Sparkle className="h-6 w-6 text-success" weight="duotone" />
                  </div>
                  <h3 className="text-lg font-semibold">New Features</h3>
                  <p className="text-sm text-muted-foreground">
                    Fund development of exciting new features and improvements.
                  </p>
                </div>
              </motion.div>

              {/* CTA Section */}
              <motion.div
                className="p-8 rounded-2xl bg-gradient-to-br from-primary/10 via-transparent to-accent/10 border border-border/50 backdrop-blur-sm text-center space-y-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold">Buy Me a Coffee</h2>
                  <p className="text-muted-foreground">
                    Every contribution, no matter how small, makes a huge difference!
                  </p>
                </div>

                <Button
                  asChild
                  size="lg"
                  className="gap-3 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg text-lg px-8 py-6"
                >
                  <a href={KOFI_URL} target="_blank" rel="noopener noreferrer">
                    <Coffee className="h-5 w-5" weight="fill" />
                    Support on Ko-fi
                  </a>
                </Button>

                <p className="text-xs text-muted-foreground">
                  Secure payment through Ko-fi · No account required
                </p>
              </motion.div>

              {/* Thank You Message */}
              <motion.div
                className="text-center pt-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <p className="text-sm text-muted-foreground">
                  Thank you for being part of our amazing community! ❤️
                </p>
              </motion.div>
            </div>
          </Card>
        </motion.div>

        {/* Back button */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <Button onClick={() => navigate('/')} variant="ghost" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
