import React from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Shield, Home, Zap, Award, Settings, BarChart3, FileCheck } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

const navigationItems = [
  {
    title: "Home",
    url: createPageUrl("Home"),
    icon: Home,
  },
  {
    title: "Secure Wipe",
    url: createPageUrl("WipeInterface"),
    icon: Zap,
  },
  {
    title: "Dashboard",
    url: createPageUrl("Dashboard"),
    icon: BarChart3,
  },
  {
    title: "Certificates",
    url: createPageUrl("Certificates"),
    icon: Award,
  },
  {
    title: "Verify Certificate",
    url: createPageUrl("VerifyCertificate"),
    icon: FileCheck,
  },
];

export default function Layout({ children, currentPageName }) {
  const location = useLocation();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <style>
          {`
            :root {
              --sidebar-background: rgba(15, 23, 42, 0.95);
              --sidebar-foreground: rgb(248, 250, 252);
              --sidebar-accent: rgb(59, 130, 246);
              --sidebar-accent-foreground: rgb(248, 250, 252);
              --sidebar-border: rgba(59, 130, 246, 0.2);
            }
            
            .animated-bg {
              background: linear-gradient(45deg, #0f172a, #1e293b, #334155);
              background-size: 400% 400%;
              animation: gradient 8s ease infinite;
            }
            
            @keyframes gradient {
              0% { background-position: 0% 50%; }
              50% { background-position: 100% 50%; }
              100% { background-position: 0% 50%; }
            }
            
            .glow-effect {
              box-shadow: 0 0 20px rgba(59, 130, 246, 0.3);
            }
            
            .sidebar-glow {
              border-right: 1px solid rgba(59, 130, 246, 0.3);
              backdrop-filter: blur(10px);
            }
          `}
        </style>
        
        <Sidebar className="sidebar-glow bg-slate-900/95">
          <SidebarHeader className="border-b border-blue-500/20 p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-lg flex items-center justify-center glow-effect">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-white text-lg">SecureWipe Pro</h2>
                <p className="text-xs text-blue-200">Enterprise Data Security</p>
              </div>
            </div>
          </SidebarHeader>
          
          <SidebarContent className="p-2">
            <SidebarGroup>
              <SidebarGroupLabel className="text-xs font-medium text-blue-300 uppercase tracking-wider px-3 py-2">
                Platform
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {navigationItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton 
                        asChild 
                        className={`hover:bg-blue-500/20 hover:text-blue-200 transition-all duration-300 rounded-lg mb-1 ${
                          location.pathname === item.url ? 'bg-blue-500/30 text-blue-100 glow-effect' : 'text-slate-300'
                        }`}
                      >
                        <Link to={item.url} className="flex items-center gap-3 px-3 py-2">
                          <item.icon className="w-5 h-5" />
                          <span className="font-medium">{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel className="text-xs font-medium text-blue-300 uppercase tracking-wider px-3 py-2">
                Security Status
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <div className="px-3 py-2 space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-slate-300">System Secure</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Shield className="w-4 h-4 text-blue-400" />
                    <span className="text-slate-300">Active Sessions: 0</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Award className="w-4 h-4 text-yellow-400" />
                    <span className="text-slate-300">Certificates: 0</span>
                  </div>
                </div>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className="border-t border-blue-500/20 p-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-cyan-300 rounded-full flex items-center justify-center">
                <Settings className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-white text-sm truncate">Admin User</p>
                <p className="text-xs text-blue-200 truncate">Enterprise License</p>
              </div>
            </div>
          </SidebarFooter>
        </Sidebar>

        <main className="flex-1 flex flex-col overflow-hidden">
          <header className="bg-slate-800/50 border-b border-blue-500/20 px-6 py-4 md:hidden backdrop-blur-sm">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="hover:bg-blue-500/20 p-2 rounded-lg transition-colors duration-200 text-white" />
              <h1 className="text-xl font-semibold text-white">SecureWipe Pro</h1>
            </div>
          </header>

          <div className="flex-1 overflow-auto animated-bg">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}