import { motion } from "framer-motion";
import { ArrowLeft, Shield, Lock, Eye, Database, Mail, Phone } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";

const SKOOL_BLUE = "#4B5FD1";

const PrivacyPolicy = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back</span>
          </button>
          <h1 className="text-lg font-bold text-gray-900">Privacy Policy</h1>
          <div className="w-16" />
        </div>
      </motion.header>

      {/* Hero Section */}
      <section className="py-12 md:py-16 px-4 text-center border-b border-gray-100">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div 
            className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
            style={{ backgroundColor: `${SKOOL_BLUE}15` }}
          >
            <Shield className="w-10 h-10" style={{ color: SKOOL_BLUE }} />
          </div>
          <h2 
            className="text-4xl sm:text-5xl font-bold mb-4"
            style={{ color: SKOOL_BLUE }}
          >
            Privacy Policy
          </h2>
          <p className="text-gray-500">
            Last updated: {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </motion.div>
      </section>

      {/* Content */}
      <section className="py-12 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="max-w-4xl mx-auto prose prose-gray prose-lg"
        >
          {/* Introduction */}
          <div className="bg-gray-50 rounded-2xl p-6 md:p-8 mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-3">
              <Lock className="w-6 h-6" style={{ color: SKOOL_BLUE }} />
              Introduction
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Business Bots UK ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website, use our AI automation services, or interact with our AI employees (Sprout, Nano, Lilly, Like, Skoot, Tobby, Banjo, and Zen).
            </p>
            <p className="text-gray-600 leading-relaxed mt-4">
              We operate in compliance with the UK General Data Protection Regulation (UK GDPR) and the Data Protection Act 2018. By using our services, you agree to the collection and use of information in accordance with this policy.
            </p>
          </div>

          {/* Information We Collect */}
          <div className="bg-gray-50 rounded-2xl p-6 md:p-8 mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-3">
              <Database className="w-6 h-6" style={{ color: SKOOL_BLUE }} />
              Information We Collect
            </h3>
            
            <h4 className="font-semibold text-gray-900 mt-6 mb-3">Personal Information</h4>
            <p className="text-gray-600 leading-relaxed">
              When you use our services, we may collect:
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mt-3">
              <li><strong>Contact Information:</strong> Name, email address, phone number, company name</li>
              <li><strong>Business Information:</strong> Industry, company size, specific automation needs</li>
              <li><strong>Communication Data:</strong> Messages, inquiries, and correspondence with our AI employees</li>
              <li><strong>Booking Information:</strong> Preferred dates, times, and meeting preferences for demos</li>
              <li><strong>Payment Information:</strong> Processed securely through our payment providers</li>
            </ul>

            <h4 className="font-semibold text-gray-900 mt-6 mb-3">Automatically Collected Information</h4>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li><strong>Device Information:</strong> IP address, browser type, operating system</li>
              <li><strong>Usage Data:</strong> Pages visited, time spent, click patterns</li>
              <li><strong>Cookies:</strong> Session and preference cookies (see our Cookie Policy)</li>
              <li><strong>Analytics Data:</strong> Google Analytics data for website improvement</li>
            </ul>
          </div>

          {/* How We Use Your Information */}
          <div className="bg-gray-50 rounded-2xl p-6 md:p-8 mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-3">
              <Eye className="w-6 h-6" style={{ color: SKOOL_BLUE }} />
              How We Use Your Information
            </h3>
            <p className="text-gray-600 leading-relaxed mb-4">
              We use the information we collect for the following purposes:
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li><strong>Service Delivery:</strong> To provide and maintain our AI employee services</li>
              <li><strong>Communication:</strong> To respond to inquiries, send confirmations, and provide support</li>
              <li><strong>Personalisation:</strong> To tailor our AI employees' responses to your business needs</li>
              <li><strong>Marketing:</strong> To send promotional materials (with your consent)</li>
              <li><strong>Analytics:</strong> To improve our website and services</li>
              <li><strong>Legal Compliance:</strong> To comply with legal obligations and protect our rights</li>
              <li><strong>Advertising:</strong> To measure the effectiveness of our advertising campaigns (including Google Ads)</li>
            </ul>
          </div>

          {/* AI and Data Processing */}
          <div className="bg-gray-50 rounded-2xl p-6 md:p-8 mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">AI Data Processing</h3>
            <p className="text-gray-600 leading-relaxed mb-4">
              Our AI employees process information to provide automated services. This includes:
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Processing natural language queries and conversations</li>
              <li>Analysing customer interactions to improve response quality</li>
              <li>Storing conversation history to maintain context</li>
              <li>Using machine learning to enhance service delivery</li>
            </ul>
            <p className="text-gray-600 leading-relaxed mt-4">
              <strong>Important:</strong> Our AI systems do not make automated decisions that significantly affect you without human oversight. All sensitive business decisions involve human review.
            </p>
          </div>

          {/* Third-Party Integrations (OAuth) */}
          <div className="bg-gray-50 rounded-2xl p-6 md:p-8 mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Third-Party Integrations (OAuth)</h3>
            <p className="text-gray-600 leading-relaxed mb-4">
              Our Autopilot SEO service allows you to connect third-party accounts via OAuth to enable automated content publishing. Specifically:
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li><strong>Facebook Pages:</strong> We request OAuth access to your Facebook Page strictly for the purpose of auto-publishing blog content and SEO-optimised posts on your behalf. We access only the permissions necessary to publish to your selected Page.</li>
              <li><strong>Google Business Profile:</strong> We request OAuth access to your Google Business Profile strictly for the purpose of auto-publishing updates and posts to your business listing.</li>
            </ul>
            <p className="text-gray-600 leading-relaxed mt-4">
              <strong>Token Storage:</strong> We securely store your OAuth access tokens and refresh tokens in an encrypted database. These tokens are used solely to maintain your authorised connection and publish content as instructed by you. We never sell, share, or use your tokens or connected account data for any purpose other than delivering the service you have enabled.
            </p>
            <p className="text-gray-600 leading-relaxed mt-4">
              <strong>Scope of Access:</strong> We request only the minimum permissions required (e.g., <code className="bg-gray-200 px-1 rounded text-sm">pages_manage_posts</code> for Facebook). We do not read your private messages, access your personal profile, or harvest your followers' data.
            </p>
          </div>

          {/* Data Deletion Instructions */}
          <div className="bg-gray-50 rounded-2xl p-6 md:p-8 mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Data Deletion Instructions</h3>
            <p className="text-gray-600 leading-relaxed mb-4">
              You can revoke third-party access and request data deletion at any time through the following methods:
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li><strong>Via Dashboard:</strong> Navigate to your Autopilot SEO dashboard and click "Disconnect" on any connected account. This immediately revokes our access and deletes your stored OAuth tokens.</li>
              <li><strong>Via Email:</strong> Send a request to <a href="mailto:support@businessbots.co.uk" className="underline" style={{ color: SKOOL_BLUE }}>support@businessbots.co.uk</a> with the subject line "Data Deletion Request". We will delete all stored API tokens, account data, and any associated content within 30 days.</li>
              <li><strong>Via Platform Settings:</strong> You can also revoke our app's access directly from your Facebook or Google account settings at any time.</li>
            </ul>
            <p className="text-gray-600 leading-relaxed mt-4">
              Upon deletion, all stored access tokens, refresh tokens, page/location identifiers, and associated metadata will be permanently removed from our systems.
            </p>
          </div>

          {/* Data Sharing */}
          <div className="bg-gray-50 rounded-2xl p-6 md:p-8 mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Data Sharing and Third Parties</h3>
            <p className="text-gray-600 leading-relaxed mb-4">
              We may share your information with:
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li><strong>Service Providers:</strong> Cloud hosting, email services, payment processors</li>
              <li><strong>Analytics Partners:</strong> Google Analytics for website improvement</li>
              <li><strong>Advertising Partners:</strong> Google Ads for campaign measurement</li>
              <li><strong>Legal Authorities:</strong> When required by law or to protect our rights</li>
            </ul>
            <p className="text-gray-600 leading-relaxed mt-4">
              We do not sell your personal information to third parties.
            </p>
          </div>

          {/* Google reCAPTCHA */}
          <div className="bg-gray-50 rounded-2xl p-6 md:p-8 mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Google reCAPTCHA</h3>
            <p className="text-gray-600 leading-relaxed">
              We use Google reCAPTCHA to protect our forms from spam and abuse. This service collects hardware and software information, such as device and application data, and sends it to Google for analysis. The use of reCAPTCHA is subject to Google's{" "}
              <a 
                href="https://policies.google.com/privacy" 
                target="_blank" 
                rel="noopener noreferrer"
                className="underline"
                style={{ color: SKOOL_BLUE }}
              >
                Privacy Policy
              </a>
              {" "}and{" "}
              <a 
                href="https://policies.google.com/terms" 
                target="_blank" 
                rel="noopener noreferrer"
                className="underline"
                style={{ color: SKOOL_BLUE }}
              >
                Terms of Service
              </a>.
            </p>
          </div>

          {/* Your Rights */}
          <div className="bg-gray-50 rounded-2xl p-6 md:p-8 mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Your Rights (UK GDPR)</h3>
            <p className="text-gray-600 leading-relaxed mb-4">
              Under UK data protection law, you have the following rights:
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li><strong>Right of Access:</strong> Request a copy of your personal data</li>
              <li><strong>Right to Rectification:</strong> Request correction of inaccurate data</li>
              <li><strong>Right to Erasure:</strong> Request deletion of your data ("right to be forgotten")</li>
              <li><strong>Right to Restrict Processing:</strong> Request limitation of data processing</li>
              <li><strong>Right to Data Portability:</strong> Request transfer of your data</li>
              <li><strong>Right to Object:</strong> Object to processing of your data</li>
              <li><strong>Right to Withdraw Consent:</strong> Withdraw consent at any time</li>
            </ul>
            <p className="text-gray-600 leading-relaxed mt-4">
              To exercise any of these rights, please contact us using the details below.
            </p>
          </div>

          {/* Data Security */}
          <div className="bg-gray-50 rounded-2xl p-6 md:p-8 mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Data Security</h3>
            <p className="text-gray-600 leading-relaxed">
              We implement appropriate technical and organisational measures to protect your personal data, including:
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mt-3">
              <li>SSL/TLS encryption for data in transit</li>
              <li>Encrypted data storage</li>
              <li>Access controls and authentication</li>
              <li>Regular security assessments</li>
              <li>Staff training on data protection</li>
            </ul>
          </div>

          {/* Data Retention */}
          <div className="bg-gray-50 rounded-2xl p-6 md:p-8 mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Data Retention</h3>
            <p className="text-gray-600 leading-relaxed">
              We retain your personal data only for as long as necessary to fulfil the purposes for which it was collected, including legal, accounting, or reporting requirements. Typically:
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mt-3">
              <li>Contact form submissions: 2 years</li>
              <li>Customer account data: Duration of relationship + 6 years</li>
              <li>Marketing preferences: Until you unsubscribe</li>
              <li>Analytics data: 26 months</li>
            </ul>
          </div>

          {/* Contact Information */}
          <div className="bg-gray-50 rounded-2xl p-6 md:p-8 mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Contact Us</h3>
            <p className="text-gray-600 leading-relaxed mb-4">
              If you have any questions about this Privacy Policy or wish to exercise your rights, please contact us:
            </p>
            <div className="space-y-3">
              <a 
                href="mailto:ai@businessbotsuk.com"
                className="flex items-center gap-3 text-gray-700 hover:text-gray-900 transition-colors"
              >
                <Mail className="w-5 h-5" style={{ color: SKOOL_BLUE }} />
                ai@businessbotsuk.com
              </a>
              <a 
                href="tel:08006546949"
                className="flex items-center gap-3 text-gray-700 hover:text-gray-900 transition-colors"
              >
                <Phone className="w-5 h-5" style={{ color: SKOOL_BLUE }} />
                0800 654 6949
              </a>
            </div>
            <p className="text-gray-600 leading-relaxed mt-4">
              You also have the right to lodge a complaint with the Information Commissioner's Office (ICO) at{" "}
              <a 
                href="https://ico.org.uk" 
                target="_blank" 
                rel="noopener noreferrer"
                className="underline"
                style={{ color: SKOOL_BLUE }}
              >
                ico.org.uk
              </a>.
            </p>
          </div>

          {/* Changes to Policy */}
          <div className="bg-gray-50 rounded-2xl p-6 md:p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Changes to This Policy</h3>
            <p className="text-gray-600 leading-relaxed">
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date. We encourage you to review this Privacy Policy periodically.
            </p>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 py-8 px-4 border-t border-gray-100">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex justify-center gap-6 mb-4">
            <Link to="/terms" className="text-gray-600 hover:text-gray-900 text-sm">
              Terms & Conditions
            </Link>
            <Link to="/contact" className="text-gray-600 hover:text-gray-900 text-sm">
              Contact Us
            </Link>
          </div>
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} Business Bots UK. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default PrivacyPolicy;
