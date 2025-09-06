import * as React from "react";
import { cn } from "@/lib/utils"; // Assuming you have this utility

const SidebarProvider = ({ children }) => {
  const [open, setOpen] = React.useState(false);
  const value = { open, setOpen, toggle: () => setOpen((prev) => !prev) };
  return React.createElement(SidebarContext.Provider, { value }, children);
};

const useSidebar = () => {
  const context = React.useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
};

const SidebarContext = React.createContext(null);

const Sidebar = ({ className, children, ...props }) => {
  const { open } = useSidebar();
  return (
    <aside
      className={cn(
        "h-screen w-64 bg-slate-900/95 transition-transform duration-300 ease-in-out transform -translate-x-full md:translate-x-0 fixed z-50 md:sticky md:top-0 md:left-0",
        open && "translate-x-0",
        className
      )}
      {...props}
    >
      {children}
    </aside>
  );
};

const SidebarHeader = ({ className, ...props }) => (
  <div className={cn("px-4 py-6 border-b", className)} {...props} />
);
const SidebarContent = ({ className, ...props }) => (
  <div className={cn("flex-1 overflow-y-auto p-4", className)} {...props} />
);
const SidebarFooter = ({ className, ...props }) => (
  <div className={cn("p-4 border-t", className)} {...props} />
);
const SidebarGroup = ({ className, ...props }) => (
  <div className={cn("mb-6", className)} {...props} />
);
const SidebarGroupLabel = ({ className, ...props }) => (
  <p className={cn("text-xs font-semibold text-slate-400 px-3 py-2", className)} {...props} />
);
const SidebarGroupContent = ({ className, ...props }) => (
  <div className={cn("mt-2 space-y-1", className)} {...props} />
);
const SidebarMenu = ({ className, ...props }) => (
  <div className={cn("space-y-1", className)} {...props} />
);
const SidebarMenuItem = ({ className, ...props }) => (
  <div className={cn("", className)} {...props} />
);
const SidebarMenuButton = React.forwardRef(({ asChild, className, ...props }, ref) => {
  const Comp = asChild ? "div" : "button"; // Use div for Link, button for other cases
  return (
    <Comp
      ref={ref}
      className={cn(
        "flex items-center w-full px-3 py-2 rounded-md transition-colors duration-200 text-left",
        className
      )}
      {...props}
    />
  );
});
SidebarMenuButton.displayName = "SidebarMenuButton";

const SidebarTrigger = ({ className, ...props }) => {
  const { toggle } = useSidebar();
  return (
    <button
      onClick={toggle}
      className={cn(
        "md:hidden p-2 rounded-lg transition-colors duration-200 text-white",
        className
      )}
      {...props}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 6h16M4 12h16m-7 6h7"
        />
      </svg>
    </button>
  );
};

export {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
};