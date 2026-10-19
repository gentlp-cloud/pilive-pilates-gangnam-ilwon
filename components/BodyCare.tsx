import type { ReactNode } from 'react';
import Zoom from './Zoom';

// PILIVE BODY CARE SYSTEM 스토리 (INTRO → 01 ASSESSMENT → 02 ANALYSIS → 03 PERSONALIZED CARE → 04 PROGRESS → FINAL)
// - 분석 화면(3D VIEW·바디 인사이트·리포트·비교)은 아웃바디 공식 화면입니다. 숫자와 그래프를 바꾸거나 새로 만들지 않습니다.
// - 사진 3장(스튜디오·측정 장면)은 필라이브 강남일원점 실제 사진입니다.
// - 상담·지도 장면의 AI 연출 이미지는 '연출 이미지'로 표시합니다.

const OB = '/images/bodycare';
const PROCESS = [
  ['/images/process/step1.webp', 'QR 코드로 로그인'],
  ['/images/process/step2.webp', '360° 웰니스 바디 검사 시작'],
  ['/images/process/step3.webp', '측정 준비사항 확인'],
  ['/images/process/step4.webp', '3가지 운동검사 안내'],
  ['/images/process/step5.webp', '매트 위에 올라서기'],
  ['/images/process/step6.webp', '화면을 따라 동작하기'],
  ['/images/process/step7.webp', '유연성 동작 측정'],
  ['/images/process/step8.webp', '자세 측정 동작'],
] as const;

function Chapter({ no, en, title, children }: { no: string; en: string; title: ReactNode; children?: ReactNode }) {
  return (
    <header className="bc-head reveal">
      <p className="bc-kicker">
        <span className="num">{no}</span>
        <span>{en}</span>
      </p>
      <h2>{title}</h2>
      {children}
    </header>
  );
}

export default function BodyCare({ book, firstId = 'intro' }: { book: (label: string, variant?: 'dark' | 'line') => ReactNode; firstId?: string }) {
  return (
    <>
      {/* INTRO */}
      <section className="bc-intro" id={firstId}>
        <div className="wrap">
          <Chapter no="—" en="PILIVE BODY CARE SYSTEM" title={<>측정하고, 운동하고,<br />다시 <em>확인</em>합니다.</>}>
            <p className="lead">
              필라이브는 3D 체형분석으로 현재의 몸을 이해하고, 분석 결과를 바탕으로 운동 방향을 설정합니다. 정기적인 재측정을 통해 운동 과정의 변화를 함께 확인합니다.
            </p>
          </Chapter>
          <figure className="bc-device reveal">
            <Zoom
              src={`${OB}/ob-device-hero.webp`}
              alt="3D 체형분석 장비와 측정 화면"
              width={1600}
              height={1315}
              lazy={false}
            />
            <figcaption>3D 체형분석 시스템 · 피트릭스 아웃바디 공식 이미지</figcaption>
          </figure>
        </div>
      </section>

      {/* 01 ASSESSMENT */}
      <section className="bc-assess" id="assessment">
        <div className="wrap">
          <Chapter no="01" en="ASSESSMENT" title={<>내 몸을 제대로 이해하는<br />첫 번째 단계.</>}>
            <p className="lead">
              피트릭스 3D 체형분석 장비 앞에서 화면의 안내를 따라 간단한 동작을 하면 측정이 진행됩니다. 복잡한 준비 없이 셀프로 측정하고, 평소 알아차리기 어려웠던 몸의 특징을 시각적으로 확인합니다.
            </p>
          </Chapter>

          <div className="bc-assess-grid">
            <div className="bc-assess-photo reveal">
              <Zoom src={`${OB}/ob-assess-posture.webp`} alt="자세 측정 결과 화면이 나오는 체형분석 장비" width={1100} height={1302} />
              <p className="bc-note">아웃바디 공식 예시 이미지</p>
            </div>
            <div className="bc-assess-side reveal">
              <ul className="bc-six" aria-label="측정 영역">
                {['자세', '유연성', '근력', '민첩성', '밸런스', '체성분'].map((t, i) => (
                  <li key={t}>
                    <span className="num">{String(i + 1).padStart(2, '0')}</span>
                    {t}
                  </li>
                ))}
              </ul>
              <div className="bc-stats">
                <div>
                  <strong className="num">70</strong>
                  <span>측정 항목</span>
                </div>
                <div>
                  <strong className="num">2<sup>min</sup></strong>
                  <span>예상 소요 시간</span>
                </div>
              </div>
              <p className="bc-small">측정은 상담 후 진행하며, 결과는 운동 방향을 정하기 위한 참고 자료입니다.</p>
            </div>
          </div>

          <div className="bc-process reveal">
            <p className="bc-label">강남일원점 실제 측정 과정</p>
            <div className="process-track" role="list">
              {PROCESS.map(([src, cap], i) => (
                <figure key={src} role="listitem">
                  <div className="process-photo">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={src} alt={cap} width={600} height={800} loading="lazy" decoding="async" />
                  </div>
                  <figcaption>
                    <span className="num">{String(i + 1).padStart(2, '0')}</span>
                    {cap}
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 02 ANALYSIS */}
      <section className="bc-analysis" id="analysis">
        <div className="wrap">
          <Chapter no="02" en="ANALYSIS" title={<>눈으로 확인하는<br />나의 신체 밸런스.</>}>
            <p className="lead">
              목의 위치, 어깨의 정렬, 골반의 기울기를 3D 이미지와 수치로 살펴봅니다. 분석 화면을 눌러 크게 확인해 보세요. 이 결과가 수업에서 먼저 살필 부위와 운동 방향을 정하는 기준이 됩니다.
            </p>
          </Chapter>

          <div className="bc-cards">
            <article className="bc-card reveal">
              <Zoom src={`${OB}/ob-3dview-TEMP.webp`} alt="골격과 근육 상태를 3D로 보여주는 3D VIEW 화면" width={431} height={762} />
              <div className="bc-card-body">
                <span className="bc-tag">3D VIEW</span>
                <h3>자세와 근육을 3D로 확인합니다</h3>
                <p>골격과 근육 상태를 3D 화면으로 살펴보며 틀어진 곳과 긴장된 곳을 이해합니다.</p>
              </div>
            </article>

            <article className="bc-card reveal">
              <Zoom src={`${OB}/ob-3dview-report.webp`} alt="자세 항목별 각도와 사진이 함께 나오는 리포트 화면" width={900} height={1600} />
              <div className="bc-card-body">
                <span className="bc-tag">POSTURE</span>
                <h3>항목별 수치로 확인합니다</h3>
                <p>머리·어깨·골반의 기울기를 정상·주의·위험 범위와 함께 보여줍니다.</p>
              </div>
            </article>

            <article className="bc-card reveal">
              <Zoom src={`${OB}/ob-body-insight-TEMP.webp`} alt="부위별 부상 위험도를 보여주는 바디 인사이트 화면" width={425} height={759} />
              <div className="bc-card-body">
                <span className="bc-tag">BODY INSIGHT</span>
                <h3>주의할 부위를 살핍니다</h3>
                <p>체형과 근육·관절 기능을 종합해 부위별 부상 위험 경향을 확인합니다.</p>
              </div>
            </article>

            <article className="bc-card bc-card-wide reveal">
              <Zoom src={`${OB}/ob-summary-360.webp`} alt="관심사항에 맞춰 보여주는 360° AI 요약 리포트" width={1241} height={1177} />
              <div className="bc-card-body">
                <span className="bc-tag">360° AI SUMMARY</span>
                <h3>나의 관심사에 맞춰 요약합니다</h3>
                <p>여러 측정 결과를 한 장으로 정리해, 복잡한 수치도 내 몸 이야기로 쉽게 이해할 수 있습니다.</p>
              </div>
            </article>
          </div>
          <figure className="bc-scene reveal">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`${OB}/scene-result-consult.webp`} alt="강사가 측정 결과지를 짚으며 회원에게 설명하는 결과 상담 장면 (AI 연출 이미지)" width={1536} height={1024} loading="lazy" decoding="async" />
            <figcaption>
              <strong>결과 상담</strong>
              측정이 끝나면 결과지를 함께 보며 현재 상태와 운동 방향을 설명드립니다. · AI로 연출한 이미지이며, 실제 강사·회원이 아닙니다.
            </figcaption>
          </figure>
          <p className="bc-note bc-note-light">화면은 제조사 피트릭스(아웃바디)의 공식 예시 화면이며, 실제 회원의 측정 결과가 아닙니다.</p>
        </div>
      </section>

      {/* 03 PERSONALIZED CARE */}
      <section className="bc-care" id="care">
        <div className="wrap">
          <Chapter no="03" en="PERSONALIZED CARE" title={<>분석 결과를<br />실제 운동으로 연결합니다.</>}>
            <p className="lead">
              회원마다 신체 상태와 운동 목적이 다릅니다. 필라이브는 분석 결과를 바탕으로 강사와 함께 지도 방향을 정하고, 수업 안에서 그 방향을 적극 반영합니다.
            </p>
          </Chapter>

          <div className="bc-care-grid">
            <figure className="bc-care-photo reveal">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/instructor.webp" alt="리포머 위 회원의 자세를 세심하게 지도하는 필라테스 강사 (AI 연출 이미지)" width={819} height={1024} loading="lazy" decoding="async" />
              <figcaption>AI로 연출한 이미지이며, 실제 강사·회원이 아닙니다.</figcaption>
            </figure>
            <div className="bc-care-side">
              <ol className="bc-points reveal">
                <li>
                  <span className="num">01</span>
                  <div>
                    <strong>신체 상태를 먼저 이해합니다</strong>
                    <p>체형·근육·관절 기능의 특징을 함께 확인하고, 우선 살필 부위를 정합니다.</p>
                  </div>
                </li>
                <li>
                  <span className="num">02</span>
                  <div>
                    <strong>운동 목적에 맞춰 방향을 정합니다</strong>
                    <p>바른 자세, 통증 관리, 체력 향상 등 회원이 원하는 목적을 먼저 듣습니다.</p>
                  </div>
                </li>
                <li>
                  <span className="num">03</span>
                  <div>
                    <strong>수업 안에서 세심하게 지도합니다</strong>
                    <p>분석 결과를 기준으로 자세와 움직임을 살피며 회원별 맞춤 관리를 이어갑니다.</p>
                  </div>
                </li>
              </ol>
              <figure className="bc-app reveal">
                <Zoom src={`${OB}/ob-app-share.webp`} alt="분석 결과에 맞춘 추천 운동을 태블릿과 앱으로 확인하는 화면" width={1600} height={1229} />
                <figcaption>결과에 맞춘 추천 운동을 확인하고 앱으로 이어서 볼 수 있습니다 · 아웃바디 공식 이미지</figcaption>
              </figure>
            </div>
          </div>
        </div>
      </section>

      {/* 04 PROGRESS */}
      <section className="bc-progress" id="progress">
        <div className="wrap">
          <Chapter no="04" en="PROGRESS" title={<>한 번의 측정이 아닌,<br />지속적인 변화관리.</>}>
            <p className="lead">
              월 1회 정기적으로 다시 측정하고, 이전 결과와 나란히 비교합니다. 운동 과정에서 나타나는 변화를 확인해 다음 달 지도 방향에 반영합니다.
            </p>
          </Chapter>

          <div className="bc-progress-grid">
            <figure className="bc-compare reveal">
              <Zoom src={`${OB}/ob-before-after.webp`} alt="이전 결과와 현재 결과를 비교하는 비포 애프터 화면" width={1600} height={1254} />
              <figcaption>이전·현재 결과를 한눈에 비교하는 화면 · 아웃바디 공식 이미지(예시)</figcaption>
            </figure>
            <ol className="bc-loop reveal">
              <li>
                <span className="num">1</span>
                <div>
                  <strong>측정</strong>
                  <p>현재의 몸을 기록합니다.</p>
                </div>
              </li>
              <li>
                <span className="num">2</span>
                <div>
                  <strong>운동</strong>
                  <p>결과를 반영한 수업을 이어갑니다.</p>
                </div>
              </li>
              <li>
                <span className="num">3</span>
                <div>
                  <strong>재측정 · 비교</strong>
                  <p>월 1회 다시 측정해 이전 결과와 비교합니다.</p>
                </div>
              </li>
              <li>
                <span className="num">4</span>
                <div>
                  <strong>방향 조정</strong>
                  <p>변화를 보고 다음 목표와 지도 방향을 다시 정합니다.</p>
                </div>
              </li>
            </ol>
          </div>
          <figure className="bc-scene reveal">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`${OB}/scene-progress-consult.webp`} alt="강사와 회원이 태블릿으로 이전 측정 결과와 변화를 함께 확인하는 변화관리 상담 장면 (AI 연출 이미지)" width={1536} height={1024} loading="lazy" decoding="async" />
            <figcaption>
              <strong>변화관리 상담</strong>
              재측정 후에는 이전 결과와 비교하며 변화를 확인하고 다음 목표를 함께 정합니다. · AI로 연출한 이미지이며, 실제 강사·회원이 아닙니다.
            </figcaption>
          </figure>
          <p className="bc-note bc-note-light">변화의 정도와 속도는 사람마다 다르며, 결과는 효과를 보장하지 않습니다.</p>
        </div>
      </section>

      {/* FINAL */}
      <section className="bc-final bgsec" id="consult">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="bg-img" src="/images/cta-bg.webp" alt="" loading="lazy" decoding="async" />
        <div className="shade" aria-hidden="true" />
        <div className="wrap">
          <p className="bc-kicker reveal">
            <span className="num">—</span>
            <span>START WITH YOUR BODY</span>
          </p>
          <h2 className="reveal">
            나에게 맞는 운동,<br />내 몸을 이해하는 것부터 <em>시작</em>하세요.
          </h2>
          <p className="bc-final-lead reveal">등록 여부와 관계없이 무료로 체형분석과 운동 상담을 받으실 수 있습니다.</p>
          <div className="reveal">{book('체형분석 및 상담 예약하기', 'dark')}</div>
        </div>
      </section>
    </>
  );
}
