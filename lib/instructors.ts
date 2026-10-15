// 강사 프로필 기본값. 각 강사 프로필 이미지에 적힌 내용만 그대로 옮겼습니다.
// (이미지에 없는 경력·자격은 넣지 않았습니다. 관리자 페이지에서 수정할 수 있습니다.)

export type LessonType = 'group' | 'private' | 'both' | '';

export type ProfileBlock = { title: string; items: string[] };

export type Instructor = {
  id: string;
  visible: boolean;
  name: string;
  role: string; // 프로필 이미지에 적힌 직함 그대로 (예: 그룹레슨 강사)
  lessonType: LessonType; // 프로필에 표기된 경우에만 지정
  subtitle: string; // 영문 부제
  specialties: string[]; // 프로필 하단 전문 분야 3가지
  blocks: ProfileBlock[]; // 경력·자격·수업 방향 (프로필의 제목 그대로)
  photo: string; // 카드용 사진 (얼굴 중심)
  profileImage: string; // 프로필 이미지 전체
};

const dir = '/assets/instructors';
const p = (slug: string) => ({ photo: `${dir}/${slug}.webp`, profileImage: `${dir}/${slug}-profile.webp` });

export const defaultInstructors: Instructor[] = [
  {
    id: 'seong-yuna',
    visible: true,
    name: '성윤아',
    role: '그룹레슨 강사',
    lessonType: 'group',
    subtitle: 'GROUP PILATES',
    specialties: ['그룹 레슨', '현장 지도 경험', '전문 과정'],
    blocks: [
      {
        title: '주요 경력',
        items: [
          '모던필라테스 오후 전임 강사',
          '이유필라테스 오후 강사 (2018~2022)',
          '라스포짐 그룹수업 강사 (2018~2022)',
          '필라이브 오전 그룹 강사 (2023~현재)',
        ],
      },
      { title: '자격 및 전문 과정', items: ['Modern Pilates Unit 1·2·3 수료', '근막경선 해부학 워크숍 수료'] },
    ],
    ...p('seong-yuna'),
  },
  {
    id: 'yang-sujeong',
    visible: true,
    name: '양수정',
    role: '필라테스 강사',
    lessonType: '',
    subtitle: 'REHABILITATION & CONDITIONING',
    specialties: ['재활 필라테스', '체형 평가', '통증 개선'],
    blocks: [
      {
        title: '교육 및 경력',
        items: [
          '한국인재교육원 재활 필라테스 과정',
          '재활 트레이닝 전문가 과정 Level 1',
          '운동 해결 전략 과정',
          '산전·산후 필라테스 과정',
          '척추측만 필라테스 과정',
        ],
      },
      {
        title: '자격 및 전문 과정',
        items: [
          'Core Pilates Association 지도자 자격',
          'Mat·Reformer·C.C.B',
          'BM Body Mechanic',
          'CRS (Conditioning Care Specialist) 자격',
        ],
      },
      {
        title: '수업 방향',
        items: ['재활 기반 필라테스 지도', '체형 평가 기반 맞춤 운동 지도', '통증 개선 및 컨디셔닝 중심 프로그램'],
      },
    ],
    ...p('yang-sujeong'),
  },
  {
    id: 'lee-yujin',
    visible: true,
    name: '이유진',
    role: '필라테스 강사',
    lessonType: '',
    subtitle: 'PILATES INSTRUCTOR',
    specialties: ['재활 필라테스', '산전·산후 필라테스', '자세 교정'],
    blocks: [
      {
        title: '교육 및 경력',
        items: [
          '국제재활필라테스 매트·기구 전문 교육',
          '근골격계 해부학 기반 운동 교육',
          '산전·산후 필라테스 전문 과정',
          '척추측만 슈로스 접근법 교육',
          '해부학적 자세 교정·근막 관련 교육',
        ],
      },
      {
        title: '자격 및 전문 과정',
        items: [
          '국제재활필라테스 Mat·Reformer·Cadillac·Chair',
          'Body Blossom Flying Yoga·Mat Yoga',
          'THE PRENATAL / POSTNATAL PILATES TEACHING',
          'Malalignment & Corrective Exercise',
          'Orthotherapy Anatomy·Posture Correction',
          'CES KOREA 교정운동 전문가 과정',
        ],
      },
    ],
    ...p('lee-yujin'),
  },
  {
    id: 'kim-eunseong',
    visible: true,
    name: '김은성',
    role: '필라테스 강사',
    lessonType: '',
    subtitle: 'ANATOMY & FUNCTIONAL PILATES',
    specialties: ['체형 교정', '기능 회복', '연령별 맞춤'],
    blocks: [
      {
        title: '교육 및 경력',
        items: [
          '움직임 평가학',
          '어깨관절·엉덩관절 이해와 적용',
          '근골격계 해부학·척추측만증',
          '키즈 필라테스·산전·산후 필라테스',
          'TRX & RIP Functional Suspension Training 전문가 과정',
        ],
      },
      {
        title: '자격 및 전문 과정',
        items: [
          'MPI (Australia) 국제 필라테스 강사자격',
          'Mat·Cadillac·Reformer·Barrel·Chair',
          '운동처방사 1급',
          '스포츠재활처방사 1급',
          'NSCA 스포츠 영양코치 Lv.1',
        ],
      },
      {
        title: '수업 방향',
        items: ['해부학 기반 체형 교정 필라테스', '재활 및 기능 회복 중심 운동 지도', '연령별 맞춤 프로그램 (키즈·노인·산전산후)'],
      },
    ],
    ...p('kim-eunseong'),
  },
  {
    id: 'sim-ayeong',
    visible: true,
    name: '심아영',
    role: '그룹·개인 병행 강사',
    lessonType: 'both',
    subtitle: 'PILATES INSTRUCTOR',
    specialties: ['그룹·개인레슨', '필라테스 지도자 자격증', '실무 과정'],
    blocks: [
      {
        title: '교육 및 경력',
        items: [
          '신성대학교 물리치료학과 3학년 재학',
          '100일간의 필라테스 파트타임 강사',
          '준필라테스 수내점 토요일 강사',
          '필라이브필라테스 일원역점 주말 강사',
        ],
      },
      { title: '자격 및 전문 과정', items: ['KPEE 필라테스 지도자 자격증', 'KPEE 실무과정'] },
    ],
    ...p('sim-ayeong'),
  },
  {
    id: 'yeom-hyeonseon',
    visible: true,
    name: '염현선',
    role: '그룹·개인 병행 강사',
    lessonType: 'both',
    subtitle: 'PILATES & FITNESS',
    specialties: ['필라테스 지도', '기능적 움직임', '재활·산전산후'],
    blocks: [
      {
        title: '교육 및 경력',
        items: [
          '용인대학교 체육학과 졸업 (2021.08)',
          '그래디 필라테스 강사',
          '광주 중앙고등학교 파견 필라테스 교육',
          '학생 신체 움직임·기초 체력 프로그램 지도',
          '필라이브 필라테스 (2026.05~)',
        ],
      },
      {
        title: '자격 및 전문 과정',
        items: [
          '바레 필라테스 자격증',
          'CPT 퍼스널 트레이닝 지도자 자격증',
          'Reha 독일 재활 필라테스 교육',
          '클래식 필라테스 (Sabina Formichella·Miguel Silva)',
          'HIIT 프로그램·티칭 스킬 교육',
          '산전산후·패시브 스트레칭·재활 세미나',
        ],
      },
    ],
    ...p('yeom-hyeonseon'),
  },
  {
    id: 'park-geunryeong',
    visible: true,
    name: '박근령',
    role: '필라테스 강사',
    lessonType: '',
    subtitle: 'PILATES INSTRUCTOR',
    specialties: ['통증 개선', '맞춤 필라테스', '체형 교정'],
    blocks: [
      {
        title: '교육 및 경력',
        items: [
          '이파마스터 온라인 교육',
          '머스트무브 보행 전문가 과정 (보행의 중요성)',
          '산전 필라테스 과정',
          'SNPE 목·어깨·허리 통증 세미나',
          '미라클짐 목·어깨·허리 통증 세미나',
          'MAT 20기 상지·하지 세미나',
        ],
      },
      {
        title: '자격 및 전문 과정',
        items: [
          '동국대학교 필라테스 지도자 자격',
          'DGPA 4코스·재활 스프링보드·대기구 Pilates',
          'Mat·소도구 필라테스',
          '스포츠테이핑 관리사',
          '재활 스트레칭 지도자',
          '국제 임산부·노인·키즈 필라테스 지도자',
        ],
      },
      {
        title: '수업 방향',
        items: ['통증 개선 및 재활 기반 필라테스 지도', '임산부·노인·키즈 맞춤 필라테스', '체형 교정 및 기능 회복 중심 프로그램'],
      },
    ],
    ...p('park-geunryeong'),
  },
  {
    id: 'na-gyuyeong',
    visible: true,
    name: '나규영',
    role: '필라테스 강사',
    lessonType: '',
    subtitle: 'MODERN PILATES',
    specialties: ['골프 필라테스', '하지 정렬 교정', '척추·골반 정렬'],
    blocks: [
      {
        title: '대표 자격',
        items: ['Modern Pilates International Level 1·2·3', 'Pilates for Golf Rotational Sports 수료'],
      },
      {
        title: '전문 교육',
        items: [
          '국제 모던필라테스 지도자 과정 (2020.07)',
          'Balanced Body 골프 필라테스 (2021.07)',
          '하지 정렬(내반슬·외반슬) 교정 운동',
          '발 기능·여성 운동 트레이닝',
          '척추·골반 정렬과 움직임 관련 교육',
          '대둔근 활성도·발목/고관절 보상작용',
          '견갑골 안정화·만성 허리통증 교육',
          'Cadillac 척추 가동성 교육',
          '천장관절 안정성·중립 골반/척추 교육',
        ],
      },
    ],
    ...p('na-gyuyeong'),
  },
  {
    id: 'eom-suhyeon',
    visible: true,
    name: '엄수현',
    role: '필라테스 강사',
    lessonType: '',
    subtitle: 'MOVEMENT & ANATOMY',
    specialties: ['움직임 평가', '통증 개선', '산전·산후 필라테스'],
    blocks: [
      {
        title: '교육 및 경력',
        items: [
          'MPI 모던필라테스 국제 지도자 Unit 1·2·3',
          '기능해부학·근골격 해부학·움직임 평가',
          '통증 개선(어깨·허리)·척추측만 교육',
          '산전·산후 및 Functional Pilates 교육',
          '골프 필라테스·스포츠 컨디셔닝',
        ],
      },
      {
        title: '자격 및 전문 과정',
        items: [
          'MPI 국제 지도자 과정',
          '노인운동지도자 자격증',
          '스포츠 마사지·테이핑·영양 코칭',
          'FST 근막 스트레칭 테크닉',
          '족부건강·재활 및 관절질환 교육',
          '소도구 필라테스(Band·Gym ball)',
        ],
      },
    ],
    ...p('eom-suhyeon'),
  },
  {
    id: 'choi-sujin',
    visible: true,
    name: '최수진',
    role: '필라테스 강사',
    lessonType: '',
    subtitle: 'PILATES INSTRUCTOR',
    specialties: ['기구 필라테스', '체형 분석', '교정 운동'],
    blocks: [
      {
        title: '교육 및 경력',
        items: [
          '라온기구필라테스 시청·용호·연산점 (2018~2022)',
          '오월애 필라테스 개인레슨 전임 (2022)',
          '도담필라테스 개인·그룹 전임 (2022~2023)',
          '포레스트 요가&필라테스 (2023~2024)',
          '필라테스365 센텀점 (2024~2025)',
          '필라이브 일원점·센트리얼 반포점 (현)',
        ],
      },
      {
        title: '자격 및 전문 과정',
        items: [
          'The Queen Pilates Level 1·2·3',
          '해부학 심화·바디퍼스트 체형분석 지도자',
          'CES KOREA 교정운동 전문가',
          '척추측만 슈로스 접근법 전문가 과정',
          '스포츠 컨디셔닝·KT TAPE 과정',
          '대한요가협회 2급·싱잉볼 지도자',
        ],
      },
    ],
    ...p('choi-sujin'),
  },
  {
    id: 'kim-jiyun',
    visible: true,
    name: '김지윤',
    role: '개인레슨 강사',
    lessonType: 'private',
    subtitle: 'PILATES INSTRUCTOR',
    specialties: ['기능성 필라테스', '체형 교정', '근력·움직임 개선'],
    blocks: [
      {
        title: '교육 및 경력',
        items: [
          '한국체육대학교 태권도학과 졸업 (학사)',
          'MERCI BODY LAB Functional Pilates Anatomy',
          'Dr. Junggi Hong Classic Pilates 34',
          'Bridging the Gap Between Muscle and Motion',
          'Lumbar Functional Instability',
          'Hamstring Exercise',
        ],
      },
      {
        title: '자격 및 전문 과정',
        items: [
          'MERCI BODY LAB 필라테스 강사 자격',
          'Reformer·Barrel·Chair·Cadillac',
          'IIPA 필라테스 1급·2급·3급 수료',
          '한국스포츠인재개발원 퍼스널 트레이너 자격',
        ],
      },
      {
        title: '수업 방향',
        items: ['해부학 기반 기능성 필라테스 지도', '체형 교정 및 하체 정렬 개선 프로그램', '근력·움직임 패턴 개선 중심 운동'],
      },
    ],
    ...p('kim-jiyun'),
  },
  {
    id: 'yu-sujin',
    visible: true,
    name: '유수진',
    role: '그룹레슨 강사',
    lessonType: 'group',
    subtitle: 'PILATES INSTRUCTOR',
    specialties: ['체형 교정', '기능 회복', '관절 재활'],
    blocks: [
      {
        title: '교육 및 경력',
        items: [
          '슈로스(Schroth) 척추측만 운동 지도 과정',
          'MPA 움직임 패턴 분석 전문가 (어깨 상방회전)',
          'KMCA Foot & Ankle Workshop',
          'ISP 질환별 필라테스 (어깨·요추·무릎)',
          '임산부 필라테스 (산전)',
        ],
      },
      {
        title: '자격 및 전문 과정',
        items: [
          'MAA Pilates Certification',
          'Pilates Method Full Course & Rehabilitation Pilates',
          'Reformer Pilates Certification',
          'C.C.B Pilates Certification',
          '대한바레협회 Barre Instructor Level 1',
        ],
      },
      {
        title: '수업 방향',
        items: ['체형 교정 및 기능 회복 중심 필라테스', '척추측만 및 관절 재활 운동 지도', '발·하지 정렬 및 움직임 패턴 개선 프로그램'],
      },
    ],
    ...p('yu-sujin'),
  },
  {
    id: 'ji-juncheol',
    visible: true,
    name: '지준철',
    role: '필라테스 강사',
    lessonType: '',
    subtitle: 'PILATES INSTRUCTOR',
    specialties: ['스포츠과학', '필라테스', '움직임 교육'],
    blocks: [
      {
        title: '교육 및 경력',
        items: [
          '한양대학교 대학원 스포츠과학과 운동역학 석사',
          '서울휘트니스 입시·아동체육 강사 (2014~2016)',
          '동덕여대 모델과 강의 보조 (2019~2020)',
          '소메틱필라테스협회 에듀케이터 (2020.12~)',
          '움직임연구소 강사 (2021.09~)',
          '중앙중학교 체육 시간강사 (2022)',
        ],
      },
      {
        title: '자격 및 전문 과정',
        items: [
          '생활스포츠지도사 2급 (2014)',
          '대한필라테스연맹 매트 필라테스 (2014)',
          '유아체육지도자 1급 (2015)',
          '소메틱필라테스 1급 기구·2급 매트',
          '소메틱필라테스 3급 소도구',
          '시니어근신경 건강운동 지도자 (2021)',
        ],
      },
    ],
    ...p('ji-juncheol'),
  },
  {
    id: 'park-borami',
    visible: true,
    name: '박보라미',
    role: '개인레슨 강사',
    lessonType: 'private',
    subtitle: 'PILATES INSTRUCTOR',
    specialties: ['체형 평가', '교정 운동', '산전·산후 필라테스'],
    blocks: [
      {
        title: '주요 경력',
        items: [
          '세리박 필라테스 | 필라테스 강사 (2022.06~재직 중)',
          '다이트한방병원 | 헬스케어팀 필라테스 실장 (2023.07~2023.12)',
          '피트니스 세븐 | 필라테스 오후 강사 (2021.06~2022.05)',
          '쥬비스 그룹 | 앳홈 운동 컨설턴트 (2020.05~2021.05)',
        ],
      },
      {
        title: '대표 자격 및 전문 과정',
        items: [
          '필라테스 지도자 1급 | 한국자격검정진흥원 (2017)',
          'KPEE 국제 필라테스 지도자 과정 (M.R.C.C.B)',
          '운동처방사 1급 | 한국자격검정진흥원 (2023.12)',
          'CES KOREA 교정운동 전문가 과정 (2020.05)',
          '임산부 산전·산후 필라테스 | 대한예방운동협회 (2019.02)',
          'Schroth method Scoliosis Ex (척추측만증) | S 사이언스 (2018.02~2018.03)',
        ],
      },
    ],
    ...p('park-borami'),
  },
  {
    id: 'choi-eunyeong',
    visible: true,
    name: '최은영',
    role: '그룹레슨 강사',
    lessonType: 'group',
    subtitle: 'PILATES INSTRUCTOR',
    specialties: ['여성 건강', '기능 회복', '체형 평가'],
    blocks: [
      {
        title: '대표 자격',
        items: [
          '미국 Balanced Body 협회 필라테스 지도자',
          "미국 The Center for Women's Fitness 인증 강사",
          '미국 Balanced Body Pilates MOTR 자격',
        ],
      },
      {
        title: '전문 교육',
        items: [
          '미국 Balanced Body Pilates 과정 이수',
          'SSL Academy 시각·전정기관 트레이닝',
          '운동재활학 상·하지·모터컨트롤 과정',
          'Spomed Lab Aging Science 과정 이수',
          'RCT 관절별 재활 전 과정 이수',
          'Premama Care 요실금·치골결합이개·복직근이개 재활 과정 이수',
        ],
      },
      {
        title: '수업 방향',
        items: ['여성 건강 특화 지도 (산전·산후·완경기)', '재활 기반 기능 회복 운동 지도', '체형 평가 기반 맞춤 필라테스 프로그램'],
      },
    ],
    ...p('choi-eunyeong'),
  },
];

export const LESSON_LABEL: Record<Exclude<LessonType, ''>, string> = {
  group: '그룹레슨',
  private: '개인레슨',
  both: '그룹·개인레슨',
};
