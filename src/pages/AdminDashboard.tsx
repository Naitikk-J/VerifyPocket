import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, UserPlus, Award, History, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useNavigate } from 'react-router-dom';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from '@/components/ui/textarea';
import QRCode from 'qrcode.react';
import SHA256 from 'crypto-js/sha256';

// --- Mock Data ---
const mockRecords = [
  { id: 'cred_001', student: '0x1a2b...', course: 'Intro to Solidity', issued: '2023-10-26' },
  { id: 'cred_002', student: '0x3c4d...', course: 'Advanced DApp Dev', issued: '2023-11-15' },
  { id: 'cred_003', student: '0x5e6f...', course: 'DeFi Fundamentals', issued: '2023-12-01' },
  { id: 'cred_004', student: '0x7g8h...', course: 'Web3 Security', issued: '2024-01-20' },
];

interface CertificateResult {
  certHash: string;
  txHash: string;
  qrUrl: string;
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [adminAddress, setAdminAddress] = useState('');
  const [certificateResult, setCertificateResult] = useState<CertificateResult | null>(null);

  useEffect(() => {
    const isLoggedIn = sessionStorage.getItem('isAdminLoggedIn') === 'true';
    const address = sessionStorage.getItem('adminAddress');

    if (!isLoggedIn || !address) {
      navigate('/admin/login');
    } else {
      setAdminAddress(address);
    }
  }, [navigate]);

  const handleLogout = () => {
    sessionStorage.removeItem('isAdminLoggedIn');
    sessionStorage.removeItem('adminAddress');
    navigate('/admin/login');
  };

  const handleRegisterStudent = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const studentAddress = formData.get('studentAddress');
    console.log("Registering Student:", { studentAddress });
    alert(`Student ${studentAddress} registered successfully (simulation).`);
    e.currentTarget.reset();
  };
  
  const handleIssueCertificate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    // 1. Create a unique hash for the certificate data
    const dataString = JSON.stringify(data) + `-${Date.now()}`;
    const certHash = SHA256(dataString).toString();

    // 2. Simulate a transaction hash
    const txHash = `0x${SHA256(certHash).toString().slice(0, 64)}`;

    // 3. Create a URL for the QR code
    const verifierUrl = `${window.location.origin}/verifier?certId=${certHash}`;
    
    // Log file info to console (simulation)
    console.log("Issuing Certificate with Files:", {
      ...data,
      certificateFile: (data.certificateFile as File).name,
      studentPhoto: (data.studentPhoto as File).name,
      certHash,
      txHash
    });

    // 4. Set results to display modal
    setCertificateResult({ certHash, txHash, qrUrl: verifierUrl });
    e.currentTarget.reset();
  };

  if (!adminAddress) {
    return null; // Render nothing while checking auth
  }

  return (
    <div className="min-h-screen">
      <header className="border-b border-border/50 glass-card sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
            <Shield className="h-8 w-8 text-primary animate-pulse-glow" />
            <span className="text-xl font-bold glow-text">CredentialPass</span>
          </div>
          <h1 className="text-2xl font-bold text-center">Admin Dashboard</h1>
          <Button variant="outline" onClick={handleLogout}>Logout</Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        <div className="space-y-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="glass-card border-primary/20">
              <CardHeader><CardTitle className="flex items-center gap-2"><UserPlus />Register New Student</CardTitle></CardHeader>
              <CardContent>
                <form onSubmit={handleRegisterStudent} className="space-y-4">
                  <Label htmlFor="studentAddress">Student Wallet Address</Label>
                  <Input id="studentAddress" name="studentAddress" placeholder="0x..." required />
                  <Button type="submit" className="w-full">Register Student</Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="glass-card border-primary/20">
              <CardHeader><CardTitle className="flex items-center gap-2"><Award />Issue Certificate</CardTitle></CardHeader>
              <CardContent>
                <form onSubmit={handleIssueCertificate} className="space-y-4">
                  <Label htmlFor="certStudentAddress">Student Wallet Address</Label>
                  <Input id="certStudentAddress" name="studentAddress" placeholder="0x..." required />
                  <Label htmlFor="studentName">Student's Full Name</Label>
                  <Input id="studentName" name="studentName" placeholder="e.g., Jane Doe" required />
                  <Label htmlFor="certificateTitle">Certificate Title</Label>
                  <Input id="certificateTitle" name="certificateTitle" placeholder="e.g., Certificate of Completion" required />
                  <Label htmlFor="courseName">Course Name</Label>
                  <Input id="courseName" name="courseName" placeholder="e.g., Advanced Web3" required />
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" name="description" placeholder="e.g., Completed a 12-week course..." required />
                  <Label htmlFor="instituteName">Issuing Institute</Label>
                  <Input id="instituteName" name="instituteName" placeholder="e.g., Web3 University" required />
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="issueDate">Date of Issuance</Label>
                      <Input id="issueDate" name="issueDate" type="date" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="grade">Grade / Score</Label>
                      <Input id="grade" name="grade" placeholder="e.g., A+" required />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="issuerName">Issuer's Name</Label>
                      <Input id="issuerName" name="issuerName" placeholder="e.g., Dr. John Smith" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="issuerTitle">Issuer's Title</Label>
                      <Input id="issuerTitle" name="issuerTitle" placeholder="e.g., Dean of Engineering" required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="certificateFile">Upload Certificate (PDF/Image)</Label>
                    <Input id="certificateFile" name="certificateFile" type="file" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="studentPhoto">Upload Student Photo</Label>
                    <Input id="studentPhoto" name="studentPhoto" type="file" required />
                  </div>
                  <Button type="submit" className="w-full bg-primary text-primary-foreground glow-border">Issue Certificate</Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card className="glass-card border-primary/20">
            <CardHeader><CardTitle className="flex items-center gap-2"><History />View All Records</CardTitle></CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Credential ID</TableHead>
                            <TableHead>Student</TableHead>
                            <TableHead>Course</TableHead>
                            <TableHead>Date Issued</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {mockRecords.map((rec) => (
                            <TableRow key={rec.id}>
                                <TableCell className='font-mono text-xs'>{rec.id}</TableCell>
                                <TableCell className='font-mono text-xs'>{rec.student}</TableCell>
                                <TableCell>{rec.course}</TableCell>
                                <TableCell>{rec.issued}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
          </Card>
        </motion.div>

      </main>

      {certificateResult && (
        <motion.div 
            className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        >
          <Card className="w-[90vw] max-w-2xl glass-card border-primary/30 relative">
            <Button variant="ghost" size="icon" className="absolute top-4 right-4" onClick={() => setCertificateResult(null)}><X /></Button>
            <CardHeader>
                <CardTitle className="text-2xl text-center">Certificate Issued Successfully!</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col md:flex-row items-center gap-8">
                <div className="flex-grow space-y-4 text-sm">
                    <div>
                        <Label className="text-muted-foreground">Certificate Hash ID</Label>
                        <p className="font-mono break-all">{certificateResult.certHash}</p>
                    </div>
                    <div>
                        <Label className="text-muted-foreground">Transaction Hash (Simulated)</Label>
                        <p className="font-mono break-all">{certificateResult.txHash}</p>
                    </div>
                </div>
                <div className="flex flex-col items-center gap-2 p-4 bg-white rounded-lg">
                    <QRCode value={certificateResult.qrUrl} size={160} />
                    <p className="text-xs text-black">Scan to Verify</p>
                </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

    </div>
  );
}
