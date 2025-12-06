import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

const SKOOL_BLUE = "#4B5FD1";

const articlesContent: Record<string, { 
  title: string; 
  category: string; 
  date: string;
  readTime: string; 
  content: string[];
  relatedSlugs: string[];
}> = {
  "ai-employees-transforming-small-businesses": {
    title: "How AI Employees Are Transforming Small Businesses",
    category: "AI Insights",
    date: "Dec 2, 2024",
    readTime: "5 min read",
    content: [
      "The landscape of small business operations is undergoing a radical transformation. AI employees are no longer a futuristic concept—they're here, and they're changing the game for entrepreneurs and small business owners everywhere.",
      "For decades, small businesses faced a fundamental challenge: how to compete with larger companies that have more resources, more staff, and more capacity. The answer has always been to work smarter, not harder. But even the smartest strategies hit a wall when you simply don't have enough hours in the day.",
      "Enter AI employees. These digital team members can handle customer inquiries at 3 AM, send personalised follow-up emails to hundreds of leads, and manage social media accounts—all while you focus on the strategic decisions that actually grow your business.",
      "Consider Sarah, who runs a boutique marketing agency. Before adopting AI employees, she was drowning in administrative tasks: responding to initial client inquiries, scheduling meetings, sending follow-up emails. Now, her AI employee handles all of this, freeing her to focus on creative strategy and client relationships.",
      "The numbers tell a compelling story. Small businesses using AI employees report an average of 40% reduction in time spent on repetitive tasks, a 60% improvement in response times to customer inquiries, and a 25% increase in lead conversion rates.",
      "But perhaps the most significant transformation isn't in the metrics—it's in the quality of life. Business owners are reclaiming their evenings and weekends. They're no longer slaves to their inboxes. They're able to be present with their families while knowing their business is still running smoothly.",
      "The key to success with AI employees is understanding they're not replacements for human creativity and judgment. They're amplifiers. They handle the routine so you can focus on the exceptional. They maintain consistency so you can drive innovation.",
      "If you're a small business owner still on the fence about AI employees, consider this: your competitors are already exploring these tools. The question isn't whether AI will transform small business operations—it's whether you'll be leading that transformation or playing catch-up."
    ],
    relatedSlugs: ["future-of-customer-support", "building-your-ai-team"]
  },
  "future-of-customer-support": {
    title: "The Future of Customer Support: AI vs Human",
    category: "Customer Support",
    date: "Nov 28, 2024",
    readTime: "7 min read",
    content: [
      "The debate between AI and human customer support has reached a fever pitch. But framing it as a competition misses the point entirely. The future isn't AI versus humans—it's AI and humans working in harmony.",
      "Let's start with what AI does brilliantly. AI never sleeps. It can handle thousands of conversations simultaneously. It doesn't have bad days. It remembers every interaction with perfect accuracy. For straightforward queries—'Where's my order?' 'What are your opening hours?' 'How do I reset my password?'—AI provides instant, accurate responses that customers actually prefer.",
      "But here's where things get nuanced. Not every customer interaction is straightforward. Sometimes people are frustrated. Sometimes they have complex problems that require creative solutions. Sometimes they just need to feel heard by another human being.",
      "The magic happens when you combine both. Imagine a support system where AI handles the initial contact, gathers relevant information, and either resolves simple issues instantly or prepares a comprehensive brief for a human agent. The customer gets speed and accuracy from AI, empathy and creativity from humans.",
      "Forward-thinking companies are already implementing this hybrid model. They're seeing 80% of routine queries resolved by AI, freeing human agents to spend more time on complex cases. Customer satisfaction scores are rising because people get quick answers for simple questions and thoughtful attention for difficult ones.",
      "The key insight is that AI doesn't replace the need for excellent human support—it reveals it. When AI handles the mundane, the moments that require human touch become more apparent and more valuable.",
      "For businesses, the question shouldn't be 'Should we use AI or humans?' but rather 'How do we design a system that gives customers exactly what they need, when they need it?'",
      "The future of customer support is hybrid. The companies that figure out the right balance first will have a significant competitive advantage. Those that cling to all-human or attempt all-AI will find themselves outpaced by more adaptive competitors."
    ],
    relatedSlugs: ["ai-employees-transforming-small-businesses", "automate-email-marketing"]
  },
  "automate-email-marketing": {
    title: "5 Ways to Automate Your Email Marketing Today",
    category: "Marketing",
    date: "Nov 22, 2024",
    readTime: "4 min read",
    content: [
      "Email marketing remains one of the highest-ROI channels available to businesses. Yet many companies leave money on the table by not automating their email workflows. Here are five automations you can implement today.",
      "Welcome Sequences: When someone joins your list, they're at peak interest. Don't waste it with a single 'Thanks for subscribing' email. Create a 5-7 email welcome sequence that introduces your brand, provides immediate value, and guides new subscribers toward their first purchase or engagement.",
      "Abandoned Cart Recovery: If you run an e-commerce business and aren't sending abandoned cart emails, you're leaving significant revenue on the table. A simple three-email sequence—sent at 1 hour, 24 hours, and 72 hours after abandonment—can recover 10-15% of lost sales.",
      "Re-engagement Campaigns: Subscribers who haven't opened your emails in 90 days are at risk of churning. An automated re-engagement sequence can win back a significant percentage of these dormant subscribers—and automatically clean your list of those who don't respond.",
      "Post-Purchase Follow-ups: The relationship doesn't end at purchase—it's just beginning. Automated follow-up emails can request reviews, suggest complementary products, and provide usage tips that increase customer lifetime value.",
      "Birthday and Anniversary Emails: Personal touches go a long way. Automated birthday emails with special offers have some of the highest open and conversion rates of any email type. If you're collecting birthdates, you should be using them.",
      "The beauty of email automation is that once you set it up, it runs forever. You're essentially creating sales systems that work while you sleep, building relationships with customers at scale without requiring your constant attention."
    ],
    relatedSlugs: ["building-your-ai-team", "ai-employees-transforming-small-businesses"]
  },
  "building-your-ai-team": {
    title: "Building Your AI Team: A Step-by-Step Guide",
    category: "Getting Started",
    date: "Nov 15, 2024",
    readTime: "8 min read",
    content: [
      "Building an effective AI team isn't about throwing technology at problems. It's about strategic planning, careful implementation, and continuous optimisation. Here's how to do it right.",
      "Start with Pain Points: Before you even look at AI solutions, identify your biggest operational bottlenecks. Where are you spending the most time on repetitive tasks? Where do mistakes happen most often? Where are customers experiencing friction? These pain points are your starting targets.",
      "Choose Your First AI Employee Wisely: Don't try to automate everything at once. Pick one area—ideally one that's high-impact but relatively straightforward—and start there. For most businesses, customer support or email marketing are excellent starting points because they offer quick wins and clear metrics.",
      "Set Clear Expectations: AI employees are incredibly capable, but they're not magic. Define what success looks like before you deploy. What metrics will you track? What improvement are you expecting? How will you measure ROI?",
      "Plan Your Integration: Your AI employees need to connect with your existing tools. Map out your current tech stack and ensure compatibility. Most modern AI solutions offer integrations with popular CRMs, email platforms, and helpdesk software, but it's worth confirming before you commit.",
      "Train Thoroughly: Like human employees, AI employees need training. Provide examples of ideal responses. Share your brand guidelines. Define edge cases and escalation procedures. The more context you provide, the better your AI employees will perform.",
      "Monitor and Iterate: The first version of any AI implementation is never the final version. Monitor performance closely in the early days. Gather feedback from both customers and internal teams. Make adjustments. This iteration process is how good AI implementations become great ones.",
      "Scale Strategically: Once your first AI employee is running smoothly, you can expand. Add AI employees to adjacent areas. Build on what you've learned. Create an AI team that works together seamlessly—and works seamlessly with your human team too."
    ],
    relatedSlugs: ["ai-employees-transforming-small-businesses", "future-of-customer-support"]
  }
};

const BlogArticle = () => {
  const navigate = useNavigate();
  const { slug } = useParams<{ slug: string }>();
  
  const article = slug ? articlesContent[slug] : null;

  if (!article) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Article not found</h1>
          <p className="text-gray-600 mb-8">The article you're looking for doesn't exist or has been moved.</p>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate("/blog")}
            className="px-6 py-3 rounded-full font-medium text-white"
            style={{ backgroundColor: SKOOL_BLUE }}
          >
            Back to Blog
          </motion.button>
        </motion.div>
      </div>
    );
  }

  const relatedArticles = article.relatedSlugs
    .map(s => articlesContent[s] ? { slug: s, ...articlesContent[s] } : null)
    .filter(Boolean);

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* Header */}
      <motion.header 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100"
      >
        <div className="max-w-4xl mx-auto px-4 py-4">
          <motion.button
            whileHover={{ x: -3 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/blog")}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to Blog</span>
          </motion.button>
        </div>
      </motion.header>

      {/* Article Header */}
      <section className="py-12 md:py-20 px-4 bg-white">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span 
              className="inline-block px-3 py-1 rounded-full text-sm font-medium mb-6"
              style={{ backgroundColor: `${SKOOL_BLUE}10`, color: SKOOL_BLUE }}
            >
              {article.category}
            </span>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              {article.title}
            </h1>
            <div className="flex items-center gap-4 text-gray-500">
              <span>{article.date}</span>
              <span>·</span>
              <span>{article.readTime}</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-3xl mx-auto px-4">
        <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
      </div>

      {/* Article Content */}
      <section className="py-12 md:py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {article.content.map((paragraph, index) => (
              <motion.p 
                key={index} 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.05 }}
                className="text-lg text-gray-700 mb-6 leading-relaxed"
              >
                {paragraph}
              </motion.p>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Related Articles */}
      {relatedArticles.length > 0 && (
        <section className="py-12 px-4 border-t border-gray-100">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Related Articles</h2>
            <div className="space-y-4">
              {relatedArticles.map((related: any) => (
                <motion.button
                  key={related.slug}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => navigate(`/blog/${related.slug}`)}
                  className="w-full text-left p-6 rounded-xl border border-gray-100 hover:border-gray-200 hover:shadow-md transition-all"
                >
                  <span 
                    className="text-sm font-medium"
                    style={{ color: SKOOL_BLUE }}
                  >
                    {related.category}
                  </span>
                  <h3 className="text-lg font-semibold text-gray-900 mt-1">{related.title}</h3>
                </motion.button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-gray-100">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-gray-500 text-sm">
            © 2024 Business Bots UK. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default BlogArticle;
