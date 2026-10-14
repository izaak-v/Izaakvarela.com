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
    url: profile.website,
    email: `mailto:${profile.email}`,
    ...(profile.phone ? { telephone: profile.phone.tel } : {}),
    ...(profile.photo ? { image: `${profile.website}${profile.photo.src}` } : {}),
    ...(profile.socialLinks.length ? { sameAs: profile.socialLinks.map((s) => s.href) } : {}),
    hasOccupation: {
      "@type": "Occupation",
      name: profile.title,
      ...(active.length
        ? {
            occupationLocation: active.map((l) => ({
              "@type": "State",
              name: l.state,
            })),
          }
        : {}),
    },
    hasCredential: active.map((l) => ({
      "@type": "EducationalOccupationalCredential",
      credentialCategory: "license",
      name: `${l.state} ${l.licenseType ?? "Insurance"} License`,
      identifier: l.licenseNumber,
      ...(l.expirationDate ? { expires: l.expirationDate } : {}),
      recognizedBy: { "@type": "Organization", name: `${l.state} insurance regulator` },
    })),
    knowsAbout: [
      "Life insurance",
      "Final expense insurance",
      "Mortgage protection",
      "Living benefits",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      email: profile.email,
      ...(profile.phone ? { telephone: profile.phone.tel } : {}),
    },
  };
}
