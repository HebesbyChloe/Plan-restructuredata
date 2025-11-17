/**
 * Details Tab Component
 * Displays project/campaign details, team, overview, and files
 */

import { useState } from "react";
import { Card } from "../../../../ui/card";
import { Button } from "../../../../ui/button";
import { Input } from "../../../../ui/input";
import { Textarea } from "../../../../ui/textarea";
import { Calendar } from "../../../../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../../../../ui/popover";
import { Checkbox } from "../../../../ui/checkbox";
import {
  FileText,
  ExternalLink,
  Paperclip,
  Upload,
  Eye,
  Plus,
  X,
  Star,
  UserPlus,
  CalendarIcon,
} from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
// Removed mock data imports - using real data from props
import { filterMembers } from "../utils/helpers";
import type { ProjectCampaignData } from "../types";

interface DetailsTabProps {
  project: ProjectCampaignData;
  teamMembers: string[];
  overviewText: string;
  onTeamMembersChange: (members: string[]) => void;
  onOverviewChange: (text: string) => void;
  onUnsyncedChange: () => void;
  allTeamMembers?: Array<{id: number; name: string}>;
  files?: Array<{name: string; size: string; date: string}>;
}

export function DetailsTab({
  project,
  teamMembers,
  overviewText,
  onTeamMembersChange,
  onOverviewChange,
  onUnsyncedChange,
  allTeamMembers = [],
  files = [],
}: DetailsTabProps) {
  const [addMemberOpen, setAddMemberOpen] = useState(false);
  const [memberSearchQuery, setMemberSearchQuery] = useState("");
  const [leadSearchQuery, setLeadSearchQuery] = useState("");
  
  // Date states
  const [startDate, setStartDate] = useState<Date | undefined>(
    project.startDate ? new Date(project.startDate) : undefined
  );
  const [endDate, setEndDate] = useState<Date | undefined>(
    project.endDate ? new Date(project.endDate) : undefined
  );
  const [launchDate, setLaunchDate] = useState<Date | undefined>(
    project.startDate ? new Date(project.startDate) : undefined
  );
  const [isOngoing, setIsOngoing] = useState(!project.endDate);

  const allMemberNames = allTeamMembers.map(m => m.name);
  const filteredMembersForMember = filterMembers(allMemberNames, memberSearchQuery, teamMembers);
  const filteredMembersForLead = filterMembers(allMemberNames, leadSearchQuery, teamMembers);

  const handleRemoveMember = (index: number) => {
    const memberName = teamMembers[index];
    onTeamMembersChange(teamMembers.filter((_, i) => i !== index));
    onUnsyncedChange();
    toast.success(`Removed ${memberName} from team`);
  };

  const handleAddMember = (memberName: string, isLead: boolean) => {
    if (isLead) {
      // Add as lead (first position)
      onTeamMembersChange([memberName, ...teamMembers.filter(m => m !== memberName)]);
    } else {
      // Add as regular member
      if (!teamMembers.includes(memberName)) {
        onTeamMembersChange([...teamMembers, memberName]);
      }
    }
    onUnsyncedChange();
    toast.success(`Added ${memberName} as ${isLead ? 'lead' : 'team member'}`);
    setMemberSearchQuery("");
    setLeadSearchQuery("");
    setAddMemberOpen(false);
  };

  return (
    <div className="space-y-4 mt-4">
      {/* View Full Report Button */}
      <Button
        variant="outline"
        size="sm"
        className="w-full gap-2 bg-gradient-to-r from-[#4B6BFB]/5 to-[#6B8AFF]/5 hover:from-[#4B6BFB]/10 hover:to-[#6B8AFF]/10 border-[#4B6BFB]/20 text-[#4B6BFB] hover:text-[#4B6BFB]"
        onClick={() => {
          toast.success("Opening full report in new tab...");
        }}
      >
        <FileText className="w-3.5 h-3.5" />
        <span>View Full Report</span>
        <ExternalLink className="w-3 h-3 ml-auto opacity-50" />
      </Button>
      
      {/* Editable Info */}
      <Card className="p-4 bg-white dark:bg-card border-[#E5E5E5]">
        <div className="space-y-3 text-sm">
          <div className={`grid gap-4 ${project.type === "campaign" ? "grid-cols-3" : "grid-cols-2"}`}>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Start Date</p>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-left font-normal border-transparent hover:border-input focus:border-input bg-transparent p-0 h-auto"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, "PPP") : <span className="text-muted-foreground">Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={(date) => {
                      setStartDate(date);
                      onUnsyncedChange();
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            {project.type === "campaign" && (
              <div>
                <p className="text-xs text-muted-foreground mb-1">Launch Date</p>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-left font-normal border-transparent hover:border-input focus:border-input bg-transparent p-0 h-auto"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {launchDate ? format(launchDate, "PPP") : <span className="text-muted-foreground">Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={launchDate}
                      onSelect={(date) => {
                        setLaunchDate(date);
                        onUnsyncedChange();
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            )}
            <div>
              <div className="flex items-center justify-between mb-1">
                <p className="text-xs text-muted-foreground">End Date</p>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="ongoing"
                    checked={isOngoing}
                    onCheckedChange={(checked) => {
                      setIsOngoing(checked as boolean);
                      if (checked) {
                        setEndDate(undefined);
                      }
                      onUnsyncedChange();
                    }}
                  />
                  <label
                    htmlFor="ongoing"
                    className="text-xs text-muted-foreground cursor-pointer"
                  >
                    Ongoing ∞
                  </label>
                </div>
              </div>
              {!isOngoing ? (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-left font-normal border-transparent hover:border-input focus:border-input bg-transparent p-0 h-auto"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {endDate ? format(endDate, "PPP") : <span className="text-muted-foreground">Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={(date) => {
                        setEndDate(date);
                        onUnsyncedChange();
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              ) : (
                <div className="text-sm text-muted-foreground italic">Ongoing</div>
              )}
            </div>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-2">Team Members</p>
            <div className="flex flex-wrap gap-2">
              {teamMembers.map((member, index) => (
                <div
                  key={index}
                  className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-[#F8F8F8] dark:bg-muted/30 group hover:bg-accent transition-colors"
                >
                  {index === 0 && (
                    <Star className="w-3 h-3 text-[#DAB785] fill-[#DAB785]" />
                  )}
                  <span className="text-xs">{member}</span>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveMember(index);
                    }}
                    className="opacity-0 group-hover:opacity-100 transition-opacity ml-1 hover:scale-110"
                    type="button"
                  >
                    <X className="w-3 h-3 text-muted-foreground hover:text-destructive transition-colors" />
                  </button>
                </div>
              ))}
              <div className="relative">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-7 px-2 text-xs"
                  type="button"
                  onClick={() => setAddMemberOpen(!addMemberOpen)}
                >
                  <Plus className="w-3 h-3 mr-1" />
                  Add Member
                </Button>
                
                {addMemberOpen && (
                  <>
                    {/* Backdrop to close dropdown */}
                    <div 
                      className="fixed inset-0 z-40" 
                      onClick={() => {
                        setAddMemberOpen(false);
                        setMemberSearchQuery("");
                        setLeadSearchQuery("");
                      }}
                    />
                    
                    {/* Dropdown Menu */}
                    <div className="absolute left-0 top-full mt-1 w-[calc(100vw-2rem)] sm:w-72 max-w-[calc(100vw-2rem)] sm:max-w-none bg-white dark:bg-card border border-border rounded-lg shadow-lg p-3 z-50 space-y-4">
                      {/* Add as Member Section */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <UserPlus className="w-3.5 h-3.5 text-[#4B6BFB]" />
                          <label className="text-xs text-muted-foreground">Add as Team Member</label>
                        </div>
                        <Input
                          type="text"
                          placeholder="Type name to search..."
                          value={memberSearchQuery}
                          onChange={(e) => setMemberSearchQuery(e.target.value)}
                          className="h-8 text-xs"
                          autoFocus
                        />
                        
                        {/* Member Search Results */}
                        {memberSearchQuery.trim() && (
                          <div className="space-y-1 max-h-[140px] overflow-y-auto">
                            {filteredMembersForMember.length > 0 ? (
                              filteredMembersForMember.map((name) => (
                                <button
                                  key={`member-${name}`}
                                  type="button"
                                  onClick={() => handleAddMember(name, false)}
                                  className="w-full text-left px-3 py-1.5 text-xs rounded hover:bg-accent transition-colors flex items-center gap-2"
                                >
                                  <UserPlus className="w-3 h-3 text-[#4B6BFB] opacity-60" />
                                  <span>{name}</span>
                                </button>
                              ))
                            ) : (
                              <div className="text-center py-2 text-xs text-muted-foreground">
                                No members found
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Divider */}
                      <div className="border-t border-border"></div>

                      {/* Add as Lead Section */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Star className="w-3.5 h-3.5 text-[#DAB785]" />
                          <label className="text-xs text-muted-foreground">Add as Team Lead</label>
                        </div>
                        <Input
                          type="text"
                          placeholder="Type name to search..."
                          value={leadSearchQuery}
                          onChange={(e) => setLeadSearchQuery(e.target.value)}
                          className="h-8 text-xs"
                        />
                        
                        {/* Lead Search Results */}
                        {leadSearchQuery.trim() && (
                          <div className="space-y-1 max-h-[140px] overflow-y-auto">
                            {filteredMembersForLead.length > 0 ? (
                              filteredMembersForLead.map((name) => (
                                <button
                                  key={`lead-${name}`}
                                  type="button"
                                  onClick={() => handleAddMember(name, true)}
                                  className="w-full text-left px-3 py-1.5 text-xs rounded hover:bg-accent transition-colors flex items-center gap-2"
                                >
                                  <Star className="w-3 h-3 text-[#DAB785] opacity-60" />
                                  <span>{name}</span>
                                </button>
                              ))
                            ) : (
                              <div className="text-center py-2 text-xs text-muted-foreground">
                                No members found
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Overview Section */}
      <Card className="p-4 bg-white dark:bg-card border-[#E5E5E5]">
        <h4 className="mb-2 flex items-center gap-2">
          <FileText className="w-4 h-4 text-[#4B6BFB]" />
          Overview
        </h4>
        <Textarea
          value={overviewText}
          onChange={(e) => {
            onOverviewChange(e.target.value);
            onUnsyncedChange();
          }}
          placeholder="Write a summary about this project or campaign..."
          className="min-h-[100px] resize-none bg-transparent border-transparent hover:border-input focus:border-input transition-colors"
        />
      </Card>

      {/* Project Hub (Files) */}
      <Card className="p-4 bg-white dark:bg-card border-[#E5E5E5]">
        <div className="flex items-center justify-between mb-3">
          <h4 className="mb-0 flex items-center gap-2">
            <Paperclip className="w-4 h-4 text-[#4B6BFB]" />
            Project Hub
          </h4>
          <Button size="sm" variant="outline" className="h-8">
            <Upload className="w-3 h-3 mr-2" />
            Upload
          </Button>
        </div>
        <div className="space-y-2">
          {files.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">No files uploaded yet</p>
          ) : (
            files.map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 rounded-lg bg-[#F8F8F8] dark:bg-muted/30 hover:bg-accent/50 transition-all cursor-pointer group"
              onClick={() => {
                toast.success(`Opening ${file.name} in new tab...`);
              }}
            >
              <div className="flex items-center gap-3 flex-1">
                <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <FileText className="w-4 h-4 text-[#4B6BFB]" />
                </div>
                <div>
                  <p className="text-sm mb-0 group-hover:text-[#4B6BFB] transition-colors">{file.name}</p>
                  <p className="text-xs text-muted-foreground mb-0">
                    {file.size} • {file.date}
                  </p>
                </div>
              </div>
              <Eye className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-[#4B6BFB]" />
            </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
}
