import type { Metadata } from 'next';
import { PageShell } from '@/components/PageShell';
import { ServicesView } from '@/components/ServicesView';

export const metadata: Metadata = {
  title: 'Insulation Fabrication Services in UAE: CNC Milling, Lamination & Pipe Fittings',
  description:
    'In-house fabrication in Ajman, UAE: CNC cellular glass milling, PSMB lamination, corrugation & embossing, pipe fitting covers, acoustic panels and cryogenic pipe supports, delivered across Saudi Arabia, Kuwait, Qatar, Bahrain and Oman.',
  alternates: { canonical: '/services' },
  openGraph: { title: 'Precision Insulation Fabrication | Growth International', url: '/services' },
};

export default function ServicesPage() {
  return (
    <PageShell>
      <ServicesView />
    </PageShell>
  );
}
