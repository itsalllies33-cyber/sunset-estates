import { useEffect, useState, type FormEvent } from "react";
import Film from "./Film";
import listing from "./listing.json";

const PLACE = {
  "@context": "https://schema.org",
  "@type": "SingleFamilyResidence",
  name: listing.name,
  address: {
    "@type": "PostalAddress",
    streetAddress: listing.address.street,
    addressLocality: listing.address.city,
    addressRegion: listing.address.region,
    postalCode: listing.address.postal,
    addressCountry: listing.address.country,
  },
  numberOfRooms: String(listing.beds),
  floorSize: {
    "@type": "QuantitativeValue",
    value: listing.sqft,
    unitCode: "FTK",
  },
  yearBuilt: String(listing.year_built),
};

export default function App() {
  const [sent, setSent] = useState(false);
  const agent = listing.agents[0];
  const line = `${listing.address.street}, ${listing.address.city}, ${listing.address.region}`;

  useEffect(() => {
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.text = JSON.stringify(PLACE);
    document.head.appendChild(script);
    return () => {
      script.remove();
    };
  }, []);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSent(true);
  }

  return (
    <>
      <Film beats={listing.beats} address={line} price={listing.price} />

      <section className="close">
        <p className="eyebrow">Private showings by appointment</p>
        <h1>Sunset Estates</h1>
        <p className="lede">
          {line} · {listing.beds} bd · {listing.baths} ba · {listing.sqft.toLocaleString()} sq ft ·{" "}
          {listing.lot_acres} acres · MLS {listing.mls}
        </p>
        <p className="agent">
          {agent.name}
          <span>{agent.brokerage}</span>
          <a href={`tel:${agent.phone}`}>{agent.phone}</a>
        </p>
        {sent ? (
          <p className="thanks">Request received. We will be in touch.</p>
        ) : (
          <form className="showing" name="showing" method="POST" data-netlify="true" onSubmit={onSubmit}>
            <input type="hidden" name="form-name" value="showing" />
            <p className="hp">
              <label>
                Don’t fill this out
                <input name="bot-field" />
              </label>
            </p>
            <label>
              Name
              <input name="name" type="text" required autoComplete="name" />
            </label>
            <label>
              Email
              <input name="email" type="email" required autoComplete="email" />
            </label>
            <label>
              Phone
              <input name="phone" type="tel" autoComplete="tel" />
            </label>
            <label>
              Preferred date or question
              <textarea name="message" rows={3} />
            </label>
            <button type="submit">{listing.cta.label}</button>
          </form>
        )}
      </section>

      <section className="gallery">
        <h2>The estate in stills</h2>
        <p className="lede">
          Photography from the official listing. {listing.gallery.length} frames shown here of 98 on
          file.
        </p>
        <div className="grid">
          {listing.gallery.map((shot) => (
            <figure key={shot.src}>
              <img src={shot.src} alt={shot.alt} loading="lazy" />
            </figure>
          ))}
        </div>
      </section>
    </>
  );
}
