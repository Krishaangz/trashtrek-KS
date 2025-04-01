import React, { useState, useEffect } from 'react';
import { motion, useScroll, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Recycle, Trophy, Trees, Award, Star, 
  Globe, Users, Brain, Smartphone, MapPin,
  ArrowRight, Check, Shield, Heart, Zap,
  Award as AwardIcon, Target, Clock, Bookmark
} from 'lucide-react';
import TestimonialSection from './TestimonialSection';

const Landing = () => {
  const { scrollYProgress } = useScroll();
  const [dimensions, setDimensions] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1000,
    height: typeof window !== 'undefined' ? window.innerHeight : 1000
  });
  const [isVisible, setIsVisible] = useState(false);

  // Show elements after a small delay for a smoother entry experience
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Enhanced floating icons with more variety
  const floatingIcons = Array(24).fill(null).map((_, i) => {
    // Choose different icons based on index for more variety
    const IconComponent = 
      i % 8 === 0 ? Recycle : 
      i % 8 === 1 ? Trees : 
      i % 8 === 2 ? Globe : 
      i % 8 === 3 ? Trophy :
      i % 8 === 4 ? Heart :
      i % 8 === 5 ? Shield :
      i % 8 === 6 ? Zap :
      Target;
    
    return {
      icon: IconComponent,
      initial: {
        x: Math.random() * dimensions.width - dimensions.width / 2,
        y: Math.random() * dimensions.height - dimensions.height / 2,
        rotate: Math.random() * 360,
        opacity: 0.12,
        scale: 0.7 + Math.random() * 0.5
      },
      animate: {
        x: [
          Math.random() * dimensions.width - dimensions.width / 2,
          Math.random() * dimensions.width - dimensions.width / 2,
          Math.random() * dimensions.width - dimensions.width / 2
        ],
        y: [
          Math.random() * dimensions.height - dimensions.height / 2,
          Math.random() * dimensions.height - dimensions.height / 2,
          Math.random() * dimensions.height - dimensions.height / 2
        ],
        rotate: [0, 180, 360],
        scale: [
          0.7 + Math.random() * 0.5,
          1 + Math.random() * 0.5,
          0.7 + Math.random() * 0.5
        ],
        transition: {
          duration: 20 + Math.random() * 15,
          repeat: Infinity,
          ease: "linear",
          delay: Math.random() * 5
        }
      }
    };
  });

  // Features section data
  const features = [
    {
      icon: MapPin,
      title: "Location Tracking",
      description: "Track your cleanup routes and areas covered in real-time"
    },
    {
      icon: Trophy,
      title: "Achievements",
      description: "Earn badges and trophies for your environmental impact"
    },
    {
      icon: Users,
      title: "Community Challenges",
      description: "Join forces with others in your area for bigger impact"
    },
    {
      icon: Brain,
      title: "Smart Suggestions",
      description: "AI-powered recommendations for efficient cleanup routes"
    }
  ];

  // Stats section data
  const stats = [
    { value: "No", label: "Users Worldwide" },
    { value: "0", label: "Tons Collected" },
    { value: "0", label: "Countries" },
    { value: "N/A", label: "App Rating" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-dark to-primary-light text-white overflow-hidden flex flex-col items-center">
      {/* Floating Background Icons */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {floatingIcons.map((icon, index) => (
          <motion.div
            key={index}
            initial={icon.initial}
            animate={icon.animate}
            className="absolute left-1/2 top-1/2 will-change-transform"
          >
            <icon.icon 
              className="text-primary/15" 
              size={20 + Math.random() * 25} 
            />
          </motion.div>
        ))}
      </div>

      {/* Enhanced Glowing Effects */}
      <motion.div
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[150px]"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      {/* Secondary pulsing effect */}
      <motion.div
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent-green/5 rounded-full blur-[120px]"
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.2, 0.3, 0.2],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2
        }}
      />

      {/* Additional accent effect */}
      <motion.div
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-accent-blue/5 rounded-full blur-[100px]"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.15, 0.25, 0.15],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 4
        }}
      />
      
      {/* Main content container */}
      <AnimatePresence>
        {isVisible && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="container mx-auto px-4 z-10 flex flex-col items-center justify-center py-16 max-w-6xl"
          >
            {/* Hero Section */}
            <section className="flex flex-col items-center justify-center min-h-[80vh] w-full text-center">
              {/* Logo animation */}
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ 
                  type: "spring",
                  stiffness: 260,
                  damping: 20,
                  duration: 1 
                }}
                className="mb-8 relative"
              >
                <motion.div 
                  className="w-28 h-28 bg-gradient-to-br from-primary to-accent-green rounded-full flex items-center justify-center glow-primary"
                  whileHover={{ scale: 1.1, rotate: 10 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Recycle size={56} className="text-primary-dark" />
                </motion.div>
                
                {/* Orbiting particles */}
                <motion.div 
                  className="absolute w-full h-full top-0 left-0"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                >
                  <motion.div className="absolute top-0 left-1/2 w-3 h-3 rounded-full bg-primary" 
                    animate={{ scale: [1, 1.5, 1], opacity: [0.7, 1, 0.7] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </motion.div>
                
                <motion.div 
                  className="absolute w-full h-full top-0 left-0"
                  animate={{ rotate: -360 }}
                  transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                >
                  <motion.div className="absolute bottom-0 left-1/2 w-2 h-2 rounded-full bg-accent-green" 
                    animate={{ scale: [1, 1.3, 1], opacity: [0.7, 1, 0.7] }}
                    transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                  />
                </motion.div>
                
                {/* Additional orbiting particle */}
                <motion.div 
                  className="absolute w-full h-full top-0 left-0"
                  animate={{ rotate: 180 }}
                  transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
                >
                  <motion.div className="absolute right-0 top-1/2 w-4 h-4 rounded-full bg-accent-blue" 
                    animate={{ scale: [1, 1.4, 1], opacity: [0.6, 0.9, 0.6] }}
                    transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                  />
                </motion.div>
              </motion.div>

              {/* Title with animated gradient */}
              <motion.h1
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.7, delay: 0.3 }}
                className="text-5xl md:text-7xl font-bold mb-6 text-center"
              >
                <motion.span 
                  className="gradient-text inline-block"
                  animate={{ 
                    backgroundPosition: ["0% center", "100% center", "0% center"],
                  }}
                  transition={{ 
                    duration: 8, 
                    repeat: Infinity,
                    repeatType: "mirror",
                    ease: "easeInOut"
                  }}
                  style={{
                    backgroundSize: "200% 100%"
                  }}
                >
                  TrashTrek
                </motion.span>
              </motion.h1>
              
              {/* Tagline with stagger animation */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl text-center"
              >
                Transform environmental cleanup into an epic adventure.
              </motion.p>
              
              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="text-base md:text-lg text-gray-400 mb-12 max-w-xl text-center"
              >
                Join thousands making a difference while earning rewards, tracking progress, and competing with friends.
              </motion.p>

              {/* Call to Action Buttons - Fixed alignment to be side by side on all screen sizes */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.9 }}
                className="flex flex-row gap-4 mb-12 justify-center"
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to="/register"
                    className="btn-primary flex items-center justify-center"
                  >
                    Get Started
                    <motion.div
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <ArrowRight className="ml-2" size={24} />
                    </motion.div>
                  </Link>
                </motion.div>
                
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to="/about"
                    className="btn-secondary"
                  >
                    Learn More
                  </Link>
                </motion.div>
              </motion.div>
              
              {/* App Store Badges - Updated to link to /deploy */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 1.1 }}
                className="flex flex-col sm:flex-row items-center gap-4"
              >
                <p className="text-gray-400 mr-2">Download:</p>
                <div className="flex gap-4">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link
                      to="/deploy"
                      className="glass px-4 py-2 rounded-lg flex items-center"
                    >
                      <Smartphone size={20} className="mr-2 text-primary" />
                      <span>App Store</span>
                    </Link>
                  </motion.div>
                  
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link
                      to="/deploy"
                      className="glass px-4 py-2 rounded-lg flex items-center"
                    >
                      <Smartphone size={20} className="mr-2 text-primary" />
                      <span>Google Play</span>
                    </Link>
                  </motion.div>
                </div>
              </motion.div>
            </section>
            
            {/* Stats Section */}
            <motion.section 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.2 }}
              className="w-full py-16 flex justify-center"
            >
              <div className="glass rounded-2xl p-8 w-full max-w-4xl">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {stats.map((stat, index) => (
                    <motion.div 
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 1.2 + (index * 0.1) }}
                      className="flex flex-col items-center justify-center text-center"
                    >
                      <motion.p 
                        className="text-3xl md:text-4xl font-bold gradient-text"
                      >
                        {stat.value}
                      </motion.p>
                      <p className="text-gray-400 text-sm md:text-base mt-2">{stat.label}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.section>
            
            {/* Features Section */}
            <motion.section 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.3 }}
              className="w-full py-16"
            >
              <div className="text-center mb-12">
                <motion.h2 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 1.3 }}
                  className="text-3xl md:text-4xl font-bold mb-4"
                >
                  App <span className="text-primary">Features</span>
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.7, delay: 1.4 }}
                  className="text-gray-400 max-w-2xl mx-auto"
                >
                  Everything you need to make a positive environmental impact while having fun
                </motion.p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 1.4 + (index * 0.1) }}
                    className="card hover-scale"
                  >
                    <div className="flex flex-col items-center text-center space-y-4">
                      <motion.div 
                        className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-4"
                        whileHover={{ 
                          backgroundColor: "rgba(208, 253, 62, 0.3)",
                          scale: 1.1,
                          transition: { duration: 0.2 }
                        }}
                      >
                        <motion.div
                          whileHover={{ 
                            rotate: [0, -10, 10, -10, 0],
                            transition: { duration: 0.5 }
                          }}
                        >
                          <feature.icon className="text-primary" size={32} />
                        </motion.div>
                      </motion.div>
                      <h3 className="text-xl font-bold">{feature.title}</h3>
                      <p className="text-gray-400">{feature.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.section>
            
            {/* Testimonial/Review Section */}
            <TestimonialSection />
            
            {/* Final CTA Section */}
            <motion.section
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.6 }}
              className="w-full py-16 mb-12 text-center"
            >
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 1.7 }}
                className="text-3xl md:text-4xl font-bold mb-4"
              >
                Ready to make a <span className="text-primary">difference</span>?
              </motion.h2>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.7, delay: 1.8 }}
                className="text-gray-400 max-w-2xl mx-auto mb-8"
              >
                Join our growing community of eco-warriors and start your TrashTrek journey today.
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7, delay: 1.9 }}
                className="flex flex-col sm:flex-row justify-center gap-4"
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to="/register"
                    className="btn-primary flex items-center justify-center"
                  >
                    Start Now
                    <Check className="ml-2" size={24} />
                  </Link>
                </motion.div>
              </motion.div>
            </motion.section>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Enhanced footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: isVisible ? 1 : 0 }}
        transition={{ duration: 0.6, delay: 2 }}
        className="py-8 mt-auto text-center w-full glass border-t border-white/5 z-10"
      >
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent-green rounded-full flex items-center justify-center mr-2">
                <Recycle size={16} className="text-primary-dark" />
              </div>
              <span className="font-bold text-primary">TrashTrek</span>
            </div>
            
            <div className="flex gap-6 mb-4 md:mb-0">
              <Link to="/about" className="text-gray-400 hover:text-primary transition-colors">About</Link>
              <Link to="/trashtrek-rulebook" className="text-gray-400 hover:text-primary transition-colors">Rules</Link>
              <Link to="/faqs" className="text-gray-400 hover:text-primary transition-colors">FAQs</Link>
              <Link to="/contact" className="text-gray-400 hover:text-primary transition-colors">Contact</Link>
            </div>
            
            <div className="flex gap-4">
              <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                <Globe size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                <Users size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                <Heart size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                <MapPin size={20} />
              </a>
            </div>
          </div>
          
          <div className="mt-6 pt-6 border-t border-white/5 text-gray-500 text-sm">
            <p>© 2025 TrashTrek. Created by Krishang Saharia. All rights reserved.</p>
          </div>
        </div>
      </motion.footer>
    </div>
  );
};

export default Landing;