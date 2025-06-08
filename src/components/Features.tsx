
import React from 'react';
import { FileSearch, ScanEye, FileSignature, SendToBack, Zap, Shield, BarChart, Users } from 'lucide-react';

const Features = () => {
  const features = [
    {
      icon: FileSearch,
      title: 'Smart Document Ingestion',
      description: 'Automatically process documents from multiple sources - email, cloud storage, APIs, and manual uploads.',
      stats: '99.9% Uptime',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      icon: ScanEye,
      title: 'AI-Powered Extraction',
      description: 'Advanced OCR and NLP extract text, entities, and structured data with industry-leading accuracy.',
      stats: '97% Accuracy',
      gradient: 'from-green-500 to-emerald-500'
    },
    {
      icon: FileSignature,
      title: 'Intelligent Classification',
      description: 'Machine learning models automatically categorize documents based on content, context, and metadata.',
      stats: '10x Faster',
      gradient: 'from-yellow-500 to-orange-500'
    },
    {
      icon: SendToBack,
      title: 'Smart Routing',
      description: 'Route documents to the right teams, systems, or workflows based on business rules and AI insights.',
      stats: '24/7 Processing',
      gradient: 'from-purple-500 to-pink-500'
    }
  ];

  const additionalFeatures = [
    {
      icon: Zap,
      title: 'Real-time Processing',
      description: 'Process thousands of documents per minute with our scalable infrastructure.'
    },
    {
      icon: Shield,
      title: 'Enterprise Security',
      description: 'SOC 2 compliant with end-to-end encryption and audit trails.'
    },
    {
      icon: BarChart,
      title: 'Analytics Dashboard',
      description: 'Comprehensive insights into processing metrics and system performance.'
    },
    {
      icon: Users,
      title: 'Team Collaboration',
      description: 'Role-based access controls and collaborative workflow management.'
    }
  ];

  return (
    <section id="features" className="py-20 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="docflow-gradient bg-clip-text text-transparent">
              Intelligent Document Pipeline
            </span>
          </h2>
          <p className="text-xl text-foreground/70 max-w-3xl mx-auto">
            Transform your document workflows with AI-powered automation that learns and adapts to your business needs.
          </p>
        </div>

        {/* Main Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={feature.title} className="group">
                <div className="docflow-card p-6 h-full hover:scale-105 transition-all duration-300 hover:shadow-xl">
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${feature.gradient} p-3 mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-foreground/70 mb-4 leading-relaxed">{feature.description}</p>
                  
                  <div className="mt-auto">
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r ${feature.gradient} text-white`}>
                      {feature.stats}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Additional Features */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {additionalFeatures.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={feature.title} className="docflow-card p-6 text-center hover:scale-105 transition-all duration-300">
                <Icon className="w-8 h-8 text-docflow-cyan mx-auto mb-4" />
                <h4 className="font-semibold mb-2">{feature.title}</h4>
                <p className="text-sm text-foreground/70">{feature.description}</p>
              </div>
            );
          })}
        </div>

        {/* Stats Section */}
        <div className="mt-20 docflow-card p-8">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            {[
              { number: '1M+', label: 'Documents Processed' },
              { number: '99.7%', label: 'Accuracy Rate' },
              { number: '10x', label: 'Faster Processing' },
              { number: '500+', label: 'Enterprise Customers' }
            ].map((stat, index) => (
              <div key={stat.label}>
                <div className="text-3xl md:text-4xl font-bold docflow-gradient bg-clip-text text-transparent mb-2">
                  {stat.number}
                </div>
                <div className="text-foreground/70">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
