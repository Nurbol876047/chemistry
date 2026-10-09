export interface GlossaryTerm {
  term: string;
  definition: string;
}

export const glossaryTerms: GlossaryTerm[] = [
  {
    term: "Реакция",
    definition:
      "Бір немесе бірнеше заттың өзара әрекеттесіп, жаңа қасиеттері бар зат(тар) түзетін процесі.",
  },
  {
    term: "Индикатор",
    definition:
      "Ортаның қышқылдық немесе негіздік қасиетіне байланысты түсін өзгертетін зат.",
  },
  {
    term: "Қышқыл",
    definition:
      "Суда еріген кезде pH мәні 7-ден төмен болатын, қышқыл дәмді, металдармен әрекеттескенде газ бөлетін зат (мысалы, сірке суы, лимон қышқылы).",
  },
  {
    term: "Негіз",
    definition:
      "Суда еріген кезде pH мәні 7-ден жоғары болатын зат (мысалы, сода ерітіндісі, сабын суы).",
  },
  {
    term: "Тотығу",
    definition:
      "Зат оттегімен әрекеттескенде болатын химиялық процесс (мысалы, кесілген алманың ауада қараюы).",
  },
  {
    term: "Кристалл",
    definition:
      "Атомдары немесе молекулалары қатаң геометриялық тәртіппен орналасқан қатты зат.",
  },
  {
    term: "pH",
    definition:
      "Ортаның қышқылдық немесе негіздік дәрежесін көрсететін 0-ден 14-ке дейінгі шартты шкала.",
  },
  {
    term: "Карбонат",
    definition:
      "Көмір қышқылының тұзы (мысалы, кальций карбонаты — жұмыртқа қабығының негізгі құрамдасы).",
  },
];

export interface PhBand {
  range: string;
  label: string;
  color: string;
}

export const phScale: PhBand[] = [
  { range: "0-2", label: "Күшті қышқыл", color: "#B91C1C" },
  { range: "3-5", label: "Әлсіз қышқыл", color: "#EA580C" },
  { range: "6", label: "Әлсіз қышқыл (жуық бейтарап)", color: "#EAB308" },
  { range: "7", label: "Бейтарап", color: "#16A34A" },
  { range: "8-9", label: "Әлсіз негіз", color: "#0D9488" },
  { range: "10-12", label: "Негіз", color: "#2563EB" },
  { range: "13-14", label: "Күшті негіз", color: "#4C1D95" },
];

export interface HouseholdSubstance {
  name: string;
  approxPh: string;
  type: string;
}

export const householdSubstances: HouseholdSubstance[] = [
  { name: "Лимон шырыны", approxPh: "2", type: "Қышқыл" },
  { name: "Сірке суы", approxPh: "3", type: "Қышқыл" },
  { name: "Газдалған сусын", approxPh: "3-4", type: "Қышқыл" },
  { name: "Таза ас суы", approxPh: "7", type: "Бейтарап" },
  { name: "Сабын суы", approxPh: "9-10", type: "Негіз" },
  { name: "Сода ерітіндісі (NaHCO₃)", approxPh: "8-9", type: "Әлсіз негіз" },
  { name: "Ас тазалағыш (аммиак негізді)", approxPh: "11-12", type: "Негіз" },
];
