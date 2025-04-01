// Testimonial/Review Section with Carousel
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Users, ArrowLeft, ArrowRight } from 'lucide-react';

const TestimonialSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const intervalRef = useRef(null);

  const testimonials = [
    {
      quote: "TrashTrek has completely changed how our community approaches cleanup events. The gamification makes it fun, while the impact tracking keeps everyone motivated.",
      author: "Community Leaders Alliance",
      location: "San Francisco, CA",
      avatar: Users
    },
    {
      quote: "As a teacher, I love how TrashTrek engages my students in environmental activism. The app's challenges have become a regular part of our science curriculum.",
      author: "Maria Johnson",
      location: "Portland, OR",
      avatar: Users
    },
    {
      quote: "I've tried several eco-apps, but none compare to TrashTrek. The UI is intuitive, and seeing my impact visualized keeps me coming back.",
      author: "Jason Kim",
      location: "Chicago, IL",
      avatar: Users
    },
    {
      quote: "Our corporate volunteer days are 100% more effective since we started using TrashTrek to coordinate and track our efforts.",
      author: "Enterprise Solutions Team",
      location: "Austin, TX",
      avatar: Users
    },
    {
      quote: "The competitive element of TrashTrek makes cleanup fun! My friends and I have a monthly challenge to see who can collect the most plastic.",
      author: "Alex Rivera",
      location: "Miami, FL",
      avatar: Users
    },
    {
      quote: "The route tracking feature is brilliant. I can see exactly which areas need attention and plan my daily walks accordingly.",
      author: "Sarah Thompson",
      location: "Seattle, WA",
      avatar: Users
    },
    {
      quote: "As a parent, I appreciate how TrashTrek turns our family hikes into meaningful environmental actions. My kids love earning the badges!",
      author: "David Chen",
      location: "Denver, CO",
      avatar: Users
    },
    {
      quote: "Our beach cleanup group has doubled in size since we started organizing through TrashTrek. The community features are game-changing.",
      author: "Coastal Conservation Group",
      location: "Santa Monica, CA",
      avatar: Users
    },
    {
      quote: "I started using TrashTrek for personal cleanup walks, and now I'm connected with like-minded people in my neighborhood I never knew existed.",
      author: "Emily Wright",
      location: "Boston, MA",
      avatar: Users
    },
    {
      quote: "The analytics provide meaningful insights about our impact. We use this data to secure funding for our nonprofit environmental initiatives.",
      author: "Green Earth Foundation",
      location: "Washington, DC",
      avatar: Users
    },
    {
      quote: "The app's challenges have helped me build consistent habits around reducing waste. I've never stuck with an eco-initiative this long before.",
      author: "Michael Torres",
      location: "Phoenix, AZ",
      avatar: Users
    },
    {
      quote: "I love how TrashTrek turns sustainability into a social experience. The team challenges have brought our office together for a common cause.",
      author: "Corporate Sustainability Lead",
      location: "Minneapolis, MN",
      avatar: Users
    },
    {
      quote: "The achievement system is incredibly motivating. I find myself going out of my way to complete cleanup routes just to earn the next badge.",
      author: "Tanya Patel",
      location: "Atlanta, GA",
      avatar: Users
    },
    {
      quote: "As someone who's been picking up trash for years, I appreciate how TrashTrek quantifies my impact and connects me with others doing the same.",
      author: "Robert Jackson",
      location: "Nashville, TN",
      avatar: Users
    },
    {
      quote: "The app's integration with our city's waste management system has streamlined how we report problem areas and coordinate larger cleanups.",
      author: "City Environmental Department",
      location: "Philadelphia, PA",
      avatar: Users
    },
    {
      quote: "I've lost 15 pounds since I started using TrashTrek! The combination of daily walking and doing good for the environment is perfect motivation.",
      author: "Lisa Morales",
      location: "San Diego, CA",
      avatar: Users
    },
    {
      quote: "Our university uses TrashTrek to manage campus cleanup events. The tracking features make it easy to assign areas and measure our collective impact.",
      author: "University Sustainability Office",
      location: "Ann Arbor, MI",
      avatar: Users
    },
    {
      quote: "The app helped me turn my daily dog walks into something more meaningful. My retriever has become a cleanup mascot in our neighborhood!",
      author: "John Peterson",
      location: "New Orleans, LA",
      avatar: Users
    },
    {
      quote: "What I love about TrashTrek is how it makes environmental action accessible to everyone, regardless of their previous involvement in eco-initiatives.",
      author: "Inclusivity in Action",
      location: "Pittsburgh, PA",
      avatar: Users
    },
    {
      quote: "The app's reward system partnering with local businesses gives real incentives beyond just the good feeling of helping the environment.",
      author: "Local Business Association",
      location: "Burlington, VT",
      avatar: Users
    },
    {
      quote: "Since our school district adopted TrashTrek, we've seen a 70% increase in student participation in environmental initiatives.",
      author: "District Environmental Coordinator",
      location: "Madison, WI",
      avatar: Users
    },
    {
      quote: "The social sharing features help spread awareness. Every time I post my cleanup stats, more friends join the movement.",
      author: "Social Media Influencer",
      location: "Los Angeles, CA",
      avatar: Users
    },
    {
      quote: "As a nature photographer, I combine my art with purpose using TrashTrek to clean up the beautiful locations I shoot.",
      author: "Creative Environmental Artist",
      location: "Sedona, AZ",
      avatar: Users
    },
    {
      quote: "The app's AI suggestions for cleanup routes are surprisingly accurate in identifying areas that need the most attention in our community.",
      author: "Tech-Savvy Environmentalist",
      location: "Raleigh, NC",
      avatar: Users
    },
    {
      quote: "After six months of consistent use, I can literally see the difference in my local park. TrashTrek has facilitated sustainable, long-term change.",
      author: "Community Park Volunteer",
      location: "Salt Lake City, UT",
      avatar: Users
    }
  ];

  // Handle auto-advancing the carousel
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    }, 5000);
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [testimonials.length]);

  // Pause auto-rotation on hover
  const pauseCarousel = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  // Resume auto-rotation when not hovering
  const resumeCarousel = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    intervalRef.current = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    }, 5000);
  };

  // Manual navigation
  const handlePrev = () => {
    pauseCarousel();
    setDirection(-1);
    setCurrentIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length);
    resumeCarousel();
  };

  const handleNext = () => {
    pauseCarousel();
    setDirection(1);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    resumeCarousel();
  };

  const variants = {
    enter: (direction) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (direction) => ({
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  };

  const testimonial = testimonials[currentIndex];

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 1.5 }}
      className="w-full py-12 mb-12"
    >
      <div className="text-center mb-8">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1.5 }}
          className="text-3xl md:text-4xl font-bold mb-4"
        >
          What <span className="text-[#D0FD3E]">Users</span> Say
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 1.6 }}
          className="text-gray-400 max-w-2xl mx-auto"
        >
          Join thousands of satisfied users making an environmental difference
        </motion.p>
      </div>
      
      <div 
        className="relative"
        onMouseEnter={pauseCarousel}
        onMouseLeave={resumeCarousel}
      >
        <motion.div 
          className="bg-white/5 backdrop-blur-md rounded-2xl p-8 relative overflow-hidden border border-white/10 h-80 md:h-72 flex items-center justify-center"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 1.6 }}
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#D0FD3E]/10 rounded-bl-full" />
          <div className="absolute bottom-0 left-0 w-16 h-16 bg-[#2ECC71]/10 rounded-tr-full" />
          
          <div className="absolute top-4 right-4 flex space-x-1">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                size={16} 
                className="text-[#D0FD3E]" 
                fill="#D0FD3E" 
              />
            ))}
          </div>
          
          <AnimatePresence custom={direction} initial={false}>
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 }
              }}
              className="w-full absolute"
            >
              <div className="relative z-10 flex flex-col items-center text-center px-4">
                <Star size={32} className="text-[#D0FD3E] mb-6" />
                <p className="text-xl md:text-2xl italic mb-6 max-w-3xl">
                  "{testimonial.quote}"
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#D0FD3E] to-[#2ECC71] flex items-center justify-center mr-3">
                    <testimonial.avatar size={20} className="text-[#0A1A2F]" />
                  </div>
                  <div className="text-left">
                    <p className="font-bold">{testimonial.author}</p>
                    <p className="text-gray-400 text-sm">{testimonial.location}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.div>
        
        {/* Navigation buttons */}
        <div className="flex justify-between absolute top-1/2 left-0 right-0 -mt-6 px-4">
          <motion.button
            onClick={handlePrev}
            className="bg-black/30 backdrop-blur-md text-white p-3 rounded-full hover:bg-[#D0FD3E]/80 hover:text-black transition-all duration-300"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ArrowLeft size={20} />
          </motion.button>
          
          <motion.button
            onClick={handleNext}
            className="bg-black/30 backdrop-blur-md text-white p-3 rounded-full hover:bg-[#D0FD3E]/80 hover:text-black transition-all duration-300"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ArrowRight size={20} />
          </motion.button>
        </div>
      </div>
      
      {/* Pagination indicators */}
      <div className="flex justify-center mt-6 space-x-2">
        {testimonials.map((_, index) => (
          <motion.button
            key={index}
            onClick={() => {
              pauseCarousel();
              setDirection(index > currentIndex ? 1 : -1);
              setCurrentIndex(index);
              resumeCarousel();
            }}
            className={`h-2 rounded-full transition-all duration-300 ${
              currentIndex === index ? "w-6 bg-[#D0FD3E]" : "w-2 bg-white/30"
            }`}
            whileHover={{ scale: 1.2 }}
          />
        ))}
      </div>
      
      {/* Testimonial counter */}
      <div className="text-center mt-4 text-gray-400 text-sm">
        Review {currentIndex + 1} of {testimonials.length}
      </div>
    </motion.section>
  );
};

export default TestimonialSection;