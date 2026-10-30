'use client';

import { exportActivityCSV, exportActivityJSON } from '@/lib/activity';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

/** Downloads the local activity log (rp:v1:activity) as JSON or CSV. */
export function ActivityExportButtons() {
  return (
    <div className="flex flex-wrap gap-2">
      <Button variant="outline" size="sm" className="gap-2" onClick={exportActivityJSON}>
        <Download className="h-4 w-4" /> Download activity (JSON)
      </Button>
      <Button variant="outline" size="sm" className="gap-2" onClick={exportActivityCSV}>
        <Download className="h-4 w-4" /> Download CSV
      </Button>
    </div>
  );
}
