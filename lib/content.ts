// 사이트에 보이는 모든 문구·이미지·지점 정보의 구조와 기본값.
// 관리자 페이지에서 저장한 값이 없으면 이 기본값이 그대로 보입니다.

export type Item = { label?: string; title: string; body?: string };
export type Stat = { value: string; unit?: string; label: string };

export type SectionType =
  | 'question'
  | 'system'
  | 'checkup'
  | 'trust'
  | 'report'
  | 'journey'
  | 'value'
  | 'location'
  | 'cta';

export type Section = {
  id: string;
  type: SectionType;
  name: string; // 관리자 화면에서 부르는 이름
  visible: boolean;
  eyebrow: string;
  title: string;
  body: string;
  body2?: string;
  note?: string;
  image?: string;
  imageAlt?: string;
  items?: Item[];
  stats?: Stat[];
};

export type Location = { name: string; en: string; address: string; url: string };

export type SiteContent = {
  seo: { title: string; description: string };
  brand: { logoUrl: string };
  booking: { buttonLabel: string; headerLabel: string; linkButton: string };
  hero: {
    eyebrow: string;
    title: string;
    subtitle: string;
    image: string;
    imageAlt: string;
    badgeSmall: string;
    badgeBig: string;
    secondaryLabel: string;
  };
  sections: Section[];
  location: Location;
  footerNote: string;
};

// 제목에서 줄바꿈은 엔터, *별표*로 감싼 단어는 금색 강조로 표시됩니다.
export const defaultContent: SiteContent = {
  seo: {
    title: '필라이브필라테스 강남일원점 | PILIVE BODY CARE SYSTEM',
    description:
      '측정하고, 운동하고, 다시 확인합니다. 피트릭스 3D 체형분석과 월 1회 재측정으로 운동의 변화까지 함께 살피는 필라이브필라테스 강남일원점의 체형관리 시스템.',
  },
  brand: { logoUrl: '' },
  booking: {
    buttonLabel: '무료 체형분석 예약하기',
    headerLabel: '상담 예약',
    linkButton: '네이버 예약',
  },
  hero: {
    eyebrow: 'PILIVE Body Care System',
    title: '운동한 만큼,\n내 몸은 정말\n*달라지고* 있을까요?',
    subtitle: '측정하고, 운동하고, 다시 확인합니다.\n필라이브필라테스 강남일원점은 운동의 변화까지 함께 살핍니다.',
    image: '',
    imageAlt: '필라이브필라테스 강남일원점 스튜디오',
    badgeSmall: 'RE-MEASURE',
    badgeBig: 'Every month',
    secondaryLabel: '관리 시스템 보기',
  },
  sections: [
    {
      id: 'philosophy',
      type: 'question',
      name: '질문 (브랜드 철학)',
      visible: true,
      eyebrow: 'The Question',
      title: '느낌만으로는\n알 수 없는 것들.',
      body: '꾸준히 운동해도 거울 속의 변화는 쉽게 보이지 않습니다. 그래서 우리는 운동에서 멈추지 않고, 변화를 확인하는 방법을 만들었습니다.',
      body2:
        '당신의 몸을 이해하는 것에서 진정한 변화는 시작됩니다. 운동의 횟수보다 중요한 것은, 나에게 맞는 운동을 지속하는 경험입니다.',
      items: [
        { title: '내 자세는 정말 좋아졌을까.' },
        { title: '어깨와 골반의 균형은 괜찮을까.' },
        { title: '유연성과 움직임은 얼마나 달라졌을까.' },
      ],
    },
    {
      id: 'system',
      type: 'system',
      name: '체형관리 시스템',
      visible: true,
      eyebrow: 'PILIVE Body Care System',
      title: '운동에서 멈추지 않고,\n변화까지 확인합니다.',
      body: '운동 목적을 먼저 듣고, 지금의 몸 상태를 측정합니다. 그 결과를 수업에 담고, 매달 다시 측정해 변화를 비교합니다.',
      note: '그리고 다시, 다음 목표로.',
      items: [
        { label: '측정', title: 'Measure', body: '상담 후 3D 체형분석으로 현재의 몸을 기록합니다.' },
        { label: '운동', title: 'Move', body: '분석 결과를 반영한 수업으로 운동을 이어갑니다.' },
        { label: '재측정', title: 'Re-measure', body: '월 1회 다시 측정해 한 달 전의 나와 비교합니다.' },
      ],
    },
    {
      id: 'checkup',
      type: 'checkup',
      name: '체형분석 측정',
      visible: true,
      eyebrow: 'The Check-up',
      title: '화면을 따라 움직이는 것만으로,\n나의 몸이 기록됩니다.',
      body: '피트릭스 3D 체형분석 시스템의 화면 안내에 따라 간단한 동작을 하면 측정이 진행됩니다. 복잡한 준비 없이 셀프로 측정하고, 평소 알아차리기 어려웠던 몸의 특징이 3D로 기록됩니다.',
      image: '',
      imageAlt: '필라이브필라테스 강남일원점의 피트릭스 3D 체형분석 기기',
      stats: [
        { value: '70', label: '측정 항목' },
        { value: '2', unit: 'min', label: '예상 소요 시간' },
        { value: '1', unit: '/mo', label: '정기 재측정' },
      ],
      items: [
        { title: '전신 사이즈', body: '신체 치수와 비율로 바디 특징을 찾습니다' },
        { title: '체형', body: '틀어진 자세와 균형을 3D로 분석합니다' },
        { title: '근육과 관절 기능', body: '동작으로 근육과 관절의 불균형을 살핍니다' },
        { title: '부상 위험 경향', body: '체형과 기능을 종합해 주의할 부위를 확인합니다' },
      ],
    },
    {
      id: 'technology',
      type: 'trust',
      name: '피트릭스 기술 신뢰',
      visible: true,
      eyebrow: 'Why Fittrix',
      title: '검증된 기술로,\n내 몸을 정확하게 읽습니다.',
      body: '필라이브필라테스 강남일원점이 사용하는 피트릭스 아웃바디는 국내외 2,000곳이 넘는 기업·병원·피트니스 시설에서 쓰이는 체형분석 시스템입니다.',
      note: '기술·인증·도입 현황은 제조사 피트릭스의 공개 자료 기준입니다 (2026년 10월 확인).',
      stats: [
        { value: '2,000', unit: '+', label: '도입 시설' },
        { value: '11', label: '운영 국가' },
        { value: '94', unit: '만+', label: '누적 평가 건수' },
        { value: '18', label: '보유 기술 특허' },
      ],
      items: [
        { label: 'I', title: '현대자동차그룹 사내벤처에서 출발', body: '현대자동차·기아와 공동으로 특허를 보유한 기술입니다.' },
        {
          label: 'II',
          title: '의료기기 성능 검증 항목 기준 검증 완료',
          body: '식품의약품안전처 성능 검증 항목을 기준으로 측정 성능을 검증받았습니다.',
        },
        { label: 'III', title: '국제 품질 인증', body: 'CE · FCC · KC · PSE · ISO 인증을 보유하고 있습니다.' },
      ],
    },
    {
      id: 'report',
      type: 'report',
      name: '리포트',
      visible: true,
      eyebrow: 'Your Report',
      title: '눈으로만 보던 자세,\n이제 숫자로 확인합니다.',
      body: "목의 위치, 어깨의 정렬, 골반의 기울기를 3D 이미지와 수치로 살펴봅니다. '몸이 굳은 것 같다'는 느낌과 실제 움직임의 범위는 다르기 때문입니다.",
      body2:
        '담당 강사는 이 결과를 기준으로 수업을 설계합니다. 결과에 맞춘 추천 운동도 바로 확인할 수 있고, 리포트는 카카오톡으로 받아볼 수 있습니다.',
      note: '화면의 수치는 이해를 돕기 위한 예시입니다.',
      image: '',
      imageAlt: '체형분석 기기 화면에 표시된 측정 결과',
      items: [
        { label: 'POSTURE', title: '자세 정렬' },
        { label: 'BODY AGE', title: '지금, 내 몸의 나이' },
        { label: 'MUSCLE', title: '늘려야 할 근육, 깨워야 할 근육' },
      ],
    },
    {
      id: 'journey',
      type: 'journey',
      name: '관리 과정',
      visible: true,
      eyebrow: 'The Care Journey',
      title: '상담에서 재측정까지,\n한 달의 관리 과정.',
      body: '',
      body2: '분석 결과는 수업 안에서 완성됩니다.',
      note: '재측정 결과는 다시 다음 달 수업의 기준이 됩니다.',
      image: '',
      imageAlt: '필라이브필라테스 강사가 회원의 자세를 지도하는 모습',
      items: [
        { title: '상담', body: '운동을 시작하는 이유와 목표, 생활 습관을 먼저 듣습니다.' },
        { title: '측정', body: '피트릭스 3D 체형분석으로 지금의 몸을 기록합니다.' },
        { title: '결과 확인', body: '자세와 움직임의 특징을 함께 보며 우선 관리할 부위를 정합니다.' },
        { title: '맞춤 수업', body: '담당 강사가 분석 결과를 수업에 적극 반영합니다.' },
        { title: '월 1회 재측정', body: '매달 다시 측정해 변화를 비교하고, 다음 목표를 세웁니다.' },
      ],
    },
    {
      id: 'value',
      type: 'value',
      name: '변화 비교',
      visible: true,
      eyebrow: 'The Value',
      title: '한 달 전의 나와,\n지금의 나.',
      body: '모든 변화가 한 달 안에 나타나는 것은 아닙니다. 하지만 꾸준히 기록하고 비교할수록 나의 운동이 어디를 향하고 있는지 선명해집니다. 측정할 때마다 기록이 쌓여, 지난달과 이번 달을 나란히 비교할 수 있습니다.',
      body2: '수업 횟수를 채우는 운동이 아니라,\n나를 이해해 가는 운동을 돕겠습니다.',
      note: '비교 수치는 예시이며, 변화의 정도는 사람마다 다릅니다.',
    },
    {
      id: 'visit',
      type: 'location',
      name: '오시는 길',
      visible: true,
      eyebrow: 'Visit Us',
      title: '필라이브필라테스\n강남일원점에서 시작하세요.',
      body: '상담부터 측정, 수업과 재측정까지 강남일원점에서 한 사람의 변화를 꼼꼼하게 살핍니다.',
    },
    {
      id: 'cta',
      type: 'cta',
      name: '마지막 상담 안내',
      visible: true,
      eyebrow: 'Free Body Check-up',
      title: '지금, 나의 몸을\n제대로 알아보는 시간.',
      body: '등록 여부와 관계없이 무료로 체형분석과 운동 상담을 받으실 수 있습니다.',
      body2: '체형분석 · 운동상담 예약하기',
      items: [{ title: '현재 운동 중인 회원님' }, { title: '잠시 쉬고 계신 회원님' }, { title: '필라테스가 처음인 분' }],
    },
  ],
  location: {
    name: '필라이브필라테스 강남일원점',
    en: 'PILIVE PILATES GANGNAM ILWON',
    address: '',
    url: '',
  },
  footerNote: '체형분석 결과는 운동 방향 설정을 위한 참고 자료이며, 의료적 진단을 대신하지 않습니다.',
};

// 저장된 값과 기본값을 합칩니다. 나중에 새 항목이 추가돼도 기존 저장본이 깨지지 않게 합니다.
export function mergeContent(saved: unknown): SiteContent {
  const d = defaultContent;
  if (!saved || typeof saved !== 'object') return d;
  const s = saved as Partial<SiteContent>;
  const sections = Array.isArray(s.sections)
    ? s.sections
        .filter((x): x is Section => !!x && typeof x === 'object' && typeof (x as Section).type === 'string')
        .map((x) => ({ ...(d.sections.find((ds) => ds.id === x.id) ?? {}), ...x }))
    : d.sections;
  // 저장본에 없는 새 기본 섹션은 숨김 상태로 뒤에 붙입니다.
  for (const ds of d.sections) {
    if (!sections.some((x) => x.id === ds.id)) sections.push({ ...ds, visible: false });
  }
  return {
    seo: { ...d.seo, ...(s.seo ?? {}) },
    brand: { ...d.brand, ...(s.brand ?? {}) },
    booking: { ...d.booking, ...(s.booking ?? {}) },
    hero: { ...d.hero, ...(s.hero ?? {}) },
    sections,
    location: { ...d.location, ...(s.location ?? {}) },
    footerNote: typeof s.footerNote === 'string' ? s.footerNote : d.footerNote,
  };
}
