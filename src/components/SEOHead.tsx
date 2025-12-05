import { Helmet } from "react-helmet-async";

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonicalUrl?: string;
  ogImage?: string;
  ogType?: string;
  noIndex?: boolean;
}

export const SEOHead = ({
  title = "Business Bots UK - AI Employees for Business Automation",
  description = "Hire AI employees that work 24/7. 8 specialized AI agents for email marketing, customer support, sales, recruitment & more.",
  keywords = "AI employees UK, business automation, AI agents, AI chatbot UK",
  canonicalUrl = "https://businessbotsuk.com",
  ogImage = "https://businessbotsuk.com/og-image.png",
  ogType = "website",
  noIndex = false,
}: SEOHeadProps) => {
  const fullTitle = title.includes("Business Bots") ? title : `${title} | Business Bots UK`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={canonicalUrl} />
      
      {noIndex && <meta name="robots" content="noindex, nofollow" />}
      
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:url" content={canonicalUrl} />
      
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
    </Helmet>
  );
};
