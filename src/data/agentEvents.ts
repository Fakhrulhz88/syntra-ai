import type {
  AgentEvent,
  CurriculumAnalysis,
  GameBlueprint,
  Language,
} from '../types'

export type AgentEventTemplate = Omit<AgentEvent, 'timestamp'>

function json(value: unknown): string {
  return JSON.stringify(value, null, 2)
}

/**
 * 18 believable pipeline events: 4 analyzer, 4 planner, 6 generator, 4 builder.
 * All content previews are derived from the actual analysis + blueprint so the
 * pipeline view and the final game always agree.
 */
export function buildAgentEvents(
  analysis: CurriculumAnalysis,
  blueprint: GameBlueprint,
  language: Language,
  gameId: string,
  feedback?: string,
): AgentEventTemplate[] {
  const isBm = language === 'bm'
  const questions = blueprint.levels.reduce((sum, level) => sum + level.questions.length, 0)
  const objectiveCount = analysis.objectives.length
  const concepts = analysis.concepts.length
  const levelNames = blueprint.levels.map((level) => level.name).join(' · ')

  const feedbackLine = feedback
    ? isBm
      ? ` Maklum balas guru disertakan: “${feedback.slice(0, 72)}${feedback.length > 72 ? '…' : ''}”`
      : ` Teacher feedback included: “${feedback.slice(0, 72)}${feedback.length > 72 ? '…' : ''}”`
    : ''

  const t = {
    analyzerStart: isBm
      ? 'Membuka PDF dan mengesan struktur dokumen…'
      : 'Opening the PDF and detecting document structure…',
    analyzerParse: isBm
      ? 'Mengekstrak unit kurikulum, standard kandungan dan standard pembelajaran…'
      : 'Extracting curriculum units, content standards and learning standards…',
    analyzerKeywords: isBm
      ? 'Mengelompokkan kata kunci dan konsep utama…'
      : 'Clustering keywords and core concepts…',
    analyzerDone: isBm
      ? `${objectiveCount} objektif, ${concepts} konsep dan ${analysis.keywords.length} kata kunci berjaya diekstrak.`
      : `${objectiveCount} objectives, ${concepts} concepts and ${analysis.keywords.length} keywords extracted.`,
    plannerStart: isBm
      ? `Merangka dunia “${blueprint.theme}” dan lengkok cerita…`
      : `Designing the world “${blueprint.theme}” and the story arc…`,
    plannerMechanics: isBm
      ? `Menetapkan ${blueprint.mechanics.hp} nyawa, ${blueprint.mechanics.points_per_correct} mata setiap jawapan dan ${blueprint.mechanics.badges.length} lencana…`
      : `Setting ${blueprint.mechanics.hp} lives, ${blueprint.mechanics.points_per_correct} points per answer and ${blueprint.mechanics.badges.length} badges…`,
    plannerLevels: isBm
      ? `Menyusun ${blueprint.levels.length} tahap: ${levelNames}…`
      : `Sequencing ${blueprint.levels.length} levels: ${levelNames}…`,
    plannerDone: isBm
      ? `Blueprint RPG siap dengan ${blueprint.levels.length} tahap dan laluan ganjaran.`
      : `RPG blueprint ready with ${blueprint.levels.length} levels and a reward path.`,
    generatorStart: isBm
      ? 'Menulis soalan pertama dan penjelasan konsep…'
      : 'Writing the first questions and concept explanations…',
    generatorLevel1: isBm
      ? `Menjana ${blueprint.levels[0]?.questions.length ?? 5} soalan untuk ${blueprint.levels[0]?.name ?? 'tahap 1'}…`
      : `Generating ${blueprint.levels[0]?.questions.length ?? 5} questions for ${blueprint.levels[0]?.name ?? 'level 1'}…`,
    generatorLevel2: isBm
      ? `Menjana ${blueprint.levels[1]?.questions.length ?? 5} soalan untuk ${blueprint.levels[1]?.name ?? 'tahap 2'}…`
      : `Generating ${blueprint.levels[1]?.questions.length ?? 5} questions for ${blueprint.levels[1]?.name ?? 'level 2'}…`,
    generatorLevel3: isBm
      ? `Menjana ${blueprint.levels[2]?.questions.length ?? 5} soalan untuk ${blueprint.levels[2]?.name ?? 'tahap 3'}…`
      : `Generating ${blueprint.levels[2]?.questions.length ?? 5} questions for ${blueprint.levels[2]?.name ?? 'level 3'}…`,
    generatorReview: isBm
      ? 'Menyemak penjelasan, jawapan alternatif dan pemetaan objektif…'
      : 'Checking explanations, accepted answers and objective mapping…',
    generatorDone: isBm
      ? `${questions} soalan selesai — MCQ dan teka-teki seimbang mengikut objektif.${feedbackLine}`
      : `${questions} questions complete — MCQs and puzzles balanced across objectives.${feedbackLine}`,
    builderStart: isBm
      ? 'Menjana latar prosedural, partikel dan audio sintetik…'
      : 'Generating procedural backdrops, particles and synth audio…',
    builderScenes: isBm
      ? `Memasang ${blueprint.levels.length} babak: ${blueprint.levels.map((level) => level.scene).join(', ')}…`
      : `Assembling ${blueprint.levels.length} scenes: ${blueprint.levels.map((level) => level.scene).join(', ')}…`,
    builderValidate: isBm
      ? 'Mengesahkan blueprint terhadap skema permainan dan akses mudah alih…'
      : 'Validating the blueprint against the game schema and mobile access…',
    builderDone: isBm
      ? 'Permainan dibina dan pautan pelajar dijana. Sedia untuk semakan guru.'
      : 'Game built and student link generated. Ready for teacher review.',
  }

  return [
    {
      agent: 'analyzer',
      status: 'running',
      message: t.analyzerStart,
    },
    {
      agent: 'analyzer',
      status: 'running',
      message: t.analyzerParse,
    },
    {
      agent: 'analyzer',
      status: 'running',
      message: t.analyzerKeywords,
    },
    {
      agent: 'analyzer',
      status: 'done',
      message: t.analyzerDone,
      output_preview: json({
        subject: analysis.subject,
        level: analysis.level,
        objectives: analysis.objectives.map((objective) => ({
          id: objective.id,
          text: objective.text,
        })),
        concepts: analysis.concepts,
        keywords: analysis.keywords,
        difficulty: analysis.difficulty,
      }),
    },
    {
      agent: 'planner',
      status: 'running',
      message: t.plannerStart,
    },
    {
      agent: 'planner',
      status: 'running',
      message: t.plannerMechanics,
    },
    {
      agent: 'planner',
      status: 'running',
      message: t.plannerLevels,
    },
    {
      agent: 'planner',
      status: 'done',
      message: t.plannerDone,
      output_preview: json({
        title: blueprint.title,
        theme: blueprint.theme,
        mechanics: blueprint.mechanics,
        levels: blueprint.levels.map((level) => ({
          id: level.id,
          name: level.name,
          scene: level.scene,
          difficulty: level.difficulty,
          objective_ids: level.objective_ids,
          question_count: level.questions.length,
        })),
      }),
    },
    {
      agent: 'generator',
      status: 'running',
      message: t.generatorStart,
    },
    {
      agent: 'generator',
      status: 'running',
      message: t.generatorLevel1,
    },
    {
      agent: 'generator',
      status: 'running',
      message: t.generatorLevel2,
    },
    {
      agent: 'generator',
      status: 'running',
      message: t.generatorLevel3,
    },
    {
      agent: 'generator',
      status: 'running',
      message: t.generatorReview,
    },
    {
      agent: 'generator',
      status: 'done',
      message: t.generatorDone,
      output_preview: json(
        blueprint.levels.map((level) => ({
          level_id: level.id,
          level_name: level.name,
          questions: level.questions.map((question) => ({
            id: question.id,
            type: question.type,
            text: question.text,
            objective_id: question.objective_id,
            answer: question.answer,
          })),
        })),
      ),
    },
    {
      agent: 'builder',
      status: 'running',
      message: t.builderStart,
    },
    {
      agent: 'builder',
      status: 'running',
      message: t.builderScenes,
    },
    {
      agent: 'builder',
      status: 'running',
      message: t.builderValidate,
    },
    {
      agent: 'builder',
      status: 'done',
      message: t.builderDone,
      output_preview: json({
        game_id: gameId,
        share_path: `/play/${gameId}`,
        theme: blueprint.theme,
        assets: ['procedural_backdrops', 'particle_systems', 'synth_audio', 'qr_share_card'],
        levels: blueprint.levels.length,
        questions,
        status: 'ready_for_review',
      }),
    },
  ]
}
