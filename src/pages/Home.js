import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Shield, 
  Zap, 
  Award, 
  CheckCircle, 
  ArrowRight, 
  Cpu, 
  Database,
  Lock,
  Globe,
  Building2,
  Users,
  Monitor,
  Smartphone,
  Laptop
} from "lucide-react";
import { motion } from "framer-motion";

// 3D Background Component
const FloatingElements = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-4 h-4 bg-blue-400/20 rounded-full"
          animate={{
            y: [-20, 20, -20],
            x: [-10, 10, -10],
            opacity: [0.3, 0.8, 0.3],
          }}
          transition={{
            duration: 4 + i * 0.5,
            repeat: Infinity,
            delay: i * 0.2,
          }}
          style={{
            left: `${15 + i * 15}%`,
            top: `${20 + i * 10}%`,
          }}
        />
      ))}
    </div>
  );
};

const FeatureCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const features = [
    {
      icon: Shield,
      title: "Military-Grade Security",
      description: "DoD 5220.22-M, NIST 800-88, and Gutmann 35-pass algorithms ensure complete data destruction",
      gradient: "from-blue-500 to-cyan-400"
    },
    {
      icon: Cpu,
      title: "AI-Powered Health Analysis",
      description: "Advanced ML algorithms analyze disk health before wiping to ensure optimal results",
      gradient: "from-purple-500 to-pink-400"
    },
    {
      icon: Award,
      title: "Compliance Certificates",
      description: "Generate legally-binding certificates that meet HIPAA, GDPR, and ISO 27001 standards",
      gradient: "from-green-500 to-emerald-400"
    },
    {
      icon: Globe,
      title: "Cross-Platform Support",
      description: "Works seamlessly across Windows, Linux, macOS, and Android devices",
      gradient: "from-orange-500 to-red-400"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % features.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [features.length]);

  return (
    <div className="relative h-96 overflow-hidden rounded-2xl">
      {features.map((feature, index) => (
        <motion.div
          key={index}
          className={`absolute inset-0 bg-gradient-to-r ${feature.gradient} opacity-90`}
          animate={{
            x: index === currentSlide ? 0 : index < currentSlide ? -100 : 100,
            opacity: index === currentSlide ? 1 : 0,
          }}
          transition={{ duration: 0.8 }}
        >
          <div className="h-full flex items-center justify-center p-8">
            <div className="text-center text-white">
              <feature.icon className="w-16 h-16 mx-auto mb-4 drop-shadow-lg" />
              <h3 className="text-3xl font-bold mb-4">{feature.title}</h3>
              <p className="text-lg opacity-90 max-w-2xl">{feature.description}</p>
            </div>
          </div>
        </motion.div>
      ))}
      
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {features.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide ? 'bg-white' : 'bg-white/40'
            }`}
            onClick={() => setCurrentSlide(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default function HomePage() {
  return (
    <div className="min-h-screen text-white relative overflow-hidden">
      <FloatingElements />
      
      <div className="max-w-7xl mx-auto px-6 py-12 relative z-10">
        {/* Hero Section */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <Badge className="mb-6 bg-blue-500/20 text-blue-200 border-blue-500/30 px-4 py-2 text-sm">
            Enterprise Data Security Platform
          </Badge>
          <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-blue-100 to-cyan-200 bg-clip-text text-transparent">
            SecureWipe Pro
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-8 leading-relaxed">
            The most advanced data destruction platform for enterprises and individuals. 
            Ensure complete data security with military-grade wiping algorithms, AI-powered health analysis, 
            and compliance-ready certification.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to={createPageUrl("WipeInterface")}>
              <Button size="lg" className="bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-2xl hover:shadow-blue-500/25 transition-all duration-300">
                <Zap className="w-5 h-5 mr-2" />
                Start Secure Wipe
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link to={createPageUrl("Dashboard")}>
              <Button variant="outline" size="lg" className="border-2 border-blue-400/50 text-blue-200 hover:bg-blue-500/10 px-8 py-4 text-lg rounded-xl">
                View Dashboard
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Feature Carousel */}
        <motion.div 
          className="mb-16"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          <FeatureCarousel />
        </motion.div>

        {/* Platform Support */}
        <motion.div 
          className="mb-16"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6 }}
        >
          <h2 className="text-3xl font-bold text-center mb-8">Cross-Platform Excellence</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: Monitor, name: "Windows", color: "blue" },
              { icon: Database, name: "Linux", color: "green" },
              { icon: Smartphone, name: "Android", color: "purple" },
              { icon: Laptop, name: "macOS", color: "orange" }
            ].map((platform, index) => (
              <Card key={platform.name} className="bg-slate-800/50 border-slate-700/50 hover:border-blue-500/50 transition-all duration-300 backdrop-blur-sm">
                <CardContent className="p-6 text-center">
                  <platform.icon className={`w-12 h-12 mx-auto mb-3 text-${platform.color}-400`} />
                  <p className="font-medium text-white">{platform.name}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* Benefits Grid */}
        <motion.div 
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.9 }}
        >
          {[
            {
              icon: Building2,
              title: "Enterprise Ready",
              description: "Scale across thousands of devices with centralized management and reporting"
            },
            {
              icon: Users,
              title: "Personal Use",
              description: "Simple interface for individual users who need secure data destruction"
            },
            {
              icon: CheckCircle,
              title: "Compliance Guaranteed",
              description: "Meet regulatory requirements with certified wiping algorithms"
            },
            {
              icon: Lock,
              title: "Zero Recovery",
              description: "Advanced algorithms ensure data cannot be recovered by any means"
            },
            {
              icon: Cpu,
              title: "AI Health Check",
              description: "Machine learning analyzes disk health before wiping"
            },
            {
              icon: Award,
              title: "Legal Certificates",
              description: "Generate court-admissible destruction certificates"
            }
          ].map((benefit, index) => (
            <Card key={benefit.title} className="bg-slate-800/30 border-slate-700/50 hover:bg-slate-800/50 transition-all duration-300 backdrop-blur-sm group">
              <CardContent className="p-6">
                <benefit.icon className="w-10 h-10 text-blue-400 mb-4 group-hover:text-cyan-400 transition-colors duration-300" />
                <h3 className="text-xl font-semibold text-white mb-2">{benefit.title}</h3>
                <p className="text-slate-300">{benefit.description}</p>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* CTA Section */}
        <motion.div 
          className="text-center bg-gradient-to-r from-blue-600/20 to-cyan-600/20 rounded-2xl p-12 backdrop-blur-sm border border-blue-500/20"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
        >
          <h2 className="text-4xl font-bold mb-4">Ready to Secure Your Data?</h2>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            Join thousands of organizations worldwide who trust SecureWipe Pro for their data destruction needs.
          </p>
          <Link to={createPageUrl("WipeInterface")}>
            <Button size="lg" className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white px-12 py-4 text-xl font-semibold rounded-xl shadow-2xl hover:shadow-cyan-500/25 transition-all duration-300">
              <Shield className="w-6 h-6 mr-3" />
              Start Your First Wipe
            </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}