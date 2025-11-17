import { Search, Bell, User, Sparkles, Menu, X, Building } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "../ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "../ui/sheet";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { motion } from "motion/react";
import { useState } from "react";
import { useTenantContext } from "../../contexts/TenantContext";

interface TopNavBarProps {
  currentCategory: string;
  onCategoryChange: (category: string) => void;
  selectedTeam: string;
  onTeamChange: (team: string) => void;
  onAIAssistantClick: () => void;
  isDarkMode: boolean;
  onDarkModeToggle: () => void;
}

const allCategories = [
  "Marketing",
  "CRM",
  "Orders",
  "Products",
  "Fulfilment",
  "Logistics",
  "Reports",
  "Workspace",
  "Administration",
];

const teams = [
  "Master Admin",
  "Marketing",
  "Sale Team",
  "Operation Team",
  "Administration Team",
  "Accounting",
];

// Department categories for Master Admin
const departmentCategories = [
  "Marketing Team",
  "Sale Team", 
  "HR",
  "Accounting",
  "Administration",
  "Fulfilment"
];

// Department-specific menu items
const departmentMenus: Record<string, string[]> = {
  "Marketing Team": ["Marketing", "Workspace"],
  "Sale Team": ["CRM", "Orders", "Products", "Workspace"],
  "Accounting": ["Reports", "Workspace"],
  "Administration": ["Reports", "Workspace"],
  "Fulfilment": ["Fulfilment", "Logistics", "Workspace"]
};

// Team-based menu filtering
const teamMenus: Record<string, string[]> = {
  "Sale Team": ["Marketing", "CRM", "Orders", "Products", "Fulfilment", "Reports", "Workspace"],
  "Marketing": ["Marketing", "Workspace"],
  "Accounting": ["Reports", "Products", "Orders"],
  "Operation Team": ["Marketing", "CRM", "Orders", "Products", "Fulfilment", "Logistics", "Reports", "Workspace"],
  "Administration Team": ["Reports", "Workspace"],
};

// Primary menu items visible by default for each team
const primaryMenuItems: Record<string, string[]> = {
  "Sale Team": ["CRM", "Orders", "Products", "Workspace"],
  "Operation Team": ["Fulfilment", "Logistics", "Workspace"],
  "Accounting": ["Reports", "Workspace"],
  "Administration Team": ["Reports", "Workspace"],
};

export function TopNavBar({
  currentCategory,
  onCategoryChange,
  selectedTeam,
  onTeamChange,
  onAIAssistantClick,
  isDarkMode,
  onDarkModeToggle,
}: TopNavBarProps) {
  const { currentTenantId, setCurrentTenantId, tenants, loading: tenantsLoading } = useTenantContext();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null);
  const [hoveredDepartment, setHoveredDepartment] = useState<string | null>(null);
  
  const currentTenant = tenants.find(t => t.id === currentTenantId);
  
  // Master Admin uses department categories
  const isMasterAdmin = selectedTeam === "Master Admin";
  
  // Get visible categories based on selected team
  const visibleCategories = teamMenus[selectedTeam] || allCategories;
  
  // Use primary menu items for teams, or department categories for Master Admin
  const displayedCategories = isMasterAdmin 
    ? departmentCategories 
    : (primaryMenuItems[selectedTeam] || visibleCategories);
  
  // Get department menu items if a department is selected
  const departmentItems = selectedDepartment ? departmentMenus[selectedDepartment] || [] : [];

  const handleCategoryClick = (category: string) => {
    onCategoryChange(category);
    setIsMobileMenuOpen(false);
  };
  
  const handleDepartmentClick = (department: string) => {
    // Map department to category page (main page for each department)
    const departmentToCategoryMap: Record<string, string> = {
      "Marketing Team": "Marketing",
      "Sale Team": "CRM",
      "HR": "HR",
      "Accounting": "Finance",
      "Administration": "Administration",
      "Fulfilment": "Fulfilment"
    };
    
    const categoryPage = departmentToCategoryMap[department];
    
    // Set this as the selected department (keeps submenu visible)
    setSelectedDepartment(department);
    
    // Navigate to the department's main page WITHOUT changing team
    // This allows Master Admin to view department pages while staying as Master Admin
    if (categoryPage) {
      onCategoryChange(categoryPage);
    }
  };
  
  const handleDepartmentHover = (department: string | null) => {
    setHoveredDepartment(department);
  };

  return (
    <div className="sticky top-0 z-40 w-full border-b backdrop-blur-xl bg-glass-bg border-glass-border">
      <div className="flex items-center justify-between min-h-16 py-2 px-4 sm:px-6 gap-2 sm:gap-4">
        {/* Left: Brand Logo */}
        <button
          onClick={() => onCategoryChange("Home")}
          className="flex items-center gap-2 hover:opacity-80 transition-opacity flex-shrink-0"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#4B6BFB] to-[#6B8AFF] flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="hidden sm:block font-semibold tracking-tight bg-gradient-to-r from-[#4B6BFB] to-[#6B8AFF] bg-clip-text text-transparent">
            AI Orchestra ERP
          </span>
        </button>

        {/* Center: Main Categories Menu - Desktop Only */}
        <div className="hidden lg:flex flex-col items-center flex-1 px-2">
          {/* Department Categories for Master Admin or Regular Menu */}
          <div className="flex items-center gap-1 justify-center flex-wrap">
            {displayedCategories.map((category) => (
              <button
                key={category}
                onClick={() => isMasterAdmin ? handleDepartmentClick(category) : handleCategoryClick(category)}
                onMouseEnter={() => isMasterAdmin ? handleDepartmentHover(category) : null}
                onMouseLeave={() => isMasterAdmin ? handleDepartmentHover(null) : null}
                className="relative px-3 py-2 rounded-lg transition-colors hover:bg-accent/50 whitespace-nowrap"
              >
                <span className={
                  isMasterAdmin 
                    ? (selectedDepartment === category ? "opacity-100" : "opacity-60")
                    : (currentCategory === category ? "opacity-100" : "opacity-60")
                }>
                  {category}
                </span>
                {((isMasterAdmin && selectedDepartment === category) || (!isMasterAdmin && currentCategory === category)) && (
                  <motion.div
                    layoutId="activeCategory"
                    className="absolute inset-0 bg-gradient-to-r from-[#4B6BFB]/20 to-[#6B8AFF]/20 rounded-lg border border-[#4B6BFB]/30"
                    initial={false}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </div>
          
          {/* Department Menu Items - Only for Master Admin (Show on hover or when selected) */}
          {isMasterAdmin && (hoveredDepartment || selectedDepartment) && departmentMenus[hoveredDepartment || selectedDepartment || ""] && (
            <motion.div 
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="relative flex items-center gap-2 justify-center flex-wrap mt-3 pt-3 pb-1 px-4"
              onMouseEnter={() => setHoveredDepartment(hoveredDepartment || selectedDepartment)}
              onMouseLeave={() => setHoveredDepartment(null)}
            >
              {/* Futuristic gradient backdrop */}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-cyan-500/10 backdrop-blur-sm border border-white/10" />
              
              {departmentMenus[hoveredDepartment || selectedDepartment || ""].map((item, index) => (
                <motion.button
                  key={item}
                  onClick={() => handleCategoryClick(item)}
                  initial={{ opacity: 0, scale: 0.8, x: -20 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.2 }}
                  className="relative group px-4 py-2 rounded-lg text-sm transition-all duration-300 hover:scale-105 whitespace-nowrap"
                >
                  {/* Gradient border glow effect */}
                  <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-cyan-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm" />
                  
                  {/* Button background */}
                  <div className={`absolute inset-0 rounded-lg transition-all duration-300 ${
                    currentCategory === item
                      ? "bg-gradient-to-r from-pink-500/30 via-purple-500/30 to-cyan-500/30 border border-pink-300/50 shadow-lg shadow-purple-500/20"
                      : "bg-glass-bg/50 border border-white/5 group-hover:border-purple-300/30"
                  }`} />
                  
                  {/* Animated shine effect */}
                  {currentCategory === item && (
                    <motion.div
                      className="absolute inset-0 rounded-lg overflow-hidden"
                      initial={false}
                    >
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                        animate={{
                          x: ["-100%", "100%"],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                      />
                    </motion.div>
                  )}
                  
                  <span className={`relative z-10 transition-all duration-300 ${
                    currentCategory === item 
                      ? "text-foreground font-medium" 
                      : "text-foreground/70 group-hover:text-foreground"
                  }`}>
                    {item}
                  </span>
                  
                  {/* Active indicator dot */}
                  {currentCategory === item && (
                    <motion.div
                      layoutId="activeDepartmentDot"
                      className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-gradient-to-r from-pink-400 to-cyan-400"
                      initial={false}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    >
                      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-pink-400 to-cyan-400 animate-ping opacity-75" />
                    </motion.div>
                  )}
                </motion.button>
              ))}
            </motion.div>
          )}
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Tenant Selector - Desktop */}
          <div className="hidden md:block">
            <Select
              value={currentTenantId?.toString() || ""}
              onValueChange={(value) => setCurrentTenantId(parseInt(value, 10))}
            >
              <SelectTrigger className="w-[180px] bg-glass-bg/50 border-glass-border">
                <Building className="w-4 h-4 mr-2 opacity-60" />
                <SelectValue placeholder="Select tenant" />
              </SelectTrigger>
              <SelectContent>
                {tenantsLoading ? (
                  <div className="px-2 py-1.5 text-sm text-muted-foreground">Loading tenants...</div>
                ) : tenants.length === 0 ? (
                  <div className="px-2 py-1.5 text-sm text-muted-foreground">No tenants available</div>
                ) : (
                  tenants.map((tenant) => (
                    <SelectItem key={tenant.id} value={tenant.id.toString()}>
                      {tenant.name}
                      {tenant.status !== 'active' && ` (${tenant.status})`}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Global Search - Desktop */}
          <div className="hidden md:block relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-40" />
            <Input
              type="search"
              placeholder="Search..."
              className="w-40 lg:w-64 pl-9 bg-glass-bg/50 border-glass-border"
            />
          </div>

          {/* Global Search - Mobile */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsSearchOpen(!isSearchOpen)}
          >
            <Search className="w-5 h-5" />
          </Button>

          {/* AI Assistant Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onAIAssistantClick}
            className="relative flex-shrink-0"
          >
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-0 rounded-full bg-[#4B6BFB]/20"
            />
            <Sparkles className="w-5 h-5 text-[#4B6BFB]" />
          </Button>

          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative flex-shrink-0 hidden sm:flex">
            <Bell className="w-5 h-5" />
            <Badge className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center p-0 bg-[#4B6BFB]">
              3
            </Badge>
          </Button>

          {/* User Profile with Team Selector */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 px-2 sm:px-3 py-2 rounded-lg hover:bg-accent/50 transition-colors flex-shrink-0">
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="bg-[#4B6BFB] text-white">AN</AvatarFallback>
                </Avatar>
                <div className="hidden sm:flex flex-col items-start">
                  <span>Anna</span>
                  <span className="opacity-60 text-xs">{selectedTeam}</span>
                </div>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="px-2 py-1.5 opacity-60">Switch Team</div>
              {teams.map((team) => (
                <DropdownMenuItem
                  key={team}
                  onClick={() => onTeamChange(team)}
                  className={selectedTeam === team ? "bg-accent" : ""}
                >
                  {team}
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile Settings</DropdownMenuItem>
              <DropdownMenuItem>My Workspace</DropdownMenuItem>
              <DropdownMenuItem onClick={onDarkModeToggle}>
                {isDarkMode ? "Light Mode" : "Dark Mode"}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Log Out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden flex-shrink-0"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Mobile Search Bar */}
      {isSearchOpen && (
        <div className="md:hidden px-4 pb-3 space-y-3">
          {/* Tenant Selector - Mobile */}
          <Select
            value={currentTenantId?.toString() || ""}
            onValueChange={(value) => setCurrentTenantId(parseInt(value, 10))}
          >
            <SelectTrigger className="w-full bg-glass-bg/50 border-glass-border">
              <Building className="w-4 h-4 mr-2 opacity-60" />
              <SelectValue placeholder="Select tenant" />
            </SelectTrigger>
            <SelectContent>
              {tenantsLoading ? (
                <div className="px-2 py-1.5 text-sm text-muted-foreground">Loading tenants...</div>
              ) : tenants.length === 0 ? (
                <div className="px-2 py-1.5 text-sm text-muted-foreground">No tenants available</div>
              ) : (
                tenants.map((tenant) => (
                  <SelectItem key={tenant.id} value={tenant.id.toString()}>
                    {tenant.name}
                    {tenant.status !== 'active' && ` (${tenant.status})`}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
          
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-40" />
            <Input
              type="search"
              placeholder="Search..."
              className="w-full pl-9 bg-glass-bg/50 border-glass-border"
              autoFocus
            />
          </div>
        </div>
      )}

      {/* Mobile Menu Sheet */}
      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetContent side="left" className="w-72 p-0">
          <SheetHeader className="p-6 border-b">
            <SheetTitle className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#4B6BFB] to-[#6B8AFF] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              Menu
            </SheetTitle>
          </SheetHeader>
          <div className="p-4 space-y-2">
            {isMasterAdmin ? (
              // Master Admin: Show departments with sub-menus
              displayedCategories.map((department) => (
                <div key={department} className="space-y-1">
                  <button
                    onClick={() => handleDepartmentClick(department)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                      selectedDepartment === department
                        ? "bg-gradient-to-r from-[#4B6BFB]/20 to-[#6B8AFF]/20 border border-[#4B6BFB]/30"
                        : "hover:bg-accent/50"
                    }`}
                  >
                    {department}
                  </button>
                  {selectedDepartment === department && departmentMenus[department] && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="ml-2 mt-2 space-y-1.5 relative"
                    >
                      {/* Gradient border on left */}
                      <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-pink-500/50 via-purple-500/50 to-cyan-500/50 rounded-full" />
                      
                      <div className="ml-2 space-y-1.5">
                        {departmentMenus[department].map((item, index) => (
                          <motion.button
                            key={item}
                            onClick={() => handleCategoryClick(item)}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className={`relative group w-full text-left px-4 py-2.5 rounded-lg text-sm transition-all duration-300 ${
                              currentCategory === item
                                ? "bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-cyan-500/20 border border-pink-300/50 shadow-lg shadow-purple-500/10"
                                : "hover:bg-gradient-to-r hover:from-pink-500/10 hover:via-purple-500/10 hover:to-cyan-500/10 hover:border-purple-300/30 border border-transparent"
                            }`}
                          >
                            <span className={`${
                              currentCategory === item 
                                ? "text-foreground font-medium" 
                                : "text-foreground/70 group-hover:text-foreground"
                            }`}>
                              {item}
                            </span>
                            
                            {/* Active indicator */}
                            {currentCategory === item && (
                              <div className="absolute right-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-gradient-to-r from-pink-400 to-cyan-400">
                                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-pink-400 to-cyan-400 animate-ping opacity-75" />
                              </div>
                            )}
                          </motion.button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </div>
              ))
            ) : (
              // Other teams: Show regular menu
              displayedCategories.map((category) => (
                <button
                  key={category}
                  onClick={() => handleCategoryClick(category)}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                    currentCategory === category
                      ? "bg-gradient-to-r from-[#4B6BFB]/20 to-[#6B8AFF]/20 border border-[#4B6BFB]/30"
                      : "hover:bg-accent/50"
                  }`}
                >
                  {category}
                </button>
              ))
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
