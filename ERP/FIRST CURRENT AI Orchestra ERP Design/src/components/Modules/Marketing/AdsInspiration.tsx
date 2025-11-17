import React, { useState } from 'react';
import { Card } from '../../ui/card';
import { Target, Sparkles, Zap, TrendingUp, DollarSign, MousePointer, Video, Image as ImageIcon, FileText } from 'lucide-react';
import { motion } from 'motion/react';
import { toast } from 'sonner';
import { Badge } from '../../ui/badge';
import { SubTabs, SubTabsList, SubTabsTrigger, SubTabsContent } from '../Global/SubTab';

export default function AdsInspiration() {
  const [selectedFormat, setSelectedFormat] = useState<string>('all');

  // Mock data for different ad formats
  const displayAds = [
    { id: 1, title: 'Summer Sale Banner', ctr: '3.8%', conversions: '245', format: 'display' },
    { id: 2, title: 'Product Showcase Display', ctr: '4.2%', conversions: '312', format: 'display' },
    { id: 3, title: 'Brand Awareness Banner', ctr: '3.5%', conversions: '198', format: 'display' },
  ];

  const videoAds = [
    { id: 4, title: 'Product Demo 15s', ctr: '8.5%', conversions: '521', format: 'video' },
    { id: 5, title: 'Customer Testimonial 30s', ctr: '7.8%', conversions: '468', format: 'video' },
    { id: 6, title: 'Brand Story 60s', ctr: '9.2%', conversions: '634', format: 'video' },
  ];

  const socialAds = [
    { id: 7, title: 'Instagram Story Ad', ctr: '6.5%', conversions: '389', format: 'social' },
    { id: 8, title: 'Facebook Carousel Ad', ctr: '5.9%', conversions: '412', format: 'social' },
    { id: 9, title: 'LinkedIn Sponsored Post', ctr: '4.8%', conversions: '267', format: 'social' },
  ];

  const searchAds = [
    { id: 10, title: 'High-Intent Keyword Ad', ctr: '12.5%', conversions: '845', format: 'search' },
    { id: 11, title: 'Local Search Ad', ctr: '10.8%', conversions: '692', format: 'search' },
    { id: 12, title: 'Competitor Keyword Ad', ctr: '9.5%', conversions: '578', format: 'search' },
  ];

  const renderAdCard = (ad: any, icon: React.ReactNode, gradient: string) => (
    <motion.div
      key={ad.id}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="p-6 bg-white/5 backdrop-blur-md border-white/10 hover:bg-white/10 transition-all cursor-pointer group">
        <div className={`aspect-video bg-gradient-to-br ${gradient} rounded-lg mb-4 flex items-center justify-center overflow-hidden relative`}>
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="flex flex-col items-center gap-2">
            {icon}
            <div className="text-white/40 text-xs uppercase tracking-wide">{ad.format} Ad</div>
          </div>
          <div className="absolute top-3 right-3">
            <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
              High Performer
            </Badge>
          </div>
          <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
            <Badge className="bg-[#4B6BFB]">View Details</Badge>
          </div>
        </div>
        <h3 className="text-white mb-3">{ad.title}</h3>
        <div className="flex items-center gap-4 text-sm text-white/60">
          <div className="flex items-center gap-1">
            <MousePointer className="w-4 h-4" />
            {ad.ctr} CTR
          </div>
          <div className="flex items-center gap-1">
            <Target className="w-4 h-4" />
            {ad.conversions}
          </div>
        </div>
      </Card>
    </motion.div>
  );

  return (
    <div className="w-full">
      {/* Sub-Tabs Section */}
      <SubTabs value={selectedFormat} onValueChange={setSelectedFormat}>
        <SubTabsList>
          <SubTabsTrigger value="all" icon={<Sparkles className="w-4 h-4" />}>
            All Formats
          </SubTabsTrigger>
          <SubTabsTrigger value="display" icon={<ImageIcon className="w-4 h-4" />}>
            Display Ads
          </SubTabsTrigger>
          <SubTabsTrigger value="video" icon={<Video className="w-4 h-4" />}>
            Video Ads
          </SubTabsTrigger>
          <SubTabsTrigger value="social" icon={<Zap className="w-4 h-4" />}>
            Social Ads
          </SubTabsTrigger>
          <SubTabsTrigger value="search" icon={<FileText className="w-4 h-4" />}>
            Search Ads
          </SubTabsTrigger>
        </SubTabsList>

        <SubTabsContent value="all">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {renderAdCard(displayAds[0], <ImageIcon className="w-10 h-10 text-white/60" />, 'from-blue-500/20 to-indigo-500/20')}
            {renderAdCard(videoAds[0], <Video className="w-10 h-10 text-white/60" />, 'from-purple-500/20 to-pink-500/20')}
            {renderAdCard(socialAds[0], <Zap className="w-10 h-10 text-white/60" />, 'from-green-500/20 to-emerald-500/20')}
            {renderAdCard(searchAds[0], <FileText className="w-10 h-10 text-white/60" />, 'from-orange-500/20 to-red-500/20')}
            {renderAdCard(displayAds[1], <ImageIcon className="w-10 h-10 text-white/60" />, 'from-blue-500/20 to-indigo-500/20')}
            {renderAdCard(videoAds[1], <Video className="w-10 h-10 text-white/60" />, 'from-purple-500/20 to-pink-500/20')}
          </div>
        </SubTabsContent>

        <SubTabsContent value="display">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayAds.map((ad) => 
              renderAdCard(ad, <ImageIcon className="w-10 h-10 text-white/60" />, 'from-blue-500/20 to-indigo-500/20')
            )}
          </div>
        </SubTabsContent>

        <SubTabsContent value="video">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videoAds.map((ad) => 
              renderAdCard(ad, <Video className="w-10 h-10 text-white/60" />, 'from-purple-500/20 to-pink-500/20')
            )}
          </div>
        </SubTabsContent>

        <SubTabsContent value="social">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {socialAds.map((ad) => 
              renderAdCard(ad, <Zap className="w-10 h-10 text-white/60" />, 'from-green-500/20 to-emerald-500/20')
            )}
          </div>
        </SubTabsContent>

        <SubTabsContent value="search">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {searchAds.map((ad) => 
              renderAdCard(ad, <FileText className="w-10 h-10 text-white/60" />, 'from-orange-500/20 to-red-500/20')
            )}
          </div>
        </SubTabsContent>
      </SubTabs>
    </div>
  );
}
