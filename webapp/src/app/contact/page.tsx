import site from "@/data/site.json";

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
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Contact</h1>
      <p className="text-lg">
        <span className="mr-2">Get in touch!</span>
        {email ? (
          <a aria-label="email" className="underline" href={`mailto:${email}`}>{email}</a>
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
  );
}
