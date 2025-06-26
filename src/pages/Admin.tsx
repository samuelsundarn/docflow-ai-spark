import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiCpu, FiActivity, FiCheckCircle, FiAlertCircle, FiUsers, FiSettings, 
  FiSearch, FiFilter, FiUser, FiLogOut, FiRotateCcw, FiSliders, FiEye 
} from 'react-icons/fi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

// Placeholder data-binding IDs
const DYNAMIC = {
  TOTAL_DOCS_PROCESSED: '{{DOC_COUNT}}',
  AGENT_UPTIME: '{{SUCCESS_RATE}}',
  FAILED_COUNT: 42,
  AVG_LATENCY_MS: '{{AVG_LATENCY_MS}}',
  ADMIN_NAME: '{{ADMIN_NAME}}',
};

const navIcons = [
  { icon: <FiActivity />, label: 'Dashboard', active: true },
  { icon: <FiCpu />, label: 'Agents' },
  { icon: <FiAlertCircle />, label: 'Queues' },
  { icon: <FiUsers />, label: 'Users' },
  { icon: <FiSettings />, label: 'Settings' },
];

const agentCards = [
  { name: 'Ingestor', color: 'from-cyan-400 to-blue-500', status: 'healthy' },
  { name: 'Extractor', color: 'from-green-400 to-emerald-500', status: 'healthy' },
  { name: 'Classifier', color: 'from-yellow-400 to-orange-500', status: 'warning' },
  { name: 'Router', color: 'from-purple-400 to-pink-500', status: 'healthy' },
];

const Admin = () => {
  const { profile, signOut } = useAuth();
  const [flipped, setFlipped] = useState([false, false, false, false]);
  const [theme, setTheme] = useState('dark');
  const [timeTravel, setTimeTravel] = useState(100);
  const [gaugeValues, setGaugeValues] = useState({
    cpu: 0,
    latency: 0,
    successRate: 0,
    queueDepth: 0
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [showGPTAssistant, setShowGPTAssistant] = useState(false);

  // Animation/transition helpers
  const handleFlip = (idx: number) => setFlipped(f => f.map((v, i) => (i === idx ? !v : v)));
  const toggleTheme = () => setTheme(t => (t === 'dark' ? 'light' : 'dark'));

  // Simulate real-time gauge updates
  useEffect(() => {
    const interval = setInterval(() => {
      setGaugeValues({
        cpu: Math.floor(Math.random() * 30) + 60,
        latency: Math.floor(Math.random() * 50) + 50,
        successRate: Math.floor(Math.random() * 10) + 90,
        queueDepth: Math.floor(Math.random() * 20) + 5
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Animated counter component
  const AnimatedCounter = ({ value, suffix = '' }: { value: number; suffix?: string }) => {
    const [displayValue, setDisplayValue] = useState(0);

    useEffect(() => {
      const start = displayValue;
      const end = value;
      const duration = 1000;
      const increment = (end - start) / (duration / 16);

      const timer = setInterval(() => {
        setDisplayValue(prev => {
          const next = prev + increment;
          if ((increment > 0 && next >= end) || (increment < 0 && next <= end)) {
            clearInterval(timer);
            return end;
          }
          return next;
        });
      }, 16);

      return () => clearInterval(timer);
    }, [value]);

    return <span>{Math.floor(displayValue)}{suffix}</span>;
  };

  // Radial gauge component
  const RadialGauge = ({ label, value, max = 100, color }: { label: string; value: number; max?: number; color: string }) => {
    const percentage = (value / max) * 100;
    const radius = 45;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
      <div className="relative w-32 h-32">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="8"
            fill="none"
          />
          {/* Progress circle */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            stroke={color}
            strokeWidth="8"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
            style={{
              filter: 'drop-shadow(0 0 8px currentColor)',
            }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className={`text-2xl font-bold ${color.includes('cyan') ? 'text-cyan-400' : color.includes('green') ? 'text-green-400' : color.includes('yellow') ? 'text-yellow-400' : 'text-purple-400'}`}>
            <AnimatedCounter value={value} suffix={label.includes('Rate') ? '%' : label.includes('Latency') ? 'ms' : ''} />
          </div>
          <div className="text-xs text-white/60 mt-1">{label}</div>
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Main Admin Dashboard Content */}
      <div className={`min-h-screen ${theme === 'dark' ? 'bg-gradient-to-br from-[#0F1224] to-[#1a1f3a]' : 'bg-gradient-to-br from-[#F7F9FB] to-[#E5E7EB]'} transition-all duration-300`}>
        {/* Left Icon Nav */}
        <nav className="fixed left-0 top-0 h-full w-16 bg-white/10 backdrop-blur-lg border-r border-white/20 z-40">
          <div className="flex flex-col items-center py-6 space-y-4">
            <div className="w-10 h-10 bg-gradient-to-br from-[#5E2BFF] to-[#00E3FF] rounded-lg flex items-center justify-center mb-4">
              <span className="text-white font-bold text-sm">DF</span>
            </div>
            {navIcons.map((item, i) => (
              <motion.button
                key={item.label}
                className={`p-3 rounded-lg transition-all duration-200 ${
                  item.active 
                    ? 'bg-gradient-to-br from-[#5E2BFF] to-[#00E3FF] text-white shadow-lg' 
                    : 'text-white/60 hover:text-white hover:bg-white/10'
                }`}
                title={item.label}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                {item.icon}
              </motion.button>
            ))}
          </div>
        </nav>

        {/* Main Content */}
        <div className="ml-16 min-h-screen">
          {/* Topbar */}
          <header className="bg-white/10 backdrop-blur-lg border-b border-white/20 px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <div className="relative">
                  <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 h-4 w-4" />
                  <Input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                  >
                    <FiFilter className="h-4 w-4 mr-2" />
                    Date
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                  >
                    <FiFilter className="h-4 w-4 mr-2" />
                    Doc Type
                  </Button>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <Button
                  onClick={toggleTheme}
                  variant="outline"
                  size="sm"
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                >
                  Toggle Theme
                </Button>
                <div className="flex items-center space-x-2 text-white/80">
                  <FiUser className="h-4 w-4" />
                  <span>{profile?.full_name || DYNAMIC.ADMIN_NAME}</span>
                </div>
                <Button
                  onClick={signOut}
                  variant="outline"
                  size="sm"
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                >
                  <FiLogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </header>

          {/* System Pulse Zone */}
          <section className="px-8 py-8">
            {/* Time-Travel Replay Slider */}
            <motion.div 
              className="mb-8 flex items-center justify-end space-x-4"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <span className="text-white/70 text-sm">Time-Travel Replay</span>
              <input
                type="range"
                min="0"
                max="100"
                value={timeTravel}
                onChange={(e) => setTimeTravel(Number(e.target.value))}
                className="w-32 h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
              />
              <span className="text-white/70 text-sm">{timeTravel}%</span>
            </motion.div>

            {/* Gauges Grid */}
            <motion.div 
              className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ staggerChildren: 0.1 }}
            >
              <motion.div 
                className="flex flex-col items-center p-6 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
              >
                <RadialGauge label="CPU Usage" value={gaugeValues.cpu} color="text-cyan-400" />
              </motion.div>
              <motion.div 
                className="flex flex-col items-center p-6 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                <RadialGauge label="Latency" value={gaugeValues.latency} max={200} color="text-green-400" />
              </motion.div>
              <motion.div 
                className="flex flex-col items-center p-6 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <RadialGauge label="Success Rate" value={gaugeValues.successRate} color="text-yellow-400" />
              </motion.div>
              <motion.div 
                className="flex flex-col items-center p-6 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <RadialGauge label="Queue Depth" value={gaugeValues.queueDepth} max={50} color="text-purple-400" />
              </motion.div>
            </motion.div>

            {/* Parallax neon data sparks */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {Array.from({ length: 20 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-[#00E3FF] rounded-full opacity-30"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                  animate={{
                    x: [0, Math.random() * 100 - 50],
                    y: [0, Math.random() * 100 - 50],
                    opacity: [0.3, 0.8, 0.3],
                  }}
                  transition={{
                    duration: Math.random() * 3 + 2,
                    repeat: Infinity,
                    repeatType: 'reverse',
                  }}
                />
              ))}
            </div>
          </section>

          {/* Agent Command Center */}
          <section className="px-8 pb-8">
            <h2 className="text-2xl font-bold text-white mb-6">Agent Command Center</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {agentCards.map((agent, idx) => (
                <motion.div
                  key={agent.name}
                  className={`relative h-48 bg-gradient-to-br ${agent.color} rounded-xl cursor-pointer overflow-hidden group`}
                  onMouseEnter={() => handleFlip(idx)}
                  onMouseLeave={() => handleFlip(idx)}
                  style={{ transformStyle: 'preserve-3d' }}
                  animate={{ rotateY: flipped[idx] ? 180 : 0 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="absolute inset-0 p-6 flex flex-col justify-between" style={{ backfaceVisibility: 'hidden' }}>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2">{agent.name}</h3>
                      <div className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                        agent.status === 'healthy' ? 'bg-green-400/20 text-green-300' : 'bg-yellow-400/20 text-yellow-300'
                      }`}>
                        {agent.status}
                      </div>
                    </div>
                    {/* Real-time sparkline placeholder */}
                    <div className="h-16 bg-white/10 rounded-lg flex items-end justify-between p-2">
                      {Array.from({ length: 12 }).map((_, i) => (
                        <div
                          key={i}
                          className="bg-white/60 rounded-sm animate-pulse"
                          style={{
                            width: '6px',
                            height: `${Math.random() * 100}%`,
                            animationDelay: `${i * 0.1}s`
                          }}
                        />
                      ))}
                    </div>
                  </div>
                  
                  <div 
                    className="absolute inset-0 p-6 flex flex-col justify-center space-y-3 bg-black/20 backdrop-blur-sm"
                    style={{ 
                      backfaceVisibility: 'hidden',
                      transform: 'rotateY(180deg)'
                    }}
                  >
                    <Button
                      className="w-full bg-white/20 text-white border-white/30 hover:bg-white/30"
                      onClick={() => toast.success(`${agent.name} restarted!`)}
                    >
                      <FiRotateCcw className="h-4 w-4 mr-2" />
                      Restart
                    </Button>
                    <Button
                      className="w-full bg-white/20 text-white border-white/30 hover:bg-white/30"
                      onClick={() => toast.success(`${agent.name} throttle adjusted!`)}
                    >
                      <FiSliders className="h-4 w-4 mr-2" />
                      Throttle
                    </Button>
                    <Button
                      className="w-full bg-white/20 text-white border-white/30 hover:bg-white/30"
                      onClick={() => toast.success(`${agent.name} logs opened!`)}
                    >
                      <FiEye className="h-4 w-4 mr-2" />
                      View Logs
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Analytics + Issue Stream */}
          <section className="px-8 pb-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Error Density Heatmap</h3>
                {/* Heatmap calendar placeholder */}
                <div className="grid grid-cols-7 gap-1">
                  {Array.from({ length: 35 }).map((_, i) => (
                    <div
                      key={i}
                      className={`aspect-square rounded-sm ${
                        Math.random() > 0.8 ? 'bg-red-400/60' :
                        Math.random() > 0.6 ? 'bg-yellow-400/40' :
                        Math.random() > 0.3 ? 'bg-green-400/20' : 'bg-white/10'
                      }`}
                      title={`Day ${i + 1}`}
                    />
                  ))}
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Live Event Stream</h3>
                {/* Live event stream placeholder */}
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <motion.div
                      key={i}
                      className="p-3 bg-white/5 rounded-lg border-l-2 border-cyan-400"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-white">Document processed successfully</span>
                        <span className="text-xs text-white/50">
                          {new Date(Date.now() - i * 60000).toLocaleTimeString()}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Smart Suggestions pill (bottom-right) */}
          <motion.div
            className="fixed bottom-6 right-6 z-50"
            animate={{ 
              scale: gaugeValues.successRate < 85 ? [1, 1.1, 1] : 1,
            }}
            transition={{ 
              repeat: gaugeValues.successRate < 85 ? Infinity : 0,
              duration: 2 
            }}
          >
            <Button
              onClick={() => setShowGPTAssistant(!showGPTAssistant)}
              className={`rounded-full px-6 py-3 ${
                gaugeValues.successRate < 85 
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 animate-pulse' 
                  : 'bg-gradient-to-r from-[#5E2BFF] to-[#00E3FF]'
              } text-white shadow-lg hover:shadow-xl transition-all duration-300`}
            >
              🤖 Smart Suggestions
            </Button>
          </motion.div>

          {/* GPT Assistant Panel */}
          <AnimatePresence>
            {showGPTAssistant && (
              <motion.div
                className="fixed bottom-20 right-6 w-80 h-96 bg-white/20 backdrop-blur-lg border border-white/20 rounded-xl p-4 z-40"
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: 20 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">AI Assistant</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowGPTAssistant(false)}
                    className="text-white/70 hover:text-white"
                  >
                    ×
                  </Button>
                </div>
                <div className="space-y-3 text-sm text-white/80">
                  <div className="p-3 bg-white/10 rounded-lg">
                    💡 <strong>Suggestion:</strong> Classifier agent showing reduced confidence. Consider retraining with recent data.
                  </div>
                  <div className="p-3 bg-white/10 rounded-lg">
                    📊 <strong>Insight:</strong> Peak processing times: 9-11 AM, 2-4 PM. Consider auto-scaling.
                  </div>
                  <div className="p-3 bg-white/10 rounded-lg">
                    🔧 <strong>Action:</strong> Update extraction rules for invoice processing to improve accuracy.
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* CSS Styles */}
      <style>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: linear-gradient(45deg, #5E2BFF, #00E3FF);
          cursor: pointer;
          box-shadow: 0 0 8px rgba(0, 227, 255, 0.5);
        }
        .slider::-moz-range-thumb {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: linear-gradient(45deg, #5E2BFF, #00E3FF);
          cursor: pointer;
          border: none;
          box-shadow: 0 0 8px rgba(0, 227, 255, 0.5);
        }
        .hover\\:shake:hover {
          animation: shake 0.5s ease-in-out;
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-2px); }
          75% { transform: translateX(2px); }
        }
      `}</style>
    </>
  );
};

export default Admin;
