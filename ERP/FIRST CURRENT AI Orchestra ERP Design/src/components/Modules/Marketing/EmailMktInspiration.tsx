import React, { useState } from 'react';
import { Card } from '../../ui/card';
import { Mail, Send, Eye, Star, Gift, Percent, Megaphone, Calendar, TrendingUp } from 'lucide-react';
import { motion } from 'motion/react';
import { toast } from 'sonner';
import { Badge } from '../../ui/badge';
import { SubTabs, SubTabsList, SubTabsTrigger, SubTabsContent } from '../Global/SubTab';

export default function EmailMktInspiration() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Mock data for different email categories
  const newsletterTemplates = [
    { id: 1, title: 'Weekly Product Highlights', openRate: '32%', ctr: '8.5%', category: 'newsletter' },
    { id: 2, title: 'Industry News Roundup', openRate: '28%', ctr: '6.2%', category: 'newsletter' },
    { id: 3, title: 'Customer Success Stories', openRate: '35%', ctr: '9.1%', category: 'newsletter' },
  ];

  const promotionalEmails = [
    { id: 4, title: 'Flash Sale Announcement', openRate: '42%', ctr: '15.3%', category: 'promotional' },
    { id: 5, title: 'Exclusive Member Discount', openRate: '38%', ctr: '12.8%', category: 'promotional' },
    { id: 6, title: 'Seasonal Sale Countdown', openRate: '45%', ctr: '18.2%', category: 'promotional' },
  ];

  const welcomeSequence = [
    { id: 7, title: 'Welcome Series - Day 1', openRate: '58%', ctr: '22.5%', category: 'welcome' },
    { id: 8, title: 'Welcome Series - Day 3', openRate: '51%', ctr: '18.9%', category: 'welcome' },
    { id: 9, title: 'Welcome Series - Day 7', openRate: '46%', ctr: '16.4%', category: 'welcome' },
  ];

  const eventInvites = [
    { id: 10, title: 'Webinar Invitation', openRate: '36%', ctr: '11.5%', category: 'event' },
    { id: 11, title: 'Product Launch Event', openRate: '41%', ctr: '14.8%', category: 'event' },
    { id: 12, title: 'Virtual Conference', openRate: '33%', ctr: '10.2%', category: 'event' },
  ];

  const renderEmailCard = (email: any, icon: React.ReactNode, gradient: string) => (
    <motion.div
      key={email.id}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="p-6 bg-white/5 backdrop-blur-md border-white/10 hover:bg-white/10 transition-all cursor-pointer group">
        <div className={`aspect-[4/3] bg-gradient-to-br ${gradient} rounded-lg mb-4 flex items-center justify-center overflow-hidden relative`}>
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="flex flex-col items-center gap-2">
            {icon}
            <div className="text-white/40 text-xs">Email Template</div>
          </div>
          <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
            <Badge className="bg-[#4B6BFB]">Preview</Badge>
          </div>
        </div>
        <h3 className="text-white mb-3">{email.title}</h3>
        <div className="flex items-center gap-4 text-sm text-white/60">
          <div className="flex items-center gap-1">
            <Eye className="w-4 h-4" />
            {email.openRate}
          </div>
          <div className="flex items-center gap-1">
            <TrendingUp className="w-4 h-4" />
            {email.ctr} CTR
          </div>
        </div>
      </Card>
    </motion.div>
  );

  return (
    <div className="w-full">
      {/* Sub-Tabs Section */}
      <SubTabs value={selectedCategory} onValueChange={setSelectedCategory}>
        <SubTabsList>
          <SubTabsTrigger value="all" icon={<Mail className="w-4 h-4" />}>
            All Templates
          </SubTabsTrigger>
          <SubTabsTrigger value="newsletter" icon={<Megaphone className="w-4 h-4" />}>
            Newsletter
          </SubTabsTrigger>
          <SubTabsTrigger value="promotional" icon={<Percent className="w-4 h-4" />}>
            Promotional
          </SubTabsTrigger>
          <SubTabsTrigger value="welcome" icon={<Gift className="w-4 h-4" />}>
            Welcome Series
          </SubTabsTrigger>
          <SubTabsTrigger value="event" icon={<Calendar className="w-4 h-4" />}>
            Event Invites
          </SubTabsTrigger>
        </SubTabsList>

        <SubTabsContent value="all">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {renderEmailCard(newsletterTemplates[0], <Mail className="w-8 h-8 text-white/60" />, 'from-blue-500/20 to-cyan-500/20')}
            {renderEmailCard(promotionalEmails[0], <Percent className="w-8 h-8 text-white/60" />, 'from-purple-500/20 to-pink-500/20')}
            {renderEmailCard(welcomeSequence[0], <Gift className="w-8 h-8 text-white/60" />, 'from-green-500/20 to-emerald-500/20')}
            {renderEmailCard(eventInvites[0], <Calendar className="w-8 h-8 text-white/60" />, 'from-orange-500/20 to-amber-500/20')}
            {renderEmailCard(newsletterTemplates[1], <Mail className="w-8 h-8 text-white/60" />, 'from-blue-500/20 to-cyan-500/20')}
            {renderEmailCard(promotionalEmails[1], <Percent className="w-8 h-8 text-white/60" />, 'from-purple-500/20 to-pink-500/20')}
          </div>
        </SubTabsContent>

        <SubTabsContent value="newsletter">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {newsletterTemplates.map((email) => 
              renderEmailCard(email, <Mail className="w-8 h-8 text-white/60" />, 'from-blue-500/20 to-cyan-500/20')
            )}
          </div>
        </SubTabsContent>

        <SubTabsContent value="promotional">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {promotionalEmails.map((email) => 
              renderEmailCard(email, <Percent className="w-8 h-8 text-white/60" />, 'from-purple-500/20 to-pink-500/20')
            )}
          </div>
        </SubTabsContent>

        <SubTabsContent value="welcome">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {welcomeSequence.map((email) => 
              renderEmailCard(email, <Gift className="w-8 h-8 text-white/60" />, 'from-green-500/20 to-emerald-500/20')
            )}
          </div>
        </SubTabsContent>

        <SubTabsContent value="event">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {eventInvites.map((email) => 
              renderEmailCard(email, <Calendar className="w-8 h-8 text-white/60" />, 'from-orange-500/20 to-amber-500/20')
            )}
          </div>
        </SubTabsContent>
      </SubTabs>
    </div>
  );
}
