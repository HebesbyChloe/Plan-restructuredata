import { Card } from "../../../ui/card";
import { Button } from "../../../ui/button";
import { Badge } from "../../../ui/badge";
import {
  Calendar,
  MapPin,
  TrendingUp,
  Phone,
  Mail,
  Instagram,
  ChevronDown,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "../../../ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../ui/tabs";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../../../ui/collapsible";
interface CustomerDetailPanelProps {
  customer: {
    id: string;
    name: string;
    email?: string;
    phone?: string;
    address?: string;
    tier?: string;
    totalOrders?: number;
    totalSpent?: number;
    lastOrderDate?: string;
    notes?: string;
    avatar?: string;
    emotion?: "positive" | "curious" | "neutral" | "happy" | "hesitant";
    badge?: "New" | "VIP" | "Regular";
    rank?: "new" | "first" | "repeat" | "loyal" | "vip" | "vvip";
    priority?: "urgent" | "high" | "normal";
    contactMethods?: Array<"email" | "phone" | "instagram">;
    status?: string;
    statusColor?: string;
    stage?: string;
    stageColor?: string;
    nextAction?: string;
    summary?: string;
    dateCreated?: string;
    createdBy?: string;
    lastUpdated?: string;
    updatedBy?: string;
  } | null;
  isOpen: boolean;
  onClose: () => void;
  getStatusColor?: (color: string) => string;
}

// Default status color function
const defaultGetStatusColor = (color: string) => {
  switch (color) {
    case "green":
      return "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400";
    case "blue":
      return "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400";
    case "yellow":
      return "bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-400";
    case "red":
      return "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400";
    default:
      return "bg-gray-100 text-gray-700 dark:bg-gray-950 dark:text-gray-400";
  }
};

export function CustomerDetailPanel({
  customer,
  isOpen,
  onClose,
  getStatusColor = defaultGetStatusColor,
}: CustomerDetailPanelProps) {
  const [showContactInfo, setShowContactInfo] = useState(false);

  if (!customer) return null;

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="w-full sm:max-w-2xl overflow-y-auto bg-background p-6" aria-describedby="customer-detail-description">
        <SheetHeader className="sr-only">
          <SheetTitle>{customer.name} - Customer Details</SheetTitle>
        </SheetHeader>
        <p id="customer-detail-description" className="sr-only">
          Detailed customer information including contact details, purchase history, and persona insights
        </p>
        <div className="space-y-4 mt-4">
          {/* Header */}
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white flex items-center justify-center flex-shrink-0">
              <span className="text-lg">{customer.name.split(' ').map(n => n[0]).join('')}</span>
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="mb-1">{customer.name}</h2>
              <div className="flex flex-wrap items-center gap-3 text-sm opacity-60">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Mar 15, 1990</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" />
                  <span className="truncate">123 Lê Lợi St, D1, HCMC</span>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <Card className="p-3 bg-muted/30">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm opacity-60 mb-0">Contact Info</p>
              <button 
                className="text-xs opacity-60 hover:opacity-100 transition-opacity"
                onClick={() => setShowContactInfo(!showContactInfo)}
              >
                {showContactInfo ? 'Hide' : 'Show'}
              </button>
            </div>
            {showContactInfo && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-1.5"
              >
                <div className="flex items-center gap-2 p-2 bg-background rounded-md text-sm">
                  <Phone className="w-3.5 h-3.5 opacity-60" />
                  <span>+84 903 123 456</span>
                </div>
                <div className="flex items-center gap-2 p-2 bg-background rounded-md text-sm">
                  <Mail className="w-3.5 h-3.5 opacity-60" />
                  <span>nguyen.anh@gmail.com</span>
                </div>
                <div className="mt-2">
                  <p className="text-xs opacity-60 mb-1.5">Social Media</p>
                  <Badge variant="outline" className="bg-blue-50 dark:bg-blue-950 border-blue-200 text-xs">
                    <Instagram className="w-3 h-3 mr-1" />
                    fb.com/anh
                  </Badge>
                </div>
              </motion.div>
            )}
          </Card>

          {/* Stats Cards */}
          <Card className="p-3 bg-muted/30">
            <div className="grid grid-cols-3 gap-3">
              <div>
                <p className="text-xs opacity-60 mb-1">Status</p>
                <Badge className={getStatusColor(customer.statusColor || "blue") + " text-xs"}>
                  {customer.status || "Active"}
                </Badge>
              </div>
              <div className="text-center">
                <p className="text-xs opacity-60 mb-1">Amount</p>
                <div className="text-xl text-emerald-600 dark:text-emerald-400">$120</div>
              </div>
              <div className="text-right">
                <p className="text-xs opacity-60 mb-1">Follow-ups</p>
                <div className="text-xl">1</div>
              </div>
            </div>
          </Card>

          {/* Next Action */}
          <div>
            <p className="text-sm opacity-60 mb-2">Next Action</p>
            <Button className="w-full bg-primary text-primary-foreground">
              {customer.nextAction || "Follow up"}
            </Button>
          </div>

          {/* Current Stage */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm opacity-60 mb-0">Current Stage</p>
              <p className="text-sm mb-0">{customer.stage || "Interest"}</p>
            </div>
            <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
              <div 
                className="h-full bg-primary transition-all duration-300"
                style={{ 
                  width: customer.stage === "Price Consider" ? "60%" : 
                         customer.stage === "Interest" ? "40%" :
                         customer.stage === "Hesitation" ? "50%" :
                         customer.stage === "Purchase" ? "100%" : "40%"
                }}
              />
            </div>
            <div className="flex items-center justify-between mt-2">
              <p className="text-xs opacity-60 mb-0">Awareness</p>
              <p className="text-xs opacity-60 mb-0">Purchase</p>
            </div>
          </div>

          {/* Opening Tasks */}
          <div>
            <p className="text-sm opacity-60 mb-3">Opening Tasks</p>
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-primary" />
                <span className="text-sm">Follow up within 24 hours</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-primary" />
                <span className="text-sm">Send product recommendations</span>
              </div>
            </div>
          </div>

          {/* Lifetime Value */}
          <Card className="p-3 bg-slate-100 dark:bg-slate-900">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 opacity-60" />
                <span>$1,420.5</span>
                <span className="opacity-60">/ 7 Orders</span>
              </div>
              <div className="flex items-center gap-3 opacity-60">
                <span>Avg: $202.93</span>
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  <span>123 days</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Journey Tabs */}
          <Tabs defaultValue="journey" className="w-full">
            <TabsList className="w-full grid grid-cols-3">
              <TabsTrigger value="journey">Journey 360°</TabsTrigger>
              <TabsTrigger value="purchase">Purchase</TabsTrigger>
              <TabsTrigger value="persona">Persona</TabsTrigger>
            </TabsList>
            
            <TabsContent value="journey" className="mt-4 space-y-4">
              {/* Timeline Header */}
              <div className="flex items-center gap-3 pb-3 border-b border-border">
                <span>Sep 30</span>
                <span className="opacity-60">•</span>
                <Badge variant="outline">Stage: Awareness</Badge>
                <span className="opacity-60">•</span>
                <Badge variant="secondary">Trigger: Ads Interact</Badge>
              </div>

              {/* Timeline Items */}
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-2.5 h-2.5 rounded-full bg-primary mt-1" />
                    <div className="w-0.5 h-full bg-border mt-1" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm opacity-60 mb-1">10:12</p>
                    <p className="mb-1">Clicked Facebook ad</p>
                    <Badge variant="secondary" className="bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300">
                      completed
                    </Badge>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-2.5 h-2.5 rounded-full bg-primary mt-1" />
                    <div className="w-0.5 h-full bg-border mt-1" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm opacity-60 mb-1">10:15</p>
                    <p className="mb-2">Customer inquired about fengshui bracelet compatibility</p>
                    <div className="flex gap-2">
                      <Badge variant="secondary" className="bg-purple-100 dark:bg-purple-900">pending</Badge>
                      <Badge variant="outline">Bracelet - Amethyst</Badge>
                      <Badge variant="outline">Fengshui Collection</Badge>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-2.5 h-2.5 rounded-full bg-primary mt-1" />
                    <div className="w-0.5 h-full bg-border mt-1" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm opacity-60 mb-1">10:17</p>
                    <p className="mb-2">Sales provided product information and fengshui consultation</p>
                    <div className="flex gap-2">
                      <Badge variant="secondary" className="bg-purple-100 dark:bg-purple-900">completed</Badge>
                      <Badge variant="outline">Bracelet - Amethyst</Badge>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-2.5 h-2.5 rounded-full bg-primary mt-1" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm opacity-60 mb-1">10:25</p>
                    <p className="mb-2">Customer needs more time to consider the purchase</p>
                    <Badge variant="secondary" className="bg-purple-100 dark:bg-purple-900">pending</Badge>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="purchase" className="mt-4">
              <div className="space-y-4">
                {/* Purchase History Table */}
                <div className="rounded-lg border border-border overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-muted/30 border-b border-border">
                      <tr>
                        <th className="text-left p-3 opacity-60">Order ID</th>
                        <th className="text-left p-3 opacity-60">Date</th>
                        <th className="text-left p-3 opacity-60">Product</th>
                        <th className="text-left p-3 opacity-60">Status</th>
                        <th className="text-right p-3 opacity-60">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-border hover:bg-accent/30 transition-colors">
                        <td className="p-3">ORD1001</td>
                        <td className="p-3">Jul 10, 2025</td>
                        <td className="p-3">Bracelet - Amethyst</td>
                        <td className="p-3">
                          <Badge className="bg-emerald-500/20 text-emerald-700 dark:text-emerald-400">
                            Completed
                          </Badge>
                        </td>
                        <td className="p-3 text-right">$120.00</td>
                      </tr>
                      <tr className="border-b border-border hover:bg-accent/30 transition-colors">
                        <td className="p-3">ORD1002</td>
                        <td className="p-3">Aug 5, 2025</td>
                        <td className="p-3">Ring - Citrine</td>
                        <td className="p-3">
                          <Badge className="bg-emerald-500/20 text-emerald-700 dark:text-emerald-400">
                            Completed
                          </Badge>
                        </td>
                        <td className="p-3 text-right">$199.00</td>
                      </tr>
                      <tr className="border-b border-border hover:bg-accent/30 transition-colors">
                        <td className="p-3">ORD1003</td>
                        <td className="p-3">Sep 12, 2025</td>
                        <td className="p-3">Bracelet - Tiger Eye</td>
                        <td className="p-3">
                          <Badge className="bg-emerald-500/20 text-emerald-700 dark:text-emerald-400">
                            Completed
                          </Badge>
                        </td>
                        <td className="p-3 text-right">$125.00</td>
                      </tr>
                      <tr className="border-b border-border hover:bg-accent/30 transition-colors">
                        <td className="p-3">ORD1004</td>
                        <td className="p-3">Sep 28, 2025</td>
                        <td className="p-3">Necklace - Jade</td>
                        <td className="p-3">
                          <Badge className="bg-amber-500/20 text-amber-700 dark:text-amber-400">
                            Processing
                          </Badge>
                        </td>
                        <td className="p-3 text-right">$299.00</td>
                      </tr>
                      <tr className="border-b border-border hover:bg-accent/30 transition-colors">
                        <td className="p-3">ORD1005</td>
                        <td className="p-3">Oct 1, 2025</td>
                        <td className="p-3">Bracelet - Black Obsidian</td>
                        <td className="p-3">
                          <Badge className="bg-blue-500/20 text-blue-700 dark:text-blue-400">
                            Pending
                          </Badge>
                        </td>
                        <td className="p-3 text-right">$155.00</td>
                      </tr>
                      <tr className="border-b border-border hover:bg-accent/30 transition-colors">
                        <td className="p-3">ORD1006</td>
                        <td className="p-3">Oct 5, 2025</td>
                        <td className="p-3">Earrings - Rose Quartz</td>
                        <td className="p-3">
                          <Badge className="bg-emerald-500/20 text-emerald-700 dark:text-emerald-400">
                            Completed
                          </Badge>
                        </td>
                        <td className="p-3 text-right">$89.00</td>
                      </tr>
                      <tr className="hover:bg-accent/30 transition-colors">
                        <td className="p-3">ORD1007</td>
                        <td className="p-3">Oct 8, 2025</td>
                        <td className="p-3">Bracelet - Hematite Combo</td>
                        <td className="p-3">
                          <Badge className="bg-emerald-500/20 text-emerald-700 dark:text-emerald-400">
                            Completed
                          </Badge>
                        </td>
                        <td className="p-3 text-right">$433.50</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Purchase Summary */}
                <Card className="p-4 bg-muted/30">
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm opacity-60 mb-1">Total Orders</p>
                      <p className="text-2xl mb-0">7</p>
                    </div>
                    <div>
                      <p className="text-sm opacity-60 mb-1">Total Spent</p>
                      <p className="text-2xl text-emerald-600 dark:text-emerald-400 mb-0">$1,420.50</p>
                    </div>
                    <div>
                      <p className="text-sm opacity-60 mb-1">Avg Order Value</p>
                      <p className="text-2xl mb-0">$202.93</p>
                    </div>
                  </div>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="persona" className="mt-4 space-y-4">
              {/* Customer Persona Card */}
              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white flex items-center justify-center flex-shrink-0">
                      <span className="text-base">{customer.name.split(' ').map(n => n[0]).join('')}</span>
                    </div>
                    <div>
                      <h3 className="mb-0">{customer.name}</h3>
                      <p className="text-sm opacity-60 mb-0">Age: 30-40</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm opacity-60 mb-0">Total Spent</p>
                    <p className="text-xl mb-0">$1,420.5</p>
                    <p className="text-xs opacity-60 mb-0">Top: Bracelet</p>
                  </div>
                </div>
              </Card>

              {/* Behavioral Insights */}
              <Card className="p-4">
                <Collapsible defaultOpen>
                  <CollapsibleTrigger className="w-full">
                    <div className="flex items-center justify-between w-full">
                      <h3 className="mb-0">Behavioral Insights</h3>
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="mt-4">
                    <div className="grid grid-cols-3 gap-4">
                      {/* Preferences */}
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-4 h-4 rounded-full bg-pink-500" />
                          <h4 className="mb-0">Preferences</h4>
                        </div>
                        <ul className="space-y-2 text-sm opacity-70">
                          <li>• Interested in fengshui and spiritual items</li>
                          <li>• Prefers amethyst and water element stones</li>
                          <li>• Values quality and authenticity</li>
                        </ul>
                      </div>

                      {/* Buying Patterns */}
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-4 h-4 rounded-full bg-blue-500" />
                          <h4 className="mb-0">Buying Patterns</h4>
                        </div>
                        <ul className="space-y-2 text-sm opacity-70">
                          <li>• Average purchase every 45 days</li>
                          <li>• Prefers mid-range priced items ($100-$200)</li>
                          <li>• Often buys during promotional periods</li>
                        </ul>
                      </div>

                      {/* Engagement */}
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-4 h-4 rounded-full bg-green-500" />
                          <h4 className="mb-0">Engagement</h4>
                        </div>
                        <ul className="space-y-2 text-sm opacity-70">
                          <li>• High email open rate (78%)</li>
                          <li>• Active on Instagram</li>
                          <li>• Responds well to personalized recommendations</li>
                        </ul>
                      </div>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </Card>

              {/* AI Recommendations */}
              <Card className="p-4 bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#4B6BFB] flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xs">AI</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="mb-2">AI Recommendation</h4>
                    <p className="text-sm opacity-80 mb-3">
                      Based on this customer's purchase history and behavior, we recommend:
                    </p>
                    <ul className="space-y-1 text-sm opacity-80">
                      <li>• Send personalized email featuring new water element collection</li>
                      <li>• Offer 10% loyalty discount on next purchase</li>
                      <li>• Follow up within 24 hours about abandoned cart item</li>
                    </ul>
                  </div>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </SheetContent>
    </Sheet>
  );
}
