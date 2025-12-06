import { motion } from "framer-motion";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

const SKOOL_BLUE = "#4B5FD1";

const articlesContent: Record<string, { title: string; category: string; content: string[] }> = {
  "setup-first-ai-employee": {
    title: "How to set up your first AI Employee",
    category: "Getting Started",
    content: [
      "Getting started with your first AI Employee is simple and straightforward. This guide will walk you through the entire process from account creation to your first automated task.",
      "Step 1: Choose Your AI Employee — Browse our roster of specialised AI Employees. Each one is designed for specific tasks like email marketing, customer support, or lead generation. Select the one that best matches your immediate needs.",
      "Step 2: Configure Your Preferences — Once selected, you'll be guided through a setup wizard. Here you can customise your AI Employee's tone of voice, response style, and working hours to match your brand.",
      "Step 3: Connect Your Tools — Integrate your existing tools like CRM, email platforms, or social media accounts. Our AI Employees work seamlessly with popular platforms.",
      "Step 4: Set Your First Task — Start with a simple task to see your AI Employee in action. Monitor the results and adjust settings as needed.",
      "Pro Tip: Start small and gradually increase the complexity of tasks as you become more comfortable with your AI Employee's capabilities."
    ]
  },
  "quick-start-guide": {
    title: "Quick start guide",
    category: "Getting Started",
    content: [
      "Welcome to Business Bots UK! This quick start guide will have you up and running in just a few minutes.",
      "1. Create Your Account — Sign up with your email and verify your account. No credit card required to get started.",
      "2. Explore the Dashboard — Familiarise yourself with the main navigation. Your AI Employees, integrations, and analytics are all accessible from here.",
      "3. Select an AI Employee — Browse our team and select one that matches your needs. You can always add more later.",
      "4. Complete the Setup Wizard — Follow the guided setup to configure your first AI Employee with your preferences.",
      "5. Start Your First Task — Assign a simple task and watch your AI Employee in action. That's it - you're ready to go!"
    ]
  },
  "understanding-dashboard": {
    title: "Understanding the dashboard",
    category: "Getting Started",
    content: [
      "Your dashboard is the command centre for all your AI Employees. Here's a comprehensive overview of each section.",
      "Home Overview — See a snapshot of all activity, recent tasks, and quick stats at a glance.",
      "AI Employees Tab — Manage your team of AI Employees. View their status, configure settings, and monitor performance.",
      "Integrations — Connect and manage your third-party tools and platforms.",
      "Analytics — Deep dive into performance metrics, task completion rates, and ROI tracking.",
      "Settings — Configure account preferences, team members, billing, and security options."
    ]
  },
  "creating-account": {
    title: "Creating your account",
    category: "Getting Started",
    content: [
      "Creating your Business Bots UK account takes just a few minutes. Follow these steps to get started.",
      "Visit our website and click 'Get Started' or 'Sign Up' to begin the registration process.",
      "Enter your email address and create a secure password. We recommend using a mix of letters, numbers, and symbols.",
      "Check your inbox for a verification email and click the link to confirm your account.",
      "Complete your profile by adding your company name and selecting your industry.",
      "You're all set! Start exploring our AI Employees and find the perfect match for your business needs."
    ]
  },
  "customizing-responses": {
    title: "Customizing AI responses",
    category: "Using AI Employees",
    content: [
      "Every business has its own voice and style. Learn how to customise your AI Employee's responses to match your brand perfectly.",
      "Tone Settings — Choose from professional, friendly, casual, or formal tones. You can also create custom tone profiles that blend multiple styles.",
      "Response Templates — Create templates for common scenarios. Your AI Employee will use these as a foundation while still maintaining natural conversation flow.",
      "Brand Guidelines — Upload your brand guidelines document and your AI Employee will automatically align its communication style.",
      "Forbidden Words & Phrases — Specify any words or phrases your AI Employee should never use. This helps maintain brand consistency and avoid potential issues.",
      "Testing Your Settings — Use the preview feature to see how your AI Employee will respond before going live. Make adjustments until you're satisfied with the results."
    ]
  },
  "training-ai-employee": {
    title: "Training your AI Employee",
    category: "Using AI Employees",
    content: [
      "Training helps your AI Employee understand your specific business context and deliver better results over time.",
      "Knowledge Base — Upload documents, FAQs, and guides that your AI Employee can reference when handling tasks.",
      "Example Conversations — Provide examples of ideal responses for common scenarios. This helps establish the right tone and approach.",
      "Feedback Loop — Rate your AI Employee's responses to help it learn and improve. Good feedback leads to better performance.",
      "Custom Instructions — Add specific instructions for unique situations or edge cases your AI Employee might encounter.",
      "Regular Updates — Keep training materials current as your business evolves. Schedule quarterly reviews to maintain accuracy."
    ]
  },
  "best-practices-prompts": {
    title: "Best practices for prompts",
    category: "Using AI Employees",
    content: [
      "The quality of your prompts directly affects your AI Employee's output. Follow these best practices for optimal results.",
      "Be Specific — Vague instructions lead to vague results. Clearly state what you want, including format, length, and style.",
      "Provide Context — Give background information that helps your AI Employee understand the situation better.",
      "Use Examples — When possible, include examples of what good output looks like.",
      "Break Down Complex Tasks — Large tasks should be broken into smaller, manageable steps.",
      "Iterate and Refine — Don't expect perfection on the first try. Review outputs and adjust your prompts accordingly."
    ]
  },
  "managing-multiple-employees": {
    title: "Managing multiple AI Employees",
    category: "Using AI Employees",
    content: [
      "As your needs grow, you may want to deploy multiple AI Employees. Here's how to manage them effectively.",
      "Role Assignment — Assign clear roles to each AI Employee to avoid overlap and confusion.",
      "Communication Between Employees — Set up handoffs so AI Employees can collaborate on complex tasks.",
      "Centralised Dashboard — Use the team view to monitor all AI Employees from one place.",
      "Resource Allocation — Distribute workload based on capacity and specialisation.",
      "Performance Comparison — Use analytics to compare performance and identify top performers."
    ]
  },
  "connecting-crm": {
    title: "Connecting to your CRM",
    category: "Integrations",
    content: [
      "Connecting your CRM to Business Bots UK allows your AI Employees to access customer data, update records, and automate workflows seamlessly.",
      "Supported CRMs — We currently support Salesforce, HubSpot, Pipedrive, Zoho CRM, and many others. If your CRM isn't listed, contact our support team.",
      "Step 1: Navigate to Integrations — Go to your dashboard and click on 'Integrations' in the sidebar. Find your CRM from the list of available integrations.",
      "Step 2: Authenticate — Click 'Connect' and follow the authentication flow. You'll need admin access to your CRM to complete this step.",
      "Step 3: Configure Permissions — Choose which data your AI Employees can access. We recommend starting with read-only access and expanding as needed.",
      "Step 4: Test the Connection — Use the 'Test Connection' button to verify everything is working correctly before going live."
    ]
  },
  "email-integration": {
    title: "Email integration setup",
    category: "Integrations",
    content: [
      "Connect your email service to enable your AI Employees to send, receive, and manage emails on your behalf.",
      "Supported Providers — We support Gmail, Outlook, Yahoo, and custom SMTP servers.",
      "OAuth Connection — For Gmail and Outlook, use our secure OAuth connection for the easiest setup.",
      "SMTP Configuration — For other providers, enter your SMTP credentials in the integration settings.",
      "Email Templates — Create branded email templates your AI Employee can use for consistent communication.",
      "Sending Limits — Be aware of your email provider's sending limits to avoid delivery issues."
    ]
  },
  "slack-teams-integration": {
    title: "Slack and Teams integration",
    category: "Integrations",
    content: [
      "Integrate with Slack or Microsoft Teams to receive notifications and interact with your AI Employees directly in your workspace.",
      "Installation — Add the Business Bots UK app to your workspace from the respective app marketplace.",
      "Channel Setup — Choose which channels your AI Employees can access and post to.",
      "Commands — Use slash commands to interact with your AI Employees directly in chat.",
      "Notifications — Configure what events trigger notifications and where they're sent.",
      "Security — Review and approve permissions to ensure your workspace data stays secure."
    ]
  },
  "api-documentation": {
    title: "API documentation overview",
    category: "Integrations",
    content: [
      "Our REST API allows you to integrate Business Bots UK functionality into your own applications and workflows.",
      "Authentication — Use API keys for authentication. Generate keys in your dashboard under Settings > API.",
      "Base URL — All API requests use https://api.businessbotsuk.com/v1 as the base URL.",
      "Rate Limits — Free tier allows 100 requests per hour. Paid plans have higher limits.",
      "Endpoints — Key endpoints include /employees, /tasks, /conversations, and /analytics.",
      "SDKs — We offer official SDKs for JavaScript, Python, and PHP to simplify integration."
    ]
  },
  "usage-billing": {
    title: "Understanding usage and billing",
    category: "Billing & Plans",
    content: [
      "Understanding how billing works helps you manage costs and get the most value from your AI Employees.",
      "Usage-Based Pricing — You're billed based on the tasks your AI Employees complete. Each plan includes a monthly allowance with competitive rates for additional usage.",
      "Viewing Your Usage — Check your dashboard for real-time usage statistics. You can see breakdowns by AI Employee, task type, and time period.",
      "Setting Limits — Set usage caps to control costs. Your AI Employees will pause when limits are reached and notify you.",
      "Billing Cycle — Invoices are generated monthly. You can download detailed reports for accounting purposes.",
      "Need Help? — Our support team is available to help you optimise your plan and answer any billing questions."
    ]
  },
  "upgrading-plan": {
    title: "Upgrading your plan",
    category: "Billing & Plans",
    content: [
      "Ready to unlock more features? Here's how to upgrade your Business Bots UK plan.",
      "Navigate to Settings > Billing in your dashboard to view available plans.",
      "Compare features and select the plan that best fits your needs.",
      "Enter your payment details if not already on file.",
      "Confirm your upgrade - changes take effect immediately.",
      "Your new features and increased limits are available right away. No restart required."
    ]
  },
  "payment-methods": {
    title: "Payment methods",
    category: "Billing & Plans",
    content: [
      "We accept a variety of payment methods to make billing convenient for you.",
      "Credit/Debit Cards — We accept Visa, Mastercard, American Express, and Discover.",
      "Direct Debit — Available for UK bank accounts via Direct Debit mandate.",
      "Bank Transfer — Available for annual Enterprise plans. Contact sales for details.",
      "Updating Payment — You can update your payment method anytime in Settings > Billing.",
      "Failed Payments — If a payment fails, we'll notify you and retry automatically. Update your details to avoid service interruption."
    ]
  },
  "cancellation-policy": {
    title: "Cancellation policy",
    category: "Billing & Plans",
    content: [
      "We make it easy to cancel if Business Bots UK isn't right for you.",
      "Cancel anytime from Settings > Billing > Cancel Subscription.",
      "Your access continues until the end of your current billing period.",
      "No cancellation fees or hidden charges.",
      "Your data is retained for 30 days after cancellation in case you change your mind.",
      "Annual plans can be cancelled with a prorated refund for unused months. Contact support for assistance."
    ]
  },
  "data-protection": {
    title: "Data protection practices",
    category: "Security & Privacy",
    content: [
      "We take data protection seriously. Here's how we keep your information safe.",
      "Encryption — All data is encrypted in transit (TLS 1.3) and at rest (AES-256).",
      "Access Controls — Strict role-based access ensures only authorised personnel can access your data.",
      "Regular Audits — We conduct regular security audits and penetration testing.",
      "Data Centres — Your data is stored in SOC 2 compliant data centres with 24/7 monitoring.",
      "Incident Response — We have a comprehensive incident response plan and will notify you promptly if any breach occurs."
    ]
  },
  "two-factor-auth": {
    title: "Two-factor authentication",
    category: "Security & Privacy",
    content: [
      "Add an extra layer of security to your account with two-factor authentication (2FA).",
      "Navigate to Settings > Security to enable 2FA.",
      "Choose your preferred method: authenticator app (recommended) or SMS.",
      "Scan the QR code with your authenticator app or enter your phone number.",
      "Enter the verification code to complete setup.",
      "Save your backup codes in a secure location in case you lose access to your 2FA device."
    ]
  },
  "privacy-settings": {
    title: "Privacy settings",
    category: "Security & Privacy",
    content: [
      "Control how your data is used and who can access it.",
      "Data Sharing — Choose whether to share anonymised usage data to help improve our services.",
      "Third-Party Access — Review and revoke access for any connected applications.",
      "Activity Logs — View a complete log of all account activity and access.",
      "Data Export — Download a complete copy of your data at any time.",
      "Data Deletion — Request complete deletion of your data and account."
    ]
  },
  "compliance": {
    title: "Compliance and certifications",
    category: "Security & Privacy",
    content: [
      "Business Bots UK maintains compliance with major industry standards and regulations.",
      "GDPR — Fully compliant with the General Data Protection Regulation for EU customers.",
      "SOC 2 Type II — Certified for security, availability, and confidentiality.",
      "ISO 27001 — Information security management system certified.",
      "PCI DSS — Payment card data handling meets industry standards.",
      "Regular Assessments — We undergo regular third-party assessments to maintain certifications."
    ]
  },
  "not-responding": {
    title: "AI Employee not responding",
    category: "Troubleshooting",
    content: [
      "If your AI Employee isn't responding, try these troubleshooting steps.",
      "Check Status — Verify your AI Employee is activated and not paused in the dashboard.",
      "Usage Limits — Ensure you haven't exceeded your plan's usage limits.",
      "Integration Status — Check that all connected integrations are working properly.",
      "Refresh Connection — Try disconnecting and reconnecting your AI Employee.",
      "Contact Support — If issues persist, contact our support team with details about the problem."
    ]
  },
  "connection-failed": {
    title: "Integration connection failed",
    category: "Troubleshooting",
    content: [
      "Connection failures can happen for various reasons. Here's how to resolve them.",
      "Re-authenticate — The most common fix is to disconnect and reconnect the integration.",
      "Check Permissions — Ensure you have the necessary permissions on the third-party platform.",
      "API Limits — Some platforms have API rate limits. Wait and try again later.",
      "Firewall Settings — Check if your organisation's firewall is blocking connections.",
      "Platform Status — Check the third-party platform's status page for any known outages."
    ]
  },
  "unexpected-responses": {
    title: "Unexpected responses",
    category: "Troubleshooting",
    content: [
      "If your AI Employee is giving unexpected responses, here's how to improve accuracy.",
      "Review Training — Check your training materials for outdated or conflicting information.",
      "Clarify Instructions — Make your prompts and instructions more specific.",
      "Add Examples — Provide more examples of desired responses.",
      "Check Context — Ensure the AI Employee has access to all necessary context and data.",
      "Provide Feedback — Use the feedback feature to correct responses and improve learning."
    ]
  },
  "performance-issues": {
    title: "Performance issues",
    category: "Troubleshooting",
    content: [
      "Experiencing slow performance? Here's how to optimise your AI Employees.",
      "Check Load — High traffic periods may cause temporary slowdowns.",
      "Simplify Tasks — Break complex tasks into smaller, simpler operations.",
      "Review Integrations — Slow third-party integrations can affect overall performance.",
      "Upgrade Plan — Higher-tier plans offer priority processing and faster response times.",
      "Status Page — Check our status page for any known performance issues or maintenance."
    ]
  }
};

const ArticleDetail = () => {
  const navigate = useNavigate();
  const { slug } = useParams<{ slug: string }>();
  
  const article = slug ? articlesContent[slug] : null;

  // Get related articles from same category
  const relatedArticles = article 
    ? Object.entries(articlesContent)
        .filter(([key, val]) => val.category === article.category && key !== slug)
        .slice(0, 3)
        .map(([key, val]) => ({ slug: key, title: val.title }))
    : [];

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
            onClick={() => navigate("/help-centre")}
            className="px-6 py-3 rounded-full font-medium text-white"
            style={{ backgroundColor: SKOOL_BLUE }}
          >
            Back to Help Centre
          </motion.button>
        </motion.div>
      </div>
    );
  }

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
            onClick={() => navigate("/help-centre")}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to Help Centre</span>
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
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
              {article.title}
            </h1>
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
              {relatedArticles.map((related) => (
                <motion.button
                  key={related.slug}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => navigate(`/help-centre/article/${related.slug}`)}
                  className="w-full flex items-center justify-between p-5 text-left rounded-xl border border-gray-100 hover:border-gray-200 hover:shadow-md transition-all"
                >
                  <span className="text-gray-900 font-medium">{related.title}</span>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </motion.button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-12 px-4 border-t border-gray-100">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-gray-600 mb-6">Was this article helpful?</p>
          <div className="flex gap-4 justify-center">
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate("/help-centre")}
              className="px-6 py-3 rounded-full font-medium text-white"
              style={{ backgroundColor: SKOOL_BLUE }}
            >
              Yes, thanks!
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => window.location.href = "mailto:support@businessbotsuk.com"}
              className="px-6 py-3 rounded-full font-medium border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
            >
              I need more help
            </motion.button>
          </div>
        </div>
      </section>

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

export default ArticleDetail;
