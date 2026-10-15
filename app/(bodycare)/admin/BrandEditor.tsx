'use client';

import { useEffect, useState, useTransition, type ReactNode } from 'react';
import { bookingReady, type BrandContent, type Feature, type Notice, type TextPair } from '@/lib/brand';
import type { Instructor, LessonType } from '@/lib/instructors';
import { logout, saveBrand } from './actions';
import { Field, ImageField, Panel, TITLE_HINT } from './AdminEditor';

type Status = { kind: 'idle' | 'ok' | 'err' | 'dirty'; text: string };

/** 한 줄에 하나씩 입력하는 목록 (저장할 때 빈 줄은 빠집니다) */
function Lines({
  id,
  label,
  hint,
  value,
  onChange,
}: {
  id: string;
  label: string;
  hint?: string;
  value: string[];
  onChange: (v: string[]) => void;
}) {
  return (
    <label className="field" htmlFor={id}>
      <span>{label}</span>
      <textarea id={id} rows={Math.max(3, value.length + 1)} value={value.join('\n')} onChange={(e) => onChange(e.target.value.split('\n'))} />
      <em>{hint ?? '한 줄에 하나씩 입력하세요. 빈 줄은 저장할 때 빠집니다.'}</em>
    </label>
  );
}

function Visible({ checked, onChange, label = '사이트에 보이기' }: { checked: boolean; onChange: (v: boolean) => void; label?: string }) {
  return (
    <label className="toggle">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      {label}
    </label>
  );
}

function badge(on: boolean) {
  return <span className={on ? 'badge' : 'badge off'}>{on ? '보이는 중' : '숨김'}</span>;
}

/** 위·아래 이동, 삭제 버튼 */
function ItemTools({
  index,
  length,
  onMove,
  onDelete,
  deleteLabel = '삭제',
  confirmText,
}: {
  index: number;
  length: number;
  onMove: (dir: -1 | 1) => void;
  onDelete?: () => void;
  deleteLabel?: string;
  confirmText?: string;
}) {
  return (
    <div className="sec-tools">
      <button type="button" className="adm-btn small" disabled={index === 0} onClick={() => onMove(-1)} aria-label="위로">
        ↑
      </button>
      <button type="button" className="adm-btn small" disabled={index === length - 1} onClick={() => onMove(1)} aria-label="아래로">
        ↓
      </button>
      {onDelete ? (
        <button
          type="button"
          className="adm-btn small danger"
          onClick={() => {
            if (!confirmText || window.confirm(confirmText)) onDelete();
          }}
        >
          {deleteLabel}
        </button>
      ) : null}
    </div>
  );
}

function move<T>(a: T[], i: number, dir: -1 | 1) {
  const j = i + dir;
  if (j < 0 || j >= a.length) return;
  [a[i], a[j]] = [a[j], a[i]];
}

function uid(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
}

function PairList({
  id,
  label,
  value,
  onChange,
  addLabel,
}: {
  id: string;
  label: string;
  value: TextPair[];
  onChange: (fn: (a: TextPair[]) => void) => void;
  addLabel: string;
}) {
  return (
    <div className="field">
      <span>{label}</span>
      <div className="sub-list">
        {value.map((x, k) => (
          <div className="sub-item" key={k}>
            <header>
              <span>{k + 1}번</span>
              <ItemTools
                index={k}
                length={value.length}
                onMove={(d) => onChange((a) => move(a, k, d))}
                onDelete={() => onChange((a) => void a.splice(k, 1))}
              />
            </header>
            <Field id={`${id}-t-${k}`} label="제목" value={x.title} onChange={(v) => onChange((a) => (a[k].title = v))} />
            <Field id={`${id}-b-${k}`} label="설명" multiline value={x.body} onChange={(v) => onChange((a) => (a[k].body = v))} />
          </div>
        ))}
      </div>
      <div>
        <button type="button" className="adm-btn small" onClick={() => onChange((a) => void a.push({ title: '', body: '' }))}>
          + {addLabel}
        </button>
      </div>
    </div>
  );
}

const LESSON_OPTIONS: { value: LessonType; label: string }[] = [
  { value: '', label: '표시 안 함' },
  { value: 'group', label: '그룹레슨' },
  { value: 'private', label: '개인레슨' },
  { value: 'both', label: '그룹·개인 병행' },
];

export default function BrandEditor({ initial, storageOk, tabs }: { initial: BrandContent; storageOk: boolean; tabs?: ReactNode }) {
  const [c, setC] = useState<BrandContent>(initial);
  const [status, setStatus] = useState<Status>({ kind: 'idle', text: '수정한 뒤 저장 버튼을 눌러 주세요.' });
  const [pending, start] = useTransition();

  // 저장하지 않고 나가려 하면 한 번 더 확인
  useEffect(() => {
    if (status.kind !== 'dirty') return;
    const warn = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [status.kind]);

  function update(fn: (d: BrandContent) => void) {
    setC((prev) => {
      const next = structuredClone(prev);
      fn(next);
      return next;
    });
    setStatus({ kind: 'dirty', text: '저장하지 않은 변경 사항이 있습니다.' });
  }

  function save() {
    if (c.booking.url.trim() && !bookingReady(c.booking.url)) {
      setStatus({ kind: 'err', text: '네이버 예약 주소는 https:// 로 시작해야 합니다. 주소를 확인해 주세요.' });
      return;
    }
    start(async () => {
      const res = await saveBrand(c);
      setStatus({ kind: res.ok ? 'ok' : 'err', text: res.message });
    });
  }

  const ins = (i: number) => (fn: (x: Instructor) => void) => update((d) => fn(d.instructors.list[i]));
  const feat = (i: number) => (fn: (x: Feature) => void) => update((d) => fn(d.why.features[i]));
  const notice = (i: number) => (fn: (x: Notice) => void) => update((d) => fn(d.notices.items[i]));
  const ready = bookingReady(c.booking.url);
  const visibleCount = c.instructors.list.filter((i) => i.visible).length;

  return (
    <div className="adm">
      <div className="adm-top">
        <div className="wrap">
          <b>PILIVE ADMIN</b>
          {tabs}
          <div className="links">
            <a className="adm-btn ghost small" href="/" target="_blank" rel="noopener">
              사이트 보기
            </a>
            <form action={logout}>
              <button className="adm-btn ghost small" type="submit">
                로그아웃
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="wrap adm-main">
        {!storageOk ? (
          <div className="notice">
            저장소(Vercel Blob)가 아직 연결되지 않아 수정 내용을 저장할 수 없습니다. Vercel 프로젝트의 Storage 메뉴에서 Blob
            저장소를 연결해 주세요.
          </div>
        ) : null}
        {!ready ? (
          <div className="notice">
            <b>네이버 예약 주소가 설정되지 않았습니다.</b> 지금은 홈페이지의 모든 예약 버튼이 &lsquo;예약 링크 준비 중&rsquo;으로 보이고
            전화 문의만 안내됩니다. 아래 &lsquo;네이버 상담예약&rsquo;에서 주소를 입력해 주세요.
          </div>
        ) : null}
        <p className="adm-intro">
          지금 수정 중인 페이지: <b>브랜드 홈페이지 (/ , /private)</b>. 항목을 눌러 펼친 뒤 수정하고, 화면 아래의 <b>저장하기</b>를
          누르면 홈페이지에 바로 반영됩니다. 사진을 바꿀 때는 &lsquo;이미지 교체&rsquo;로 올린 뒤 꼭 저장해 주세요.
        </p>

        <Panel title="네이버 상담예약" sub={<span className={ready ? 'badge' : 'badge off'}>{ready ? '설정됨' : '설정 필요'}</span>} open>
          <Field
            id="bk-url"
            type="url"
            label="네이버 예약 주소"
            hint="https:// 로 시작하는 네이버 예약 주소를 붙여넣으세요. 홈페이지와 개인레슨 페이지의 모든 예약 버튼이 이 주소로 연결됩니다. 비워 두면 '예약 링크 준비 중'과 전화번호가 보입니다."
            value={c.booking.url}
            onChange={(v) => update((d) => (d.booking.url = v))}
          />
          {ready ? (
            <p className="adm-intro">
              <a href={c.booking.url} target="_blank" rel="noopener noreferrer">
                입력한 주소 열어서 확인하기 →
              </a>
            </p>
          ) : null}
          <div className="row2">
            <Field id="bk-head" label="상단 메뉴 버튼" value={c.booking.headerLabel} onChange={(v) => update((d) => (d.booking.headerLabel = v))} />
            <Field id="bk-hero" label="메인 화면 버튼" value={c.booking.heroLabel} onChange={(v) => update((d) => (d.booking.heroLabel = v))} />
            <Field id="bk-sticky" label="모바일 하단 고정 버튼 · 마지막 상담 섹션" value={c.booking.stickyLabel} onChange={(v) => update((d) => (d.booking.stickyLabel = v))} />
            <Field id="bk-private" label="개인레슨 버튼" value={c.booking.privateLabel} onChange={(v) => update((d) => (d.booking.privateLabel = v))} />
            <Field id="bk-schedule" label="시간표 아래 버튼" value={c.booking.scheduleLabel} onChange={(v) => update((d) => (d.booking.scheduleLabel = v))} />
            <Field id="bk-bodycare" label="바디케어 섹션 버튼" value={c.booking.bodycareLabel} onChange={(v) => update((d) => (d.booking.bodycareLabel = v))} />
            <Field id="bk-ins" label="강사진 아래 버튼" value={c.booking.instructorsLabel} onChange={(v) => update((d) => (d.booking.instructorsLabel = v))} />
          </div>
        </Panel>

        <Panel title="공지사항" sub={<span className="badge">{c.notices.items.filter((n) => n.visible).length}개 공개</span>}>
          <Visible checked={c.notices.visible} onChange={(v) => update((d) => (d.notices.visible = v))} label="공지사항 영역 보이기 (공개 공지가 있을 때만 나타납니다)" />
          <Field id="nt-title" label="영역 제목" value={c.notices.title} onChange={(v) => update((d) => (d.notices.title = v))} />
          <div className="sub-list">
            {c.notices.items.map((n, k) => (
              <div className="sub-item" key={n.id}>
                <header>
                  <span>{badge(n.visible)}</span>
                  <ItemTools
                    index={k}
                    length={c.notices.items.length}
                    onMove={(dir) => update((d) => move(d.notices.items, k, dir))}
                    onDelete={() => update((d) => void d.notices.items.splice(k, 1))}
                    confirmText="이 공지를 삭제할까요?"
                  />
                </header>
                <Visible checked={n.visible} onChange={(v) => notice(k)((x) => (x.visible = v))} label="공개" />
                <div className="row2">
                  <Field id={`nt-d-${k}`} label="날짜 (예: 2026.10.15)" value={n.date} onChange={(v) => notice(k)((x) => (x.date = v))} />
                  <Field id={`nt-t-${k}`} label="제목" value={n.title} onChange={(v) => notice(k)((x) => (x.title = v))} />
                </div>
                <Field id={`nt-b-${k}`} label="내용" multiline value={n.body} onChange={(v) => notice(k)((x) => (x.body = v))} />
              </div>
            ))}
          </div>
          <div>
            <button
              type="button"
              className="adm-btn small"
              onClick={() =>
                update((d) =>
                  d.notices.items.unshift({
                    id: uid('notice'),
                    visible: true,
                    date: new Date().toLocaleDateString('ko-KR', { timeZone: 'Asia/Seoul' }).replace(/\s/g, '').replace(/\.$/, ''),
                    title: '',
                    body: '',
                  }),
                )
              }
            >
              + 공지 추가
            </button>
          </div>
        </Panel>

        <Panel title="1. 메인 화면 (첫 화면)">
          <ImageField
            id="hero-img"
            label="메인 사진"
            hint="가로로 넓은 스튜디오 전경 사진을 추천합니다. 아래 '모바일 사진 위치'로 휴대폰에서 보일 부분을 고를 수 있습니다."
            value={c.hero.image}
            onChange={(v) => update((d) => (d.hero.image = v))}
          />
          <Field id="hero-alt" label="사진 설명 (시각장애인용·검색용)" value={c.hero.imageAlt} onChange={(v) => update((d) => (d.hero.imageAlt = v))} />
          <label className="field" htmlFor="hero-fx">
            <span>모바일 사진 위치 — {c.hero.focusX <= 20 ? '왼쪽' : c.hero.focusX >= 80 ? '오른쪽' : '가운데'} ({c.hero.focusX}%)</span>
            <input
              id="hero-fx"
              type="range"
              min={0}
              max={100}
              step={5}
              value={c.hero.focusX}
              onChange={(e) => update((d) => (d.hero.focusX = Number(e.target.value)))}
            />
            <em>휴대폰 화면은 세로로 길어서 사진의 양옆이 잘립니다. 보여주고 싶은 공간 쪽으로 옮겨 주세요.</em>
          </label>
          <Field id="hero-slogan" label="영문 슬로건" value={c.hero.slogan} onChange={(v) => update((d) => (d.hero.slogan = v))} />
          <Field id="hero-title" label="메인 문구" hint={TITLE_HINT} multiline value={c.hero.title} onChange={(v) => update((d) => (d.hero.title = v))} />
          <Field id="hero-sub" label="서브 문구" multiline value={c.hero.subtitle} onChange={(v) => update((d) => (d.hero.subtitle = v))} />
          <Field id="hero-explore" label="'알아보기' 버튼 문구" value={c.hero.exploreLabel} onChange={(v) => update((d) => (d.hero.exploreLabel = v))} />
        </Panel>

        <Panel title="2. 필라이브 소개" sub={badge(c.intro.visible)}>
          <Visible checked={c.intro.visible} onChange={(v) => update((d) => (d.intro.visible = v))} />
          <Field id="in-eb" label="작은 영문 문구" value={c.intro.eyebrow} onChange={(v) => update((d) => (d.intro.eyebrow = v))} />
          <Field id="in-t" label="제목" hint={TITLE_HINT} multiline value={c.intro.title} onChange={(v) => update((d) => (d.intro.title = v))} />
          <Field id="in-b" label="본문" multiline value={c.intro.body} onChange={(v) => update((d) => (d.intro.body = v))} />
          <div className="row2">
            <div className="field">
              <ImageField id="in-img" label="큰 사진 (아치형)" value={c.intro.image} onChange={(v) => update((d) => (d.intro.image = v))} />
              <Field id="in-alt" label="사진 설명" value={c.intro.imageAlt} onChange={(v) => update((d) => (d.intro.imageAlt = v))} />
            </div>
            <div className="field">
              <ImageField id="in-img2" label="작은 사진" value={c.intro.image2} onChange={(v) => update((d) => (d.intro.image2 = v))} />
              <Field id="in-alt2" label="사진 설명" value={c.intro.image2Alt} onChange={(v) => update((d) => (d.intro.image2Alt = v))} />
            </div>
          </div>
          <PairList id="in-sv" label="주요 서비스" value={c.intro.services} onChange={(fn) => update((d) => fn(d.intro.services))} addLabel="서비스 추가" />
        </Panel>

        <Panel title="3. 필라이브의 특별함 (장점)" sub={badge(c.why.visible)}>
          <Visible checked={c.why.visible} onChange={(v) => update((d) => (d.why.visible = v))} />
          <Field id="why-t" label="제목" hint={TITLE_HINT} value={c.why.title} onChange={(v) => update((d) => (d.why.title = v))} />
          <Field id="why-b" label="설명" multiline value={c.why.body} onChange={(v) => update((d) => (d.why.body = v))} />
          <div className="notice">
            아래 숫자는 홈페이지에 크게 표시됩니다. <b>실제 운영 정보와 맞는지 꼭 확인</b>해 주세요. 장점 카드의 큰 숫자 칸에{' '}
            <code>{'{classes}'}</code>를 쓰면 주간 수업 수, <code>{'{instructors}'}</code>를 쓰면 강사 수가 들어갑니다.
          </div>
          <div className="row2">
            <Field
              id="why-cls"
              label="주간 그룹레슨 수"
              hint="첨부 홍보물 기준 111개. 시간표가 바뀌면 함께 고쳐 주세요."
              value={c.why.classesPerWeek}
              onChange={(v) => update((d) => (d.why.classesPerWeek = v))}
            />
            <Field
              id="why-ins"
              label="강사 수"
              hint={`비워 두면 공개 중인 강사 수(현재 ${visibleCount}명)가 자동으로 들어갑니다.`}
              value={c.why.instructorCount}
              onChange={(v) => update((d) => (d.why.instructorCount = v))}
            />
          </div>
          <div className="sub-list">
            {c.why.features.map((f, k) => (
              <div className="sub-item" key={f.id}>
                <header>
                  <span>
                    {k + 1}. {f.title || '(제목 없음)'} {badge(f.visible)}
                  </span>
                  <ItemTools index={k} length={c.why.features.length} onMove={(dir) => update((d) => move(d.why.features, k, dir))} />
                </header>
                <Visible checked={f.visible} onChange={(v) => feat(k)((x) => (x.visible = v))} />
                <div className="row2">
                  <Field id={`f-k-${k}`} label="번호 라벨" value={f.kicker} onChange={(v) => feat(k)((x) => (x.kicker = v))} />
                  <Field id={`f-t-${k}`} label="제목" value={f.title} onChange={(v) => feat(k)((x) => (x.title = v))} />
                  <Field id={`f-sv-${k}`} label="큰 숫자 (비우면 숨김)" value={f.statValue} onChange={(v) => feat(k)((x) => (x.statValue = v))} />
                  <Field id={`f-sl-${k}`} label="숫자 옆 설명" value={f.statLabel} onChange={(v) => feat(k)((x) => (x.statLabel = v))} />
                </div>
                <Field id={`f-b-${k}`} label="설명" multiline value={f.body} onChange={(v) => feat(k)((x) => (x.body = v))} />
                <Lines id={`f-p-${k}`} label="키워드" value={f.points} onChange={(v) => feat(k)((x) => (x.points = v))} />
                <ImageField id={`f-img-${k}`} label="사진" value={f.image} onChange={(v) => feat(k)((x) => (x.image = v))} />
                <Field id={`f-alt-${k}`} label="사진 설명" value={f.imageAlt} onChange={(v) => feat(k)((x) => (x.imageAlt = v))} />
              </div>
            ))}
          </div>
          <Field id="why-note" label="아래 작은 안내 문구" value={c.why.note} onChange={(v) => update((d) => (d.why.note = v))} />
        </Panel>

        <Panel title="4. 1:1 개인레슨 소개 (홈페이지)" sub={badge(c.privateTeaser.visible)}>
          <Visible checked={c.privateTeaser.visible} onChange={(v) => update((d) => (d.privateTeaser.visible = v))} />
          <Field id="pt-eb" label="작은 영문 문구" value={c.privateTeaser.eyebrow} onChange={(v) => update((d) => (d.privateTeaser.eyebrow = v))} />
          <Field id="pt-t" label="제목" hint={TITLE_HINT} multiline value={c.privateTeaser.title} onChange={(v) => update((d) => (d.privateTeaser.title = v))} />
          <Field id="pt-b" label="설명" multiline value={c.privateTeaser.body} onChange={(v) => update((d) => (d.privateTeaser.body = v))} />
          <ImageField id="pt-img" label="사진" value={c.privateTeaser.image} onChange={(v) => update((d) => (d.privateTeaser.image = v))} />
          <Field id="pt-alt" label="사진 설명" value={c.privateTeaser.imageAlt} onChange={(v) => update((d) => (d.privateTeaser.imageAlt = v))} />
          <Field id="pt-link" label="상세 페이지 버튼 문구" value={c.privateTeaser.linkLabel} onChange={(v) => update((d) => (d.privateTeaser.linkLabel = v))} />
        </Panel>

        <Panel title="개인레슨 상세 페이지 (/private)">
          <Field id="pp-t" label="메인 헤드라인" hint={TITLE_HINT} multiline value={c.privatePage.title} onChange={(v) => update((d) => (d.privatePage.title = v))} />
          <Field id="pp-s" label="서브 문구" multiline value={c.privatePage.subtitle} onChange={(v) => update((d) => (d.privatePage.subtitle = v))} />
          <ImageField id="pp-img" label="첫 화면 사진" value={c.privatePage.heroImage} onChange={(v) => update((d) => (d.privatePage.heroImage = v))} />
          <Field id="pp-alt" label="사진 설명" value={c.privatePage.heroImageAlt} onChange={(v) => update((d) => (d.privatePage.heroImageAlt = v))} />
          <Field id="pp-wt" label="고민 영역 제목" value={c.privatePage.worriesTitle} onChange={(v) => update((d) => (d.privatePage.worriesTitle = v))} />
          <Lines id="pp-w" label="고객 고민" value={c.privatePage.worries} onChange={(v) => update((d) => (d.privatePage.worries = v))} />
          <Field id="pp-pt" label="차별화 제목" hint={TITLE_HINT} multiline value={c.privatePage.pointsTitle} onChange={(v) => update((d) => (d.privatePage.pointsTitle = v))} />
          <PairList id="pp-p" label="개인레슨의 차별화" value={c.privatePage.points} onChange={(fn) => update((d) => fn(d.privatePage.points))} addLabel="항목 추가" />
          <Field id="pp-ct" label="그룹·개인 비교 제목" hint={TITLE_HINT} multiline value={c.privatePage.compareTitle} onChange={(v) => update((d) => (d.privatePage.compareTitle = v))} />
          <Field id="pp-cb" label="비교 설명" multiline value={c.privatePage.compareBody} onChange={(v) => update((d) => (d.privatePage.compareBody = v))} />
          <div className="row2">
            <Lines id="pp-g" label="그룹레슨의 장점" value={c.privatePage.group.points} onChange={(v) => update((d) => (d.privatePage.group.points = v))} />
            <Lines id="pp-pv" label="개인레슨의 장점" value={c.privatePage.private.points} onChange={(v) => update((d) => (d.privatePage.private.points = v))} />
          </div>
          <Field id="pp-it" label="개인레슨 강사 영역 제목" value={c.privatePage.instructorsTitle} onChange={(v) => update((d) => (d.privatePage.instructorsTitle = v))} />
          <Field
            id="pp-in"
            label="개인레슨 강사 안내"
            hint="강사진 목록에서 수업 구분을 '개인레슨' 또는 '그룹·개인 병행'으로 지정한 강사가 이 페이지에 보입니다."
            multiline
            value={c.privatePage.instructorsNote}
            onChange={(v) => update((d) => (d.privatePage.instructorsNote = v))}
          />
          <Field id="pp-clt" label="마지막 상담 문구" hint={TITLE_HINT} multiline value={c.privatePage.closingTitle} onChange={(v) => update((d) => (d.privatePage.closingTitle = v))} />
          <Field id="pp-clb" label="마지막 상담 설명" multiline value={c.privatePage.closingBody} onChange={(v) => update((d) => (d.privatePage.closingBody = v))} />
          <ImageField id="pp-cli" label="마지막 상담 배경 사진" value={c.privatePage.closingImage} onChange={(v) => update((d) => (d.privatePage.closingImage = v))} />
          <Field id="pp-dis" label="하단 안내 (의료 관련 고지)" multiline value={c.privatePage.disclaimer} onChange={(v) => update((d) => (d.privatePage.disclaimer = v))} />
        </Panel>

        <Panel title="5. PILIVE BODY CARE SYSTEM" sub={badge(c.bodycare.visible)}>
          <Visible checked={c.bodycare.visible} onChange={(v) => update((d) => (d.bodycare.visible = v))} />
          <Field
            id="bc-link"
            label="바디케어 페이지 주소"
            hint="같은 사이트의 바디케어 페이지는 /bodycare 입니다. 다른 사이트로 연결하려면 https:// 로 시작하는 주소를 넣으세요. 비우면 '주소 준비 중'으로 보입니다."
            value={c.bodycare.link}
            onChange={(v) => update((d) => (d.bodycare.link = v))}
          />
          <Field id="bc-ll" label="버튼 문구" value={c.bodycare.linkLabel} onChange={(v) => update((d) => (d.bodycare.linkLabel = v))} />
          <Field id="bc-t" label="제목" hint={TITLE_HINT} multiline value={c.bodycare.title} onChange={(v) => update((d) => (d.bodycare.title = v))} />
          <Field id="bc-b" label="설명" multiline value={c.bodycare.body} onChange={(v) => update((d) => (d.bodycare.body = v))} />
          <Lines id="bc-i" label="관리 내용" value={c.bodycare.items} onChange={(v) => update((d) => (d.bodycare.items = v))} />
          <ImageField id="bc-img" label="사진" value={c.bodycare.image} onChange={(v) => update((d) => (d.bodycare.image = v))} />
          <Field id="bc-alt" label="사진 설명" value={c.bodycare.imageAlt} onChange={(v) => update((d) => (d.bodycare.imageAlt = v))} />
        </Panel>

        <Panel title="6. 그룹레슨 시간표" sub={badge(c.schedule.visible)}>
          <Visible checked={c.schedule.visible} onChange={(v) => update((d) => (d.schedule.visible = v))} />
          <ImageField
            id="sc-img"
            label="시간표 이미지"
            hint="시간표가 바뀌면 새 이미지로 교체하세요. 글씨가 잘 보이도록 가로 1200px 이상의 원본 이미지를 올려 주세요. (최대 7MB)"
            value={c.schedule.image}
            onChange={(v) => update((d) => (d.schedule.image = v))}
          />
          <Field id="sc-alt" label="이미지 설명 (시각장애인용·검색용)" multiline value={c.schedule.imageAlt} onChange={(v) => update((d) => (d.schedule.imageAlt = v))} />
          <Field id="sc-t" label="제목" hint={TITLE_HINT} value={c.schedule.title} onChange={(v) => update((d) => (d.schedule.title = v))} />
          <Field id="sc-b" label="설명" multiline value={c.schedule.body} onChange={(v) => update((d) => (d.schedule.body = v))} />
          <Field id="sc-c" label="시간표 아래 문구" value={c.schedule.caption} onChange={(v) => update((d) => (d.schedule.caption = v))} />
        </Panel>

        <Panel title="7. 전문 강사진" sub={<span className="badge">{visibleCount}명 공개</span>}>
          <Visible checked={c.instructors.visible} onChange={(v) => update((d) => (d.instructors.visible = v))} label="강사진 영역 보이기" />
          <Field id="ins-t" label="제목" hint={TITLE_HINT} value={c.instructors.title} onChange={(v) => update((d) => (d.instructors.title = v))} />
          <Field id="ins-b" label="설명" value={c.instructors.body} onChange={(v) => update((d) => (d.instructors.body = v))} />
          <p className="adm-intro">↑ ↓ 버튼으로 홈페이지에 보이는 순서를 바꿀 수 있습니다. 강사 이름을 눌러 펼친 뒤 수정하세요.</p>
          <div className="sub-list">
            {c.instructors.list.map((x, k) => (
              <div className="sub-item" key={x.id}>
                <header>
                  <span>
                    {k + 1}. <b>{x.name || '(이름 없음)'}</b> {badge(x.visible)}
                  </span>
                  <ItemTools
                    index={k}
                    length={c.instructors.list.length}
                    onMove={(dir) => update((d) => move(d.instructors.list, k, dir))}
                    onDelete={() => update((d) => void d.instructors.list.splice(k, 1))}
                    confirmText={`${x.name || '이'} 강사를 삭제할까요? 잠시 숨기려면 삭제 대신 '공개' 체크를 해제하세요.`}
                  />
                </header>
                <details>
                  <summary className="adm-btn small">자세히 수정</summary>
                  <div className="panel-body" style={{ padding: '14px 0 0' }}>
                    <Visible checked={x.visible} onChange={(v) => ins(k)((i) => (i.visible = v))} label="공개" />
                    <div className="row2">
                      <Field id={`i-n-${k}`} label="이름" value={x.name} onChange={(v) => ins(k)((i) => (i.name = v))} />
                      <Field id={`i-r-${k}`} label="직함 (예: 그룹레슨 강사)" value={x.role} onChange={(v) => ins(k)((i) => (i.role = v))} />
                      <label className="field" htmlFor={`i-l-${k}`}>
                        <span>그룹/개인레슨 구분</span>
                        <select
                          id={`i-l-${k}`}
                          value={x.lessonType}
                          onChange={(e) => ins(k)((i) => (i.lessonType = e.target.value as LessonType))}
                          style={{ minHeight: 44, borderRadius: 6, border: '1px solid var(--stone)', padding: '0 10px', background: 'var(--ivory)' }}
                        >
                          {LESSON_OPTIONS.map((o) => (
                            <option key={o.value} value={o.value}>
                              {o.label}
                            </option>
                          ))}
                        </select>
                        <em>프로필에 표기된 경우에만 지정해 주세요.</em>
                      </label>
                      <Field id={`i-s-${k}`} label="영문 부제" value={x.subtitle} onChange={(v) => ins(k)((i) => (i.subtitle = v))} />
                    </div>
                    <Lines id={`i-sp-${k}`} label="주요 전문 분야" value={x.specialties} onChange={(v) => ins(k)((i) => (i.specialties = v))} />
                    {x.blocks.map((b, bi) => (
                      <div className="sub-item" key={bi} style={{ background: 'var(--white)' }}>
                        <header>
                          <span>경력·자격 묶음 {bi + 1}</span>
                          <ItemTools
                            index={bi}
                            length={x.blocks.length}
                            onMove={(dir) => ins(k)((i) => move(i.blocks, bi, dir))}
                            onDelete={() => ins(k)((i) => void i.blocks.splice(bi, 1))}
                          />
                        </header>
                        <Field
                          id={`i-bt-${k}-${bi}`}
                          label="제목 (예: 교육 및 경력, 자격 및 전문 과정, 수업 방향)"
                          value={b.title}
                          onChange={(v) => ins(k)((i) => (i.blocks[bi].title = v))}
                        />
                        <Lines id={`i-bi-${k}-${bi}`} label="내용" value={b.items} onChange={(v) => ins(k)((i) => (i.blocks[bi].items = v))} />
                      </div>
                    ))}
                    <div>
                      <button type="button" className="adm-btn small" onClick={() => ins(k)((i) => void i.blocks.push({ title: '', items: [] }))}>
                        + 경력·자격 묶음 추가
                      </button>
                    </div>
                    <div className="row2">
                      <ImageField
                        id={`i-ph-${k}`}
                        label="카드 사진 (얼굴이 잘 보이는 세로 사진)"
                        hint="비워 두면 프로필 이미지의 윗부분이 보입니다."
                        value={x.photo}
                        onChange={(v) => ins(k)((i) => (i.photo = v))}
                      />
                      <ImageField
                        id={`i-pr-${k}`}
                        label="프로필 이미지 전체"
                        hint="'프로필 이미지 전체 보기'에서 확대해 볼 수 있습니다."
                        value={x.profileImage}
                        onChange={(v) => ins(k)((i) => (i.profileImage = v))}
                      />
                    </div>
                  </div>
                </details>
              </div>
            ))}
          </div>
          <div>
            <button
              type="button"
              className="adm-btn small"
              onClick={() =>
                update((d) =>
                  d.instructors.list.push({
                    id: uid('ins'),
                    visible: false,
                    name: '',
                    role: '필라테스 강사',
                    lessonType: '',
                    subtitle: 'PILATES INSTRUCTOR',
                    specialties: [],
                    blocks: [
                      { title: '교육 및 경력', items: [] },
                      { title: '자격 및 전문 과정', items: [] },
                    ],
                    photo: '',
                    profileImage: '',
                  }),
                )
              }
            >
              + 강사 추가
            </button>
            <p className="adm-intro" style={{ marginTop: 8 }}>
              새 강사는 &lsquo;숨김&rsquo; 상태로 추가됩니다. 내용을 채운 뒤 &lsquo;공개&rsquo;를 체크하고 저장하세요.
            </p>
          </div>
        </Panel>

        <Panel title="8. 마지막 상담 섹션" sub={badge(c.cta.visible)}>
          <Visible checked={c.cta.visible} onChange={(v) => update((d) => (d.cta.visible = v))} />
          <Field id="cta-t" label="제목" hint={TITLE_HINT} multiline value={c.cta.title} onChange={(v) => update((d) => (d.cta.title = v))} />
          <Field id="cta-b" label="설명" multiline value={c.cta.body} onChange={(v) => update((d) => (d.cta.body = v))} />
          <ImageField id="cta-img" label="배경 사진" value={c.cta.image} onChange={(v) => update((d) => (d.cta.image = v))} />
        </Panel>

        <Panel title="9. 지점 정보 · 푸터">
          <div className="row2">
            <Field id="loc-n" label="지점명" value={c.location.name} onChange={(v) => update((d) => (d.location.name = v))} />
            <Field id="loc-p" label="전화번호" value={c.location.phone} onChange={(v) => update((d) => (d.location.phone = v))} />
          </div>
          <Field id="loc-a" label="주소" value={c.location.address} onChange={(v) => update((d) => (d.location.address = v))} />
          <Field id="loc-d" label="주소 아래 안내 (예: 주차·출입 안내, 비우면 숨김)" value={c.location.detail} onChange={(v) => update((d) => (d.location.detail = v))} />
          <div className="field">
            <span>스튜디오 사진</span>
            <div className="sub-list">
              {c.location.gallery.map((g, k) => (
                <div className="sub-item" key={k}>
                  <header>
                    <span>{k + 1}번 사진</span>
                    <ItemTools
                      index={k}
                      length={c.location.gallery.length}
                      onMove={(dir) => update((d) => move(d.location.gallery, k, dir))}
                      onDelete={() => update((d) => void d.location.gallery.splice(k, 1))}
                    />
                  </header>
                  <ImageField id={`g-${k}`} label="사진" value={g.src} onChange={(v) => update((d) => (d.location.gallery[k].src = v))} />
                  <Field id={`g-a-${k}`} label="사진 이름" value={g.alt} onChange={(v) => update((d) => (d.location.gallery[k].alt = v))} />
                </div>
              ))}
            </div>
            <div>
              <button type="button" className="adm-btn small" onClick={() => update((d) => void d.location.gallery.push({ src: '', alt: '' }))}>
                + 사진 추가
              </button>
            </div>
          </div>
          <Field id="ft" label="푸터 안내 문구" multiline value={c.footerNote} onChange={(v) => update((d) => (d.footerNote = v))} />
        </Panel>

        <Panel title="검색·공유 설정 (SEO)">
          <Field id="seo-t" label="검색 결과 제목" value={c.seo.title} onChange={(v) => update((d) => (d.seo.title = v))} />
          <Field id="seo-d" label="검색 결과 설명" multiline value={c.seo.description} onChange={(v) => update((d) => (d.seo.description = v))} />
          <ImageField
            id="seo-og"
            label="카카오톡·SNS 공유 이미지"
            hint="1200×630 크기의 가로 이미지를 추천합니다."
            value={c.seo.ogImage}
            onChange={(v) => update((d) => (d.seo.ogImage = v))}
          />
        </Panel>
      </div>

      <div className="save-bar">
        <div className="inner">
          <p className={status.kind === 'ok' ? 'ok' : status.kind === 'err' ? 'err' : ''} role="status">
            {status.text}
          </p>
          <button className="adm-btn dark" type="button" onClick={save} disabled={pending || !storageOk}>
            {pending ? '저장 중…' : '저장하기'}
          </button>
        </div>
      </div>
    </div>
  );
}
