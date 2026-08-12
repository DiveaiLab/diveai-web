"use client";

import Link from "next/link";
import type { CSSProperties } from "react";
import { useMemo, useState } from "react";

import type { CourseSummary } from "../_data/types";
import styles from "./learning-archipelago.module.css";

type LearningArchipelagoProps = {
  courses: CourseSummary[];
};

type JourneyState = "completed" | "current" | "available" | "locked";

type JourneyDefinition = {
  landmassName: string;
  coordinate: string;
  skill: string;
  position: { x: number; y: number };
};

type NodePosition = CSSProperties & {
  "--node-x": string;
  "--node-y": string;
};

const JOURNEY_DEFINITIONS: JourneyDefinition[] = [
  {
    landmassName: "啟航基礎島",
    coordinate: "24°N · 121°E",
    skill: "建立 AI 協作判斷力",
    position: { x: 13, y: 65 },
  },
  {
    landmassName: "協作實作洲",
    coordinate: "31°N · 128°E",
    skill: "把一次對話變成成果",
    position: { x: 38, y: 29 },
  },
  {
    landmassName: "工作流進階群島",
    coordinate: "19°N · 137°E",
    skill: "建立可重複的方法",
    position: { x: 66, y: 59 },
  },
  {
    landmassName: "創作與責任大陸",
    coordinate: "34°N · 145°E",
    skill: "帶著判斷力公開作品",
    position: { x: 85, y: 22 },
  },
];

const STATE_LABEL: Record<JourneyState, string> = {
  completed: "已通關",
  current: "航行中",
  available: "已解鎖",
  locked: "尚未解鎖",
};

const STATE_ICON: Record<JourneyState, string> = {
  completed: "✓",
  current: "◆",
  available: "↗",
  locked: "鎖",
};

function getInitialCompleted(stageCount: number) {
  return stageCount > 1 ? [0] : [];
}

function getInitialActive(stageCount: number) {
  return stageCount > 1 ? 1 : stageCount === 1 ? 0 : null;
}

export function LearningArchipelago({ courses }: LearningArchipelagoProps) {
  const stages = useMemo(
    () =>
      courses.slice(0, JOURNEY_DEFINITIONS.length).map((course, index) => ({
        ...JOURNEY_DEFINITIONS[index],
        course,
        index,
      })),
    [courses],
  );

  const [completedIndices, setCompletedIndices] = useState<number[]>(() =>
    getInitialCompleted(stages.length),
  );
  const [activeIndex, setActiveIndex] = useState<number | null>(() =>
    getInitialActive(stages.length),
  );
  const [selectedIndex, setSelectedIndex] = useState(() =>
    getInitialActive(stages.length) ?? 0,
  );
  const [announcement, setAnnouncement] = useState(
    "示範航線已載入，目前正在協作實作洲。",
  );

  if (stages.length === 0) {
    return null;
  }

  const firstIncompleteIndex = stages.findIndex(
    (stage) => !completedIndices.includes(stage.index),
  );

  function getJourneyState(index: number): JourneyState {
    if (completedIndices.includes(index)) {
      return "completed";
    }

    if (activeIndex === index) {
      return "current";
    }

    if (activeIndex === null && index === firstIncompleteIndex) {
      return "available";
    }

    return "locked";
  }

  const selectedStage = stages[selectedIndex] ?? stages[0];
  const selectedState = getJourneyState(selectedStage.index);
  const completedCount = completedIndices.length;
  const progressPercent = Math.round((completedCount / stages.length) * 100);
  const previousStage = stages[selectedStage.index - 1];
  const allCompleted = completedCount === stages.length;

  function selectStage(index: number) {
    const stage = stages[index];
    const state = getJourneyState(index);

    setSelectedIndex(index);
    setAnnouncement(
      `已選擇第 ${index + 1} 站，${stage.landmassName}，${STATE_LABEL[state]}。`,
    );
  }

  function startStage(index: number) {
    const stage = stages[index];

    setActiveIndex(index);
    setSelectedIndex(index);
    setAnnouncement(`已從 ${stage.landmassName} 啟航。`);
  }

  function completeActiveStage() {
    if (activeIndex === null) {
      return;
    }

    const completedStage = stages[activeIndex];
    const nextCompleted = Array.from(
      new Set([...completedIndices, activeIndex]),
    ).sort((a, b) => a - b);
    const nextIndex = stages.findIndex(
      (stage) => !nextCompleted.includes(stage.index),
    );

    setCompletedIndices(nextCompleted);
    setActiveIndex(null);

    if (nextIndex >= 0) {
      setSelectedIndex(nextIndex);
      setAnnouncement(
        `已完成${completedStage.landmassName}，${stages[nextIndex].landmassName}已解鎖。`,
      );
    } else {
      setSelectedIndex(activeIndex);
      setAnnouncement("恭喜完成整條示範航線，四座學習大陸都已通關！");
    }
  }

  function resetJourney() {
    const initialCompleted = getInitialCompleted(stages.length);
    const initialActive = getInitialActive(stages.length);

    setCompletedIndices(initialCompleted);
    setActiveIndex(initialActive);
    setSelectedIndex(initialActive ?? 0);
    setAnnouncement("示範航線已重新開始。");
  }

  return (
    <section
      id="learning-archipelago"
      className={styles.section}
      aria-labelledby="archipelago-title"
    >
      <div className={styles.sectionInner}>
        <header className={styles.heading}>
          <div className={styles.headingCopy}>
            <p className={styles.eyebrow}>YOUR LEARNING VOYAGE · DEMO</p>
            <h2 id="archipelago-title">沿著能力航線，一站一站解鎖。</h2>
            <p>
              大陸不是課程分類，而是一條由淺入深的學習路徑。先完成目前任務，下一站才會從海霧中出現。
            </p>
          </div>

          <div className={styles.progressCard}>
            <div className={styles.progressTopline}>
              <span>示範學習進度</span>
              <strong>{progressPercent}%</strong>
            </div>
            <progress
              value={completedCount}
              max={stages.length}
              aria-label={`已完成 ${completedCount}／${stages.length} 座學習大陸`}
            />
            <p>
              <strong>{completedCount}</strong> / {stages.length} 站已通關
              <span>・進度不會永久儲存</span>
            </p>
          </div>
        </header>

        <div className={styles.voyageGrid}>
          <div className={styles.map}>
            <div className={styles.mapTopline} aria-hidden="true">
              <span>DIVEAI OCEAN CHART</span>
              <span>ROUTE 01 — EASTBOUND</span>
            </div>
            <div className={styles.mapCompass} aria-hidden="true">
              <span>N</span>
              <i />
            </div>
            <div className={styles.seaMarks} aria-hidden="true">
              <span />
              <span />
              <span />
            </div>
            <div className={`${styles.route} ${styles.routeOne}`} aria-hidden="true" />
            <div className={`${styles.route} ${styles.routeTwo}`} aria-hidden="true" />
            <div className={`${styles.route} ${styles.routeThree}`} aria-hidden="true" />

            <ol
              className={styles.journeyList}
              aria-label={`學習航線，共 ${stages.length} 站`}
            >
              {stages.map((stage) => {
                const state = getJourneyState(stage.index);
                const isSelected = selectedStage.index === stage.index;
                const positionStyle: NodePosition = {
                  "--node-x": `${stage.position.x}%`,
                  "--node-y": `${stage.position.y}%`,
                };

                return (
                  <li
                    key={stage.course.slug}
                    className={`${styles.node} ${styles[state]} ${
                      isSelected ? styles.selected : ""
                    }`}
                    style={positionStyle}
                  >
                    <button
                      type="button"
                      aria-current={state === "current" ? "step" : undefined}
                      aria-pressed={isSelected}
                      aria-label={`第 ${stage.index + 1} 站，${stage.landmassName}，${stage.course.title}，${STATE_LABEL[state]}`}
                      onClick={() => selectStage(stage.index)}
                    >
                      <span className={styles.island} aria-hidden="true">
                        <span className={styles.islandContour} />
                        <span className={styles.islandMarker}>
                          {STATE_ICON[state]}
                        </span>
                      </span>
                      <span className={styles.nodeCopy}>
                        <span className={styles.nodeStep}>
                          STEP {String(stage.index + 1).padStart(2, "0")}
                        </span>
                        <strong>{stage.landmassName}</strong>
                        <span className={styles.nodeState}>{STATE_LABEL[state]}</span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ol>

            <div className={styles.mapScale} aria-hidden="true">
              <span />
              <span>0</span>
              <span>200 KM</span>
            </div>
          </div>

          <aside className={styles.detailCard} aria-label="選取關卡詳情">
            <div className={styles.detailTopline}>
              <span>{selectedStage.coordinate}</span>
              <span>STAGE {String(selectedStage.index + 1).padStart(2, "0")}</span>
            </div>

            <div className={styles.detailStatusRow}>
              <span className={`${styles.statusBadge} ${styles[selectedState]}`}>
                {STATE_ICON[selectedState]} {STATE_LABEL[selectedState]}
              </span>
              <span className={styles.availabilityBadge}>
                {selectedStage.course.status === "coming-soon"
                  ? "即將開島"
                  : "課程已上線"}
              </span>
            </div>

            <p className={styles.detailLandmass}>{selectedStage.landmassName}</p>
            <h3>{selectedStage.course.title}</h3>
            <p className={styles.detailSummary}>{selectedStage.course.summary}</p>

            <dl className={styles.detailFacts}>
              <div>
                <dt>本島能力</dt>
                <dd>{selectedStage.skill}</dd>
              </div>
              <div>
                <dt>建議程度</dt>
                <dd>{selectedStage.course.level}</dd>
              </div>
              <div>
                <dt>航程</dt>
                <dd>
                  {selectedStage.course.duration} · {selectedStage.course.lessonCount} 單元
                </dd>
              </div>
            </dl>

            {selectedState === "locked" ? (
              <p className={styles.unlockHint}>
                <span aria-hidden="true">鎖</span>
                完成「{previousStage?.landmassName ?? "上一站"}」後解鎖這座大陸。
              </p>
            ) : null}

            <div className={styles.detailActions}>
              {selectedState === "current" ? (
                <button type="button" onClick={completeActiveStage}>
                  模擬完成此關 <span aria-hidden="true">→</span>
                </button>
              ) : null}

              {selectedState === "available" ? (
                <button
                  type="button"
                  onClick={() => startStage(selectedStage.index)}
                >
                  啟航這一站 <span aria-hidden="true">→</span>
                </button>
              ) : null}

              {selectedState === "completed" ? (
                <Link href={`/courses/${selectedStage.course.slug}`}>
                  重新探索課程 <span aria-hidden="true">↗</span>
                </Link>
              ) : null}

              {selectedState === "current" || selectedState === "available" ? (
                <Link
                  className={styles.textLink}
                  href={`/courses/${selectedStage.course.slug}`}
                >
                  {selectedStage.course.status === "coming-soon"
                    ? "查看課程預告"
                    : "查看完整課程"}
                </Link>
              ) : null}
            </div>

            {allCompleted ? (
              <button className={styles.resetButton} type="button" onClick={resetJourney}>
                重新開始示範航線
              </button>
            ) : null}
          </aside>
        </div>

        <div className={styles.legend} aria-label="航線狀態圖例">
          {(Object.keys(STATE_LABEL) as JourneyState[]).map((state) => (
            <span key={state}>
              <i className={styles[state]} aria-hidden="true" />
              {STATE_LABEL[state]}
            </span>
          ))}
          <p>點選任一大陸可查看課程與解鎖條件。</p>
        </div>

        <p className={styles.visuallyHidden} aria-live="polite" aria-atomic="true">
          {announcement}
        </p>
      </div>
    </section>
  );
}
