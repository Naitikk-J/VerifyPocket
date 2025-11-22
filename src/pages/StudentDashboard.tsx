import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Award, Settings, CheckCircle, LogOut, Menu, X, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAccount, useDisconnect } from 'wagmi';
import { ConnectWalletButton } from '@/components/web3/ConnectWalletButton';
import { CredentialCard, Certificate } from '@/components/student/CredentialCard';
import { getApiUrl } from '@/lib/utils';

const MOCK_CERTIFICATES: Certificate[] = [
  {
    id: '1',
    title: 'Bachelor of Computer Science',
    issuer: 'University of Technology',
    studentPhoto: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop',
    certificateThumb: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=300&fit=crop',
    issuedAt: '2024-10-15',
    txHash: '0x8f2c2e3a4b5c6d7e8f9a0b1c2d3e4f5g6h7i8j9k0l1m2n3o4p5q6r7s8t9u',
    isVerified: true,
    category: 'Degree',
  },
  {
    id: '2',
    title: 'Advanced Web Development Certification',
    issuer: 'Code Academy',
    studentPhoto: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop',
    certificateThumb: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&h=300&fit=crop',
    issuedAt: '2024-08-20',
    txHash: '0x9g3d3f4b5c6d7e8f9a0b1c2d3e4f5g6h7i8j9k0l1m2n3o4p5q6r7s8t9u',
    isVerified: true,
    category: 'Certification',
  },
  {
    id: '3',
    title: 'Blockchain Fundamentals',
    issuer: 'Ethereum Foundation',
    studentPhoto: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop',
    certificateThumb: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=500&h=300&fit=crop',
    issuedAt: '2024-06-10',
    txHash: '0xah4e4g5c6d7e8f9a0b1c2d3e4f5g6h7i8j9k0l1m2n3o4p5q6r7s8t9u',
    isVerified: true,
    category: 'Course',
  },
];

interface DatabaseCertificate {
  _id: string;
  studentAddress: string;
  studentName: string;
  certificateTitle: string;
  instituteName: string;
  issueDate: string;
  hash: string;
  issuedAt: string;
}

const CERTIFICATE_CATEGORIES = ['All', 'Degree', 'Certification', 'Course', 'Skill'];

export default function StudentDashboard() {
  const navigate = useNavigate();
  const { address } = useAccount();
  const { disconnect } = useDisconnect();
  const [credentials, setCredentials] = useState<Certificate[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [showEmptyState, setShowEmptyState] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showProfileSettings, setShowProfileSettings] = useState(false);
  const [showVerifyTool, setShowVerifyTool] = useState(false);

  useEffect(() => {
    if (address) {
      fetchCredentials(address);
    }
  }, [address]);

  const fetchCredentials = async (studentAddress: string) => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${getApiUrl()}/api/credentials`);
      const userCredentials: DatabaseCertificate[] = response.data.filter(
        (cred: DatabaseCertificate) =>
          cred.studentAddress.toLowerCase() === studentAddress.toLowerCase()
      );

      if (userCredentials.length === 0) {
        setShowEmptyState(true);
        setCredentials([]);
      } else {
        setShowEmptyState(false);
        const formattedCredentials: Certificate[] = userCredentials.map((cred: any) => ({
          id: cred._id,
          title: cred.certificateTitle,
          issuer: cred.instituteName,
          studentPhoto: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop',
          certificateThumb: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=300&fit=crop',
          issuedAt: cred.issuedAt || cred.issueDate,
          txHash: cred.hash,
          isVerified: true,
          category: cred.category || 'Course',
        }));
        setCredentials(formattedCredentials);
      }
    } catch (error) {
      console.error('Error fetching credentials:', error);
      setShowEmptyState(true);
    } finally {
      setIsLoading(false);
    }
  };

  const navItems = [
    {
      icon: Award,
      label: 'My Credentials',
      active: !showProfileSettings && !showVerifyTool,
      action: () => {
        setShowProfileSettings(false);
        setShowVerifyTool(false);
      }
    },
    {
      icon: Settings,
      label: 'Profile Settings',
      active: showProfileSettings,
      action: () => {
        setShowProfileSettings(true);
        setShowVerifyTool(false);
      }
    },
    {
      icon: CheckCircle,
      label: 'Verify Tool',
      active: showVerifyTool,
      action: () => {
        setShowVerifyTool(true);
        setShowProfileSettings(false);
      }
    },
    {
      icon: LogOut,
      label: 'Disconnect Wallet',
      active: false,
      action: () => disconnect()
    },
  ];

  const getReputationScore = (credentialCount: number): 'High' | 'Medium' | 'Low' => {
    if (credentialCount >= 3) return 'High';
    if (credentialCount >= 1) return 'Medium';
    return 'Low';
  };

  const filteredCredentials = selectedCategory === 'All'
    ? credentials
    : credentials.filter((cert) => cert.category === selectedCategory);

  const reputationScore = getReputationScore(credentials.length);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-border/50 glass-card sticky top-0 z-50">
        <div className="px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 hover:bg-primary/20 rounded-lg transition-colors"
            >
              {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => navigate('/')}
            >
              <Shield className="h-8 w-8 text-primary animate-pulse-glow" />
              <span className="text-xl font-bold glow-text hidden sm:inline">CredentialPass</span>
            </motion.div>
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-primary/20 rounded-lg transition-colors relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-accent rounded-full" />
            </button>
            <ConnectWalletButton />
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <motion.aside
          initial={false}
          animate={{
            width: sidebarOpen ? '250px' : '0px',
            opacity: sidebarOpen ? 1 : 0,
          }}
          transition={{ duration: 0.3 }}
          className="hidden lg:flex lg:w-64 bg-gradient-to-b from-card/50 to-background/50 backdrop-blur-md border-r border-primary/10 flex-col overflow-hidden"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: sidebarOpen ? 1 : 0 }}
            transition={{ delay: 0.1 }}
            className="p-6 space-y-1"
          >
            {navItems.map((item, index) => (
              <motion.button
                key={item.label}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={item.action}
                className={`w-full px-4 py-3 rounded-lg transition-all flex items-center gap-3 ${
                  item.active
                    ? 'bg-primary/20 text-primary border border-primary/50'
                    : 'hover:bg-primary/10 text-muted-foreground hover:text-foreground'
                }`}
              >
                <item.icon className="h-5 w-5" />
                <span className="text-sm font-medium">{item.label}</span>
              </motion.button>
            ))}
          </motion.div>
        </motion.aside>

        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/50 lg:hidden z-40"
          />
        )}

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          <div className="p-6 lg:p-8 max-w-7xl mx-auto">
            {/* Welcome Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <h1 className="text-4xl font-bold mb-2">
                Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">{address?.slice(0, 6) || 'Guest'}</span>
              </h1>
              <p className="text-muted-foreground">Manage and showcase your digital credentials</p>
            </motion.div>

            {/* Identity Card & Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
            >
              {/* Identity Card */}
              <Card className="glass-card border-primary/20 col-span-1 lg:col-span-1">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                    Identity Card
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Ethereum Address</p>
                    <p className="font-mono text-sm text-primary break-all">
                      {address || 'Not connected'}
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">Total Credentials</p>
                      <p className="text-2xl font-bold">{credentials.length}</p>
                    </div>
                    <Badge className="bg-accent/20 text-accent border-accent/50">
                      {credentials.length} verified
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Stats Cards */}
              <Card className="glass-card border-primary/20">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Reputation Score</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-end gap-4">
                    <div>
                      <Badge
                        className={`text-lg px-4 py-2 ${
                          reputationScore === 'High'
                            ? 'bg-success/20 text-success border-success/50'
                            : reputationScore === 'Medium'
                              ? 'bg-warning/20 text-warning border-warning/50'
                              : 'bg-destructive/20 text-destructive border-destructive/50'
                        }`}
                      >
                        {reputationScore}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">Based on verified credentials</p>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <Card className="glass-card border-primary/20">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Verification Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">On-Chain Verified</span>
                      <span className="text-lg font-bold text-success">{credentials.length}</span>
                    </div>
                    <div className="h-1 bg-primary/20 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: credentials.length > 0 ? '100%' : '0%' }}
                        transition={{ duration: 1 }}
                        className="h-full bg-gradient-to-r from-primary to-accent"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Credentials Grid */}
            {!showProfileSettings && !showVerifyTool && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h2 className="text-2xl font-bold mb-6">Your Digital Backpack</h2>

                {/* Category Filter */}
                {credentials.length > 0 && (
                  <div className="mb-6 flex flex-wrap gap-2">
                    {CERTIFICATE_CATEGORIES.map((category) => (
                      <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`px-4 py-2 rounded-lg transition-all ${
                          selectedCategory === category
                            ? 'bg-primary/30 text-primary border border-primary/50'
                            : 'bg-primary/10 text-muted-foreground border border-primary/20 hover:bg-primary/20'
                        }`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                )}

                {isLoading ? (
                  <div className="text-center py-12">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="w-12 h-12 border-2 border-primary/20 border-t-primary rounded-full mx-auto mb-4"
                    />
                    <p className="text-muted-foreground">Loading your credentials...</p>
                  </div>
                ) : showEmptyState ? (
                  <Card className="glass-card border-primary/20 py-12">
                    <CardContent className="text-center">
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-4"
                      >
                        <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                          <Award className="h-12 w-12 text-primary/50" />
                        </div>
                        <h3 className="text-xl font-bold">Your Digital Backpack is empty.</h3>
                        <p className="text-muted-foreground">
                          Connect with your university to receive your first verified credential.
                        </p>
                        <Button
                          className="mt-4 bg-gradient-to-r from-primary to-accent hover:opacity-90"
                          onClick={() => navigate('/')}
                        >
                          Explore Institutions
                        </Button>
                      </motion.div>
                    </CardContent>
                  </Card>
                ) : filteredCredentials.length === 0 ? (
                  <Card className="glass-card border-primary/20 py-12">
                    <CardContent className="text-center">
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-4"
                      >
                        <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                          <Award className="h-12 w-12 text-primary/50" />
                        </div>
                        <h3 className="text-xl font-bold">No credentials in this category</h3>
                        <p className="text-muted-foreground">
                          Try selecting a different category.
                        </p>
                      </motion.div>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCredentials.map((cert, index) => (
                      <CredentialCard
                        key={cert.id}
                        certificate={cert}
                        index={index}
                      />
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* Profile Settings View */}
            {showProfileSettings && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="max-w-2xl">
                  <h2 className="text-2xl font-bold mb-6">Profile Settings</h2>
                  <Card className="glass-card border-primary/20">
                    <CardHeader>
                      <CardTitle>Update Your Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ProfileSettingsForm address={address || ''} />
                    </CardContent>
                  </Card>
                </div>
              </motion.div>
            )}

            {/* Verify Tool View */}
            {showVerifyTool && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="max-w-2xl">
                  <h2 className="text-2xl font-bold mb-6">Verify Credentials</h2>
                  <VerifyToolComponent />
                </div>
              </motion.div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
