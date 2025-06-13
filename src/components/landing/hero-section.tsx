'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { 
  Heart, 
  Users, 
  Shield, 
  Sparkles, 
  ArrowRight,
  Play,
  Star,
  MessageCircle,
  Video,
  Zap,
  TrendingUp,
  Clock
} from 'lucide-react';
import { useAppStore } from '@/lib/store/app';

export default function HeroSection() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const { setCurrentView } = useAppStore();

  const testimonials = [
    {
      text: "unmute helped me find my voice again. The anonymous environment made all the difference.",
      author: "Sarah M.",
      topic: "Anxiety Support"
    },
    {
      text: "I've never felt more understood. The AI moderator creates such a safe space.",
      author: "Alex K.",
      topic: "Depression Recovery"
    },
    {
      text: "Finding people who truly get what I'm going through has been life-changing.",
      author: "Jordan P.",
      topic: "Grief Processing"
    }
  ];

  const stats = [
    { number: "50K+", label: "Lives Touched", icon: Heart },
    { number: "95%", label: "Feel Safer", icon: Shield },
    { number: "85%", label: "Report Progress", icon: TrendingUp },
    { number: "24/7", label: "Support Available", icon: Clock }
  ];

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-green-400/20 to-blue-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-purple-400/10 to-pink-600/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[
          { left: 10, top: 20, delay: 0, duration: 4 },
          { left: 80, top: 60, delay: 1, duration: 5 },
          { left: 30, top: 80, delay: 2, duration: 3 },
          { left: 70, top: 30, delay: 0.5, duration: 4.5 },
          { left: 50, top: 10, delay: 1.5, duration: 3.5 },
          { left: 90, top: 70, delay: 2.5, duration: 4 },
          { left: 20, top: 50, delay: 0.8, duration: 3.8 },
          { left: 60, top: 90, delay: 1.8, duration: 4.2 },
          { left: 40, top: 40, delay: 2.2, duration: 3.2 },
          { left: 85, top: 15, delay: 1.2, duration: 4.8 }
        ].map((item, i) => (
          <div
            key={i}
            className="absolute opacity-20"
            style={{
              left: `${item.left}%`,
              top: `${item.top}%`,
              animationDelay: `${item.delay}s`,
              animationDuration: `${item.duration}s`
            }}
          >
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
          </div>
        ))}
      </div>

      <div className="relative z-10 container mx-auto px-4 py-20">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className={`text-center mb-16 transition-all duration-1000 ${
            isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-10'
          }`}>
            <Badge className="mb-6 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0">
              <Sparkles className="w-4 h-4 mr-2" />
              AI-Powered Mental Health Support
            </Badge>
            
            <h1 className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent mb-8 leading-tight">
              Find Your
              <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Safe Haven
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto mb-12 leading-relaxed">
              Anonymous, AI-moderated peer support sessions that connect you with people who truly understand your journey. 
              <span className="text-blue-600 font-semibold"> Your healing begins here.</span>
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Button 
                size="lg" 
                className="px-8 py-4 text-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300"
                onClick={() => setCurrentView('onboarding')}
              >
                <Play className="w-5 h-5 mr-2" />
                Join a Session Now
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="px-8 py-4 text-lg border-2 hover:bg-gray-50 transition-all duration-300"
                onClick={() => setCurrentView('crisis')}
              >
                <Shield className="w-5 h-5 mr-2" />
                Need Help Now?
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className={`grid grid-cols-2 md:grid-cols-4 gap-6 mb-20 transition-all duration-1000 delay-300 ${
            isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-10'
          }`}>
            {stats.map((stat, index) => (
              <Card key={index} className="p-6 text-center hover:shadow-lg transition-all duration-300 hover:scale-105">
                <stat.icon className="w-8 h-8 mx-auto mb-3 text-blue-600" />
                <div className="text-3xl font-bold text-gray-900 mb-1">{stat.number}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </Card>
            ))}
          </div>

          {/* Live Testimonial */}
          <div className={`max-w-4xl mx-auto mb-20 transition-all duration-1000 delay-500 ${
            isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-10'
          }`}>
            <Card className="p-8 bg-white/80 backdrop-blur-sm border-0 shadow-xl">
              <div className="flex items-center justify-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <blockquote className="text-xl md:text-2xl text-gray-700 text-center mb-6 leading-relaxed">
                "{testimonials[currentTestimonial].text}"
              </blockquote>
              <div className="text-center">
                <div className="font-semibold text-gray-900">{testimonials[currentTestimonial].author}</div>
                <div className="text-blue-600">{testimonials[currentTestimonial].topic}</div>
              </div>
            </Card>
          </div>

          {/* Feature Preview Cards */}
          <div className={`grid md:grid-cols-3 gap-8 transition-all duration-1000 delay-700 ${
            isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-10'
          }`}>
            <Card className="p-8 hover:shadow-xl transition-all duration-300 hover:scale-105 group">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Anonymous Groups</h3>
              <p className="text-gray-600 mb-6">Join supportive communities where you can be completely yourself without judgment.</p>
              <Button variant="ghost" className="p-0 h-auto text-blue-600 hover:text-blue-700">
                Learn more <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Card>

            <Card className="p-8 hover:shadow-xl transition-all duration-300 hover:scale-105 group">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">AI Moderation</h3>
                              <p className="text-gray-600 mb-6">Intelligent AI companions create safe, structured supportive conversations.</p>
              <Button variant="ghost" className="p-0 h-auto text-purple-600 hover:text-purple-700">
                Learn more <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Card>

            <Card className="p-8 hover:shadow-xl transition-all duration-300 hover:scale-105 group">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Complete Privacy</h3>
              <p className="text-gray-600 mb-6">Your identity stays protected while you get the support you need.</p>
              <Button variant="ghost" className="p-0 h-auto text-green-600 hover:text-green-700">
                Learn more <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
} 