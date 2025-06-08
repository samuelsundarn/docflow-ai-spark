import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, FileSearch, ScanEye, FileSignature, SendToBack, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Hero = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const scrollToFeatures = () => {
    const featuresSection = document.getElementById('features');
    featuresSection?.scrollIntoView({ behavior: 'smooth' });
  };

  const keywords = ['Ingest.', 'Extract.', 'Classify.', 'Route.'];
  const floatingDocs = [
    { icon: FileSearch, delay: 0 },
    { icon: ScanEye, delay: 1 },
    { icon: FileSignature, delay: 2 },
    { icon: SendToBack, delay: 3 },
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-background via-background to-docflow-blue/5 pb-8">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      {/* Floating Document Cards */}
      <div className="absolute inset-0 pointer-events-none">
        {floatingDocs.map((doc, index) => {
          const Icon = doc.icon;
          return (
            <div
              key={index}
              className={`absolute animate-float docflow-card p-4 w-16 h-16 flex items-center justify-center opacity-20`}
              style={{
                left: `${20 + index * 20}%`,
                top: `${30 + (index % 2) * 40}%`,
                animationDelay: `${doc.delay}s`,
              }}
            >
              <Icon className="w-8 h-8 text-docflow-cyan" />
            </div>
          );
        })}
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 text-center z-10 pt-28">
        <div className="max-w-4xl mx-auto">
          {/* Main Headline */}
          <div className="mb-8">
            <div className="flex flex-wrap justify-center items-center gap-4 text-4xl md:text-6xl lg:text-7xl font-bold leading-normal">
              {keywords.map((keyword, index) => (
                <span
                  key={keyword}
                  className={`docflow-gradient bg-clip-text text-transparent ${
                    isVisible ? 'animate-slide-up' : 'opacity-0'
                  }`}
                  style={{ animationDelay: `${index * 200}ms` }}
                >
                  {keyword}
                </span>
              ))}
            </div>
          </div>

          {/* Subtitle */}
          <p className={`text-xl md:text-2xl text-foreground/80 mb-12 max-w-2xl mx-auto ${
            isVisible ? 'animate-slide-up-delayed' : 'opacity-0'
          }`}>
            Let AI tame your document chaos. Enterprise-grade automation for intelligent document processing.
          </p>

          {/* CTA Buttons */}
          <div className={`flex flex-col sm:flex-row gap-4 justify-center items-center mb-16 ${
            isVisible ? 'animate-slide-up-delayed' : 'opacity-0'
          }`}>
            <Link to="/dashboard">
              <Button className="docflow-button-primary group animate-glow">
                Try the Demo
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            
            <Button 
              className="docflow-button-ghost group"
              onClick={scrollToFeatures}
            >
              See How It Works
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>

          {/* Pipeline Flow Visualization */}
          <div className={`mb-12 ${isVisible ? 'animate-slide-up-delayed' : 'opacity-0'}`}>
            <div className="docflow-card p-8 max-w-3xl mx-auto">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                {[
                  { icon: FileSearch, label: 'Ingest', color: 'text-blue-400' },
                  { icon: ScanEye, label: 'Extract', color: 'text-green-400' },
                  { icon: FileSignature, label: 'Classify', color: 'text-yellow-400' },
                  { icon: SendToBack, label: 'Route', color: 'text-purple-400' },
                ].map((step, index) => {
                  const Icon = step.icon;
                  return (
                    <React.Fragment key={step.label}>
                      <div className="flex flex-col items-center space-y-2">
                        <div className={`p-3 rounded-full bg-background border-2 border-current ${step.color}`}>
                          <Icon className="w-6 h-6" />
                        </div>
                        <span className="text-sm font-medium">{step.label}</span>
                      </div>
                      {index < 3 && (
                        <ArrowRight className="hidden md:block w-5 h-5 text-foreground/30" />
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <button
          onClick={scrollToFeatures}
          className="animate-bounce hover:scale-110 transition-transform duration-200"
        >
          <ChevronDown className="w-8 h-8 text-foreground/50" />
        </button>
      </div>
    </section>
  );
};

export default Hero;
