import site from "@/data/site.json";
import EmailLink from "./EmailLink";

export const metadata = { title: "Contact" };

type ContactLinks = { linkedin?: string; instagram?: string; imdb?: string; ['crew-united']?: string };
type ContactData = { email?: string; emailUser?: string; emailDomain?: string; links?: ContactLinks };

export default function ContactPage() {
  const contact = (site as unknown as { contact?: ContactData }).contact || {};
  const email = contact.email || (contact.emailUser && contact.emailDomain ? `${contact.emailUser}@${contact.emailDomain}` : null);
  const links = (contact.links || {}) as ContactLinks;
  const socialDefs = [
    { key: 'linkedin', icon: '/icons/linkedin.svg', aria: 'linkedin' },
    { key: 'instagram', icon: '/icons/instagram.svg', aria: 'instagram' },
    { key: 'imdb', icon: '/icons/imdb.svg', aria: 'imdb' },
    { key: 'crew-united', icon: '/icons/crew-united.png', aria: 'crew united' },
  ] as const;
  const socials = socialDefs
    .map(def => ({ ...def, href: links[def.key as keyof ContactLinks] as string | undefined }))
    .filter(s => !!s.href);

  // Obfuscate email for bots: encode parts and only decode on client
  function encodePart(str?: string | null): number[] {
    if (!str) return [];
    return Array.from(str).reverse().map(ch => ch.charCodeAt(0) + 1);
  }
  const userPart = contact.emailUser || (contact.email ? String(contact.email).split("@")[0] : "");
  const domainPart = contact.emailDomain || (contact.email ? String(contact.email).split("@")[1] : "");
  const userEnc = encodePart(userPart);
  const domainEnc = encodePart(domainPart);
  return (
    <article className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Contact</h1>
        <p className="text-lg">
          <span className="mr-2">Get in touch!</span>
          {userEnc.length && domainEnc.length ? (
            <EmailLink user={userEnc} domain={domainEnc} className="underline" label="Email" />
          ) : (
            <span aria-label="email" className="underline" />
          )}
        </p>
        <div className="flex gap-3">
          {socials.map(({ key, href, icon, aria }) => (
            <a key={key} href={href!} target="_blank" rel="noreferrer" aria-label={aria}>
              <span className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-white fx-enter">
                <span
                  className="block h-8 w-8"
                  style={{
                    backgroundColor: "#0A0A0A",
                    WebkitMaskImage: `url(${icon})`,
                    maskImage: `url(${icon})`,
                    WebkitMaskRepeat: "no-repeat",
                    maskRepeat: "no-repeat",
                    WebkitMaskPosition: "center",
                    maskPosition: "center",
                    WebkitMaskSize: "contain",
                    maskSize: "contain",
                  }}
                />
              </span>
            </a>
          ))}
        </div>
      </div>
      <aside className="text-sm text-muted leading-relaxed">
        <h2 className="text-base font-semibold mb-2 text-white/90">Impressum</h2>
        <p className="mb-2">Angaben gemäß § 5 TMG:</p>
        <address className="not-italic">
          Gaston Ibarroule<br />
          Stettinerstr. 12<br />
          13357 Berlin<br />
          Deutschland
        </address>
        <p className="mt-2">
          Umsatzsteuer-Identifikationsnummer gemäß §27a Umsatzsteuergesetz: DE317158689
        </p>
      </aside>
    </article>
  );
}
