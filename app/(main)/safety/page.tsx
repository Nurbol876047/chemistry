import { AlertTriangle } from "lucide-react";
import { generalSafetyRules, forbiddenMixes, mandatorySupervisionNote } from "@/data/safety";
import { Card } from "@/components/ui/Card";
import { Table, THead, TH, TBody, TR, TD } from "@/components/ui/Table";

export default function SafetyPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <Card>
        <div className="flex items-start gap-3 rounded-md border border-amber-300 bg-amber-50 p-3">
          <AlertTriangle size={18} className="mt-0.5 shrink-0 text-amber-700" />
          <p className="text-sm text-amber-800">{mandatorySupervisionNote}</p>
        </div>
      </Card>

      <Card title="Үйде жұмыс істеу ережелері">
        <ol className="space-y-2">
          {generalSafetyRules.map((rule, idx) => (
            <li key={idx} className="flex gap-3 text-sm text-ink/90">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand/10 text-xs font-semibold text-brand">
                {idx + 1}
              </span>
              {rule}
            </li>
          ))}
        </ol>
      </Card>

      <Card title="Араластыруға тыйым салынады" subtitle="Бұл заттарды ешқашан бірге қоспаңыз">
        <Table>
          <THead>
            <TH>Зат А</TH>
            <TH>Зат Ә</TH>
            <TH>Қауіп</TH>
          </THead>
          <TBody>
            {forbiddenMixes.map((mix, idx) => (
              <TR key={idx}>
                <TD className="font-medium">{mix.substanceA}</TD>
                <TD className="font-medium">{mix.substanceB}</TD>
                <TD className="text-red-700">{mix.risk}</TD>
              </TR>
            ))}
          </TBody>
        </Table>
      </Card>
    </div>
  );
}
