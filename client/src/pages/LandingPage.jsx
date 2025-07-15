import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '~/components/ui/button';
import { Card } from '~/components/ui/card';
import { ThemeToggle } from '../components/ThemeToggle'; // Import the new component

// Animation variants for Framer Motion
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2, delayChildren: 0.3 },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.5 } },
};

const LandingPage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground font-sans overflow-x-hidden">
      {/* Header */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between p-4 border-b bg-card/80 backdrop-blur-sm sticky top-0 z-50"
      >
        <h1 className="text-xl font-bold tracking-tighter">Eco-Explorer 🗺️</h1>
        <nav className="flex items-center gap-4">
          <a href="#features" className="text-sm hover:text-primary transition-colors">Features</a>
          <a href="#pricing" className="text-sm hover:text-primary transition-colors">Pricing</a>
          <Link to="/app">
            <Button>Launch App</Button>
          </Link>
          <ThemeToggle /> {/* Add the theme toggle button here */}
        </nav>
      </motion.header>

      {/* Main Content */}
      <motion.main
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex-1"
      >
        {/* Hero Section */}
        <section className="text-center py-20 md:py-32 px-4">
          <motion.h2 variants={itemVariants} className="text-4xl md:text-6xl font-extrabold tracking-tighter mb-4">
            Find Your Perfect Path.
          </motion.h2>
          <motion.p variants={itemVariants} className="max-w-2xl mx-auto text-lg text-muted-foreground mb-8">
            Discover the city's most scenic and tranquil walking routes. Turn your commute into an adventure.
          </motion.p>
          <motion.div variants={itemVariants}>
            <Link to="/app">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold">
                Start Exploring for Free
              </Button>
            </Link>
          </motion.div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 px-4 bg-card/50">
          <motion.h3 variants={itemVariants} className="text-3xl font-bold text-center mb-12">Why You'll Love Eco-Explorer</motion.h3>
          <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8">
            <motion.div variants={itemVariants}>
              <Card className="bg-card border text-center p-8">
                <h4 className="text-xl font-semibold mb-2">Scenic Routing</h4>
                <p className="text-muted-foreground">Our smart algorithm prioritizes parks, waterfronts, and tree-lined streets.</p>
              </Card>
            </motion.div>
            <motion.div variants={itemVariants}>
              <Card className="bg-card border text-center p-8">
                <h4 className="text-xl font-semibold mb-2">Live Geolocation</h4>
                <p className="text-muted-foreground">Track your progress in real-time with precise location services.</p>
              </Card>
            </motion.div>
            <motion.div variants={itemVariants}>
              <Card className="bg-card border text-center p-8">
                <h4 className="text-xl font-semibold mb-2">Adaptive UI</h4>
                <p className="text-muted-foreground">The interface adapts to your network speed, ensuring a smooth experience.</p>
              </Card>
            </motion.div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-20 px-4">
           <motion.h3 variants={itemVariants} className="text-3xl font-bold text-center mb-12">Choose Your Plan</motion.h3>
           <motion.div variants={itemVariants} className="max-w-md mx-auto">
             <Card className="bg-gradient-to-br from-primary/20 to-background border-primary p-8 text-center">
                <h4 className="text-2xl font-bold mb-2">Pro Plan</h4>
                <p className="text-4xl font-extrabold mb-4">$5<span className="text-lg font-normal text-muted-foreground">/month</span></p>
                <ul className="text-left space-y-2 mb-8">
                  <li>✅ Unlimited Scenic Routes</li>
                  <li>✅ Save & Share Your Favorite Paths</li>
                  <li>✅ Offline Map Access</li>
                </ul>
                <Button size="lg" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold">Go Pro</Button>
             </Card>
           </motion.div>
        </section>
      </motion.main>
    </div>
  );
};

export default LandingPage;