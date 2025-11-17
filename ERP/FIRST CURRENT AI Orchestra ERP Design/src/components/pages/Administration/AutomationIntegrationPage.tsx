import { Zap, AlertCircle } from "lucide-react";
import { Card } from "../../ui/card";

export function AutomationIntegrationPage() {
  return (
    <div className="space-y-6">
      <Card className="p-8 bg-white dark:bg-card border-[#E5E5E5]">
        <div className="flex flex-col items-center justify-center text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
            <AlertCircle className="w-8 h-8 text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <h2 className="mb-2">Database Setup Required</h2>
            <p className="text-muted-foreground mb-0">
              The automation and integration feature requires database tables to be created.
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Please create integration-related tables in your Supabase database to manage API connections, webhooks, and automation workflows.
            </p>
            <p className="text-sm text-muted-foreground mt-4">
              <strong>Suggested tables:</strong> integrations, api_keys, webhooks, automation_rules
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
