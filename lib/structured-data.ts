import { profile } from "@/content/profile";
import { licenses } from "@/content/licenses";

export function personJsonLd() {
  const active = licenses.filter((l) => l.status === "active");
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${profile.website}/#person`,
    name: profile.name,
    jobTitle: profile.title,
    description: `${profile.name} is a licensed life insurance agent (${profile.legalName}).`,
    url: profile.website,
    email: `mailto:${profile.email}`,
    ...(profile.phone ? { telephone: profile.phone.tel } : {}),
    ...(profile.photo ? { image: `${profile.website}${profile.photo.src}` } : {}),
    ...(profile.socialLinks.length ? { sameAs: profile.socialLinks.map((s) => s.href) } : {}),
    identifier: {
      "@type": "PropertyValue",
      propertyID: "National Producer Number (NPN)",
      value: profile.npn,
    },
    hasOccupation: { "@type": "Occupation", name: profile.title },
    ...(active.length
      ? {
          hasCredential: active.map((l) => ({
            "@type": "EducationalOccupationalCredential",
            credentialCategory: "license",
            name: `${l.state} ${l.licenseType ?? "Insurance"} License`,
            identifier: l.licenseNumber,
            ...(l.expirationDate ? { expires: l.expirationDate } : {}),
          })),
        }
      : {}),
    knowsAbout: [
      "Life insurance",
      "Final expense insurance",
      "Mortgage protection",
      "Family protection",
      "Living benefits",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      email: profile.email,
      ...(profile.phone ? { telephone: profile.phone.tel } : {}),
      availableLanguage: "English",
    },
  };
}
