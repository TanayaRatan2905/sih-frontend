import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { WipeSession } from "@/entities/WipeSession";
import { Certificate } from "@/entities/Certificate";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';
import { 
  Activity, 
  Award, 
  CheckCircle, 
  Clock, 
  Database, 
  HardDrive, 
  Shield, 
  Zap,
  TrendingUp,
  AlertTriangle
} from "lucide-react";
import { motion } from "framer-motion";
import { format } from "date-fns";

const StatCard = ({ title, value, icon: Icon, color, trend, subtitle }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <Card className="bg-slate-800/30 border-slate-700/50 backdrop-blur-sm hover:bg-slate-800/50 transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-400 font-medium">{title}</p>
            <p className="text-3xl font-bold text-white mt-1">{value}</p>
            {subtitle && <p className="text-sm text-slate-300 mt-1">{subtitle}</p>}
            {trend && (
              <div className="flex items-center mt-2">
                <TrendingUp className="w-4 h-4 text-green-400 mr-1" />
                <span className="text-sm text-green-400">{trend}</span>
              </div>
            )}
          </div>
          <div className={`p-3 rounded-lg bg-${color}-500/20`}>
            <Icon className={`w-8 h-8 text-${color}-400`} />
          </div>
        </div>
      </CardContent>
    </Card>
  </motion.div>
);

export default function Dashboard() {
  const [sessions, setSessions] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [sessionsData, certificatesData] = await Promise.all([
        WipeSession.list("-created_date"),
        Certificate.list("-created_date")
      ]);
      setSessions(sessionsData);
      setCertificates(certificatesData);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    }
    setIsLoading(false);
  };

  const getStats = () => {
    const completedSessions = sessions.filter(s => s.status === 'completed');
    const totalDataWiped = completedSessions.reduce((sum, s) => sum + (s.size_gb || 0), 0);
    const avgHealthScore = sessions.length > 0 
      ? Math.round(sessions.reduce((sum, s) => sum + (s.health_score || 0), 0) / sessions.length)
      : 0;
    
    return {
      totalSessions: sessions.length,
      completedSessions: completedSessions.length,
      totalCertificates: certificates.length,
      totalDataWiped,
      avgHealthScore,
      activeSessions: sessions.filter(s => ['pending', 'wiping', 'health_check'].includes(s.status)).length
    };
  };

  const stats = getStats();

  const platformData = sessions.reduce((acc, session) => {
    acc[session.platform] = (acc[session.platform] || 0) + 1;
    return acc;
  }, {});

  const pieData = Object.entries(platformData).map(([platform, count]) => ({
    name: platform,
    value: count,
    color: {
      windows: '#3b82f6',
      linux: '#10b981',
      android: '#8b5cf6',
      mac: '#f59e0b'
    }[platform] || '#6b7280'
  }));

  const monthlyData = sessions.reduce((acc, session) => {
    const month = format(new Date(session.created_date), 'MMM yyyy');
    acc[month] = (acc[month] || 0) + (session.size_gb || 0);
    return acc;
  }, {});

  const lineData = Object.entries(monthlyData).map(([month, gb]) => ({
    month,
    dataWiped: gb
  }));

  return (
    <div className="p-6 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-bold text-white mb-2">Security Dashboard</h1>
          <p className="text-slate-400">Monitor your data wiping operations and security metrics</p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Sessions"
            value={stats.totalSessions}
            icon={Activity}
            color="blue"
            trend="+12% this month"
          />
          <StatCard
            title="Data Wiped"
            value={`${stats.totalDataWiped.toFixed(1)} GB`}
            icon={HardDrive}
            color="green"
            subtitle="Securely destroyed"
          />
          <StatCard
            title="Certificates"
            value={stats.totalCertificates}
            icon={Award}
            color="yellow"
            trend="+8 this week"
          />
          <StatCard
            title="Avg Health Score"
            value={`${stats.avgHealthScore}/100`}
            icon={Shield}
            color="purple"
            subtitle="AI Analysis"
          />
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* Platform Distribution */}
          <Card className="bg-slate-800/30 border-slate-700/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Database className="w-5 h-5 text-blue-400" />
                Platform Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({name, value}) => `${name}: ${value}`}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Data Wiped Over Time */}
          <Card className="lg:col-span-2 bg-slate-800/30 border-slate-700/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-400" />
                Data Wiped Over Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={lineData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                  <XAxis dataKey="month" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1e293b', 
                      border: '1px solid #475569',
                      borderRadius: '8px'
                    }}
                  />
                  <Line type="monotone" dataKey="dataWiped" stroke="#10b981" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Recent Sessions */}
        <div className="grid lg:grid-cols-2 gap-6">
          <Card className="bg-slate-800/30 border-slate-700/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-400" />
                Recent Sessions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {sessions.slice(0, 5).map((session) => (
                  <div key={session.id} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                    <div>
                      <p className="font-medium text-white">{session.session_name}</p>
                      <p className="text-sm text-slate-400">
                        {session.wipe_type} • {session.platform}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={session.status === 'completed' ? 'default' : 'secondary'}
                        className={
                          session.status === 'completed' 
                            ? 'bg-green-500/20 text-green-300 border-green-500/30'
                            : session.status === 'wiping'
                            ? 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                            : 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
                        }
                      >
                        {session.status}
                      </Badge>
                      {session.status === 'completed' && (
                        <CheckCircle className="w-4 h-4 text-green-400" />
                      )}
                      {session.status === 'wiping' && (
                        <Zap className="w-4 h-4 text-blue-400 animate-pulse" />
                      )}
                    </div>
                  </div>
                ))}
                {sessions.length === 0 && (
                  <div className="text-center py-8">
                    <Activity className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                    <p className="text-slate-400">No sessions yet</p>
                    <p className="text-sm text-slate-500">Start your first wipe to see data here</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/30 border-slate-700/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Award className="w-5 h-5 text-yellow-400" />
                Recent Certificates
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {certificates.slice(0, 5).map((cert) => (
                  <div key={cert.id} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                    <div>
                      <p className="font-medium text-white">{cert.certificate_id}</p>
                      <p className="text-sm text-slate-400">
                        {cert.organization || 'Individual User'}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                        Verified
                      </Badge>
                      <Shield className="w-4 h-4 text-green-400" />
                    </div>
                  </div>
                ))}
                {certificates.length === 0 && (
                  <div className="text-center py-8">
                    <Award className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                    <p className="text-slate-400">No certificates yet</p>
                    <p className="text-sm text-slate-500">Complete a wipe to generate certificates</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}