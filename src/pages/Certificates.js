import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Certificate } from "@/entities/Certificate";
import { WipeSession } from "@/entities/WipeSession";
import { 
  Award, 
  Search, 
  Download, 
  ExternalLink,
  Shield,
  Calendar,
  Building2,
  FileText,
  CheckCircle
} from "lucide-react";
import { motion } from "framer-motion";
import { format } from "date-fns";

const CertificateCard = ({ certificate, session }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <Card className="bg-slate-800/30 border-slate-700/50 backdrop-blur-sm hover:bg-slate-800/50 transition-all duration-300">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-400 rounded-lg flex items-center justify-center">
              <Award className="w-6 h-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-white text-lg">{certificate.certificate_id}</CardTitle>
              <p className="text-slate-400 text-sm">{certificate.organization || 'Individual User'}</p>
            </div>
          </div>
          <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
            <CheckCircle className="w-3 h-3 mr-1" />
            Verified
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-slate-400 text-sm">Target</p>
              <p className="text-white font-medium">{certificate.target_description}</p>
            </div>
            <div>
              <p className="text-slate-400 text-sm">Standard</p>
              <p className="text-white font-medium">{certificate.wipe_standard.replace(/_/g, ' ').toUpperCase()}</p>
            </div>
            <div>
              <p className="text-slate-400 text-sm">Issue Date</p>
              <p className="text-white font-medium">
                {format(new Date(certificate.created_date), "MMM d, yyyy")}
              </p>
            </div>
            <div>
              <p className="text-slate-400 text-sm">Expiry Date</p>
              <p className="text-white font-medium">
                {format(new Date(certificate.expiry_date), "MMM d, yyyy")}
              </p>
            </div>
          </div>

          {certificate.compliance_standards && (
            <div>
              <p className="text-slate-400 text-sm mb-2">Compliance Standards</p>
              <div className="flex flex-wrap gap-2">
                {certificate.compliance_standards.map((standard, index) => (
                  <Badge key={index} variant="outline" className="border-blue-500/50 text-blue-300">
                    {standard}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {session && (
            <div className="bg-slate-700/30 rounded-lg p-4">
              <p className="text-slate-400 text-sm mb-2">Session Details</p>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-slate-400">Platform:</span>
                  <span className="text-white ml-2">{session.platform.toUpperCase()}</span>
                </div>
                <div>
                  <span className="text-slate-400">Size:</span>
                  <span className="text-white ml-2">{session.size_gb || 0} GB</span>
                </div>
                <div>
                  <span className="text-slate-400">Duration:</span>
                  <span className="text-white ml-2">{session.duration_minutes || 0} min</span>
                </div>
                <div>
                  <span className="text-slate-400">Health Score:</span>
                  <span className="text-white ml-2">{session.health_score || 0}/100</span>
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-2">
            <Button size="sm" className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-400">
              <Download className="w-4 h-4 mr-2" />
              Download PDF
            </Button>
            <Button size="sm" variant="outline" className="flex-1">
              <ExternalLink className="w-4 h-4 mr-2" />
              Share Link
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  </motion.div>
);

export default function Certificates() {
  const [certificates, setCertificates] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [certsData, sessionsData] = await Promise.all([
        Certificate.list("-created_date"),
        WipeSession.list()
      ]);
      setCertificates(certsData);
      setSessions(sessionsData);
    } catch (error) {
      console.error("Error loading certificates:", error);
    }
    setIsLoading(false);
  };

  const filteredCertificates = certificates.filter(cert =>
    cert.certificate_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (cert.organization && cert.organization.toLowerCase().includes(searchTerm.toLowerCase())) ||
    cert.target_description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getSessionForCertificate = (certificate) => {
    return sessions.find(session => session.id === certificate.session_id);
  };

  return (
    <div className="p-6 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-bold text-white mb-2">Certificates</h1>
          <p className="text-slate-400">Manage and download your data destruction certificates</p>
        </motion.div>

        {/* Search and Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="md:col-span-2 bg-slate-800/30 border-slate-700/50 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                <Input
                  placeholder="Search certificates..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-slate-700/30 border-slate-600 text-white"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/30 border-slate-700/50 backdrop-blur-sm">
            <CardContent className="p-4 text-center">
              <Award className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-white">{certificates.length}</p>
              <p className="text-slate-400 text-sm">Total Certificates</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/30 border-slate-700/50 backdrop-blur-sm">
            <CardContent className="p-4 text-center">
              <Shield className="w-8 h-8 text-green-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-white">
                {certificates.filter(c => c.is_verified).length}
              </p>
              <p className="text-slate-400 text-sm">Verified</p>
            </CardContent>
          </Card>
        </div>

        {/* Certificates Grid */}
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredCertificates.map((certificate) => (
            <CertificateCard 
              key={certificate.id} 
              certificate={certificate}
              session={getSessionForCertificate(certificate)}
            />
          ))}
        </div>

        {filteredCertificates.length === 0 && !isLoading && (
          <motion.div 
            className="text-center py-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Award className="w-24 h-24 text-slate-600 mx-auto mb-4" />
            <h3 className="text-2xl font-semibold text-white mb-2">
              {certificates.length === 0 ? "No certificates yet" : "No matching certificates"}
            </h3>
            <p className="text-slate-400 mb-6">
              {certificates.length === 0 
                ? "Complete your first wipe operation to generate certificates"
                : "Try adjusting your search terms"
              }
            </p>
            {certificates.length === 0 && (
              <Button className="bg-gradient-to-r from-blue-500 to-cyan-400">
                <FileText className="w-4 h-4 mr-2" />
                Start First Wipe
              </Button>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}