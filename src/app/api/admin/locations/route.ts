import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { requireAdminApi } from '@/lib/auth';
import { logAdminAction } from '@/lib/audit';

export async function GET(req: NextRequest) {
  const auth = requireAdminApi(req);
  if (auth instanceof NextResponse) return auth;

  try {
    const locations = db.prepare(`SELECT * FROM gcc_locations ORDER BY display_order ASC`).all();
    return NextResponse.json({ success: true, count: locations.length, data: locations });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch GCC locations' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const auth = requireAdminApi(req);
  if (auth instanceof NextResponse) return auth;
  const user = auth.user;

  try {
    const body = await req.json();
    const { id, hubName, country, isHq, status, phone, coordX, coordY, lastShipment, inventoryCount, displayOrder, isActive } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: 'Location ID is required' }, { status: 400 });
    }

    db.prepare(`
      UPDATE gcc_locations
      SET hub_name = ?, country = ?, is_hq = ?, status = ?, phone = ?, coord_x = ?, coord_y = ?, last_shipment = ?, inventory_count = ?, display_order = ?, is_active = ?
      WHERE id = ?
    `).run(
      hubName,
      country,
      isHq ? 1 : 0,
      status,
      phone,
      coordX,
      coordY,
      lastShipment,
      inventoryCount,
      displayOrder || 0,
      isActive ? 1 : 0,
      id
    );

    logAdminAction({
      adminEmail: user.email,
      action: 'UPDATE',
      entity: 'GCC_LOCATION',
      entityId: id,
      metadata: { hubName, status, isActive },
    });

    return NextResponse.json({ success: true, message: 'GCC location updated successfully.' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Failed to update GCC location' }, { status: 500 });
  }
}
