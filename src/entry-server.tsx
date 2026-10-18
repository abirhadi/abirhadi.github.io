import { renderToString } from "react-dom/server";
import App from "./App";
import { profile } from "./content/profile";
import { professionalLinks } from "./content/links";
import { publications } from "./content/publications";
export function getPublicationIds() {
  return publications.map((publication) => publication.id);
}
export function render() {
  const escape = (s: string) =>
    s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
  const title = `${profile.name}, ${profile.suffix} | AI Research & Education`;
  const image = new URL("social-preview.png", profile.canonicalUrl).href;
  const schema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${profile.canonicalUrl}#person`,
    name: profile.name,
    honorificSuffix: profile.suffix,
    url: profile.canonicalUrl,
    jobTitle: profile.appointment,
    description: profile.description,
    worksFor: { "@type": "CollegeOrUniversity", name: profile.institution },
    alumniOf: {
      "@type": "CollegeOrUniversity",
      name: profile.education.institution,
    },
    sameAs: professionalLinks.map((link) => link.url),
  };
  const head = `<title>${escape(title)}</title>
<meta name="description" content="${escape(profile.description)}" />
<link rel="canonical" href="${profile.canonicalUrl}" />
<meta property="og:type" content="profile" /><meta property="og:title" content="${escape(title)}" /><meta property="og:description" content="${escape(profile.description)}" /><meta property="og:url" content="${profile.canonicalUrl}" /><meta property="og:site_name" content="${escape(profile.name)}" /><meta property="og:image" content="${image}" /><meta property="og:image:width" content="1200" /><meta property="og:image:height" content="630" /><meta property="og:image:alt" content="${escape(profile.name)} — ${escape(profile.direction)}" />
<meta name="twitter:card" content="summary_large_image" /><meta name="twitter:title" content="${escape(title)}" /><meta name="twitter:description" content="${escape(profile.description)}" /><meta name="twitter:image" content="${image}" /><meta name="theme-color" content="#f5f4ee" />
<script type="application/ld+json">${JSON.stringify(schema).replace(/</g, "\\u003c")}</script>`;
  const socialSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630"><rect width="1200" height="630" fill="#f5f4ee"/><path d="M65 95h1070M65 550h1070" stroke="#d1d9c9"/><text x="65" y="70" font-family="sans-serif" font-size="19" fill="#203a34">${escape(profile.name)}, ${escape(profile.suffix)}</text><text x="65" y="200" font-family="sans-serif" font-size="14" letter-spacing="3" fill="#53694e">RESEARCH &amp; EDUCATION</text><text x="65" y="290" font-family="sans-serif" font-size="64" letter-spacing="-3" fill="#203a34">${escape(profile.headline.opening)}</text><text x="65" y="370" font-family="Georgia,serif" font-size="76" font-style="italic" fill="#285a47">${escape(profile.headline.emphasis)}</text><text x="65" y="448" font-family="sans-serif" font-size="64" letter-spacing="-3" fill="#203a34">${escape(profile.headline.ending)}</text><text x="65" y="588" font-family="sans-serif" font-size="17" fill="#53694e">${escape(profile.institution)}</text><g stroke="#285a47" fill="none" stroke-width="1.3" opacity=".5">${Array.from({ length: 12 }, (_, i) => `<ellipse cx="950" cy="325" rx="${35 + i * 9}" ry="165" transform="rotate(${i * 15} 950 325)"/>`).join("")}<circle cx="950" cy="325" r="196" stroke-dasharray="2 9"/></g><circle cx="950" cy="325" r="7" fill="#a94b32"/><circle cx="802" cy="247" r="7" fill="#285a47"/><circle cx="1050" cy="452" r="7" fill="#285a47"/></svg>`;
  return {
    html: renderToString(<App />),
    head,
    canonicalUrl: profile.canonicalUrl,
    socialSvg,
  };
}
