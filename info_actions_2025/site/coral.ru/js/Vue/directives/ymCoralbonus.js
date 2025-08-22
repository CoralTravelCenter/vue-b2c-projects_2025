import {useIntersectionObserver} from '@vueuse/core'

const seen = new WeakSet()

export default {
  mounted(el, binding) {
    const v = binding.value
    const promotion = v?.promotion ?? v
    if (!promotion) return

    const filterName = v?.filterName ?? 'Акции CoralBonus'
    const counterId = v?.counterId ?? 96674199
    const goal = v?.goal ?? 'coral-bonus-show'
    const threshold = v?.threshold ?? 0.2

    if (promotion.filter !== filterName || seen.has(el)) return

    const {stop} = useIntersectionObserver(
      el,
      ([entry]) => {
        if (entry.isIntersecting && !seen.has(el)) {
          seen.add(el)
          if (typeof window.ym === 'function') {
            const yaParams = {
              [location.pathname]: {
                banner: promotion.name,
              },
            }
            ym(counterId, 'reachGoal', goal, yaParams)
          }

          stop()
          el.__ymStop = undefined
        }
      },
      {threshold}
    )

    el.__ymStop = stop
  },

  unmounted(el) {
    el.__ymStop?.()
    el.__ymStop = undefined
    seen.delete(el)
  },
}
