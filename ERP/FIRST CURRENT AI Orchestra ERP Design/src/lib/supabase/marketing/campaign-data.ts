/**
 * Campaign Data Fetching Utilities
 * Fetches related data for campaigns: tasks, activities, team members, files
 */

import { supabase } from "../client";

// ============================================
// TYPES
// ============================================

export interface CampaignTask {
  id: string;
  title: string;
  assignee: string;
  status: string;
  date: string;
}

export interface CampaignActivity {
  date: string;
  activity: string;
  status: string;
}

export interface TeamMember {
  id: number;
  name: string;
  email?: string;
}

export interface ProjectFile {
  name: string;
  size: string;
  date: string;
}

// ============================================
// TASKS
// ============================================

/**
 * Get tasks for a campaign
 * Tasks are linked via: campaign → mkt_campaign_projects → project → task
 */
export async function getCampaignTasks(
  campaignId: number,
  tenantId: number
): Promise<{ data: CampaignTask[] | null; error: Error | null }> {
  try {
    // First, get project IDs linked to this campaign
    const { data: campaignProjects, error: cpError } = await supabase
      .from('mkt_campaign_projects')
      .select('project_id')
      .eq('campaign_id', campaignId);

    if (cpError) {
      console.error('Error fetching campaign projects:', cpError);
      return { data: null, error: new Error(cpError.message) };
    }

    if (!campaignProjects || campaignProjects.length === 0) {
      return { data: [], error: null };
    }

    const projectIds = campaignProjects.map(cp => cp.project_id);

    // Get tasks for these projects
    const { data: tasks, error: tasksError } = await supabase
      .from('task')
      .select(`
        id,
        title,
        status,
        due_date,
        assignee_id,
        sys_users:assignee_id (
          id,
          name,
          email
        )
      `)
      .in('project_id', projectIds)
      .is('archived_at', null)
      .order('due_date', { ascending: true, nullsFirst: false });

    if (tasksError) {
      console.error('Error fetching tasks:', tasksError);
      return { data: null, error: new Error(tasksError.message) };
    }

    if (!tasks) {
      return { data: [], error: null };
    }

    // Map to CampaignTask format
    const campaignTasks: CampaignTask[] = tasks.map((task: any) => ({
      id: String(task.id),
      title: task.title || 'Untitled Task',
      assignee: task.sys_users?.name || `User ${task.assignee_id}` || 'Unassigned',
      status: task.status || 'To Do',
      date: task.due_date 
        ? new Date(task.due_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        : 'No date',
    }));

    return { data: campaignTasks, error: null };
  } catch (err) {
    console.error('Unexpected error fetching campaign tasks:', err);
    return { data: null, error: err instanceof Error ? err : new Error('Unknown error') };
  }
}

// ============================================
// ACTIVITIES
// ============================================

/**
 * Get activities for a campaign
 * Activities come from mkt_campaign_activities table
 */
export async function getCampaignActivities(
  campaignId: number,
  tenantId: number
): Promise<{ data: CampaignActivity[] | null; error: Error | null }> {
  try {
    const { data, error } = await supabase
      .from('mkt_campaign_activities')
      .select('id, title, status, date, start_time, end_time')
      .eq('campaign_id', campaignId)
      .eq('tenant_id', tenantId)
      .is('deleted_at', null)
      .order('date', { ascending: false })
      .order('start_time', { ascending: true, nullsFirst: true });

    if (error) {
      console.error('Error fetching campaign activities:', error);
      return { data: null, error: new Error(error.message) };
    }

    if (!data) {
      return { data: [], error: null };
    }

    // Map to CampaignActivity format
    const activities: CampaignActivity[] = data.map((activity: any) => ({
      date: activity.date 
        ? new Date(activity.date).toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric' 
          })
        : 'No date',
      activity: activity.title || 'Untitled Activity',
      status: activity.status || 'pending',
    }));

    return { data: activities, error: null };
  } catch (err) {
    console.error('Unexpected error fetching campaign activities:', err);
    return { data: null, error: err instanceof Error ? err : new Error('Unknown error') };
  }
}

/**
 * Get all campaign activities across all campaigns for calendar view
 * Activities come from mkt_campaign_activities table
 */
export async function getAllCampaignActivities(
  tenantId: number,
  startDate?: Date,
  endDate?: Date
): Promise<{ data: Array<{
  id: string;
  title: string;
  type: "email" | "social" | "paid-ads" | "content" | "event" | "launch";
  status: "scheduled" | "active" | "completed" | "draft";
  date: Date;
  startTime: string;
  endTime: string;
  duration: number;
  budget?: string;
  reach?: string;
  campaignId: string;
  campaignName: string;
  campaignColor?: string;
}> | null; error: Error | null }> {
  try {
    let query = supabase
      .from('mkt_campaign_activities')
      .select(`
        id,
        campaign_id,
        title,
        type,
        status,
        date,
        start_time,
        end_time,
        duration,
        budget,
        reach,
        mkt_campaigns!inner(
          id,
          name,
          type,
          tenant_id
        )
      `)
      .is('deleted_at', null);

    if (startDate) {
      query = query.gte('date', startDate.toISOString().split('T')[0]);
    }
    if (endDate) {
      query = query.lte('date', endDate.toISOString().split('T')[0]);
    }

    const { data, error } = await query
      .order('date', { ascending: true })
      .order('start_time', { ascending: true, nullsFirst: true });

    if (error) {
      console.error('Error fetching all campaign activities:', error);
      return { data: null, error: new Error(error.message) };
    }

    if (!data) {
      return { data: [], error: null };
    }

    // Filter by tenant_id from the joined campaign
    const filteredData = data.filter((activity: any) => 
      activity.mkt_campaigns?.tenant_id === tenantId
    );

    // Map activity types to colors
    const activityTypeColors: Record<string, string> = {
      email: "#4B6BFB",
      social: "#EC4899",
      "paid-ads": "#F59E0B",
      content: "#10B981",
      event: "#8B5CF6",
      launch: "#EF4444",
    };

    const activities = filteredData.map((activity: any) => ({
      id: String(activity.id),
      title: activity.title || 'Untitled Activity',
      type: activity.type as "email" | "social" | "paid-ads" | "content" | "event" | "launch",
      status: activity.status as "scheduled" | "active" | "completed" | "cancelled",
      date: new Date(activity.date),
      startTime: activity.start_time || "09:00",
      endTime: activity.end_time || "17:00",
      duration: activity.duration || 1,
      budget: activity.budget ? `$${Number(activity.budget).toLocaleString()}` : undefined,
      reach: activity.reach ? `${Number(activity.reach).toLocaleString()}` : undefined,
      campaignId: String(activity.campaign_id),
      campaignName: activity.mkt_campaigns?.name || 'Unknown Campaign',
      campaignColor: activityTypeColors[activity.type] || "#4B6BFB",
    }));

    return { data: activities, error: null };
  } catch (err) {
    console.error('Unexpected error fetching all campaign activities:', err);
    return { data: null, error: err instanceof Error ? err : new Error('Unknown error') };
  }
}

// ============================================
// TEAM MEMBERS
// ============================================

/**
 * Get team members (users) for a tenant
 */
export async function getTeamMembers(
  tenantId: number
): Promise<{ data: TeamMember[] | null; error: Error | null }> {
  try {
    const { data, error } = await supabase
      .from('sys_users')
      .select('id, full_name, email')
      .eq('primary_tenant_id', tenantId)
      .is('deactivated_at', null)
      .order('full_name', { ascending: true });

    if (error) {
      console.error('Error fetching team members:', error);
      return { data: null, error: new Error(error.message) };
    }

    if (!data) {
      return { data: [], error: null };
    }

    const members: TeamMember[] = data.map((user: any) => ({
      id: user.id,
      name: user.full_name || user.email || `User ${user.id}`,
      email: user.email,
    }));

    return { data: members, error: null };
  } catch (err) {
    console.error('Unexpected error fetching team members:', err);
    return { data: null, error: err instanceof Error ? err : new Error('Unknown error') };
  }
}

// ============================================
// FILES
// ============================================

/**
 * Get files for a campaign
 * Files come from project_repository via campaign projects
 */
export async function getCampaignFiles(
  campaignId: number,
  tenantId: number
): Promise<{ data: ProjectFile[] | null; error: Error | null }> {
  try {
    // First, get project IDs linked to this campaign
    const { data: campaignProjects, error: cpError } = await supabase
      .from('mkt_campaign_projects')
      .select('project_id')
      .eq('campaign_id', campaignId);

    if (cpError) {
      console.error('Error fetching campaign projects:', cpError);
      return { data: null, error: new Error(cpError.message) };
    }

    if (!campaignProjects || campaignProjects.length === 0) {
      return { data: [], error: null };
    }

    const projectIds = campaignProjects.map(cp => cp.project_id);

    // Get files for these projects
    const { data: files, error: filesError } = await supabase
      .from('project_repository')
      .select('id, name, size, created_at')
      .in('project_id', projectIds)
      .order('created_at', { ascending: false });

    if (filesError) {
      console.error('Error fetching campaign files:', filesError);
      return { data: null, error: new Error(filesError.message) };
    }

    if (!files) {
      return { data: [], error: null };
    }

    // Map to ProjectFile format
    const projectFiles: ProjectFile[] = files.map((file: any) => {
      const sizeInMB = file.size ? (file.size / (1024 * 1024)).toFixed(1) + ' MB' : 'Unknown size';
      const date = file.created_at 
        ? new Date(file.created_at).toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric' 
          })
        : 'Unknown date';

      return {
        name: file.name || 'Untitled File',
        size: sizeInMB,
        date: date,
      };
    });

    return { data: projectFiles, error: null };
  } catch (err) {
    console.error('Unexpected error fetching campaign files:', err);
    return { data: null, error: err instanceof Error ? err : new Error('Unknown error') };
  }
}

