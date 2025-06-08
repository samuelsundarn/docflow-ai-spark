
import React, { useState } from 'react';
import { Upload, FileText, Clock, CheckCircle, AlertCircle, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import Navigation from '@/components/Navigation';

const Dashboard = () => {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setIsUploading(true);
      setUploadProgress(0);
      
      // Simulate upload progress
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsUploading(false);
            return 100;
          }
          return prev + 10;
        });
      }, 200);
    }
  };

  const documents = [
    {
      id: 1,
      name: 'Invoice_2024_001.pdf',
      status: 'completed',
      classification: 'Invoice',
      confidence: 98,
      processed: '2 mins ago',
      route: 'Accounting'
    },
    {
      id: 2,
      name: 'Contract_ServiceAgreement.docx',
      status: 'processing',
      classification: 'Contract',
      confidence: 95,
      processed: 'Processing...',
      route: 'Legal'
    },
    {
      id: 3,
      name: 'Receipt_Office_Supplies.jpg',
      status: 'completed',
      classification: 'Receipt',
      confidence: 92,
      processed: '5 mins ago',
      route: 'Procurement'
    },
    {
      id: 4,
      name: 'Report_Q4_Financial.pdf',
      status: 'failed',
      classification: 'Report',
      confidence: 87,
      processed: '1 hour ago',
      route: 'Finance'
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'processing':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'failed':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      completed: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
      processing: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
      failed: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
    };
    
    return (
      <Badge className={variants[status as keyof typeof variants] || variants.processing}>
        {status}
      </Badge>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="pt-20 pb-8">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Document Pipeline</h1>
            <p className="text-foreground/70">Upload, process, and manage your documents with AI-powered automation</p>
          </div>

          {/* Upload Section */}
          <div className="grid lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-2">
              <div className="docflow-card p-6">
                <h2 className="text-xl font-semibold mb-4">Upload Documents</h2>
                
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-docflow-cyan transition-colors">
                  <Upload className="w-12 h-12 text-foreground/50 mx-auto mb-4" />
                  <div className="mb-4">
                    <p className="text-lg font-medium mb-2">Drag and drop files here</p>
                    <p className="text-foreground/70">or click to browse</p>
                  </div>
                  
                  <input
                    type="file"
                    multiple
                    accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                  />
                  
                  <label htmlFor="file-upload">
                    <Button className="docflow-button-primary cursor-pointer">
                      Select Files
                    </Button>
                  </label>
                </div>

                {isUploading && (
                  <div className="mt-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Uploading...</span>
                      <span className="text-sm text-foreground/70">{uploadProgress}%</span>
                    </div>
                    <Progress value={uploadProgress} className="h-2" />
                  </div>
                )}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="space-y-4">
              <div className="docflow-card p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-foreground/70">Documents Today</p>
                    <p className="text-2xl font-bold">24</p>
                  </div>
                  <FileText className="w-8 h-8 text-docflow-cyan" />
                </div>
              </div>
              
              <div className="docflow-card p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-foreground/70">Success Rate</p>
                    <p className="text-2xl font-bold">98.5%</p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-green-500" />
                </div>
              </div>
              
              <div className="docflow-card p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-foreground/70">Avg Process Time</p>
                    <p className="text-2xl font-bold">2.3s</p>
                  </div>
                  <Clock className="w-8 h-8 text-blue-500" />
                </div>
              </div>
            </div>
          </div>

          {/* Processing Pipeline */}
          <div className="docflow-card p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Processing Pipeline</h2>
            <div className="grid md:grid-cols-4 gap-4">
              {[
                { stage: 'Ingested', count: 156, status: 'active' },
                { stage: 'Extracted', count: 142, status: 'active' },
                { stage: 'Classified', count: 138, status: 'active' },
                { stage: 'Routed', count: 134, status: 'completed' }
              ].map((stage, index) => (
                <div key={stage.stage} className="text-center">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-2 ${
                    stage.status === 'active' ? 'docflow-gradient' : 'bg-green-500'
                  }`}>
                    <span className="text-white font-bold">{stage.count}</span>
                  </div>
                  <p className="font-medium">{stage.stage}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Documents Table */}
          <div className="docflow-card p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Recent Documents</h2>
              <Button variant="outline" size="sm">
                View All
              </Button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-medium">Document</th>
                    <th className="text-left py-3 px-4 font-medium">Status</th>
                    <th className="text-left py-3 px-4 font-medium">Classification</th>
                    <th className="text-left py-3 px-4 font-medium">Confidence</th>
                    <th className="text-left py-3 px-4 font-medium">Processed</th>
                    <th className="text-left py-3 px-4 font-medium">Route</th>
                    <th className="text-left py-3 px-4 font-medium"></th>
                  </tr>
                </thead>
                <tbody>
                  {documents.map((doc) => (
                    <tr key={doc.id} className="border-b border-border hover:bg-muted/50">
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-3">
                          <FileText className="w-5 h-5 text-foreground/50" />
                          <span className="font-medium">{doc.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(doc.status)}
                          {getStatusBadge(doc.status)}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant="outline">{doc.classification}</Badge>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-medium">{doc.confidence}%</span>
                      </td>
                      <td className="py-3 px-4 text-foreground/70">
                        {doc.processed}
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant="secondary">{doc.route}</Badge>
                      </td>
                      <td className="py-3 px-4">
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
