export default function MapSection() {
  return (
    <section className="my-12">
      <h2 className="text-2xl font-semibold mb-4">Our Location</h2>
      <div className="rounded-lg overflow-hidden shadow">
        <iframe
          title="Embassy Location"
          src="https://www.google.com/maps?q=Embassy%20of%20Sudan&output=embed"
          width="100%"
          height="400"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </section>
  )
}


