
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Mail, FileText, Clock, CheckCircle2, AlertCircle, RefreshCw, Tag, Send, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Document {
  id: string;
  name: string;
  type: string;
  status: string;
  confidence_score: number;
  created_at: string;
  updated_at: string;
  metadata: any;
}

const UserDashboard = () => {
  const { user, profile, signOut } = useAuth();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [pipelineStep, setPipelineStep] = useState(0);

  const pipelineSteps = [
    { name: 'Ingested', icon: Upload, color: 'text-blue-400' },
    { name: 'Extracted', icon: FileText, color: 'text-green-400' },
    { name: 'Classified', icon: Tag, color: 'text-yellow-400' },
    { name: 'Routed', icon: Send, color: 'text-purple-400' }
  ];

  useEffect(() => {
    fetchDocuments();
    
    // Simulate pipeline progress
    const interval = setInterval(() => {
      setPipelineStep(prev => (prev + 1) % 4);
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);

  const fetchDocuments = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching documents:', error);
      return;
    }

    setDocuments(data || []);
  };

  const handleFileUpload = async (files: FileList) => {
    if (!user || files.length === 0) return;

    const file = files[0];
    const fileType = file.name.split('.').pop()?.toLowerCase() || 'unknown';
    
    // Simulate document processing
    const newDoc = {
      user_id: user.id,
      name: file.name,
      type: fileType === 'pdf' ? 'PDF' : fileType === 'docx' ? 'Contract' : 'Document',
      status: 'processing',
      confidence_score: Math.floor(Math.random() * 20) + 80,
      metadata: {
        size: file.size,
        ocr_time: (Math.random() * 5 + 1).toFixed(1) + 's',
        entities: ['amount', 'date', 'parties']
      }
    };

    const { data, error } = await supabase
      .from('documents')
      .insert(newDoc)
      .select()
      .single();

    if (error) {
      toast.error('Failed to upload document');
      return;
    }

    setDocuments(prev => [data, ...prev]);
    toast.success('Document uploaded successfully!');

    // Simulate processing completion
    setTimeout(async () => {
      await supabase
        .from('documents')
        .update({ status: 'completed' })
        .eq('id', data.id);
      
      fetchDocuments();
    }, 3000);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    handleFileUpload(files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle2 className="h-4 w-4 text-green-400" />;
      case 'processing': return <Clock className="h-4 w-4 text-yellow-400 animate-spin" />;
      case 'failed': return <AlertCircle className="h-4 w-4 text-red-400" />;
      default: return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
    switch (status) {
      case 'completed': return `${baseClasses} bg-green-400/20 text-green-400`;
      case 'processing': return `${baseClasses} bg-yellow-400/20 text-yellow-400`;
      case 'failed': return `${baseClasses} bg-red-400/20 text-red-400`;
      default: return `${baseClasses} bg-gray-400/20 text-gray-400`;
    }
  };

  const TypewriterText = ({ text, delay = 0 }: { text: string; delay?: number }) => {
    const [displayText, setDisplayText] = useState('');
    
    useEffect(() => {
      let timeoutId: NodeJS.Timeout;
      
      if (delay > 0) {
        timeoutId = setTimeout(() => {
          let i = 0;
          const timer = setInterval(() => {
            setDisplayText(text.slice(0, i + 1));
            i++;
            if (i >= text.length) {
              clearInterval(timer);
            }
          }, 50);
        }, delay);
      } else {
        let i = 0;
        const timer = setInterval(() => {
          setDisplayText(text.slice(0, i + 1));
          i++;
          if (i >= text.length) {
            clearInterval(timer);
          }
        }, 50);
      }
      
      return () => {
        if (timeoutId) clearTimeout(timeoutId);
      };
    }, [text, delay]);
    
    return <span>{displayText}</span>;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F1224] to-[#1a1f3a]">
      {/* Top Navigation */}
      <nav className="bg-white/10 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-[#5E2BFF] to-[#00E3FF] rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">DF</span>
              </div>
              <span className="text-xl font-bold text-white">DocFlow AI</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-white/70">Welcome, {profile?.full_name || user?.email}</span>
              <Button 
                onClick={signOut}
                variant="outline" 
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 3-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Rail - Upload Panel */}
          <div className="space-y-6">
            <motion.div
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
                isDragging 
                  ? 'border-[#00E3FF] bg-[#00E3FF]/10' 
                  : 'border-white/20 bg-white/5'
              }`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Upload className="h-12 w-12 text-white/50 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Upload Documents</h3>
              <p className="text-sm text-white/70 mb-4">
                Drag and drop files here or click to browse
              </p>
              <input
                type="file"
                multiple
                onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload">
                <Button className="bg-[#5E2BFF] hover:bg-[#5E2BFF]/80 text-white">
                  Browse Files
                </Button>
              </label>
            </motion.div>

            <motion.div
              className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <Mail className="h-5 w-5 mr-2 text-[#00E3FF]" />
                Connect Mailbox
              </h3>
              <p className="text-sm text-white/70 mb-4">
                Automatically process incoming emails and attachments
              </p>
              <Button className="w-full bg-gradient-to-r from-[#5E2BFF] to-[#00E3FF] text-white">
                Connect Email
              </Button>
            </motion.div>
          </div>

          {/* Center - Pipeline Progress */}
          <div className="space-y-6">
            <motion.div
              className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h3 className="text-lg font-semibold text-white mb-6">Live Pipeline</h3>
              
              <div className="relative">
                {/* Pipeline Line */}
                <div className="absolute top-8 left-8 right-8 h-0.5 bg-white/20"></div>
                <div 
                  className="absolute top-8 left-8 h-0.5 bg-gradient-to-r from-[#5E2BFF] to-[#00E3FF] transition-all duration-1000"
                  style={{ width: `${(pipelineStep + 1) * 25}%` }}
                ></div>
                
                {/* Pipeline Steps */}
                <div className="flex justify-between relative">
                  {pipelineSteps.map((step, index) => {
                    const Icon = step.icon;
                    const isActive = index <= pipelineStep;
                    const isCurrent = index === pipelineStep;
                    
                    return (
                      <motion.div
                        key={step.name}
                        className="flex flex-col items-center"
                        initial={{ scale: 0.8, opacity: 0.5 }}
                        animate={{ 
                          scale: isActive ? 1 : 0.8,
                          opacity: isActive ? 1 : 0.5
                        }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className={`
                          w-16 h-16 rounded-full flex items-center justify-center mb-3 transition-all duration-300
                          ${isActive 
                            ? 'bg-gradient-to-br from-[#5E2BFF] to-[#00E3FF] shadow-lg shadow-[#00E3FF]/30' 
                            : 'bg-white/10'
                          }
                          ${isCurrent ? 'animate-pulse' : ''}
                        `}>
                          <Icon className={`h-6 w-6 ${isActive ? 'text-white' : 'text-white/50'}`} />
                        </div>
                        <h4 className={`text-sm font-medium ${isActive ? 'text-white' : 'text-white/50'}`}>
                          {step.name}
                        </h4>
                        {isCurrent && (
                          <div className="mt-2 text-xs text-[#00E3FF]">
                            <TypewriterText 
                              text={`${new Date().toLocaleTimeString()} • Processing...`}
                              delay={500}
                            />
                          </div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </motion.div>

            {/* Processing Stats */}
            <motion.div
              className="grid grid-cols-2 gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-[#00E3FF] mb-1">
                  {documents.length}
                </div>
                <div className="text-sm text-white/70">Documents Processed</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-[#5E2BFF] mb-1">
                  {Math.floor(Math.random() * 500) + 200}ms
                </div>
                <div className="text-sm text-white/70">Avg Processing Time</div>
              </div>
            </motion.div>
          </div>

          {/* Right Rail - Recent Documents */}
          <div>
            <motion.div
              className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="p-6 border-b border-white/20">
                <h3 className="text-lg font-semibold text-white">Recent Documents</h3>
              </div>
              <div className="max-h-96 overflow-y-auto">
                <AnimatePresence>
                  {documents.map((doc, index) => (
                    <motion.div
                      key={doc.id}
                      className="p-4 border-b border-white/10 hover:bg-white/5 cursor-pointer transition-colors"
                      onClick={() => setSelectedDoc(doc)}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ x: 4 }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-sm font-medium text-white truncate flex-1">
                          {doc.name}
                        </h4>
                        {getStatusIcon(doc.status)}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className={getStatusBadge(doc.type)}>
                          {doc.type}
                        </span>
                        <span className="text-xs text-white/50">
                          {new Date(doc.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="mt-2">
                        <span className={getStatusBadge(doc.status)}>
                          {doc.status}
                        </span>
                        {doc.confidence_score > 0 && (
                          <span className="ml-2 text-xs text-white/70">
                            {doc.confidence_score}% confidence
                          </span>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                {documents.length === 0 && (
                  <div className="p-8 text-center text-white/50">
                    <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No documents yet. Upload your first document to get started!</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Document Detail Drawer */}
      <AnimatePresence>
        {selectedDoc && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-end"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedDoc(null)}
          >
            <motion.div
              className="bg-white/20 backdrop-blur-lg border-l border-white/20 w-full max-w-md h-full overflow-y-auto"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-white">Document Details</h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedDoc(null)}
                    className="text-white/70 hover:text-white hover:bg-white/10"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-white/70 mb-1">File Name</h3>
                    <p className="text-white">{selectedDoc.name}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-white/70 mb-1">Type</h3>
                    <span className={getStatusBadge(selectedDoc.type)}>{selectedDoc.type}</span>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-white/70 mb-1">Status</h3>
                    <span className={getStatusBadge(selectedDoc.status)}>{selectedDoc.status}</span>
                  </div>
                  
                  {selectedDoc.confidence_score > 0 && (
                    <div>
                      <h3 className="text-sm font-medium text-white/70 mb-1">Confidence</h3>
                      <p className="text-white">{selectedDoc.confidence_score}%</p>
                    </div>
                  )}
                  
                  {selectedDoc.metadata && (
                    <div>
                      <h3 className="text-sm font-medium text-white/70 mb-2">Processing Info</h3>
                      <div className="bg-white/10 rounded-lg p-3 text-sm text-white/80">
                        {selectedDoc.metadata.ocr_time && (
                          <p>OCR Time: {selectedDoc.metadata.ocr_time}</p>
                        )}
                        {selectedDoc.metadata.entities && (
                          <p>Entities: {selectedDoc.metadata.entities.join(', ')}</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Manual Override Actions */}
                <div className="mt-8">
                  <h3 className="text-lg font-semibold text-white mb-4">Manual Overrides</h3>
                  <div className="space-y-3">
                    <Button
                      className="w-full bg-blue-600/20 border border-blue-400/30 text-blue-300 hover:bg-blue-600/30 hover:shake"
                      onClick={() => toast.success('Re-extraction initiated!')}
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Re-Extract ↻
                    </Button>
                    <Button
                      className="w-full bg-yellow-600/20 border border-yellow-400/30 text-yellow-300 hover:bg-yellow-600/30 hover:shake"
                      onClick={() => toast.success('Re-classification initiated!')}
                    >
                      <Tag className="h-4 w-4 mr-2" />
                      Re-Classify 🏷️
                    </Button>
                    <Button
                      className="w-full bg-purple-600/20 border border-purple-400/30 text-purple-300 hover:bg-purple-600/30 hover:shake"
                      onClick={() => toast.success('Routing options opened!')}
                    >
                      <Send className="h-4 w-4 mr-2" />
                      Route To... 📤
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserDashboard;
