import React, { useState } from 'react';
import { Card } from '../../ui/card';
import { Instagram, Facebook, Twitter, Linkedin, TrendingUp, Heart, MessageCircle, Share2, Eye } from 'lucide-react';
import { motion } from 'motion/react';
import { toast } from 'sonner';
import { Badge } from '../../ui/badge';
import { SubTabs, SubTabsList, SubTabsTrigger, SubTabsContent } from '../Global/SubTab';

export default function SocialInspiration() {
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all');

  // Mock data for different platforms
  const instagramPosts = [
    { id: 1, title: 'Product Showcase Reel', engagement: '12.5K', likes: '8.2K', platform: 'instagram' },
    { id: 2, title: 'Behind The Scenes', engagement: '9.8K', likes: '6.5K', platform: 'instagram' },
    { id: 3, title: 'User Generated Content', engagement: '15.2K', likes: '11.3K', platform: 'instagram' },
  ];

  const facebookPosts = [
    { id: 4, title: 'Community Event Announcement', engagement: '5.4K', likes: '3.2K', platform: 'facebook' },
    { id: 5, title: 'Customer Testimonial', engagement: '7.1K', likes: '4.8K', platform: 'facebook' },
    { id: 6, title: 'Product Launch Video', engagement: '18.5K', likes: '13.2K', platform: 'facebook' },
  ];

  const twitterPosts = [
    { id: 7, title: 'Industry Insights Thread', engagement: '3.2K', likes: '2.1K', platform: 'twitter' },
    { id: 8, title: 'Quick Tips Series', engagement: '4.5K', likes: '3.3K', platform: 'twitter' },
    { id: 9, title: 'Trending Topic Commentary', engagement: '6.8K', likes: '5.2K', platform: 'twitter' },
  ];

  const linkedinPosts = [
    { id: 10, title: 'Thought Leadership Article', engagement: '8.9K', likes: '6.4K', platform: 'linkedin' },
    { id: 11, title: 'Company Culture Highlight', engagement: '5.6K', likes: '4.1K', platform: 'linkedin' },
    { id: 12, title: 'Industry Report Share', engagement: '12.3K', likes: '9.7K', platform: 'linkedin' },
  ];

  return (
    <div className="w-full">
      {/* Sub-Tabs Section */}
      <SubTabs value={selectedPlatform} onValueChange={setSelectedPlatform}>
        <SubTabsList>
          <SubTabsTrigger value="all" icon={<TrendingUp className="w-4 h-4" />}>
            All Platforms
          </SubTabsTrigger>
          <SubTabsTrigger value="instagram" icon={<Instagram className="w-4 h-4" />}>
            Instagram
          </SubTabsTrigger>
          <SubTabsTrigger value="facebook" icon={<Facebook className="w-4 h-4" />}>
            Facebook
          </SubTabsTrigger>
          <SubTabsTrigger value="twitter" icon={<Twitter className="w-4 h-4" />}>
            Twitter
          </SubTabsTrigger>
          <SubTabsTrigger value="linkedin" icon={<Linkedin className="w-4 h-4" />}>
            LinkedIn
          </SubTabsTrigger>
        </SubTabsList>

        <SubTabsContent value="all">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...instagramPosts.slice(0, 1), ...facebookPosts.slice(0, 1), ...twitterPosts.slice(0, 1), ...linkedinPosts.slice(0, 1), ...instagramPosts.slice(1, 2), ...facebookPosts.slice(1, 2)].map((post) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="p-6 bg-white/5 backdrop-blur-md border-white/10 hover:bg-white/10 transition-all cursor-pointer group">
                  <div className="aspect-square bg-gradient-to-br from-[#4B6BFB]/20 to-purple-500/20 rounded-lg mb-4 flex items-center justify-center overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="flex gap-3">
                      {post.platform === 'instagram' && <Instagram className="w-8 h-8 text-white/60" />}
                      {post.platform === 'facebook' && <Facebook className="w-8 h-8 text-white/60" />}
                      {post.platform === 'twitter' && <Twitter className="w-8 h-8 text-white/60" />}
                      {post.platform === 'linkedin' && <Linkedin className="w-8 h-8 text-white/60" />}
                    </div>
                    <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Badge className="bg-[#4B6BFB]">View</Badge>
                    </div>
                  </div>
                  <h3 className="text-white mb-2">{post.title}</h3>
                  <div className="flex items-center gap-4 text-sm text-white/60">
                    <div className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      {post.engagement}
                    </div>
                    <div className="flex items-center gap-1">
                      <Heart className="w-4 h-4" />
                      {post.likes}
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </SubTabsContent>

        <SubTabsContent value="instagram">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {instagramPosts.map((post) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="p-6 bg-white/5 backdrop-blur-md border-white/10 hover:bg-white/10 transition-all cursor-pointer group">
                  <div className="aspect-square bg-gradient-to-br from-pink-500/20 to-purple-500/20 rounded-lg mb-4 flex items-center justify-center overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <Instagram className="w-12 h-12 text-white/60" />
                    <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Badge className="bg-[#4B6BFB]">View</Badge>
                    </div>
                  </div>
                  <h3 className="text-white mb-2">{post.title}</h3>
                  <div className="flex items-center gap-4 text-sm text-white/60">
                    <div className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      {post.engagement}
                    </div>
                    <div className="flex items-center gap-1">
                      <Heart className="w-4 h-4" />
                      {post.likes}
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </SubTabsContent>

        <SubTabsContent value="facebook">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {facebookPosts.map((post) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="p-6 bg-white/5 backdrop-blur-md border-white/10 hover:bg-white/10 transition-all cursor-pointer group">
                  <div className="aspect-square bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-lg mb-4 flex items-center justify-center overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <Facebook className="w-12 h-12 text-white/60" />
                    <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Badge className="bg-[#4B6BFB]">View</Badge>
                    </div>
                  </div>
                  <h3 className="text-white mb-2">{post.title}</h3>
                  <div className="flex items-center gap-4 text-sm text-white/60">
                    <div className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      {post.engagement}
                    </div>
                    <div className="flex items-center gap-1">
                      <Heart className="w-4 h-4" />
                      {post.likes}
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </SubTabsContent>

        <SubTabsContent value="twitter">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {twitterPosts.map((post) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="p-6 bg-white/5 backdrop-blur-md border-white/10 hover:bg-white/10 transition-all cursor-pointer group">
                  <div className="aspect-square bg-gradient-to-br from-sky-500/20 to-blue-500/20 rounded-lg mb-4 flex items-center justify-center overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <Twitter className="w-12 h-12 text-white/60" />
                    <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Badge className="bg-[#4B6BFB]">View</Badge>
                    </div>
                  </div>
                  <h3 className="text-white mb-2">{post.title}</h3>
                  <div className="flex items-center gap-4 text-sm text-white/60">
                    <div className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      {post.engagement}
                    </div>
                    <div className="flex items-center gap-1">
                      <Heart className="w-4 h-4" />
                      {post.likes}
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </SubTabsContent>

        <SubTabsContent value="linkedin">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {linkedinPosts.map((post) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="p-6 bg-white/5 backdrop-blur-md border-white/10 hover:bg-white/10 transition-all cursor-pointer group">
                  <div className="aspect-square bg-gradient-to-br from-blue-600/20 to-indigo-500/20 rounded-lg mb-4 flex items-center justify-center overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <Linkedin className="w-12 h-12 text-white/60" />
                    <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Badge className="bg-[#4B6BFB]">View</Badge>
                    </div>
                  </div>
                  <h3 className="text-white mb-2">{post.title}</h3>
                  <div className="flex items-center gap-4 text-sm text-white/60">
                    <div className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      {post.engagement}
                    </div>
                    <div className="flex items-center gap-1">
                      <Heart className="w-4 h-4" />
                      {post.likes}
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </SubTabsContent>
      </SubTabs>
    </div>
  );
}
