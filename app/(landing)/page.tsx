"use client";

import { useState } from 'react';
import { ArrowRight, Bot, Zap, Shield, Globe, MessageSquare, Users, CheckCircle } from 'lucide-react';
import { Button } from '@/components/common/components/Button';
import AuthModal from '@/components/common/modals/AuthModal';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const features = [
  {
    icon: <Bot className="w-6 h-6" />,
    title: "AI-Powered Conversations",
    description: "Create intelligent chatbots that understand context and provide meaningful responses"
  },
  {
    icon: <Globe className="w-6 h-6" />,
    title: "Website Integration",
    description: "Train your bot with your website content, documentation, and knowledge base"
  },
  {
    icon: <MessageSquare className="w-6 h-6" />,
    title: "Multi-Channel Deployment",
    description: "Deploy across websites, Slack, Discord, and other platforms seamlessly"
  },
  {
    icon: <Zap className="w-6 h-6" />,
    title: "No-Code Builder",
    description: "Build sophisticated conversational flows without writing a single line of code"
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: "Enterprise Security",
    description: "Bank-grade security with data encryption and compliance standards"
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: "Team Collaboration",
    description: "Work together with your team to build and manage chatbots"
  }
];

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Product Manager",
    company: "TechCorp",
    content: "This platform transformed how we handle customer support. Our response time improved by 80%.",
    avatar: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2"
  },
  {
    name: "Michael Chen",
    role: "CTO",
    company: "StartupXYZ",
    content: "The easiest way to build and deploy chatbots. Our team was up and running in minutes.",
    avatar: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2"
  },
  {
    name: "Emily Rodriguez",
    role: "Marketing Director",
    company: "GrowthCo",
    content: "Incredible results! Our lead generation increased by 150% after implementing their chatbots.",
    avatar: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2"
  }
];

export default function LandingPage() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      router.push('/dashboard');
    }
  }, [session, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <div className="w-20 rounded-lg flex items-center justify-center">
                <img src="/chatbot-logo.png" alt=""  className=''/>
              </div>
              <span className="text-xl font-bold">Codedrill Agent</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-zinc-300 hover:text-white transition-colors">Features</a>
              <a href="#pricing" className="text-zinc-300 hover:text-white transition-colors">Pricing</a>
              <a href="#testimonials" className="text-zinc-300 hover:text-white transition-colors">Testimonials</a>
              <Button
                variant="outline"
                onClick={() => setShowAuthModal(true)}
                className="border-zinc-600 text-zinc-300 hover:text-white"
              >
                Sign In
              </Button>
              <Button
                onClick={() => setShowAuthModal(true)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-8">
            <div className="inline-flex items-center px-4 py-2 bg-blue-900/20 border border-blue-500/20 rounded-full text-blue-300 text-sm mb-6">
              <Zap className="w-4 h-4 mr-2" />
              AI-Powered Chatbot Platform
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-blue-200 to-blue-400 bg-clip-text text-transparent">
              Build Intelligent
              <br />
              Chatbots in Minutes
            </h1>
            <p className="text-xl text-zinc-400 mb-8 max-w-3xl mx-auto">
              Create, train, and deploy AI-powered chatbots that understand your business. 
              No coding required. Start automating customer interactions today.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button
              size="lg"
              onClick={() => setShowAuthModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-4"
            >
              Start Building Free
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-zinc-600 text-zinc-300 hover:text-white text-lg px-8 py-4"
            >
              Watch Demo
            </Button>
          </div>

          {/* Hero Image/Video Placeholder */}
          <div className="relative max-w-3xl mx-auto">
            <div className="bg-gradient-to-r from-blue-900/20 to-blue-900/20 rounded-2xl border border-zinc-800 p-8">
              <div className="bg-black rounded-xl border border-zinc-700 p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <div className="text-left space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                    <div className="bg-zinc-800 rounded-lg px-4 py-2 flex-1 max-w-xs">
                      <p className="text-sm">Hello! I'm your AI assistant. How can I help you today?</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 justify-end">
                    <div className="bg-blue-600 rounded-lg px-4 py-2">
                      <p className="text-sm">I need help with my order</p>
                    </div>
                    <div className="w-8 h-8 bg-zinc-600 rounded-full"></div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                    <div className="bg-zinc-800 rounded-lg px-4 py-2 flex-1 max-w-xs">
                      <p className="text-sm">I'd be happy to help! Can you provide your order number?</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-zinc-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Everything you need to build amazing chatbots</h2>
            <p className="text-xl text-zinc-400 max-w-3xl mx-auto">
              Powerful features that make chatbot creation simple, scalable, and effective
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-black border border-zinc-800 rounded-xl p-6 hover:border-blue-500/50 transition-colors">
                <div className="w-12 h-12 bg-blue-600/10 rounded-lg flex items-center justify-center text-blue-400 mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-zinc-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Trusted by thousands of businesses</h2>
            <p className="text-xl text-zinc-400">See what our customers are saying</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-black border border-zinc-800 rounded-xl p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="font-semibold">{testimonial.name}</h4>
                    <p className="text-sm text-zinc-400">{testimonial.role} at {testimonial.company}</p>
                  </div>
                </div>
                <p className="text-zinc-300">"{testimonial.content}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-900/20 to-blue-900/20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to get started?</h2>
          <p className="text-xl text-zinc-400 mb-8">
            Join thousands of businesses already using our platform to automate customer interactions
          </p>
          <Button
            size="lg"
            onClick={() => setShowAuthModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-4"
          >
            Start Building Your Bot
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-800 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
                <img src="" alt="" />
              </div>
              <span className="text-xl font-bold">BotAgent</span>
            </div>
            <div className="flex items-center space-x-6 text-zinc-400">
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
              <a href="#" className="hover:text-white transition-colors">Support</a>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-zinc-800 text-center text-zinc-400">
            <p>&copy; 2024 BotAgent. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        title="Get Started with BotAgent"
        callbackUrl="/dashboard"
      />
    </div>
  );
}