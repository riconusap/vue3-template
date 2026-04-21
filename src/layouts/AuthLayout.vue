<template>
  <div class="auth-layout">
    <el-row justify="center" align="middle" class="auth-row">
      <el-col :xs="23" :sm="21" :md="19" :lg="15">
        <transition name="auth-flip" mode="out-in">
          <el-card :key="$route.fullPath" class="auth-card">
            <router-view />
          </el-card>
        </transition>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'AuthLayout',
  setup() {
    return {}
  },
})
</script>

<style scoped>
.auth-layout {
  min-height: 100vh;
  background:
    radial-gradient(circle at 12% 20%, rgba(47, 47, 228, 0.18), transparent 36%),
    radial-gradient(circle at 84% 90%, rgba(22, 46, 147, 0.18), transparent 34%),
    linear-gradient(180deg, var(--app-bg) 0%, var(--app-surface-alt) 100%);
}

.auth-row {
  min-height: 100vh;
}

.auth-card {
  border-radius: 16px;
  border: 1px solid var(--app-border);
  box-shadow: var(--app-shadow-soft);
  transform-origin: center center;
  backface-visibility: hidden;
  background: var(--app-surface);
}

:global(:root[data-theme='dark']) .auth-layout {
  background:
    radial-gradient(circle at 12% 20%, rgba(140, 140, 241, 0.16), transparent 36%),
    radial-gradient(circle at 84% 90%, rgba(94, 129, 255, 0.12), transparent 34%),
    linear-gradient(180deg, var(--app-bg) 0%, #0b1220 100%);
}

.auth-flip-enter-active,
.auth-flip-leave-active {
  transition:
    transform 0.56s cubic-bezier(0.22, 1, 0.36, 1),
    opacity 0.4s ease;
  transform-style: preserve-3d;
}

.auth-flip-enter-from {
  opacity: 0;
  transform: perspective(1400px) rotateY(92deg) scale(0.96);
}

.auth-flip-leave-to {
  opacity: 0;
  transform: perspective(1400px) rotateY(-92deg) scale(0.96);
}

:deep(.el-card__body) {
  padding: 0;
}

@media (prefers-reduced-motion: reduce) {
  .auth-flip-enter-active,
  .auth-flip-leave-active {
    transition: opacity 0.18s ease;
  }

  .auth-flip-enter-from,
  .auth-flip-leave-to {
    transform: none;
  }
}
</style>
