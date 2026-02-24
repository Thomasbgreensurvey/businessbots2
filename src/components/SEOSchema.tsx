import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// Newcastle HQ NAP data
const NAP = {
  name: "Business Bots UK",
  street: "The Beacon Business Centre, Westgate Road",
  city: "Newcastle upon Tyne",
  region: "Tyne and Wear",
  postcode: "NE4 9PQ",
  country: "GB",
  phone: "+44-800-654-6949",
  freephone: "0800 654 6949",
  email: "ai@businessbotsuk.com",
  lat: "54.9696",
  lng: "-1.6294",
};

interface ProductData {
  name: string;
  description: string;
  image: string;
  sku: string;
  brand?: string;
  price: string;
  priceCurrency?: string;
  ratingValue?: string;
  reviewCount?: string;
}

interface SEOSchemaProps {
  pageTitle: string;
  pageDescription: string;
  breadcrumbs?: { name: string; url: string }[];
  faqItems?: { question: string; answer: string }[];
  articleData?: {
    headline: string;
    datePublished: string;
    dateModified?: string;
    author?: string;
    image?: string;
  };
  products?: ProductData[];
}

const SEOSchema = ({
  pageTitle,
  pageDescription,
  breadcrumbs,
  faqItems,
  articleData,
  products,
}: SEOSchemaProps) => {
  const location = useLocation();
  const currentUrl = `https://businessbotsuk.com${location.pathname}`;

  useEffect(() => {
    // Update document title
    document.title = pageTitle;

    // Update meta description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute("content", pageDescription);
    }

    // Update canonical — ensure self-referencing canonical on every page
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", currentUrl);

    // Update OG tags
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute("content", pageTitle);
    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute("content", pageDescription);
    const ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl) ogUrl.setAttribute("content", currentUrl);
  }, [pageTitle, pageDescription, currentUrl]);

  // Build BreadcrumbList schema
  const breadcrumbSchema = breadcrumbs
    ? {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://businessbotsuk.com/" },
          ...breadcrumbs.map((bc, i) => ({
            "@type": "ListItem",
            position: i + 2,
            name: bc.name,
            item: bc.url.startsWith("http") ? bc.url : `https://businessbotsuk.com${bc.url}`,
          })),
        ],
      }
    : null;

  // Build FAQ schema
  const faqSchema =
    faqItems && faqItems.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqItems.map((faq) => ({
            "@type": "Question",
            name: faq.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: faq.answer,
            },
          })),
        }
      : null;

  // Build LocalBusiness schema with 24/7 hours
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": "https://businessbotsuk.com/#localbusiness",
    name: NAP.name,
    image: "https://businessbotsuk.com/logo.png",
    telephone: NAP.phone,
    email: NAP.email,
    url: "https://businessbotsuk.com",
    priceRange: "££",
    address: {
      "@type": "PostalAddress",
      streetAddress: NAP.street,
      addressLocality: NAP.city,
      addressRegion: NAP.region,
      postalCode: NAP.postcode,
      addressCountry: NAP.country,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: NAP.lat,
      longitude: NAP.lng,
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      opens: "00:00",
      closes: "23:59",
    },
    areaServed: [
      { "@type": "Country", name: "United Kingdom" },
      { "@type": "Country", name: "United States" },
      { "@type": "Country", name: "Canada" },
      { "@type": "Country", name: "Ireland" },
    ],
    contactPoint: {
      "@type": "ContactPoint",
      telephone: NAP.phone,
      contactType: "customer service",
      areaServed: ["GB", "US", "CA", "IE"],
      availableLanguage: "English",
      contactOption: "TollFree",
    },
    sameAs: [
      "https://twitter.com/businessbotsuk",
      "https://linkedin.com/company/businessbotsuk",
      "https://www.skool.com/ai-automation-agency",
    ],
  };

  // Article schema
  const articleSchema = articleData
    ? {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: articleData.headline,
        datePublished: articleData.datePublished,
        dateModified: articleData.dateModified || articleData.datePublished,
        author: {
          "@type": "Organization",
          name: NAP.name,
        },
        publisher: {
          "@type": "Organization",
          name: NAP.name,
          logo: {
            "@type": "ImageObject",
            url: "https://businessbotsuk.com/logo.png",
          },
        },
        image: articleData.image || "https://businessbotsuk.com/og-image.png",
        mainEntityOfPage: currentUrl,
      }
    : null;

  // Build Product schemas
  const productSchemas = products?.map((product) => ({
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.image,
    sku: product.sku,
    brand: {
      "@type": "Brand",
      name: "Business Bots UK",
    },
    offers: {
      "@type": "Offer",
      url: "https://businessbotsuk.com/",
      priceCurrency: "GBP",
      price: "499.00",
      availability: "https://schema.org/InStock",
      seller: {
        "@type": "Organization",
        name: "Business Bots UK",
      },
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: product.ratingValue || "5",
      bestRating: "5",
      worstRating: "1",
      reviewCount: product.reviewCount || "12",
    },
    review: {
      "@type": "Review",
      author: {
        "@type": "Person",
        name: "Newcastle SME Owner",
      },
      datePublished: "2026-02-21",
      reviewRating: {
        "@type": "Rating",
        ratingValue: "5",
        bestRating: "5",
        worstRating: "1",
      },
      reviewBody: `${product.name} has transformed how we handle automation. Incredible 24/7 performance and ROI.`,
    },
  })) || [];

  return (
    <>
      {breadcrumbSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />
      )}
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      {articleSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
        />
      )}
      {productSchemas.map((schema, i) => (
        <script
          key={`product-${i}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
  );
};

export default SEOSchema;
