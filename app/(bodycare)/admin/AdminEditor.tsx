'use client';

import { useState, useTransition, type ChangeEvent, type ReactNode } from 'react';
import type { Item, Photo, Section, SiteContent, Stat } from '@/lib/content';
import { logout, saveSite, uploadImage } from './actions';

type Status = { kind: 'idle' | 'ok' | 'err' | 'dirty'; text: string };

export function Field({
  label,
  hint,
  value,
  onChange,
  multiline,
  type = 'text',
  id,
}: {
  label: string;
  hint?: string;
  value: string;
  onChange: (v: string) => void;
  multiline?: boolean;
  type?: 'text' | 'url';
  id: string;
}) {
  return (
    <label className="field" htmlFor={id}>
      <span>{label}</span>
      {multiline ? (
        <textarea id={id} value={value} onChange={(e) => onChange(e.target.value)} rows={3} />
      ) : (
        <input id={id} type={type} value={value} onChange={(e) => onChange(e.target.value)} />
      )}
      {hint ? <em>{hint}</em> : null}
    </label>
  );
}

export function ImageField({
  label,
  value,
  onChange,
  id,
  hint,
}: {
  label: string;
  value: string;
  onChange: (url: string) => void;
  id: string;
  hint?: string;
}) {
  const [msg, setMsg] = useState('');
  const [busy, setBusy] = useState(false);
  async function onFile(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    setMsg('업로드 중…');
    const fd = new FormData();
    fd.append('file', file);
    const res = await uploadImage(fd);
    setBusy(false);
    setMsg(res.message);
    if (res.ok && res.url) onChange(res.url);
    e.target.value = '';
  }
  return (
    <div className="field img-field">
      <span>{label}</span>
      {value ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={value} alt="" />
      ) : (
        <em>이미지가 없습니다.</em>
      )}
      <div className="sec-tools">
        <label className="adm-btn small" htmlFor={id}>
          {busy ? '업로드 중…' : '이미지 교체'}
        </label>
        <input id={id} type="file" accept="image/jpeg,image/png,image/webp,image/svg+xml" onChange={onFile} hidden />
        {value ? (
          <button type="button" className="adm-btn small danger" onClick={() => onChange('')}>
            이미지 빼기
          </button>
        ) : null}
      </div>
      {hint ? <em>{hint}</em> : null}
      {msg ? <em>{msg}</em> : null}
    </div>
  );
}

export function Panel({ title, sub, children, open }: { title: string; sub?: ReactNode; children: ReactNode; open?: boolean }) {
  return (
    <details className="panel" open={open}>
      <summary>
        {title}
        {sub ? <small>{sub}</small> : null}
      </summary>
      <div className="panel-body">{children}</div>
    </details>
  );
}

export const TITLE_HINT = '엔터로 줄바꿈, *단어*처럼 별표로 감싸면 금색으로 강조됩니다.';

export default function AdminEditor({ initial, storageOk, tabs }: { initial: SiteContent; storageOk: boolean; tabs?: ReactNode }) {
  const [c, setC] = useState<SiteContent>(initial);
  const [status, setStatus] = useState<Status>({ kind: 'idle', text: '수정한 뒤 저장 버튼을 눌러 주세요.' });
  const [pending, start] = useTransition();

  function update(fn: (draft: SiteContent) => void) {
    setC((prev) => {
      const next: SiteContent = structuredClone(prev);
      fn(next);
      return next;
    });
    setStatus({ kind: 'dirty', text: '저장하지 않은 변경 사항이 있습니다.' });
  }

  function save() {
    start(async () => {
      const res = await saveSite(c);
      setStatus({ kind: res.ok ? 'ok' : 'err', text: res.message });
    });
  }

  function moveSection(i: number, dir: -1 | 1) {
    update((d) => {
      const j = i + dir;
      if (j < 0 || j >= d.sections.length) return;
      [d.sections[i], d.sections[j]] = [d.sections[j], d.sections[i]];
    });
  }

  const sec = (i: number) => (fn: (s: Section) => void) => update((d) => fn(d.sections[i]));

  return (
    <div className="adm">
      <div className="adm-top">
        <div className="wrap">
          <b>PILIVE ADMIN</b>
          {tabs}
          <div className="links">
            <a className="adm-btn ghost small" href="/bodycare" target="_blank" rel="noopener">
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
            저장소(Vercel Blob)가 아직 연결되지 않아 수정 내용을 저장할 수 없습니다. Vercel 프로젝트의 Storage 메뉴에서
            Blob 저장소를 연결해 주세요.
          </div>
        ) : null}
        <p className="adm-intro">
          지금 수정 중인 페이지: <b>PILIVE BODY CARE SYSTEM (/bodycare)</b>. 항목을 눌러 펼친 뒤 수정하고, 화면 아래의 <b>저장하기</b>를 누르면 사이트에 바로 반영됩니다.
        </p>

        <Panel title="예약 링크 · 오시는 길" open>
          <Field
            id="loc-url"
            type="url"
            label="네이버 예약 링크"
            hint="https:// 로 시작하는 주소를 붙여넣으세요. 바디케어 페이지(/bodycare)의 예약 버튼이 이 링크로 연결됩니다. 브랜드 홈페이지의 예약 링크는 '브랜드 홈페이지' 탭에서 따로 설정합니다."
            value={c.location.url}
            onChange={(v) => update((d) => (d.location.url = v))}
          />
          <div className="row2">
            <Field id="loc-name" label="지점명" value={c.location.name} onChange={(v) => update((d) => (d.location.name = v))} />
            <Field id="loc-en" label="영문 표기" value={c.location.en} onChange={(v) => update((d) => (d.location.en = v))} />
          </div>
          <Field
            id="loc-addr"
            label="주소"
            hint="비워두면 주소 줄이 보이지 않습니다."
            value={c.location.address}
            onChange={(v) => update((d) => (d.location.address = v))}
          />
        </Panel>

        <Panel title="첫 화면 (메인 문구)">
          <Field id="hero-eyebrow" label="작은 영문 문구" value={c.hero.eyebrow} onChange={(v) => update((d) => (d.hero.eyebrow = v))} />
          <Field
            id="hero-title"
            label="메인 헤드라인"
            hint={TITLE_HINT}
            multiline
            value={c.hero.title}
            onChange={(v) => update((d) => (d.hero.title = v))}
          />
          <Field id="hero-sub" label="설명 문구" multiline value={c.hero.subtitle} onChange={(v) => update((d) => (d.hero.subtitle = v))} />
          <ImageField id="hero-img" label="메인 이미지" value={c.hero.image} onChange={(v) => update((d) => (d.hero.image = v))} hint="세로로 긴 사진(4:5 비율)이 가장 잘 어울립니다." />
          <Field id="hero-alt" label="이미지 설명 (시각장애인용·검색용)" value={c.hero.imageAlt} onChange={(v) => update((d) => (d.hero.imageAlt = v))} />
          <div className="row2">
            <Field id="hero-bs" label="사진 위 작은 라벨" value={c.hero.badgeSmall} onChange={(v) => update((d) => (d.hero.badgeSmall = v))} />
            <Field id="hero-bb" label="사진 위 큰 라벨" hint="비우면 라벨이 사라집니다." value={c.hero.badgeBig} onChange={(v) => update((d) => (d.hero.badgeBig = v))} />
          </div>
          <Field id="hero-sec" label="두 번째 버튼 문구" value={c.hero.secondaryLabel} onChange={(v) => update((d) => (d.hero.secondaryLabel = v))} />
        </Panel>

        <Panel title="상담 버튼 문구">
          <div className="row2">
            <Field id="bk-btn" label="예약 버튼 (첫 화면·모바일 하단)" value={c.booking.buttonLabel} onChange={(v) => update((d) => (d.booking.buttonLabel = v))} />
            <Field id="bk-head" label="상단 메뉴 버튼" value={c.booking.headerLabel} onChange={(v) => update((d) => (d.booking.headerLabel = v))} />
          </div>
          <Field id="bk-lb" label="오시는 길 섹션의 예약 버튼" value={c.booking.linkButton} onChange={(v) => update((d) => (d.booking.linkButton = v))} />
        </Panel>

        {c.sections.map((s, i) => {
          const set = sec(i);
          return (
            <Panel
              key={s.id}
              title={`${i + 1}. ${s.name}`}
              sub={<span className={s.visible ? 'badge' : 'badge off'}>{s.visible ? '보이는 중' : '숨김'}</span>}
            >
              <div className="sec-tools">
                <label className="toggle">
                  <input type="checkbox" checked={s.visible} onChange={(e) => set((x) => (x.visible = e.target.checked))} />
                  사이트에 보이기
                </label>
                <button type="button" className="adm-btn small" onClick={() => moveSection(i, -1)} disabled={i === 0}>
                  ↑ 위로
                </button>
                <button type="button" className="adm-btn small" onClick={() => moveSection(i, 1)} disabled={i === c.sections.length - 1}>
                  ↓ 아래로
                </button>
              </div>
              <Field id={`${s.id}-eb`} label="작은 영문 문구" value={s.eyebrow} onChange={(v) => set((x) => (x.eyebrow = v))} />
              <Field id={`${s.id}-t`} label="제목" hint={TITLE_HINT} multiline value={s.title} onChange={(v) => set((x) => (x.title = v))} />
              {s.type !== 'journey' ? (
                <Field id={`${s.id}-b`} label="본문" multiline value={s.body} onChange={(v) => set((x) => (x.body = v))} />
              ) : null}
              {s.body2 !== undefined ? (
                <Field
                  id={`${s.id}-b2`}
                  label={
                    s.type === 'cta'
                      ? '버튼 문구'
                      : s.type === 'journey'
                        ? '사진 아래 설명'
                        : s.type === 'value'
                          ? '마무리 문장'
                          : s.type === 'report'
                            ? '근육 카드 설명'
                            : '추가 문구'
                  }
                  multiline={s.type !== 'cta'}
                  value={s.body2}
                  onChange={(v) => set((x) => (x.body2 = v))}
                />
              ) : null}
              {s.note !== undefined ? (
                <Field id={`${s.id}-n`} label="작은 안내 문구" multiline value={s.note} onChange={(v) => set((x) => (x.note = v))} />
              ) : null}
              {s.image !== undefined ? (
                <>
                  <ImageField id={`${s.id}-img`} label="섹션 이미지" value={s.image} onChange={(v) => set((x) => (x.image = v))} />
                  <Field id={`${s.id}-alt`} label="이미지 설명" value={s.imageAlt ?? ''} onChange={(v) => set((x) => (x.imageAlt = v))} />
                </>
              ) : null}
              {s.stats ? (
                <div className="field">
                  <span>숫자 항목</span>
                  <div className="sub-list">
                    {s.stats.map((st: Stat, k) => (
                      <div className="sub-item" key={k}>
                        <div className="row2">
                          <Field id={`${s.id}-sv-${k}`} label="숫자" value={st.value} onChange={(v) => set((x) => (x.stats![k].value = v))} />
                          <Field id={`${s.id}-su-${k}`} label="단위 (작게 표시)" value={st.unit ?? ''} onChange={(v) => set((x) => (x.stats![k].unit = v))} />
                        </div>
                        <Field id={`${s.id}-sl-${k}`} label="설명" value={st.label} onChange={(v) => set((x) => (x.stats![k].label = v))} />
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
              {s.gallery ? <GalleryEditor sectionId={s.id} photos={s.gallery} onChange={(fn) => set((x) => fn(x.gallery!))} /> : null}
              {s.items && s.type !== 'report' ? (
                <ItemsEditor sectionId={s.id} type={s.type} items={s.items} onChange={(fn) => set((x) => fn(x.items!))} />
              ) : null}
              {s.items && s.type === 'report' ? (
                <div className="field">
                  <span>카드 제목</span>
                  <div className="sub-list">
                    {s.items.map((it, k) => (
                      <div className="sub-item" key={k}>
                        <div className="row2">
                          <Field id={`${s.id}-rl-${k}`} label="영문 라벨" value={it.label ?? ''} onChange={(v) => set((x) => (x.items![k].label = v))} />
                          <Field id={`${s.id}-rt-${k}`} label="카드 제목" value={it.title} onChange={(v) => set((x) => (x.items![k].title = v))} />
                        </div>
                      </div>
                    ))}
                  </div>
                  <em>카드 안의 예시 수치와 그래프는 디자인 요소로 고정되어 있습니다.</em>
                </div>
              ) : null}
            </Panel>
          );
        })}

        <Panel title="로고 · 검색 노출 (SEO) · 하단 문구">
          <ImageField
            id="logo"
            label="브랜드 로고"
            value={c.brand.logoUrl}
            onChange={(v) => update((d) => (d.brand.logoUrl = v))}
            hint="비워두면 PILIVE PILATES 글자 로고가 보입니다. 배경이 투명한 PNG 또는 SVG를 권장합니다."
          />
          <Field id="seo-t" label="검색 결과 제목" value={c.seo.title} onChange={(v) => update((d) => (d.seo.title = v))} hint="네이버·구글 검색 결과와 카카오톡 공유 미리보기에 보이는 제목입니다." />
          <Field id="seo-d" label="검색 결과 설명" multiline value={c.seo.description} onChange={(v) => update((d) => (d.seo.description = v))} />
          <Field id="foot" label="하단 안내 문구" multiline value={c.footerNote} onChange={(v) => update((d) => (d.footerNote = v))} />
        </Panel>
      </div>

      <div className="save-bar">
        <div className="inner">
          <p className={status.kind === 'ok' ? 'ok' : status.kind === 'err' ? 'err' : ''} role="status">
            {status.text}
          </p>
          <button type="button" className="adm-btn dark" onClick={save} disabled={pending || !storageOk}>
            {pending ? '저장 중…' : '저장하기'}
          </button>
        </div>
      </div>
    </div>
  );
}

function ItemsEditor({
  sectionId,
  type,
  items,
  onChange,
}: {
  sectionId: string;
  type: Section['type'];
  items: Item[];
  onChange: (fn: (items: Item[]) => void) => void;
}) {
  const hasLabel = type === 'system' || type === 'trust';
  const hasBody = type !== 'question' && type !== 'cta';
  const label =
    type === 'question' ? '질문 목록' : type === 'cta' ? '대상 태그' : type === 'journey' ? '관리 단계' : type === 'checkup' ? '분석 단계' : '항목';
  return (
    <div className="field">
      <span>{label}</span>
      <div className="sub-list">
        {items.map((it, k) => (
          <div className="sub-item" key={k}>
            <header>
              <span>{k + 1}번</span>
              <div className="sec-tools">
                <button
                  type="button"
                  className="adm-btn small"
                  disabled={k === 0}
                  onClick={() => onChange((a) => void ([a[k - 1], a[k]] = [a[k], a[k - 1]]))}
                >
                  ↑
                </button>
                <button
                  type="button"
                  className="adm-btn small"
                  disabled={k === items.length - 1}
                  onClick={() => onChange((a) => void ([a[k + 1], a[k]] = [a[k], a[k + 1]]))}
                >
                  ↓
                </button>
                <button type="button" className="adm-btn small danger" onClick={() => onChange((a) => void a.splice(k, 1))}>
                  삭제
                </button>
              </div>
            </header>
            {hasLabel ? (
              <Field
                id={`${sectionId}-il-${k}`}
                label={type === 'trust' ? '번호 표기' : '한글 라벨'}
                value={it.label ?? ''}
                onChange={(v) => onChange((a) => (a[k].label = v))}
              />
            ) : null}
            <Field id={`${sectionId}-it-${k}`} label="제목" value={it.title} onChange={(v) => onChange((a) => (a[k].title = v))} />
            {hasBody ? (
              <Field id={`${sectionId}-ib-${k}`} label="설명" multiline value={it.body ?? ''} onChange={(v) => onChange((a) => (a[k].body = v))} />
            ) : null}
          </div>
        ))}
      </div>
      <div>
        <button
          type="button"
          className="adm-btn small"
          onClick={() => onChange((a) => void a.push(hasBody ? { title: '', body: '', ...(hasLabel ? { label: '' } : {}) } : { title: '' }))}
        >
          + 항목 추가
        </button>
      </div>
    </div>
  );
}

function GalleryEditor({
  sectionId,
  photos,
  onChange,
}: {
  sectionId: string;
  photos: Photo[];
  onChange: (fn: (photos: Photo[]) => void) => void;
}) {
  return (
    <div className="field">
      <span>측정 과정 사진</span>
      <div className="sub-list">
        {photos.map((ph, k) => (
          <div className="sub-item" key={k}>
            <header>
              <span>{k + 1}번 사진</span>
              <div className="sec-tools">
                <button
                  type="button"
                  className="adm-btn small"
                  disabled={k === 0}
                  onClick={() => onChange((a) => void ([a[k - 1], a[k]] = [a[k], a[k - 1]]))}
                >
                  ↑
                </button>
                <button
                  type="button"
                  className="adm-btn small"
                  disabled={k === photos.length - 1}
                  onClick={() => onChange((a) => void ([a[k + 1], a[k]] = [a[k], a[k + 1]]))}
                >
                  ↓
                </button>
                <button type="button" className="adm-btn small danger" onClick={() => onChange((a) => void a.splice(k, 1))}>
                  삭제
                </button>
              </div>
            </header>
            <ImageField id={`${sectionId}-g-${k}`} label="사진" value={ph.src} onChange={(v) => onChange((a) => (a[k].src = v))} />
            <Field id={`${sectionId}-gc-${k}`} label="사진 설명" value={ph.caption} onChange={(v) => onChange((a) => (a[k].caption = v))} />
          </div>
        ))}
      </div>
      <div>
        <button type="button" className="adm-btn small" onClick={() => onChange((a) => void a.push({ src: '', caption: '' }))}>
          + 사진 추가
        </button>
      </div>
    </div>
  );
}
