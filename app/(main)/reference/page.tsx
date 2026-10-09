import { glossaryTerms, phScale, householdSubstances } from "@/data/reference";
import { Card } from "@/components/ui/Card";
import { Table, THead, TH, TBody, TR, TD } from "@/components/ui/Table";

export default function ReferencePage() {
  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <Card title="Терминдер">
        <dl className="space-y-3">
          {glossaryTerms.map((t) => (
            <div key={t.term}>
              <dt className="text-sm font-semibold text-ink">{t.term}</dt>
              <dd className="text-sm text-muted">{t.definition}</dd>
            </div>
          ))}
        </dl>
      </Card>

      <Card title="pH шкаласы" subtitle="0 — күшті қышқыл, 14 — күшті негіз">
        <div className="flex h-8 w-full overflow-hidden rounded-md">
          {phScale.map((band) => (
            <div
              key={band.range}
              className="flex-1"
              style={{ backgroundColor: band.color }}
              title={`${band.range}: ${band.label}`}
            />
          ))}
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {phScale.map((band) => (
            <div key={band.range} className="flex items-center gap-2 text-xs text-ink/90">
              <span className="h-3 w-3 shrink-0 rounded-sm" style={{ backgroundColor: band.color }} />
              <span>
                {band.range}: {band.label}
              </span>
            </div>
          ))}
        </div>
      </Card>

      <Card title="Тұрмыстық заттар кестесі">
        <Table>
          <THead>
            <TH>Зат</TH>
            <TH>Шамамен pH</TH>
            <TH>Түрі</TH>
          </THead>
          <TBody>
            {householdSubstances.map((s) => (
              <TR key={s.name}>
                <TD className="font-medium">{s.name}</TD>
                <TD>{s.approxPh}</TD>
                <TD>{s.type}</TD>
              </TR>
            ))}
          </TBody>
        </Table>
      </Card>
    </div>
  );
}
