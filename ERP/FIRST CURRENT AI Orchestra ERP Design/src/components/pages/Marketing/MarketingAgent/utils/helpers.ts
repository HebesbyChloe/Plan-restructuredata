import { AgentType } from "../types";

export const generateAIResponse = (userInput: string, agentType: AgentType): string => {
  const responses = {
    marketing: `I understand you're asking about "${userInput}". As your AI Marketing Agent, I can help you with:\n\n• Campaign strategy and planning\n• Performance analytics and insights\n• Content creation and optimization\n• Budget allocation recommendations\n• Audience targeting strategies\n\nWhich aspect would you like to explore first?`,
    copywriter: `Great question about "${userInput}"! As your Copywriter Agent, I can assist you with:\n\n• Crafting compelling headlines and CTAs\n• Writing persuasive product descriptions\n• Creating engaging email copy\n• Developing brand voice guidelines\n• A/B testing copy variations\n\nLet's create something amazing together!`,
    analytics: `Analyzing "${userInput}" for you. As your Data Analytics Agent, I can provide:\n\n• Comprehensive performance metrics\n• Trend analysis and forecasting\n• ROI calculations and insights\n• Customer behavior patterns\n• Data-driven optimization recommendations\n\nWhat specific metrics would you like to dive into?`,
    ecommerce: `Looking at "${userInput}" from an e-commerce perspective. I can help you with:\n\n• Product page optimization\n• Conversion rate improvements\n• Cart abandonment solutions\n• Pricing strategy analysis\n• Customer retention tactics\n\nWhich area should we focus on first?`,
    design: `Considering "${userInput}" from a design standpoint. As your Visual & Design Agent, I can guide you on:\n\n• Brand visual consistency\n• Color theory and palettes\n• Layout and composition principles\n• Accessibility and user experience\n• Visual content strategy\n\nWhat design challenge can I help solve?`,
  };

  return responses[agentType];
};
