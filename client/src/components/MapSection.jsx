import { useTranslation } from 'react-i18next';

export default function MapSection() {
  const { t } = useTranslation();
  
  return (
    <section className="my-8 md:my-12" data-aos="fade-up">
      <h2 className="text-2xl font-semibold mb-4">{t('common.our_location')}</h2>
      <div className="rounded-lg overflow-hidden shadow">
        <iframe
          title="Embassy Location"
          src="https://www.google.com/maps?q=Embassy%20of%20Sudan&output=embed"
          width="100%"
          height="300"
          className="md:h-[400px]"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </section>
  )
}


