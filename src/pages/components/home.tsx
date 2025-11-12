import Head from 'next/head';

export default function Home() {
  return (
    <Head>
      <title>Kantan Consultancy Pvt. Ltd. | Labour Compliance Experts</title>
      <meta
        name='description'
        content='Kantan Consultancy Pvt. Ltd. offers software-powered labour compliance and statutory management for every industry. Stay compliant, transparent, and audit-ready.'
      />
      <meta
        name='keywords'
        content='Automation, Form 16, outsourcing software, payroll consultant India, salary compliance and filing, PF/ESI, labour law, labour compliance consultancy, statutory management, HR compliance software, payroll compliance, legal audit consultancy, Coimbatore, Chennai'
      />
      <meta property='og:title' content='Kantan Consultancy Pvt. Ltd.' />
      <meta
        property='og:description'
        content='Software-powered labour compliance & statutory management for every industry.'
      />
      <meta name='geo.region' content='IN-TN' />
      <meta name='geo.placename' content='Coimbatore' />
      <meta name='geo.position' content='11.0168;76.9558' />
      <meta name='ICBM' content='11.0168, 76.9558' />
      <meta property='og:url' content='https://www.kantanconsultancy.com' />
      <link rel='canonical' href='https://www.kantanconsultancy.com' />
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: 'Kantan Consultancy Pvt. Ltd.',
            url: 'https://www.kantanconsultancy.com',
            logo: 'https://www.kantanconsultancy.com/logo_light.png',
            contactPoint: {
              '@type': 'ContactPoint',
              telephone: '+91-9566628016',
              contactType: 'customer support',
              areaServed: 'IN',
              availableLanguage: 'English',
            },
          }),
        }}
      />
    </Head>
  );
}
