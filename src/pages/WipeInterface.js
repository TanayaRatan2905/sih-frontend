
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Folder, 
  HardDrive, 
  Zap, 
  Shield, 
  AlertTriangle, 
  CheckCircle,
  Monitor,
  Smartphone,
  Laptop,
  Database,
  Activity,
  Clock,
  Award
} from "lucide-react";
import { WipeSession } from "@/entities/WipeSession";
import { Certificate } from "@/entities/Certificate";
import { InvokeLLM } from "@/integrations/Core";

export default function WipeInterface() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    sessionName: "",
    wipeType: "",
    targetPath: "",
    platform: "",
    wipeMethod: "",
    organization: ""
  });
  const [healthResults, setHealthResults] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentSession, setCurrentSession] = useState(null);

  const platformIcons = {
    windows: Monitor,
    linux: Database,
    android: Smartphone,
    mac: Laptop
  };

  const wipeAlgorithms = [
    { value: "dod_3_pass", label: "DoD 5220.22-M (3 Pass)", description: "Standard military wiping" },
    { value: "dod_7_pass", label: "DoD 5220.22-M (7 Pass)", description: "Enhanced security" },
    { value: "gutmann_35_pass", label: "Gutmann Method (35 Pass)", description: "Maximum security" },
    { value: "random_single", label: "Single Random Pass", description: "Fast wiping" },
    { value: "zero_fill", label: "Zero Fill", description: "Basic overwrite" }
  ];

  const simulateHealthCheck = async () => {
    setIsProcessing(true);
    setProgress(0);

    // Simulate progress
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 2;
      });
    }, 50);

    // Simulate ML health analysis
    const healthData = await InvokeLLM({
      prompt: `Simulate a disk health analysis for a ${formData.platform} system. 
      Generate realistic health metrics including bad sectors, temperature, read/write errors, 
      and an overall health score between 0-100. Format as JSON.`,
      response_json_schema: {
        type: "object",
        properties: {
          health_score: { type: "number" },
          bad_sectors: { type: "number" },
          temperature: { type: "number" },
          read_errors: { type: "number" },
          write_errors: { type: "number" },
          recommendation: { type: "string" }
        }
      }
    });

    setTimeout(() => {
      setHealthResults(healthData);
      setIsProcessing(false);
      if (healthData.health_score >= 70) {
        setCurrentStep(3);
      } else {
        setCurrentStep(4); // Abort step
      }
    }, 2000);
  };

  const executeWipe = async () => {
    setIsProcessing(true);
    setProgress(0);

    // Create wipe session
    const session = await WipeSession.create({
      ...formData,
      status: "wiping",
      health_score: healthResults.health_score,
      health_details: healthResults,
      size_gb: Math.floor(Math.random() * 500) + 50
    });

    setCurrentSession(session);

    // Simulate wiping process
    const wipeInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(wipeInterval);
          return 100;
        }
        return prev + 0.5;
      });
    }, 100);

    // Complete after simulation
    setTimeout(async () => {
      const certificateId = `CERT-${Date.now()}`;
      
      // Generate certificate
      await Certificate.create({
        certificate_id: certificateId,
        session_id: session.id,
        organization: formData.organization || "Individual User",
        target_description: `${formData.wipeType} - ${formData.targetPath}`,
        wipe_standard: formData.wipeMethod,
        verification_hash: `HASH-${Date.now()}`,
        expiry_date: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        compliance_standards: ["DoD 5220.22-M", "NIST 800-88"]
      });

      // Update session
      await WipeSession.update(session.id, {
        status: "completed",
        certificate_id: certificateId,
        duration_minutes: Math.floor(Math.random() * 120) + 30
      });

      setIsProcessing(false);
      setCurrentStep(5);
    }, 10000);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div>
              <Label htmlFor="sessionName">Session Name</Label>
              <Input
                id="sessionName"
                value={formData.sessionName}
                onChange={(e) => setFormData({...formData, sessionName: e.target.value})}
                placeholder="Enter session name"
                className="bg-slate-800/50 border-slate-600 text-white"
              />
            </div>

            <div>
              <Label htmlFor="organization">Organization (Optional)</Label>
              <Input
                id="organization"
                value={formData.organization}
                onChange={(e) => setFormData({...formData, organization: e.target.value})}
                placeholder="Company name"
                className="bg-slate-800/50 border-slate-600 text-white"
              />
            </div>

            <div>
              <Label>Wipe Type</Label>
              <RadioGroup 
                value={formData.wipeType} 
                onValueChange={(value) => setFormData({...formData, wipeType: value})}
                className="mt-2"
              >
                <div className="flex items-center space-x-2 p-3 border border-slate-600 rounded-lg hover:border-blue-500 transition-colors">
                  <RadioGroupItem value="folder" id="folder" />
                  <Folder className="w-5 h-5 text-blue-400" />
                  <Label htmlFor="folder" className="text-white">Specific Folder</Label>
                </div>
                <div className="flex items-center space-x-2 p-3 border border-slate-600 rounded-lg hover:border-blue-500 transition-colors">
                  <RadioGroupItem value="full_disk" id="full_disk" />
                  <HardDrive className="w-5 h-5 text-red-400" />
                  <Label htmlFor="full_disk" className="text-white">Entire Disk</Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label htmlFor="targetPath">Target Path</Label>
              <Input
                id="targetPath"
                value={formData.targetPath}
                onChange={(e) => setFormData({...formData, targetPath: e.target.value})}
                placeholder="/path/to/folder or C:\ for full disk"
                className="bg-slate-800/50 border-slate-600 text-white"
              />
            </div>

            <div>
              <Label>Platform</Label>
              <div className="grid grid-cols-2 gap-3 mt-2">
                {Object.entries(platformIcons).map(([key, Icon]) => (
                  <button
                    key={key}
                    onClick={() => setFormData({...formData, platform: key})}
                    className={`p-3 border rounded-lg transition-all duration-200 ${
                      formData.platform === key 
                        ? 'border-blue-500 bg-blue-500/20' 
                        : 'border-slate-600 hover:border-blue-400'
                    }`}
                  >
                    <Icon className="w-6 h-6 text-blue-400 mx-auto mb-1" />
                    <p className="text-sm text-white capitalize">{key}</p>
                  </button>
                ))}
              </div>
            </div>

            <Button 
              onClick={() => setCurrentStep(2)}
              disabled={!formData.sessionName || !formData.wipeType || !formData.targetPath || !formData.platform}
              className="w-full bg-gradient-to-r from-blue-500 to-cyan-400"
            >
              Next: Configure Wipe Method
            </Button>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div>
              <Label>Wiping Algorithm</Label>
              <div className="space-y-3 mt-2">
                {wipeAlgorithms.map((algorithm) => (
                  <button
                    key={algorithm.value}
                    onClick={() => setFormData({...formData, wipeMethod: algorithm.value})}
                    className={`w-full p-4 border rounded-lg text-left transition-all duration-200 ${
                      formData.wipeMethod === algorithm.value
                        ? 'border-blue-500 bg-blue-500/20'
                        : 'border-slate-600 hover:border-blue-400'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Shield className="w-5 h-5 text-blue-400" />
                      <div>
                        <p className="font-medium text-white">{algorithm.label}</p>
                        <p className="text-sm text-slate-400">{algorithm.description}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={() => setCurrentStep(1)}
                className="flex-1"
              >
                Back
              </Button>
              <Button 
                onClick={simulateHealthCheck}
                disabled={!formData.wipeMethod}
                className="flex-1 bg-gradient-to-r from-purple-500 to-pink-400"
              >
                <Activity className="w-4 h-4 mr-2" />
                Start Health Check
              </Button>
            </div>
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-6"
          >
            {isProcessing ? (
              <>
                <Activity className="w-16 h-16 text-blue-400 mx-auto animate-spin" />
                <h3 className="text-2xl font-semibold text-white">Analyzing Disk Health</h3>
                <Progress value={progress} className="w-full h-3" />
                <p className="text-slate-300">AI algorithms are analyzing your disk...</p>
              </>
            ) : healthResults ? (
              <>
                <CheckCircle className="w-16 h-16 text-green-400 mx-auto" />
                <h3 className="text-2xl font-semibold text-white">Health Check Complete</h3>
                <div className="bg-slate-800/50 rounded-lg p-6 text-left">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-slate-400">Health Score</p>
                      <p className="text-2xl font-bold text-green-400">{healthResults.health_score}/100</p>
                    </div>
                    <div>
                      <p className="text-slate-400">Bad Sectors</p>
                      <p className="text-xl font-semibold text-white">{healthResults.bad_sectors}</p>
                    </div>
                    <div>
                      <p className="text-slate-400">Temperature</p>
                      <p className="text-xl font-semibold text-white">{healthResults.temperature}°C</p>
                    </div>
                    <div>
                      <p className="text-slate-400">Read Errors</p>
                      <p className="text-xl font-semibold text-white">{healthResults.read_errors}</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="text-slate-400">AI Recommendation</p>
                    <p className="text-white mt-1">{healthResults.recommendation}</p>
                  </div>
                </div>
                <Button 
                  onClick={executeWipe}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-400 text-lg py-3"
                >
                  <Zap className="w-5 h-5 mr-2" />
                  Execute Secure Wipe
                </Button>
              </>
            ) : null}
          </motion.div>
        );

      case 4:
        return (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-6"
          >
            <AlertTriangle className="w-16 h-16 text-red-400 mx-auto" />
            <h3 className="text-2xl font-semibold text-white">Wipe Operation Aborted</h3>
            <Alert className="border-red-500/50 bg-red-500/10">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription className="text-red-200">
                Health check failed. The disk shows signs of hardware issues that could compromise the wiping process.
                Please repair or replace the disk before attempting to wipe.
              </AlertDescription>
            </Alert>
            {healthResults && (
              <div className="bg-slate-800/50 rounded-lg p-6 text-left">
                <p className="text-red-400 font-semibold mb-2">Issues Detected:</p>
                <ul className="text-slate-300 space-y-1">
                  <li>• Health Score: {healthResults.health_score}/100 (Below 70)</li>
                  <li>• Bad Sectors: {healthResults.bad_sectors}</li>
                  <li>• Read Errors: {healthResults.read_errors}</li>
                  <li>• Write Errors: {healthResults.write_errors}</li>
                </ul>
              </div>
            )}
            <Button 
              onClick={() => {
                setCurrentStep(1);
                setHealthResults(null);
                setProgress(0);
              }}
              variant="outline"
              className="w-full"
            >
              Start New Session
            </Button>
          </motion.div>
        );

      case 5:
        return (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-6"
          >
            {isProcessing ? (
              <>
                <Zap className="w-16 h-16 text-yellow-400 mx-auto animate-pulse" />
                <h3 className="text-2xl font-semibold text-white">Secure Wiping in Progress</h3>
                <Progress value={progress} className="w-full h-4" />
                <p className="text-slate-300">
                  Executing {formData.wipeMethod.replace(/_/g, ' ').toUpperCase()} algorithm...
                </p>
                <div className="flex justify-center items-center gap-2 text-slate-400">
                  <Clock className="w-4 h-4" />
                  <span>Estimated time remaining: {Math.ceil((100 - progress) / 10)} minutes</span>
                </div>
              </>
            ) : (
              <>
                <CheckCircle className="w-20 h-20 text-green-400 mx-auto" />
                <h3 className="text-3xl font-semibold text-white">Wipe Completed Successfully!</h3>
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-6">
                  <p className="text-green-200 text-lg mb-4">
                    Your data has been securely wiped using military-grade algorithms.
                  </p>
                  <div className="text-left space-y-2 text-slate-300">
                    <p>• Algorithm: {formData.wipeMethod.replace(/_/g, ' ').toUpperCase()}</p>
                    <p>• Target: {formData.targetPath}</p>
                    <p>• Platform: {formData.platform.toUpperCase()}</p>
                    <p>• Certificate Generated: CERT-{Date.now()}</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button 
                    onClick={() => {
                      setCurrentStep(1);
                      setFormData({sessionName: "", wipeType: "", targetPath: "", platform: "", wipeMethod: "", organization: ""});
                      setHealthResults(null);
                      setProgress(0);
                      setCurrentSession(null);
                    }}
                    variant="outline"
                    className="flex-1"
                  >
                    New Wipe Session
                  </Button>
                  <Button className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-400">
                    <Award className="w-4 h-4 mr-2" />
                    View Certificate
                  </Button>
                </div>
              </>
            )}
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Secure Data Wiping</h1>
          <div className="flex justify-center items-center space-x-4 mb-6">
            {[1, 2, 3, 4, 5].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  currentStep >= step ? 'bg-blue-500 text-white' : 'bg-slate-700 text-slate-400'
                }`}>
                  {step}
                </div>
                {step < 5 && (
                  <div className={`w-12 h-1 ${
                    currentStep > step ? 'bg-blue-500' : 'bg-slate-700'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <Card className="bg-slate-800/30 border-slate-700/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-2xl text-white flex items-center gap-2">
              <Shield className="w-6 h-6 text-blue-400" />
              {currentStep === 1 && "Configure Wipe Session"}
              {currentStep === 2 && "Select Wiping Algorithm"}
              {currentStep === 3 && "Health Check Results"}
              {currentStep === 4 && "Operation Aborted"}
              {currentStep === 5 && "Wipe Operation"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <AnimatePresence mode="wait">
              {renderStepContent()}
            </AnimatePresence>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
