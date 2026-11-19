import { create } from 'zustand'
import questData from '../preguntas/quest.json'

/**
 * Almacén global del juego (useGameStore).
 * Gestiona: fase del juego, etapa actual, preguntas, puntaje y errores.
 */
export const useGameStore = create((set, get) => ({
  // --- Estado de fase del juego ---
  phase: 'menu', // 'menu' | 'game' | 'gameOver'

  // --- Datos de la misión ---
  mision: questData.mision,
  preguntas: questData.preguntas,

  // --- Etapa actual (0 a 4) ---
  currentStage: 0,

  // --- Puntaje acumulado ---
  score: 0,

  // --- Registro de errores por etapa: { [etapa]: ['A', 'C', ...] } ---
  errors: {},

  // --- Si la etapa actual ya tuvo al menos un fallo (no se suma punto al acertar) ---
  currentStageHadError: false,

  // --- Retroalimentación visible ---
  feedback: null, // { type: 'correct'|'incorrect', text: string } | null

  // --- Opciones marcadas como erróneas en la etapa actual ---
  wrongOptions: [], // ['A', 'C', ...]

  // --- Flag para resetear posición del personaje al centro ---
  resetPlayerPosition: false,

  // ===================== ACCIONES =====================

  /** Inicia el juego desde el menú */
  startGame: () =>
    set({
      phase: 'game',
      currentStage: 0,
      score: 0,
      errors: {},
      currentStageHadError: false,
      feedback: null,
      wrongOptions: [],
      resetPlayerPosition: true,
    }),

  /** Respuesta correcta en la etapa actual */
  answerCorrect: () => {
    const { currentStage, score, currentStageHadError, preguntas } = get()
    const pregunta = preguntas[currentStage]
    const newScore = currentStageHadError ? score : score + 1
    const nextStage = currentStage + 1

    set({
      feedback: {
        type: 'correct',
        text: pregunta.retroalimentacion.correcta,
      },
      score: newScore,
    })

    // Después de un pequeño delay, avanza de etapa o termina el juego
    setTimeout(() => {
      if (nextStage >= preguntas.length) {
        set({
          phase: 'gameOver',
          feedback: null,
        })
      } else {
        set({
          currentStage: nextStage,
          currentStageHadError: false,
          wrongOptions: [],
          feedback: null,
          resetPlayerPosition: true,
        })
      }
    }, 2800)
  },

  /** Respuesta incorrecta en la etapa actual */
  answerIncorrect: (optionId) => {
    const { currentStage, errors, preguntas, wrongOptions } = get()
    const pregunta = preguntas[currentStage]

    // Registrar error en el historial
    const stageErrors = errors[currentStage] || []
    const updatedErrors = {
      ...errors,
      [currentStage]: [...stageErrors, optionId],
    }

    set({
      errors: updatedErrors,
      currentStageHadError: true,
      wrongOptions: [...wrongOptions, optionId],
      feedback: {
        type: 'incorrect',
        text: pregunta.retroalimentacion.incorrecta,
      },
      resetPlayerPosition: true,
    })
  },

  /** Cierra la ventana de retroalimentación */
  dismissFeedback: () => set({ feedback: null }),

  /** Consumir el flag de reseteo de posición */
  consumeResetPosition: () => set({ resetPlayerPosition: false }),

  /** Reiniciar al menú */
  goToMenu: () =>
    set({
      phase: 'menu',
      currentStage: 0,
      score: 0,
      errors: {},
      currentStageHadError: false,
      feedback: null,
      wrongOptions: [],
      resetPlayerPosition: false,
    }),
}))
