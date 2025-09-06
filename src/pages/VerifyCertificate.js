import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Certificate } from "@/entities/Certificate";
import { WipeSession } from "@/entities/WipeSession";
import { UploadFile, ExtractDataFromUploadedFile } from "@/integrations/Core";
import { 
  FileCheck, 
  Upload, 
  CheckCircle, 
  AlertTriangle, 
  Shield,
  Award,
  X,
  Search,
  FileText
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";

export default function VerifyCertificate() {
  const [verificationMethod, setVerificationMethod] = useState("id"); // "id" or "upload"
  const [certificateId, setCertificateId] = useState("");
  const [uploadedFile, setUploadedFile] = useState(null);
  const [verificationResult, setVerificationResult] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState("");

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.includes('pdf') && !file.type.includes('image')) {
      setError("Please upload a PDF or image file");
      return;
    }

    setUploadedFile(file);
    setError("");
  };

  const verifyById = async () => {
    if (!certificateId.trim()) {
      setError("Please enter a certificate ID");
      return;
    }

    setIsVerifying(true);
    setError("");

    try {
      // Search for certificate
      const certificates = await Certificate.filter({ certificate_id: certificateId });
      
      if (certificates.length === 0) {
        setVerificationResult({ valid: false, message: "Certificate not found" });
      } else {
        const certificate = certificates[0];
        const session = await WipeSession.filter({ id: certificate.session_id });
        
        setVerificationResult({
          valid: true,
          certificate,
          session: session[0],
          message: "Certificate verified successfully"
        });
      }
    } catch (error) {
      setError("Error verifying certificate");
    }

    setIsVerifying(false);
  };

  const verifyByUpload = async () => {
    if (!uploadedFile) {
      setError("Please upload a certificate file");
      return;
    }

    setIsVerifying(true);
    setError("");

    try {
      // Upload file
      const { file_url } = await UploadFile({ file: uploadedFile });
      
      // Extract certificate data
      const extractResult = await ExtractDataFromUploadedFile({
        file_url,
        json_schema: {
          type: "object",
          properties: {
            certificate_id: { type: "string" },
            organization: { type: "string" },
            target_description: { type: "string" },
            wipe_standard: { type: "string" },
            issue_date: { type: "string" },
            verification_hash: { type: "string" }
          }
        }
      });

      if (extractResult.status === "success" && extractResult.output?.certificate_id) {
        // Verify extracted certificate ID
        const certificates = await Certificate.filter({ 
          certificate_id: extractResult.output.certificate_id 
        });
        
        if (certificates.length > 0) {
          const certificate = certificates[0];
          const session = await WipeSession.filter({ id: certificate.session_id });
          
          setVerificationResult({
            valid: true,
            certificate,
            session: session[0],
            message: "Certificate verified from uploaded document",
            extractedData: extractResult.output
          });
        } else {
          setVerificationResult({ 
            valid: false, 
            message: "Certificate ID found in document but not verified in our database" 
          });
        }
      } else {
        setVerificationResult({ 
          valid: false, 
          message: "Could not extract certificate information from the uploaded file" 
        });
      }
    } catch (error) {
      setError("Error processing uploaded certificate");
    }

    setIsVerifying(false);
  };

  const resetVerification = () => {
    setVerificationResult(null);
    setCertificateId("");
    setUploadedFile(null);
    setError("");
  };

  return (
    <div className="p-6 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <motion.div 
          className="mb-8 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-bold text-white mb-2">Certificate Verification</h1>
          <p className="text-slate-400">Verify the authenticity of data destruction certificates</p>
        </motion.div>

        {!verificationResult ? (
          <Card className="bg-slate-800/30 border-slate-700/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <FileCheck className="w-6 h-6 text-blue-400" />
                Choose Verification Method
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Method Selection */}
              <div className="grid md:grid-cols-2 gap-4">
                <button
                  onClick={() => setVerificationMethod("id")}
                  className={`p-4 border-2 rounded-lg transition-all duration-300 ${
                    verificationMethod === "id"
                      ? 'border-blue-500 bg-blue-500/20'
                      : 'border-slate-600 hover:border-blue-400'
                  }`}
                >
                  <Search className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                  <h3 className="text-white font-semibold">By Certificate ID</h3>
                  <p className="text-slate-400 text-sm mt-1">Enter certificate ID directly</p>
                </button>

                <button
                  onClick={() => setVerificationMethod("upload")}
                  className={`p-4 border-2 rounded-lg transition-all duration-300 ${
                    verificationMethod === "upload"
                      ? 'border-blue-500 bg-blue-500/20'
                      : 'border-slate-600 hover:border-blue-400'
                  }`}
                >
                  <Upload className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                  <h3 className="text-white font-semibold">Upload Certificate</h3>
                  <p className="text-slate-400 text-sm mt-1">Upload PDF or image file</p>
                </button>
              </div>

              {error && (
                <Alert className="border-red-500/50 bg-red-500/10">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription className="text-red-200">{error}</AlertDescription>
                </Alert>
              )}

              <AnimatePresence mode="wait">
                {verificationMethod === "id" ? (
                  <motion.div
                    key="id-method"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    className="space-y-4"
                  >
                    <div>
                      <Label htmlFor="certificateId">Certificate ID</Label>
                      <Input
                        id="certificateId"
                        value={certificateId}
                        onChange={(e) => setCertificateId(e.target.value)}
                        placeholder="Enter certificate ID (e.g., CERT-1234567890)"
                        className="bg-slate-700/30 border-slate-600 text-white"
                      />
                    </div>
                    <Button 
                      onClick={verifyById}
                      disabled={isVerifying || !certificateId.trim()}
                      className="w-full bg-gradient-to-r from-blue-500 to-cyan-400"
                    >
                      {isVerifying ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Verifying...
                        </>
                      ) : (
                        <>
                          <Shield className="w-4 h-4 mr-2" />
                          Verify Certificate
                        </>
                      )}
                    </Button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="upload-method"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    className="space-y-4"
                  >
                    <div>
                      <Label htmlFor="fileUpload">Upload Certificate File</Label>
                      <div className="mt-2 border-2 border-dashed border-slate-600 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                        <input
                          id="fileUpload"
                          type="file"
                          accept=".pdf,.png,.jpg,.jpeg"
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                        <label htmlFor="fileUpload" className="cursor-pointer">
                          <FileText className="w-12 h-12 text-slate-400 mx-auto mb-2" />
                          {uploadedFile ? (
                            <p className="text-white font-medium">{uploadedFile.name}</p>
                          ) : (
                            <>
                              <p className="text-white">Click to upload certificate</p>
                              <p className="text-slate-400 text-sm">PDF, PNG, JPG files supported</p>
                            </>
                          )}
                        </label>
                      </div>
                    </div>
                    <Button 
                      onClick={verifyByUpload}
                      disabled={isVerifying || !uploadedFile}
                      className="w-full bg-gradient-to-r from-purple-500 to-pink-400"
                    >
                      {isVerifying ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Processing...
                        </>
                      ) : (
                        <>
                          <FileCheck className="w-4 h-4 mr-2" />
                          Verify Uploaded Certificate
                        </>
                      )}
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Card className="bg-slate-800/30 border-slate-700/50 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white flex items-center gap-2">
                    {verificationResult.valid ? (
                      <CheckCircle className="w-6 h-6 text-green-400" />
                    ) : (
                      <AlertTriangle className="w-6 h-6 text-red-400" />
                    )}
                    Verification Result
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={resetVerification}
                    className="text-slate-400 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Alert className={`mb-6 ${
                  verificationResult.valid 
                    ? 'border-green-500/50 bg-green-500/10' 
                    : 'border-red-500/50 bg-red-500/10'
                }`}>
                  {verificationResult.valid ? (
                    <CheckCircle className="h-4 w-4 text-green-400" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 text-red-400" />
                  )}
                  <AlertDescription className={
                    verificationResult.valid ? 'text-green-200' : 'text-red-200'
                  }>
                    {verificationResult.message}
                  </AlertDescription>
                </Alert>

                {verificationResult.valid && verificationResult.certificate && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-400 rounded-lg flex items-center justify-center">
                        <Award className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-white">
                          {verificationResult.certificate.certificate_id}
                        </h3>
                        <p className="text-slate-300">
                          {verificationResult.certificate.organization || 'Individual User'}
                        </p>
                        <Badge className="bg-green-500/20 text-green-300 border-green-500/30 mt-1">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Verified Authentic
                        </Badge>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="bg-slate-700/30 rounded-lg p-4">
                        <h4 className="font-semibold text-white mb-3">Certificate Details</h4>
                        <div className="space-y-2">
                          <div>
                            <p className="text-slate-400 text-sm">Target</p>
                            <p className="text-white">{verificationResult.certificate.target_description}</p>
                          </div>
                          <div>
                            <p className="text-slate-400 text-sm">Wipe Standard</p>
                            <p className="text-white">
                              {verificationResult.certificate.wipe_standard.replace(/_/g, ' ').toUpperCase()}
                            </p>
                          </div>
                          <div>
                            <p className="text-slate-400 text-sm">Issue Date</p>
                            <p className="text-white">
                              {format(new Date(verificationResult.certificate.created_date), "PPP")}
                            </p>
                          </div>
                          <div>
                            <p className="text-slate-400 text-sm">Expiry Date</p>
                            <p className="text-white">
                              {format(new Date(verificationResult.certificate.expiry_date), "PPP")}
                            </p>
                          </div>
                        </div>
                      </div>

                      {verificationResult.session && (
                        <div className="bg-slate-700/30 rounded-lg p-4">
                          <h4 className="font-semibold text-white mb-3">Session Details</h4>
                          <div className="space-y-2">
                            <div>
                              <p className="text-slate-400 text-sm">Platform</p>
                              <p className="text-white">{verificationResult.session.platform.toUpperCase()}</p>
                            </div>
                            <div>
                              <p className="text-slate-400 text-sm">Data Size</p>
                              <p className="text-white">{verificationResult.session.size_gb || 0} GB</p>
                            </div>
                            <div>
                              <p className="text-slate-400 text-sm">Duration</p>
                              <p className="text-white">{verificationResult.session.duration_minutes || 0} minutes</p>
                            </div>
                            <div>
                              <p className="text-slate-400 text-sm">Health Score</p>
                              <p className="text-white">{verificationResult.session.health_score || 0}/100</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {verificationResult.certificate.compliance_standards && (
                      <div>
                        <h4 className="font-semibold text-white mb-3">Compliance Standards</h4>
                        <div className="flex flex-wrap gap-2">
                          {verificationResult.certificate.compliance_standards.map((standard, index) => (
                            <Badge key={index} variant="outline" className="border-blue-500/50 text-blue-300">
                              {standard}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex gap-3">
                      <Button className="flex-1 bg-gradient-to-r from-green-500 to-emerald-400">
                        <Shield className="w-4 h-4 mr-2" />
                        Certificate Valid
                      </Button>
                      <Button variant="outline" onClick={resetVerification}>
                        Verify Another
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}