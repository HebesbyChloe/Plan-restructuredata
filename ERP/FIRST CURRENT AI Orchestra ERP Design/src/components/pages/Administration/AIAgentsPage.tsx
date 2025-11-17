"use client";

import { useState, useMemo, useEffect, useCallback, memo, useRef } from "react";
import { Card } from "../../ui/card";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Textarea } from "../../ui/textarea";
import { Badge } from "../../ui/badge";
import { Switch } from "../../ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../../ui/sheet";
import {
  Bot,
  Plus,
  Search,
  Edit,
  Trash2,
  Loader2,
  Sparkles,
  Settings,
} from "lucide-react";
import { useTenantContext } from "../../../contexts/TenantContext";
import { useAgents, useAgentSeedData } from "../../../hooks/useAgents";
import { supabase } from "../../../lib/supabase/client";
import type { AiAgent } from "../../../types/database/ai";
import { toast } from "sonner";
import type { AiAgentInsert, AiAgentUpdate, AiSeedDataInsert } from "../../../types/database/ai";

const DEPARTMENTS = [
  { value: "orders", label: "Orders" },
  { value: "products", label: "Products" },
  { value: "logistics", label: "Logistics" },
  { value: "fulfillment", label: "Fulfillment" },
  { value: "crm", label: "CRM" },
  { value: "marketing", label: "Marketing" },
  { value: "administration", label: "Administration" },
];

const ICON_OPTIONS = [
  { value: "ShoppingCart", label: "Shopping Cart" },
  { value: "Truck", label: "Truck" },
  { value: "Users", label: "Users" },
  { value: "Package", label: "Package" },
  { value: "BarChart3", label: "Bar Chart" },
  { value: "TrendingUp", label: "Trending Up" },
  { value: "AlertCircle", label: "Alert Circle" },
  { value: "Clock", label: "Clock" },
  { value: "CheckCircle", label: "Check Circle" },
  { value: "Sparkles", label: "Sparkles" },
  { value: "Bot", label: "Bot" },
  { value: "Settings", label: "Settings" },
];

export function AIAgentsPage() {
  const { currentTenantId } = useTenantContext();
  const { agents, loading, error, createAgent, updateAgent, deleteAgent, refresh } = useAgents(undefined, currentTenantId);
  const [rawAgents, setRawAgents] = useState<AiAgent[]>([]);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingAgentId, setEditingAgentId] = useState<string | null>(null);
  
  // Use refs to maintain input focus
  const inputRefs = useRef<{ [key: string]: HTMLInputElement | HTMLTextAreaElement | null }>({});
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);
  const [isSeedDataDialogOpen, setIsSeedDataDialogOpen] = useState(false);
  
  const [agentForm, setAgentForm] = useState<AiAgentInsert>({
    id: "",
    name: "",
    description: "",
    quote: "",
    department: ["orders"], // Now an array
    api_endpoint: null,
    api_key: null,
    icon_name: "Bot",
    color: "#4B6BFB",
    gradient: "from-[#4B6BFB] to-[#6B8AFF]",
    is_active: true,
    metadata: {},
    tenant_id: currentTenantId || null,
  });

  const { seedData, createSeedData, deleteSeedData, loading: seedDataLoading } = useAgentSeedData(selectedAgentId || "dummy-id-to-prevent-empty-string");
  const [newSeedDataText, setNewSeedDataText] = useState("");
  const [newSeedDataIcon, setNewSeedDataIcon] = useState("Sparkles");
  const [newSeedDataColor, setNewSeedDataColor] = useState("#4B6BFB");

  // Load raw agent data for editing
  useEffect(() => {
    loadRawAgents();
  }, [currentTenantId]);

  const loadRawAgents = async () => {
    try {
      let query = supabase
        .from('ai_agents')
        .select('*')
        .eq('is_active', true);

      if (currentTenantId) {
        query = query.eq('tenant_id', currentTenantId);
      } else {
        query = query.is('tenant_id', null);
      }

      const { data, error } = await query.order('name', { ascending: true });
      if (error) throw error;
      setRawAgents(data || []);
    } catch (error) {
      console.error('Error loading raw agents:', error);
    }
  };

  const filteredAgents = useMemo(() => {
    if (!searchTerm) return agents;
    const term = searchTerm.toLowerCase();
    return agents.filter(
      (agent) =>
        agent.name.toLowerCase().includes(term) ||
        agent.description.toLowerCase().includes(term) ||
        agent.id.toLowerCase().includes(term)
    );
  }, [agents, searchTerm]);

  const handleCreateAgent = async () => {
    if (!agentForm.id || !agentForm.name || !Array.isArray(agentForm.department)) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      // Ensure tenant_id is set
      const agentData = {
        ...agentForm,
        tenant_id: currentTenantId || null,
      };
      
      await createAgent(agentData);
      await loadRawAgents();
      await refresh();
      toast.success("Agent created successfully");
      setIsCreateDialogOpen(false);
      // Reset form after successful creation
      setAgentForm({
        id: "",
        name: "",
        description: "",
        quote: "",
        department: ["orders"],
        api_endpoint: null,
        api_key: null,
        icon_name: "Bot",
        color: "#4B6BFB",
        gradient: "from-[#4B6BFB] to-[#6B8AFF]",
        is_active: true,
        metadata: {},
        tenant_id: currentTenantId || null,
      });
    } catch (error: any) {
      toast.error("Failed to create agent: " + error.message);
    }
  };

  const handleEditAgent = async () => {
    if (!editingAgentId) return;

    try {
      const updates: AiAgentUpdate = {
        name: agentForm.name,
        description: agentForm.description || null,
        quote: agentForm.quote || null,
        department: agentForm.department,
        api_endpoint: agentForm.api_endpoint || null,
        api_key: agentForm.api_key || null,
        icon_name: agentForm.icon_name || null,
        color: agentForm.color,
        gradient: agentForm.gradient,
        is_active: agentForm.is_active,
        metadata: agentForm.metadata,
      };

      await updateAgent(editingAgentId, updates);
      await loadRawAgents();
      await refresh();
      toast.success("Agent updated successfully");
      setIsEditDialogOpen(false);
      setEditingAgentId(null);
    } catch (error: any) {
      toast.error("Failed to update agent: " + error.message);
    }
  };

  const handleDeleteAgent = async (id: string) => {
    if (!confirm("Are you sure you want to delete this agent? This will also delete all associated seed data.")) {
      return;
    }

    try {
      await deleteAgent(id);
      await loadRawAgents();
      await refresh();
      toast.success("Agent deleted successfully");
    } catch (error: any) {
      toast.error("Failed to delete agent: " + error.message);
    }
  };

  const openEditDialog = (agentId: string) => {
    const agent = rawAgents.find(a => a.id === agentId);
    if (!agent) return;
    
    // Ensure department is an array
    const departmentArray = Array.isArray(agent.department) 
      ? agent.department 
      : (agent.department ? [agent.department] : []);
    
    setEditingAgentId(agent.id);
    setAgentForm({
      id: agent.id,
      name: agent.name,
      description: agent.description || "",
      quote: agent.quote || "",
      department: departmentArray,
      api_endpoint: agent.api_endpoint || null,
      api_key: agent.api_key || null,
      icon_name: agent.icon_name || "Bot",
      color: agent.color,
      gradient: agent.gradient,
      is_active: agent.is_active,
      metadata: agent.metadata || {},
      tenant_id: agent.tenant_id || currentTenantId || null,
    });
    setIsEditDialogOpen(true);
  };

  const handleCreateSeedData = async () => {
    if (!selectedAgentId || !newSeedDataText.trim()) {
      toast.error("Please enter seed data text");
      return;
    }

    try {
      await createSeedData({
        agent_id: selectedAgentId,
        text: newSeedDataText,
        icon_name: newSeedDataIcon,
        color: newSeedDataColor,
        display_order: seedData.length,
      });
      toast.success("Seed data created successfully");
      setNewSeedDataText("");
      setNewSeedDataIcon("Sparkles");
      setNewSeedDataColor("#4B6BFB");
    } catch (error: any) {
      toast.error("Failed to create seed data: " + error.message);
    }
  };

  // Memoized handlers to prevent re-renders
  const handleIdChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newId = e.target.value.toLowerCase().replace(/\s+/g, '-');
    setAgentForm(prev => ({ ...prev, id: newId }));
  }, []);

  const handleNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setAgentForm(prev => ({ ...prev, name: e.target.value }));
  }, []);

  const handleDescriptionChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setAgentForm(prev => ({ ...prev, description: e.target.value }));
  }, []);

  const handleQuoteChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setAgentForm(prev => ({ ...prev, quote: e.target.value }));
  }, []);

  const handleColorChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setAgentForm(prev => ({ ...prev, color: e.target.value }));
  }, []);

  const handleGradientChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setAgentForm(prev => ({ ...prev, gradient: e.target.value }));
  }, []);

  const handleApiEndpointChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setAgentForm(prev => ({ ...prev, api_endpoint: e.target.value || null }));
  }, []);

  const handleApiKeyChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setAgentForm(prev => ({ ...prev, api_key: e.target.value || null }));
  }, []);

  const handleIconChange = useCallback((value: string) => {
    setAgentForm(prev => ({ ...prev, icon_name: value }));
  }, []);

  const handleActiveChange = useCallback((checked: boolean) => {
    setAgentForm(prev => ({ ...prev, is_active: checked }));
  }, []);

  const handleDepartmentToggle = useCallback((deptValue: string) => {
    setAgentForm(prev => {
      const isSelected = prev.department.includes(deptValue);
      return {
        ...prev,
        department: isSelected
          ? prev.department.filter(d => d !== deptValue)
          : [...prev.department, deptValue]
      };
    });
  }, []);

  // Form fields - handlers are memoized, so inputs should maintain focus
  const formFieldsJSX = (
    <div className="space-y-4">
      <div>
        <label className="text-sm mb-2 block">Agent ID *</label>
        <Input
          value={agentForm.id}
          onChange={handleIdChange}
          placeholder="order-manager"
          className="bg-[#F8F8F8] dark:bg-muted border-[#E5E5E5]"
          disabled={!!editingAgentId}
        />
        <p className="text-xs text-muted-foreground mt-1">Unique identifier (e.g., "order-manager")</p>
      </div>
      <div>
        <label className="text-sm mb-2 block">Name *</label>
        <Input
          value={agentForm.name}
          onChange={handleNameChange}
          placeholder="Order Manager AI"
          className="bg-[#F8F8F8] dark:bg-muted border-[#E5E5E5]"
        />
      </div>
      <div>
        <label className="text-sm mb-2 block">Description</label>
        <Textarea
          value={agentForm.description || ""}
          onChange={handleDescriptionChange}
          placeholder="Agent description..."
          className="bg-[#F8F8F8] dark:bg-muted border-[#E5E5E5]"
          rows={3}
        />
      </div>
      <div>
        <label className="text-sm mb-2 block">Quote</label>
        <Input
          value={agentForm.quote || ""}
          onChange={handleQuoteChange}
          placeholder="Inspirational quote..."
          className="bg-[#F8F8F8] dark:bg-muted border-[#E5E5E5]"
        />
      </div>
      <div>
        <label className="text-sm mb-2 block">Departments * (Select multiple, empty = global)</label>
        <div className="flex flex-wrap gap-2 mb-2">
          {DEPARTMENTS.map((dept) => {
            const isSelected = agentForm.department.includes(dept.value);
            return (
              <button
                key={dept.value}
                type="button"
                onClick={() => handleDepartmentToggle(dept.value)}
                className={`px-3 py-1.5 rounded-lg text-sm border transition-colors ${
                  isSelected
                    ? "bg-[#4B6BFB] text-white border-[#4B6BFB]"
                    : "bg-[#F8F8F8] dark:bg-muted border-[#E5E5E5] hover:bg-[#E5E5E5]"
                }`}
              >
                {dept.label}
              </button>
            );
          })}
        </div>
        <p className="text-xs text-muted-foreground">
          {agentForm.department.length === 0 
            ? "No departments selected = Global agent (available to all departments)"
            : `Selected: ${agentForm.department.join(", ")}`}
        </p>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm mb-2 block">Icon</label>
          <Select
            value={agentForm.icon_name || "Bot"}
            onValueChange={handleIconChange}
          >
            <SelectTrigger className="bg-[#F8F8F8] dark:bg-muted border-[#E5E5E5]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-card">
              {ICON_OPTIONS.map((icon) => (
                <SelectItem key={icon.value} value={icon.value}>
                  {icon.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm mb-2 block">Color</label>
          <Input
            type="color"
            value={agentForm.color}
            onChange={handleColorChange}
            className="h-10"
          />
        </div>
        <div>
          <label className="text-sm mb-2 block">Gradient</label>
          <Input
            value={agentForm.gradient}
            onChange={handleGradientChange}
            placeholder="from-[#4B6BFB] to-[#6B8AFF]"
            className="bg-[#F8F8F8] dark:bg-muted border-[#E5E5E5]"
          />
        </div>
      </div>
      <div>
        <label className="text-sm mb-2 block">API Endpoint (Optional)</label>
        <Input
          value={agentForm.api_endpoint || ""}
          onChange={handleApiEndpointChange}
          placeholder="https://api.example.com/chat"
          className="bg-[#F8F8F8] dark:bg-muted border-[#E5E5E5]"
        />
        <p className="text-xs text-muted-foreground mt-1">Custom API endpoint for this agent</p>
      </div>
      <div>
        <label className="text-sm mb-2 block">API Key (Optional)</label>
        <Input
          type="password"
          value={agentForm.api_key || ""}
          onChange={handleApiKeyChange}
          placeholder="Enter API key"
          className="bg-[#F8F8F8] dark:bg-muted border-[#E5E5E5]"
        />
      </div>
      <div className="flex items-center gap-3">
        <Switch
          checked={agentForm.is_active}
          onCheckedChange={handleActiveChange}
        />
        <label className="text-sm">Active</label>
      </div>
      <div className="pt-2 border-t">
        <p className="text-xs text-muted-foreground">
          Tenant ID: {currentTenantId ? `#${currentTenantId}` : "Global (no tenant)"}
        </p>
      </div>
    </div>
  );
  
  const editFormFieldsJSX = (
    <div className="space-y-4">
      <div>
        <label className="text-sm mb-2 block">Agent ID *</label>
        <Input
          value={agentForm.id}
          onChange={handleIdChange}
          placeholder="order-manager"
          className="bg-[#F8F8F8] dark:bg-muted border-[#E5E5E5]"
          disabled={!!editingAgentId}
        />
        <p className="text-xs text-muted-foreground mt-1">Unique identifier (e.g., "order-manager")</p>
      </div>
      <div>
        <label className="text-sm mb-2 block">Name *</label>
        <Input
          value={agentForm.name}
          onChange={handleNameChange}
          placeholder="Order Manager AI"
          className="bg-[#F8F8F8] dark:bg-muted border-[#E5E5E5]"
        />
      </div>
      <div>
        <label className="text-sm mb-2 block">Description</label>
        <Textarea
          value={agentForm.description || ""}
          onChange={handleDescriptionChange}
          placeholder="Agent description..."
          className="bg-[#F8F8F8] dark:bg-muted border-[#E5E5E5]"
          rows={3}
        />
      </div>
      <div>
        <label className="text-sm mb-2 block">Quote</label>
        <Input
          value={agentForm.quote || ""}
          onChange={handleQuoteChange}
          placeholder="Inspirational quote..."
          className="bg-[#F8F8F8] dark:bg-muted border-[#E5E5E5]"
        />
      </div>
      <div>
        <label className="text-sm mb-2 block">Departments * (Select multiple, empty = global)</label>
        <div className="flex flex-wrap gap-2 mb-2">
          {DEPARTMENTS.map((dept) => {
            const isSelected = agentForm.department.includes(dept.value);
            return (
              <button
                key={dept.value}
                type="button"
                onClick={() => handleDepartmentToggle(dept.value)}
                className={`px-3 py-1.5 rounded-lg text-sm border transition-colors ${
                  isSelected
                    ? "bg-[#4B6BFB] text-white border-[#4B6BFB]"
                    : "bg-[#F8F8F8] dark:bg-muted border-[#E5E5E5] hover:bg-[#E5E5E5]"
                }`}
              >
                {dept.label}
              </button>
            );
          })}
        </div>
        <p className="text-xs text-muted-foreground">
          {agentForm.department.length === 0 
            ? "No departments selected = Global agent (available to all departments)"
            : `Selected: ${agentForm.department.join(", ")}`}
        </p>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm mb-2 block">Icon</label>
          <Select
            value={agentForm.icon_name || "Bot"}
            onValueChange={handleIconChange}
          >
            <SelectTrigger className="bg-[#F8F8F8] dark:bg-muted border-[#E5E5E5]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-card">
              {ICON_OPTIONS.map((icon) => (
                <SelectItem key={icon.value} value={icon.value}>
                  {icon.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm mb-2 block">Color</label>
          <Input
            type="color"
            value={agentForm.color}
            onChange={handleColorChange}
            className="h-10"
          />
        </div>
        <div>
          <label className="text-sm mb-2 block">Gradient</label>
          <Input
            value={agentForm.gradient}
            onChange={handleGradientChange}
            placeholder="from-[#4B6BFB] to-[#6B8AFF]"
            className="bg-[#F8F8F8] dark:bg-muted border-[#E5E5E5]"
          />
        </div>
      </div>
      <div>
        <label className="text-sm mb-2 block">API Endpoint (Optional)</label>
        <Input
          value={agentForm.api_endpoint || ""}
          onChange={handleApiEndpointChange}
          placeholder="https://api.example.com/chat"
          className="bg-[#F8F8F8] dark:bg-muted border-[#E5E5E5]"
        />
        <p className="text-xs text-muted-foreground mt-1">Custom API endpoint for this agent</p>
      </div>
      <div>
        <label className="text-sm mb-2 block">API Key (Optional)</label>
        <Input
          type="password"
          value={agentForm.api_key || ""}
          onChange={handleApiKeyChange}
          placeholder="Enter API key"
          className="bg-[#F8F8F8] dark:bg-muted border-[#E5E5E5]"
        />
      </div>
      <div className="flex items-center gap-3">
        <Switch
          checked={agentForm.is_active}
          onCheckedChange={handleActiveChange}
        />
        <label className="text-sm">Active</label>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-1">AI Agents</h1>
          <p className="text-muted-foreground mb-0">
            Manage AI agents across departments. Configure API endpoints and customize agent behavior.
          </p>
        </div>
        <Sheet open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <SheetTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Create Agent
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-full sm:w-[600px] lg:w-[700px] flex flex-col p-0" key="create-agent-sheet">
            <SheetHeader className="px-6 pt-6 pb-4 border-b">
              <SheetTitle>Create AI Agent</SheetTitle>
              <SheetDescription>
                Add a new AI agent for a specific department
              </SheetDescription>
            </SheetHeader>
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {formFieldsJSX}
            </div>
            <SheetFooter className="px-6 py-4 border-t bg-white dark:bg-card">
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateAgent}>Create Agent</Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>

      <Card className="p-6 bg-white dark:bg-card border-[#E5E5E5]">
        <div className="flex items-center gap-4 mb-4">
          <div className="flex-1">
            <Input
              placeholder="Search agents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm bg-[#F8F8F8] dark:bg-muted border-[#E5E5E5]"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            <span className="ml-2 text-sm text-muted-foreground">Loading agents...</span>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-12">
            <p className="text-sm text-destructive mb-2">Error loading agents: {error.message}</p>
            <Button variant="outline" size="sm" onClick={() => refresh()}>
              Retry
            </Button>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Agent</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>API Endpoint</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAgents.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    No agents found
                  </TableCell>
                </TableRow>
              ) : (
                filteredAgents.map((agent) => {
                  const rawAgent = rawAgents.find(a => a.id === agent.id);
                  return (
                    <TableRow key={agent.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div
                            className="w-10 h-10 rounded-lg flex items-center justify-center"
                            style={{ backgroundColor: `${agent.color}20` }}
                          >
                            <Bot className="w-5 h-5" style={{ color: agent.color }} />
                          </div>
                          <div>
                            <div className="font-medium">{agent.name}</div>
                            <div className="text-xs text-muted-foreground">{agent.id}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {rawAgent?.department && Array.isArray(rawAgent.department) && rawAgent.department.length > 0 ? (
                            rawAgent.department.map((dept: string, idx: number) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {dept}
                              </Badge>
                            ))
                          ) : (
                            <Badge variant="default" className="text-xs">Global</Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">
                          {rawAgent?.api_endpoint || "Default service"}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge variant={rawAgent?.is_active !== false ? "default" : "secondary"}>
                          {rawAgent?.is_active !== false ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedAgentId(agent.id);
                              setIsSeedDataDialogOpen(true);
                            }}
                          >
                            <Sparkles className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openEditDialog(agent.id)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteAgent(agent.id)}
                            className="text-red-600"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        )}
      </Card>

      {/* Edit Dialog */}
      <Sheet open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <SheetContent side="right" className="w-full sm:w-[600px] lg:w-[700px] flex flex-col p-0">
          <SheetHeader className="px-6 pt-6 pb-4 border-b">
            <SheetTitle>Edit AI Agent</SheetTitle>
            <SheetDescription>
              Update agent configuration
            </SheetDescription>
          </SheetHeader>
          <div className="flex-1 overflow-y-auto px-6 py-4">
            {editFormFieldsJSX}
          </div>
          <SheetFooter className="px-6 py-4 border-t bg-white dark:bg-card">
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditAgent}>Update Agent</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* Seed Data Dialog */}
      <Dialog open={isSeedDataDialogOpen} onOpenChange={setIsSeedDataDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Manage Seed Data (Prompts)</DialogTitle>
            <DialogDescription>
              Manage prompts and suggestions for {selectedAgentId}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="text-sm text-muted-foreground bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg border border-yellow-200 dark:border-yellow-800">
              Note: This is seed data that can be removed later when moving to full API-based system.
            </div>
            
            {/* Add New Seed Data */}
            <div className="space-y-3 p-4 rounded-lg bg-[#F8F8F8] dark:bg-muted border border-[#E5E5E5]">
              <h4 className="text-sm font-medium">Add New Prompt</h4>
              <Input
                value={newSeedDataText}
                onChange={(e) => setNewSeedDataText(e.target.value)}
                placeholder="Enter prompt text..."
                className="bg-white dark:bg-card border-[#E5E5E5]"
              />
              <div className="grid grid-cols-2 gap-3">
                <Select value={newSeedDataIcon} onValueChange={setNewSeedDataIcon}>
                  <SelectTrigger className="bg-white dark:bg-card border-[#E5E5E5]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-card">
                    {ICON_OPTIONS.map((icon) => (
                      <SelectItem key={icon.value} value={icon.value}>
                        {icon.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  type="color"
                  value={newSeedDataColor}
                  onChange={(e) => setNewSeedDataColor(e.target.value)}
                  className="h-10"
                />
              </div>
              <Button onClick={handleCreateSeedData} size="sm" className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Add Prompt
              </Button>
            </div>

            {/* Existing Seed Data */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Existing Prompts</h4>
              {seedDataLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                </div>
              ) : seedData.length === 0 ? (
                <div className="text-sm text-muted-foreground text-center py-8">
                  No prompts found. Add one above.
                </div>
              ) : (
                seedData.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-[#F8F8F8] dark:bg-muted border border-[#E5E5E5]">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: `${item.color}20` }}
                      >
                        <item.icon className="w-4 h-4" style={{ color: item.color }} />
                      </div>
                      <span className="text-sm">{item.text}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={async () => {
                        // Get seed data ID from database
                        const { data } = await supabase
                          .from('ai_seed_data')
                          .select('id')
                          .eq('agent_id', selectedAgentId)
                          .eq('text', item.text)
                          .single();
                        
                        if (data?.id) {
                          try {
                            await deleteSeedData(data.id);
                            toast.success("Prompt deleted");
                          } catch (error: any) {
                            toast.error("Failed to delete: " + error.message);
                          }
                        }
                      }}
                      className="text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSeedDataDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

