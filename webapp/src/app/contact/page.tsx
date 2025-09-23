import site from "@/data/site.json";

export const metadata = { title: "Contact" };

type ContactLinks = { linkedin?: string; instagram?: string; imdb?: string; ['crew-united']?: string };
type ContactData = { email?: string; emailUser?: string; emailDomain?: string; links?: ContactLinks };

export default function ContactPage() {
  const contact = (site as unknown as { contact?: ContactData }).contact || {};
  const email = contact.email || (contact.emailUser && contact.emailDomain ? `${contact.emailUser}@${contact.emailDomain}` : null);
  const links = (contact.links || {}) as ContactLinks;
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
        {links.linkedin ? (
          <a href={links.linkedin} target="_blank" rel="noreferrer" aria-label="linkedin">
            <span className="inline-flex items-center justify-center h-8 w-8 rounded-[30px] border border-white/20 text-xs uppercase fx-enter">in</span>
          </a>
        ) : null}
        {links.instagram ? (
          <a href={links.instagram} target="_blank" rel="noreferrer" aria-label="instagram">
            <span className="inline-flex items-center justify-center h-8 w-8 rounded-[30px] border border-white/20 text-xs uppercase fx-enter right">ig</span>
          </a>
        ) : null}
        {links.imdb ? (
          <a href={links.imdb} target="_blank" rel="noreferrer" aria-label="imdb">
            <span className="inline-flex items-center justify-center h-8 w-8 rounded-[30px] border border-white/20 text-xs uppercase fx-enter">db</span>
          </a>
        ) : null}
        {links['crew-united'] ? (
          <a href={links['crew-united']} target="_blank" rel="noreferrer" aria-label="crewunited">
            <span className="inline-flex items-center justify-center h-8 w-8 rounded-[30px] border border-white/20 text-xs uppercase fx-enter right">cu</span>
          </a>
        ) : null}
      </div>
    </div>
  );
}
