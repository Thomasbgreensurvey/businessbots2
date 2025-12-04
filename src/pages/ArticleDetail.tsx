import { motion } from "framer-motion";
import { ArrowLeft, Clock, User, ChevronRight } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

const articlesContent: Record<string, { title: string; category: string; readTime: string; content: string[] }> = {
  "how-to-set-up-your-first-ai-employee": {
    title: "How to set up your first AI Employee",
    category: "Getting Started",
    readTime: "5 min read",
    content: [
      "Getting started with your first AI Employee is simple and straightforward. This guide will walk you through the entire process from account creation to your first automated task.",
      "Step 1: Choose Your AI Employee - Browse our roster of specialised AI Employees. Each one is designed for specific tasks like email marketing, customer support, or lead generation. Select the one that best matches your immediate needs.",
      "Step 2: Configure Your Preferences - Once selected, you'll be guided through a setup wizard. Here you can customise your AI Employee's tone of voice, response style, and working hours to match your brand.",
      "Step 3: Connect Your Tools - Integrate your existing tools like CRM, email platforms, or social media accounts. Our AI Employees work seamlessly with popular platforms.",
      "Step 4: Set Your First Task - Start with a simple task to see your AI Employee in action. Monitor the results and adjust settings as needed.",
      "Pro Tip: Start small and gradually increase the complexity of tasks as you become more comfortable with your AI Employee's capabilities."
    ]
  },
  "connecting-to-your-crm": {
    title: "Connecting to your CRM",
    category: "Integrations",
    readTime: "4 min read",
    content: [
      "Connecting your CRM to Business Bots UK allows your AI Employees to access customer data, update records, and automate workflows seamlessly.",
      "Supported CRMs: We currently support Salesforce, HubSpot, Pipedrive, Zoho CRM, and many others. If your CRM isn't listed, contact our support team.",
      "Step 1: Navigate to Integrations - Go to your dashboard and click on 'Integrations' in the sidebar. Find your CRM from the list of available integrations.",
      "Step 2: Authenticate - Click 'Connect' and follow the authentication flow. You'll need admin access to your CRM to complete this step.",
      "Step 3: Configure Permissions - Choose which data your AI Employees can access. We recommend starting with read-only access and expanding as needed.",
      "Step 4: Test the Connection - Use the 'Test Connection' button to verify everything is working correctly before going live."
    ]
  },
  "customizing-ai-responses": {
    title: "Customizing AI responses",
    category: "Using AI Employees",
    readTime: "6 min read",
    content: [
      "Every business has its own voice and style. Learn how to customise your AI Employee's responses to match your brand perfectly.",
      "Tone Settings: Choose from professional, friendly, casual, or formal tones. You can also create custom tone profiles that blend multiple styles.",
      "Response Templates: Create templates for common scenarios. Your AI Employee will use these as a foundation while still maintaining natural conversation flow.",
      "Brand Guidelines: Upload your brand guidelines document and your AI Employee will automatically align its communication style.",
      "Forbidden Words & Phrases: Specify any words or phrases your AI Employee should never use. This helps maintain brand consistency and avoid potential issues.",
      "Testing Your Settings: Use the preview feature to see how your AI Employee will respond before going live. Make adjustments until you're satisfied with the results."
    ]
  },
  "setting-up-automated-workflows": {
    title: "Setting up automated workflows",
    category: "Using AI Employees",
    readTime: "7 min read",
    content: [
      "Automated workflows allow your AI Employees to handle complex, multi-step processes without manual intervention.",
      "What is a Workflow? A workflow is a series of connected actions that trigger automatically based on specific conditions. For example, when a new lead comes in, your AI Employee can qualify them, send a welcome email, and schedule a follow-up.",
      "Creating Your First Workflow: Start with the workflow builder in your dashboard. Drag and drop actions to create your desired sequence.",
      "Triggers: Choose what starts your workflow - new form submission, time-based schedules, CRM updates, or custom API calls.",
      "Actions: Add actions like sending emails, updating records, creating tasks, or notifying team members.",
      "Testing: Always test your workflows with sample data before activating them. Use our sandbox environment to ensure everything works as expected."
    ]
  },
  "understanding-usage-and-billing": {
    title: "Understanding usage and billing",
    category: "Getting Started",
    readTime: "3 min read",
    content: [
      "Understanding how billing works helps you manage costs and get the most value from your AI Employees.",
      "Usage-Based Pricing: You're billed based on the tasks your AI Employees complete. Each plan includes a monthly allowance with competitive rates for additional usage.",
      "Viewing Your Usage: Check your dashboard for real-time usage statistics. You can see breakdowns by AI Employee, task type, and time period.",
      "Setting Limits: Set usage caps to control costs. Your AI Employees will pause when limits are reached and notify you.",
      "Billing Cycle: Invoices are generated monthly. You can download detailed reports for accounting purposes.",
      "Need Help? Our support team is available to help you optimise your plan and answer any billing questions."
    ]
  },
  "quick-start-guide": {
    title: "Quick start guide",
    category: "Getting Started",
    readTime: "4 min read",
    content: [
      "Welcome to Business Bots UK! This quick start guide will have you up and running in just a few minutes.",
      "1. Create Your Account: Sign up with your email and verify your account. No credit card required to get started.",
      "2. Explore the Dashboard: Familiarise yourself with the main navigation. Your AI Employees, integrations, and analytics are all accessible from here.",
      "3. Select an AI Employee: Browse our team and select one that matches your needs. You can always add more later.",
      "4. Complete the Setup Wizard: Follow the guided setup to configure your first AI Employee with your preferences.",
      "5. Start Your First Task: Assign a simple task and watch your AI Employee in action. That's it - you're ready to go!"
    ]
  },
  "understanding-the-dashboard": {
    title: "Understanding the dashboard",
    category: "Getting Started",
    readTime: "5 min read",
    content: [
      "Your dashboard is the command centre for all your AI Employees. Here's a comprehensive overview of each section.",
      "Home Overview: See a snapshot of all activity, recent tasks, and quick stats at a glance.",
      "AI Employees Tab: Manage your team of AI Employees. View their status, configure settings, and monitor performance.",
      "Integrations: Connect and manage your third-party tools and platforms.",
      "Analytics: Deep dive into performance metrics, task completion rates, and ROI tracking.",
      "Settings: Configure account preferences, team members, billing, and security options."
    ]
  },
  "training-your-ai-employee": {
    title: "Training your AI Employee",
    category: "Using AI Employees",
    readTime: "6 min read",
    content: [
      "Training helps your AI Employee understand your specific business context and deliver better results over time.",
      "Knowledge Base: Upload documents, FAQs, and guides that your AI Employee can reference when handling tasks.",
      "Example Conversations: Provide examples of ideal responses for common scenarios. This helps establish the right tone and approach.",
      "Feedback Loop: Rate your AI Employee's responses to help it learn and improve. Good feedback leads to better performance.",
      "Custom Instructions: Add specific instructions for unique situations or edge cases your AI Employee might encounter.",
      "Regular Updates: Keep training materials current as your business evolves. Schedule quarterly reviews to maintain accuracy."
    ]
  },
  "best-practices-for-prompts": {
    title: "Best practices for prompts",
    category: "Using AI Employees",
    readTime: "5 min read",
    content: [
      "The quality of your prompts directly affects your AI Employee's output. Follow these best practices for optimal results.",
      "Be Specific: Vague instructions lead to vague results. Clearly state what you want, including format, length, and style.",
      "Provide Context: Give background information that helps your AI Employee understand the situation better.",
      "Use Examples: When possible, include examples of what good output looks like.",
      "Break Down Complex Tasks: Large tasks should be broken into smaller, manageable steps.",
      "Iterate and Refine: Don't expect perfection on the first try. Review outputs and adjust your prompts accordingly."
    ]
  },
  "managing-multiple-ai-employees": {
    title: "Managing multiple AI Employees",
    category: "Using AI Employees",
    readTime: "4 min read",
    content: [
      "As your needs grow, you may want to deploy multiple AI Employees. Here's how to manage them effectively.",
      "Role Assignment: Assign clear roles to each AI Employee to avoid overlap and confusion.",
      "Communication Between Employees: Set up handoffs so AI Employees can collaborate on complex tasks.",
      "Centralised Dashboard: Use the team view to monitor all AI Employees from one place.",
      "Resource Allocation: Distribute workload based on capacity and specialisation.",
      "Performance Comparison: Use analytics to compare performance and identify top performers."
    ]
  },
  "email-integration-setup": {
    title: "Email integration setup",
    category: "Integrations",
    readTime: "4 min read",
    content: [
      "Connect your email service to enable your AI Employees to send, receive, and manage emails on your behalf.",
      "Supported Providers: We support Gmail, Outlook, Yahoo, and custom SMTP servers.",
      "OAuth Connection: For Gmail and Outlook, use our secure OAuth connection for the easiest setup.",
      "SMTP Configuration: For other providers, enter your SMTP credentials in the integration settings.",
      "Email Templates: Create branded email templates your AI Employee can use for consistent communication.",
      "Sending Limits: Be aware of your email provider's sending limits to avoid delivery issues."
    ]
  },
  "slack-and-teams-integration": {
    title: "Slack and Teams integration",
    category: "Integrations",
    readTime: "3 min read",
    content: [
      "Integrate with Slack or Microsoft Teams to receive notifications and interact with your AI Employees directly in your workspace.",
      "Installation: Add the Business Bots UK app to your workspace from the respective app marketplace.",
      "Channel Setup: Choose which channels your AI Employees can access and post to.",
      "Commands: Use slash commands to interact with your AI Employees directly in chat.",
      "Notifications: Configure what events trigger notifications and where they're sent.",
      "Security: Review and approve permissions to ensure your workspace data stays secure."
    ]
  },
  "api-documentation-overview": {
    title: "API documentation overview",
    category: "Integrations",
    readTime: "5 min read",
    content: [
      "Our REST API allows you to integrate Business Bots UK functionality into your own applications and workflows.",
      "Authentication: Use API keys for authentication. Generate keys in your dashboard under Settings > API.",
      "Base URL: All API requests use https://api.businessbotsuk.com/v1 as the base URL.",
      "Rate Limits: Free tier allows 100 requests per hour. Paid plans have higher limits.",
      "Endpoints: Key endpoints include /employees, /tasks, /conversations, and /analytics.",
      "SDKs: We offer official SDKs for JavaScript, Python, and PHP to simplify integration."
    ]
  },
  "troubleshooting-common-issues": {
    title: "Troubleshooting common issues",
    category: "Video Tutorials",
    readTime: "6 min read",
    content: [
      "Encountering issues? Here are solutions to the most common problems users face.",
      "AI Employee Not Responding: Check that your AI Employee is activated and not paused. Verify your usage limits haven't been exceeded.",
      "Integration Connection Failed: Re-authenticate the integration. Ensure you have the necessary permissions on the third-party platform.",
      "Unexpected Responses: Review your training materials and prompts. Consider adding more context or examples.",
      "Slow Performance: High traffic periods may cause delays. Check our status page for any known issues.",
      "Still Need Help? Contact our support team through the Help Centre or email support@businessbotsuk.com."
    ]
  }
};

const relatedArticles = [
  "Quick start guide",
  "Understanding the dashboard",
  "Best practices for prompts"
];

const ArticleDetail = () => {
  const navigate = useNavigate();
  const { slug } = useParams<{ slug: string }>();
  
  const article = slug ? articlesContent[slug] : null;

  if (!article) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Article not found</h1>
          <button
            onClick={() => navigate("/help-centre")}
            className="text-cyan-600 hover:text-cyan-700 font-medium"
          >
            Return to Help Centre
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate("/help-centre")}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Help Centre</span>
          </button>
        </div>
      </header>

      {/* Article Header */}
      <section className="bg-gradient-to-br from-cyan-500 via-blue-500 to-cyan-600 py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="inline-block px-3 py-1 bg-white/20 text-white rounded-full text-sm font-medium mb-4">
              {article.category}
            </span>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
              {article.title}
            </h1>
            <div className="flex items-center gap-4 text-white/80">
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {article.readTime}
              </span>
              <span className="flex items-center gap-1">
                <User className="w-4 h-4" />
                Business Bots UK Team
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Article Content */}
      <section className="py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="prose prose-lg max-w-none"
          >
            {article.content.map((paragraph, index) => (
              <p key={index} className="text-gray-700 mb-6 text-lg leading-relaxed">
                {paragraph}
              </p>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Related Articles */}
      <section className="py-12 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Related articles</h2>
          <div className="space-y-3">
            {relatedArticles.map((title) => {
              const articleSlug = title.toLowerCase().replace(/\s+/g, '-');
              return (
                <button
                  key={title}
                  onClick={() => navigate(`/help-centre/article/${articleSlug}`)}
                  className="w-full flex items-center justify-between p-4 bg-white rounded-xl hover:bg-gray-100 transition-colors text-left"
                >
                  <span className="text-gray-900 font-medium">{title}</span>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-gray-600 mb-4">Was this article helpful?</p>
          <div className="flex gap-3 justify-center">
            <button className="px-6 py-2 bg-cyan-600 text-white rounded-lg font-medium hover:bg-cyan-700 transition-colors">
              Yes, thanks!
            </button>
            <button className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors">
              Not really
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ArticleDetail;
