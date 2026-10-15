// 브랜드 홈페이지(/, /private)에 보이는 모든 문구·이미지·링크의 구조와 기본값.
// 관리자 페이지에서 저장한 값이 없으면 이 기본값이 그대로 보입니다.
// 제목에서 줄바꿈은 엔터, *별표*로 감싼 단어는 금색 강조로 표시됩니다.

import { defaultInstructors, type Instructor } from './instructors';

export type Notice = { id: string; visible: boolean; date: string; title: string; body: string };
export type Feature = {
  id: string;
  visible: boolean;
  kicker: string;
  title: string;
  body: string;
  points: string[];
  image: string;
  imageAlt: string;
  statValue: string; // 큰 숫자 (비워 두면 숨김)
  statLabel: string;
};
export type TextPair = { title: string; body: string };

// 시간표를 나중에 요일별로 거를 수 있도록 남겨 둔 구조입니다.
// 지금은 비어 있고, 값이 생기면 시간표 아래에 요일 필터가 나타납니다.
export type ScheduleClass = { day: '월' | '화' | '수' | '목' | '금' | '토' | '일'; time: string; name: string; level: string };

export type BrandContent = {
  seo: { title: string; description: string; ogImage: string };
  booking: {
    url: string; // 네이버 예약 주소 (https:// 로 시작)
    headerLabel: string;
    heroLabel: string;
    stickyLabel: string;
    privateLabel: string;
    scheduleLabel: string;
    bodycareLabel: string;
    instructorsLabel: string;
  };
  hero: {
    image: string;
    imageAlt: string;
    focusX: number; // 모바일에서 사진의 어느 쪽을 보여줄지 (0=왼쪽, 100=오른쪽)
    slogan: string;
    title: string;
    subtitle: string;
    exploreLabel: string;
  };
  intro: {
    visible: boolean;
    eyebrow: string;
    title: string;
    body: string;
    image: string;
    imageAlt: string;
    image2: string;
    image2Alt: string;
    services: TextPair[];
  };
  why: {
    visible: boolean;
    eyebrow: string;
    title: string;
    body: string;
    classesPerWeek: string; // 주간 그룹수업 수 — 실제 운영 정보와 맞는지 확인하세요
    instructorCount: string; // 비워 두면 공개 중인 강사 수를 자동으로 표시
    features: Feature[];
    note: string;
  };
  privateTeaser: {
    visible: boolean;
    eyebrow: string;
    title: string;
    body: string;
    image: string;
    imageAlt: string;
    linkLabel: string;
  };
  privatePage: {
    title: string;
    subtitle: string;
    heroImage: string;
    heroImageAlt: string;
    worriesTitle: string;
    worries: string[];
    pointsEyebrow: string;
    pointsTitle: string;
    points: TextPair[];
    compareTitle: string;
    compareBody: string;
    group: { title: string; points: string[] };
    private: { title: string; points: string[] };
    instructorsTitle: string;
    instructorsNote: string;
    closingTitle: string;
    closingBody: string;
    closingImage: string;
    closingImageAlt: string;
    disclaimer: string;
  };
  bodycare: {
    visible: boolean;
    eyebrow: string;
    title: string;
    body: string;
    items: string[];
    image: string;
    imageAlt: string;
    linkLabel: string;
    link: string; // 같은 사이트 안이면 /bodycare, 다른 사이트면 https:// 주소
  };
  schedule: {
    visible: boolean;
    eyebrow: string;
    title: string;
    body: string;
    image: string;
    imageAlt: string;
    caption: string;
    classes: ScheduleClass[];
  };
  instructors: {
    visible: boolean;
    eyebrow: string;
    title: string;
    body: string;
    list: Instructor[];
  };
  notices: { visible: boolean; title: string; items: Notice[] };
  cta: { visible: boolean; eyebrow: string; title: string; body: string; image: string; imageAlt: string };
  location: {
    name: string;
    address: string;
    detail: string;
    phone: string;
    gallery: { src: string; alt: string }[];
  };
  footerNote: string;
};

export const NAVER_BOOKING_DEFAULT =
  'https://m.booking.naver.com/booking/13/bizes/962448/items/8132716?area=pll&lang=ko&theme=place';

export const defaultBrand: BrandContent = {
  seo: {
    title: '필라이브필라테스 강남 일원점 | PILIVE PILATES',
    description:
      '오늘도, 더 건강한 나를 만나는 시간. 0~3단계 수준별 그룹 기구필라테스, 1:1 개인레슨, 피트릭스 체형분석 기반 운동관리까지 — 필라이브필라테스 강남 일원점.',
    ogImage: '/assets/brand/og.jpg',
  },
  booking: {
    url: NAVER_BOOKING_DEFAULT,
    headerLabel: '상담예약',
    heroLabel: '상담예약하기',
    stickyLabel: '네이버 상담예약하기',
    privateLabel: '1:1 개인레슨 상담예약하기',
    scheduleLabel: '수업 상담예약하기',
    bodycareLabel: '체형분석 상담예약하기',
    instructorsLabel: '나에게 맞는 강사 상담받기',
  },
  hero: {
    image: '/images/hero-bg.webp',
    imageAlt: '필라이브필라테스 강남 일원점 입구와 기구 필라테스 룸',
    focusX: 30,
    slogan: 'MOVE BETTER, LIVE BRIGHTER',
    title: '오늘도, 더 건강한\n나를 만나는 시간',
    subtitle: '당신의 움직임을 이해하고,\n당신에게 맞는 변화를 만들어갑니다.',
    exploreLabel: '필라이브 알아보기',
  },
  intro: {
    visible: true,
    eyebrow: 'About PILIVE',
    title: '나에게 맞는 운동을\n*찾아가는* 곳.',
    body: '필라이브필라테스 강남 일원점은 수준별 그룹 기구필라테스부터 1:1 개인레슨, 체형분석 기반의 운동관리까지 한 공간에서 이어지는 운동을 만듭니다. 처음 시작하는 분도, 오래 운동해 온 분도 지금의 몸에 맞는 수업에서 출발할 수 있습니다.',
    image: '/assets/studio/corridor.webp',
    imageAlt: '유리벽 너머로 기구가 보이는 필라이브필라테스 강남 일원점 복도',
    image2: '/assets/studio/reception-front.webp',
    image2Alt: '필라이브필라테스 강남 일원점 상담 데스크',
    services: [
      { title: '그룹 기구필라테스', body: '0~3단계 레벨로 나뉜 수업을 원하는 시간에 선택합니다.' },
      { title: '1:1 개인필라테스', body: '한 사람의 몸과 목표에 맞춰 수업을 설계합니다.' },
      { title: '체형분석 · 운동관리', body: '피트릭스 체형분석으로 현재를 기록하고 변화를 확인합니다.' },
    ],
  },
  why: {
    visible: true,
    eyebrow: 'Why PILIVE',
    title: '왜 *필라이브필라테스*일까요?',
    body: '선택할 수 있는 수업, 나에게 맞는 단계, 믿고 맡길 수 있는 강사, 그리고 변화를 확인하는 관리까지.',
    classesPerWeek: '111',
    instructorCount: '',
    features: [
      {
        id: 'instructors',
        visible: true,
        kicker: '01',
        title: '다양한 전문 강사진',
        body: '체형교정, 근력 강화, 기능성 운동, 산전·산후 운동까지. 분야별 전문성을 갖춘 강사진의 수업 가운데 나의 운동 목적에 맞는 수업을 고를 수 있습니다.',
        points: ['체형교정', '근력 강화', '기능성 운동', '산전·산후 운동'],
        image: '/images/instructor.webp',
        imageAlt: '필라이브필라테스 강사가 리포머 위 회원의 자세를 지도하는 모습',
        statValue: '{instructors}',
        statLabel: '명의 강사진',
      },
      {
        id: 'levels',
        visible: true,
        kicker: '02',
        title: '0~3단계 수준별 맞춤 수업',
        body: '운동 경험과 수준에 따라 레벨이 나뉘어 있어, 입문자부터 숙련자까지 지금의 운동 능력에 맞는 수업에서 체계적으로 운동할 수 있습니다.',
        points: [],
        image: '/images/studio-wide.webp',
        imageAlt: '바렐과 체어가 놓인 필라이브필라테스 그룹 수업 공간',
        statValue: 'Lv.0~3',
        statLabel: '단계별 수업',
      },
      {
        id: 'classes',
        visible: true,
        kicker: '03',
        title: '풍부한 그룹레슨 편성',
        body: '주 7일, 이른 아침부터 저녁까지 다양한 요일과 시간대에 수업이 열립니다. 선택의 폭이 넓어 내 일정에 맞춰 예약하기 편합니다.',
        points: ['주 7일 운영', '오전 · 오후 · 저녁 수업', '캐딜락 · 리포머 · 체어 · 바렐'],
        image: '/assets/studio/entrance.webp',
        imageAlt: '필라이브필라테스 강남 일원점 입구와 기구 필라테스 룸',
        statValue: '{classes}',
        statLabel: '주간 그룹레슨',
      },
      {
        id: 'care',
        visible: true,
        kicker: '04',
        title: '체계적인 운동관리',
        body: '운동을 시작하기 전 몸의 상태를 확인하고, 목표를 함께 세웁니다. 정기적으로 변화를 확인하며 다음 목표를 다시 설정합니다.',
        points: ['피트릭스 기반 체형분석', '운동 목적 설정', '정기적인 변화 확인', '운동상담 및 목표 재설정'],
        image: '/images/checkup.webp',
        imageAlt: '필라이브필라테스 강남 일원점의 피트릭스 체형분석 기기',
        statValue: '',
        statLabel: '',
      },
    ],
    note: '수업 수와 강사 수는 운영 상황에 따라 달라질 수 있습니다.',
  },
  privateTeaser: {
    visible: true,
    eyebrow: '1:1 Private Lesson',
    title: '같은 운동을 해도,\n몸의 변화는 *다릅니다*.',
    body: '내 몸의 움직임을 세밀하게 살피고, 목적에 맞춰 설계하는 1:1 개인레슨. 나에게 맞는 운동을 제대로 배우는 시간입니다.',
    image: '/images/cta-bg.webp',
    imageAlt: '강사가 리포머 위 회원의 자세를 1:1로 지도하는 모습',
    linkLabel: '1:1 개인레슨 자세히 보기',
  },
  privatePage: {
    title: '같은 운동을 해도,\n몸의 변화는 *다릅니다*.',
    subtitle: '당신의 몸은 다른 사람과 다르기에,\n운동 방법도 달라야 합니다.',
    heroImage: '/images/cta-bg.webp',
    heroImageAlt: '강사가 리포머 위 회원의 자세를 1:1로 지도하는 모습',
    worriesTitle: '혹시 이런 고민이 있으신가요?',
    worries: [
      '필라테스를 해봤지만 어떤 변화가 있었는지 모르겠어요.',
      '그룹수업을 따라가기 어려울 때가 있어요.',
      '운동할 때 내 자세가 맞는지 궁금해요.',
      '허리나 어깨가 불편해서 운동이 조심스러워요.',
      '체형교정이나 근력 강화 등 명확한 목표가 있어요.',
      '운동을 처음 시작해서 기초부터 배우고 싶어요.',
    ],
    pointsEyebrow: 'Private Lesson',
    pointsTitle: '1:1 개인레슨은\n이렇게 *다릅니다*.',
    points: [
      { title: '개인별 체형 및 움직임 상태 확인', body: '수업 전, 지금의 자세와 움직임의 특징을 먼저 살펴봅니다.' },
      { title: '운동 목적에 맞춘 프로그램 설계', body: '체형, 근력, 컨디션, 생활 습관을 고려해 나만의 순서를 만듭니다.' },
      { title: '강사의 집중적인 1:1 자세 지도', body: '한 동작 한 동작, 놓치기 쉬운 정렬과 호흡을 바로 짚어 드립니다.' },
      { title: '운동 강도와 난이도의 개별 조절', body: '그날의 컨디션과 숙련도에 맞춰 강도와 난이도를 조절합니다.' },
      { title: '정기적인 변화 점검과 목표 관리', body: '변화를 함께 확인하고, 다음 목표를 다시 세웁니다.' },
    ],
    compareTitle: '그룹레슨과 개인레슨,\n각자의 장점이 있습니다.',
    compareBody: '두 수업은 우열이 아니라 역할이 다릅니다. 목적에 따라 하나를 선택하거나, 함께 병행할 수 있습니다.',
    group: {
      title: '그룹레슨',
      points: ['함께 운동하는 즐거움과 에너지', '다양한 프로그램과 기구를 경험', '레벨별 수업으로 단계적인 성장', '원하는 요일·시간을 골라 꾸준하게'],
    },
    private: {
      title: '1:1 개인레슨',
      points: ['내 움직임을 더욱 세밀하게 관찰', '자세를 바로 짚어 주는 즉각적인 교정', '목적과 컨디션에 맞춘 개별 프로그램', '기초를 탄탄히 다져 그룹레슨에도 자신감'],
    },
    instructorsTitle: '개인레슨을 함께하는 강사',
    instructorsNote: '프로필에 개인레슨이 표기된 강사입니다. 다른 강사의 개인레슨 가능 여부는 상담 시 안내해 드립니다.',
    closingTitle: '운동을 더 많이 하는 것보다,\n나에게 *맞게* 하는 것이 중요합니다.',
    closingBody: '상담에서 지금의 몸 상태와 운동 목적을 먼저 듣고, 나에게 맞는 수업 방향을 함께 정합니다.',
    closingImage: '/assets/studio/reception.webp',
    closingImageAlt: '필라이브필라테스 강남 일원점 상담 공간',
    disclaimer:
      '필라테스 수업은 의료적 치료를 대신하지 않습니다. 통증이나 질환이 있는 경우 전문의와 먼저 상담해 주세요. 운동의 효과는 개인마다 다릅니다.',
  },
  bodycare: {
    visible: true,
    eyebrow: 'PILIVE Body Care System',
    title: '운동을 넘어,\n변화까지 *관리*합니다.',
    body: '느낌만으로는 알기 어려운 몸의 변화를 측정하고, 기록하고, 다시 확인합니다.',
    items: ['피트릭스 체형분석', '운동 목적 및 현재 상태 확인', '맞춤 운동 방향 설정', '정기적인 체형 재측정', '운동상담 및 목표 관리'],
    image: '/images/report.webp',
    imageAlt: '피트릭스 체형분석 기기가 자세를 3D로 스캔하는 화면',
    linkLabel: 'PILIVE BODY CARE SYSTEM 자세히 알아보기',
    link: '/bodycare',
  },
  schedule: {
    visible: true,
    eyebrow: 'Group Class Schedule',
    title: '그룹레슨 시간표',
    body: '시간표를 누르면 크게 볼 수 있어요. 두 손가락으로 확대하고, 끌어서 움직일 수 있습니다.',
    image: '/assets/schedule/gangnam-ilwon-group.jpg',
    imageAlt: '필라이브필라테스 강남 일원점 그룹레슨 주간 시간표 (월~일, 08:00~21:00, 캐딜락·리포머·체어·바렐 Lv.0~3)',
    caption: '나에게 맞는 시간과 레벨을 선택하세요.',
    classes: [],
  },
  instructors: {
    visible: true,
    eyebrow: 'Our Instructors',
    title: '필라이브의 *전문 강사진*',
    body: '강사 카드를 누르면 경력과 자격, 수업 방향을 확인할 수 있어요.',
    list: defaultInstructors,
  },
  notices: { visible: true, title: '공지사항', items: [] },
  cta: {
    visible: true,
    eyebrow: 'Consultation',
    title: '나에게 맞는 운동,\n상담에서 *시작*하세요.',
    body: '지금의 몸 상태와 운동 목적을 듣고, 그룹레슨·개인레슨·체형분석 중 나에게 맞는 방향을 함께 찾아 드립니다.',
    image: '/images/lobby.webp',
    imageAlt: '필라이브필라테스 강남 일원점 기구 필라테스 룸',
  },
  location: {
    name: '필라이브필라테스 강남 일원점',
    address: '서울 강남구 일원동 63, 정오빌딩 B1',
    detail: '',
    phone: '010-8312-7384',
    gallery: [
      { src: '/assets/studio/entrance.webp', alt: '스튜디오 입구' },
      { src: '/assets/studio/reception.webp', alt: '상담 공간' },
      { src: '/assets/studio/locker.webp', alt: '탈의실 앞 라커' },
    ],
  },
  footerNote: '필라테스 수업과 체형분석은 운동 방향 설정을 위한 것이며, 의료적 진단이나 치료를 대신하지 않습니다.',
};

// ---- 저장본과 기본값 합치기 (새 항목이 추가돼도 기존 저장본이 깨지지 않게) ----

function obj<T extends object>(d: T, s: unknown): T {
  return s && typeof s === 'object' && !Array.isArray(s) ? { ...d, ...(s as Partial<T>) } : d;
}
function arr<T>(d: T[], s: unknown): T[] {
  return Array.isArray(s) ? (s as T[]) : d;
}

export function mergeBrand(saved: unknown): BrandContent {
  const d = defaultBrand;
  if (!saved || typeof saved !== 'object') return d;
  const s = saved as Partial<BrandContent>;
  const why = obj(d.why, s.why);
  const intro = obj(d.intro, s.intro);
  const pp = obj(d.privatePage, s.privatePage);
  const loc = obj(d.location, s.location);
  const ins = obj(d.instructors, s.instructors);
  const notices = obj(d.notices, s.notices);
  const bc = obj(d.bodycare, s.bodycare);
  const sch = obj(d.schedule, s.schedule);
  return {
    seo: obj(d.seo, s.seo),
    booking: obj(d.booking, s.booking),
    hero: obj(d.hero, s.hero),
    intro: { ...intro, services: arr(d.intro.services, intro.services) },
    why: { ...why, features: arr(d.why.features, why.features) },
    privateTeaser: obj(d.privateTeaser, s.privateTeaser),
    privatePage: {
      ...pp,
      worries: arr(d.privatePage.worries, pp.worries),
      points: arr(d.privatePage.points, pp.points),
      group: obj(d.privatePage.group, pp.group),
      private: obj(d.privatePage.private, pp.private),
    },
    bodycare: { ...bc, items: arr(d.bodycare.items, bc.items) },
    schedule: { ...sch, classes: arr(d.schedule.classes, sch.classes) },
    instructors: {
      ...ins,
      list: arr(d.instructors.list, ins.list).map((x) => ({
        ...x,
        specialties: Array.isArray(x.specialties) ? x.specialties : [],
        blocks: Array.isArray(x.blocks) ? x.blocks : [],
      })),
    },
    notices: { ...notices, items: arr(d.notices.items, notices.items) },
    cta: obj(d.cta, s.cta),
    location: { ...loc, gallery: arr(d.location.gallery, loc.gallery) },
    footerNote: typeof s.footerNote === 'string' ? s.footerNote : d.footerNote,
  };
}

/** 네이버 예약 주소가 올바르게 입력됐는지 */
export function bookingReady(url: string) {
  return /^https:\/\/\S+$/.test(url.trim());
}

/** 장점 카드 숫자에 들어가는 {classes}, {instructors} 를 실제 값으로 바꿉니다. */
export function fillStat(value: string, c: BrandContent) {
  const count = c.instructors.list.filter((i) => i.visible).length;
  const instructors = c.why.instructorCount.trim() || String(count);
  return value.replaceAll('{classes}', c.why.classesPerWeek).replaceAll('{instructors}', instructors);
}
