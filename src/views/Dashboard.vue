<template>
  <div class="welcome-row">
    <el-avatar :size="56" class="welcome-avatar">{{ userInitials }}</el-avatar>

    <div class="welcome-copy">
      <h1 class="welcome-line">
        Welcome, <strong>{{ userProfile.name }}</strong> 👋
      </h1>
      <p class="welcome-meta">
        {{ userProfile.position }} • {{ currentDateLabel }}
        <span class="welcome-time is-number">{{ currentTimeLabel }}</span>
      </p>
    </div>
  </div>
  <div class="dashboard-spacer"></div>
  <section class="dashboard-content section-content">

  </section>
</template>

<script lang="ts">
import { computed, defineComponent, onBeforeUnmount, onMounted, ref } from 'vue'
import { useAuthStore } from '@/stores/auth'

interface UserProfile {
  name: string
  email: string
  position: string
  placement: string
  photoUrl: string
}

export default defineComponent({
  name: 'Dashboard',
  setup() {
    const authStore = useAuthStore()
    const currentTime = ref(new Date())
    let clockTimer: number | undefined

    const userProfile = computed<UserProfile>(() => {
      const session = authStore.session
      const fullName = session?.name ?? 'Guest'
      return {
        name: fullName,
        email: session?.email ?? '-',
        position: session?.role ?? 'Staff',
        placement: 'Head Office Jakarta',
        photoUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=2f2fe4&color=ffffff`,
      }
    })

    const currentTimeLabel = computed((): string => {
      return currentTime.value.toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      })
    })

    const currentDateLabel = computed((): string => {
      return currentTime.value.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    })

    const userInitials = computed((): string => {
      return userProfile.value.name
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase() ?? '')
        .join('')
    })

    onMounted(() => {
      clockTimer = window.setInterval(() => {
        currentTime.value = new Date()
      }, 1000)
    })

    onBeforeUnmount(() => {
      if (clockTimer) {
        window.clearInterval(clockTimer)
      }
    })

    return {
      userProfile,
      userInitials,
      currentTimeLabel,
      currentDateLabel,
    }
  },
})
</script>

<style scoped>
.dashboard-content {
  width: 100%;
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
}

.welcome-card {
  width: 100%;
}

.welcome-card :deep(.el-card__body) {
  padding: 16px 18px;
}

.welcome-row {
  display: flex;
  align-items: center;
  gap: 14px;
}

.welcome-avatar {
  flex-shrink: 0;
  background: linear-gradient(145deg, var(--el-color-primary), color-mix(in srgb, var(--el-color-primary-dark-2) 78%, #1f2a44));
  color: #ffffff;
  font-weight: 700;
}

.welcome-copy {
  min-width: 0;
}

.welcome-line {
  margin: 0;
  font-size: 18px;
  line-height: 1.3;
  color: var(--el-text-color-primary);
}

.welcome-line strong {
  font-weight: 800;
}

.welcome-meta {
  margin: 6px 0 0;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
  font-size: 13px;
  color: var(--el-text-color-secondary);
}

.welcome-time {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border-radius: 999px;
  background: color-mix(in srgb, var(--app-surface-alt) 88%, var(--app-surface));
  border: 1px solid var(--app-border-soft);
}

.dashboard-spacer {
  flex: 1;
  min-height: 0;
}

@media (max-width: 1100px) {
  .welcome-line {
    font-size: 16px;
  }
}

@media (max-width: 640px) {
  .welcome-row {
    flex-direction: column;
    align-items: flex-start;
  }

  .dashboard-content {
    padding-bottom: 8px;
  }

  .welcome-meta {
    gap: 8px;
  }
}
</style>
