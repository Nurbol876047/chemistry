import { JournalEntry } from "@/lib/types";

export interface DemoStudent {
  id: string;
  name: string;
}

export const demoStudents: DemoStudent[] = [
  { id: "s1", name: "Айгерім Боранбаева" },
  { id: "s2", name: "Данияр Серіков" },
  { id: "s3", name: "Мадина Қасымова" },
  { id: "s4", name: "Арман Төлеуов" },
  { id: "s5", name: "Жансая Нұрланова" },
];

function allChecked(count: number): Record<string, boolean> {
  const result: Record<string, boolean> = {};
  for (let i = 0; i < count; i++) result[String(i)] = true;
  return result;
}

export const demoJournalEntries: JournalEntry[] = [
  {
    id: "e1",
    experimentId: "soda-vinegar",
    studentId: "s1",
    studentName: "Айгерім Боранбаева",
    createdAt: "2026-09-18T09:10:00.000Z",
    updatedAt: "2026-09-18T09:40:00.000Z",
    materialsChecked: allChecked(5),
    safetyChecked: allChecked(4),
    observation: {
      notes:
        "Сода үстіне сірке суын құйған сәтте көп көпіршік пайда болды, стакан ішінен сыстаған дыбыс шықты. Көпіршік 1 минуттай тұрды, кейін азайды.",
      colorChange: "Түс өзгерісі болмады, қоспа ақшыл-лайлы болды",
      gasReleased: true,
      temperatureChange: "Сәл салқындады",
      time: "2 минут",
    },
    measurements: [
      { id: "m1", substance: "Сода + сірке суы", result: "Күшті көпіршік", value: "30 секунд" },
    ],
    photos: [],
    status: "Тексерілді",
    grade: 9,
    teacherComment:
      "Жұмыс өте жақсы орындалған, бақылаулар нақты жазылған. Газдың аты (CO₂) қосымша айтылса, өте толық болар еді.",
  },
  {
    id: "e2",
    experimentId: "cabbage-indicator",
    studentId: "s2",
    studentName: "Данияр Серіков",
    createdAt: "2026-09-22T10:00:00.000Z",
    updatedAt: "2026-09-22T11:10:00.000Z",
    materialsChecked: allChecked(5),
    safetyChecked: allChecked(4),
    observation: {
      notes:
        "Индикатор дайындалғаннан кейін күлгін түсте болды. Әр сұйықтыққа қосқанда түсі бірден өзгерді.",
      colorChange: "Сірке суы — қызыл, лимон шырыны — ашық қызыл, су — күлгін, сода — көк-жасыл, сабын суы — жасыл",
      gasReleased: false,
      temperatureChange: "Өзгеріс болмады",
      time: "25 минут",
    },
    measurements: [
      { id: "m1", substance: "Сірке суы", result: "Қызыл", value: "3" },
      { id: "m2", substance: "Лимон шырыны", result: "Ашық қызыл", value: "2" },
      { id: "m3", substance: "Ағын су", result: "Күлгін", value: "7" },
      { id: "m4", substance: "Сода ерітіндісі", result: "Көк-жасыл", value: "9" },
      { id: "m5", substance: "Сабын суы", result: "Жасыл", value: "10" },
    ],
    photos: [],
    status: "Тексерілді",
    grade: 10,
    teacherComment:
      "Тамаша орындалған тәжірибе! Барлық мәндер дұрыс бағаланған, кесте мен график анық толтырылған.",
  },
  {
    id: "e3",
    experimentId: "eggshell-vinegar",
    studentId: "s3",
    studentName: "Мадина Қасымова",
    createdAt: "2026-09-25T08:30:00.000Z",
    updatedAt: "2026-09-26T18:00:00.000Z",
    materialsChecked: allChecked(4),
    safetyChecked: allChecked(3),
    observation: {
      notes:
        "Қабықты сірке суына салған сәтте бірден көпіршіктер пайда болды. Келесі күні қабық жұмсарып, жұқарған.",
      colorChange: "Қабық сәл ағарған",
      gasReleased: true,
      temperatureChange: "Өзгеріс байқалмады",
      time: "26 сағат",
    },
    measurements: [
      { id: "m1", substance: "Қабық (1-сағат)", result: "Көпіршік белсенді", value: "-" },
      { id: "m2", substance: "Қабық (24-сағат)", result: "Жұмсарған", value: "-" },
    ],
    photos: [],
    status: "Тексеруге жіберілді",
    grade: undefined,
    teacherComment: undefined,
  },
  {
    id: "e4",
    experimentId: "apple-oxidation",
    studentId: "s4",
    studentName: "Арман Төлеуов",
    createdAt: "2026-09-28T14:00:00.000Z",
    updatedAt: "2026-09-28T15:10:00.000Z",
    materialsChecked: allChecked(5),
    safetyChecked: allChecked(3),
    observation: {
      notes: "Екі бөлік де біраздан соң қараюды бастады, айырмашылықты анық байқай алмадым.",
      colorChange: "Екі бөлік те бірдей қоныр тартты",
      gasReleased: false,
      temperatureChange: "-",
      time: "60 минут",
    },
    measurements: [
      { id: "m1", substance: "Лимонсыз бөлік", result: "Қоныр", value: "20 мин" },
      { id: "m2", substance: "Лимонды бөлік", result: "Қоныр", value: "20 мин" },
    ],
    photos: [],
    status: "Қайта жасау",
    grade: 5,
    teacherComment:
      "Лимон шырынын бөлікке толық сылап жағу керек еді, сол себепті екі бөлік те бірдей қарайған болуы мүмкін. Тәжірибені қайта жасап, лимонды бөлікті мұқият майлап көр.",
  },
  {
    id: "e5",
    experimentId: "salt-crystals",
    studentId: "s5",
    studentName: "Жансая Нұрланова",
    createdAt: "2026-10-05T12:00:00.000Z",
    updatedAt: "2026-10-07T09:00:00.000Z",
    materialsChecked: allChecked(5),
    safetyChecked: allChecked(4),
    observation: {
      notes: "Екінші күні жіпте кішкентай кристалдар көрінді, әлі өсіп жатыр.",
      colorChange: "-",
      gasReleased: false,
      temperatureChange: "-",
      time: "2 күн",
    },
    measurements: [
      { id: "m1", substance: "1-күн", result: "Кристалл көрінбейді", value: "-" },
      { id: "m2", substance: "2-күн", result: "Кіші кристалдар", value: "~2 мм" },
    ],
    photos: [],
    status: "Орындалуда",
    grade: undefined,
    teacherComment: undefined,
  },
];
