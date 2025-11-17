"use client";

import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../ui/tabs';
import { AINotificationCard } from '../../Modules/Global/AINotificationCard';
import { Lightbulb, Instagram, Mail, Target } from 'lucide-react';
import { motion } from 'motion/react';
import { toast } from 'sonner';
import SocialInspiration from '../../Modules/Marketing/SocialInspiration';
import EmailMktInspiration from '../../Modules/Marketing/EmailMktInspiration';
import AdsInspiration from '../../Modules/Marketing/AdsInspiration';

export default function Inspiration() {
  const [activeTab, setActiveTab] = useState('social');

  // Dynamic content based on active tab
  const tabContent = {
    social: {
      title: 'Social Media Inspiration',
      description: 'Discover trending social media content and creative ideas',
      icon: <Instagram className="w-8 h-8 text-[#4B6BFB]" />,
      aiMessage: <><span className="opacity-100">AI Social Trend Alert:</span> Instagram Reels featuring product demos are trending 45% higher this week. Consider creating short-form video content for maximum engagement.</>,
      actionLabel: 'Get Ideas →'
    },
    email: {
      title: 'Email Marketing Inspiration',
      description: 'Explore high-performing email templates and campaign ideas',
      icon: <Mail className="w-8 h-8 text-[#4B6BFB]" />,
      aiMessage: <><span className="opacity-100">AI Email Insight:</span> Subject lines with emojis show 28% higher open rates. Welcome emails have the highest engagement - consider expanding your welcome sequence.</>,
      actionLabel: 'Optimize Emails →'
    },
    ads: {
      title: 'Ads Campaign Inspiration',
      description: 'Explore high-converting ad creatives and campaign strategies',
      icon: <Target className="w-8 h-8 text-[#4B6BFB]" />,
      aiMessage: <><span className="opacity-100">AI Ad Performance Alert:</span> Video ads are outperforming static ads by 62% this month. Search ads with specific product names show 3.2x higher conversion rates.</>,
      actionLabel: 'Get Recommendations →'
    }
  };

  const currentContent = tabContent[activeTab as keyof typeof tabContent];

  return (
    <div className="w-full p-8">
      {/* Header Section */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-start justify-between">
          <div>
            <h1 className="mb-2">{currentContent.title}</h1>
            <p className="opacity-60">{currentContent.description}</p>
          </div>
          {currentContent.icon}
        </div>
      </motion.div>

      {/* AI Insights Banner */}
      <div className="mb-8">
        <AINotificationCard
          key={activeTab}
          message={currentContent.aiMessage}
          actionLabel={currentContent.actionLabel}
          onAction={() => toast.success(`Opening ${activeTab} recommendations...`)}
          animated={true}
        />
      </div>

      {/* Tabs Section */}
      <Tabs defaultValue="social" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="social" className="gap-2">
            <Instagram className="w-4 h-4" />
            Social Inspiration
          </TabsTrigger>
          <TabsTrigger value="email" className="gap-2">
            <Mail className="w-4 h-4" />
            Email Marketing
          </TabsTrigger>
          <TabsTrigger value="ads" className="gap-2">
            <Target className="w-4 h-4" />
            Ads Inspiration
          </TabsTrigger>
        </TabsList>

        <TabsContent value="social">
          <SocialInspiration />
        </TabsContent>

        <TabsContent value="email">
          <EmailMktInspiration />
        </TabsContent>

        <TabsContent value="ads">
          <AdsInspiration />
        </TabsContent>
      </Tabs>
    </div>
  );
}
