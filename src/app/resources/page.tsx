import type { Metadata } from 'next';
import { PageShell } from '@/components/PageShell';
import { ResourceLibrary } from '@/components/ResourceLibrary';
import { FabricationBanner } from '@/components/FabricationBanner';
import { InventoryBrowser } from '@/components/InventoryBrowser';

export const metadata: Metadata = {
  title: 'Technical Data Sheets, SDS & ASTM Compliance Documents',
  description:
    'Download TDS, SDS, installation guides and ASTM compliance documents for FOAMGLAS, PSMB jacketing, rockwool, aerogel and Armaflex insulation supplied across the GCC.',
  alternates: { canonical: '/resources' },
  openGraph: { title: 'Engineering Resource Library | Growth International', url: '/resources' },
};

export default function ResourcesPage() {
  return (
    <PageShell>
      <ResourceLibrary />
      <FabricationBanner />
      <InventoryBrowser />
    </PageShell>
  );
}
