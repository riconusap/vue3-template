<template>
  <section class="sign-up-page">
    <el-row :gutter="0" class="sign-up-shell">
      <el-col :xs="24" :sm="24" :md="10" :lg="10" class="sign-up-side">
        <div class="side-content">
          <p class="side-kicker">Admin Dashboard</p>
          <h2>Build your admin workspace in minutes.</h2>
          <p class="side-description">
            Create your account and start managing users, permissions, and analytics from one place.
          </p>
          <div class="feature-list">
            <div class="feature-item">Fast onboarding</div>
            <div class="feature-item">Secure credentials</div>
            <div class="feature-item">Scalable management</div>
          </div>
        </div>
      </el-col>

      <el-col :xs="24" :sm="24" :md="14" :lg="14" class="sign-up-main">
        <div class="main-content">
          <div class="main-header">
            <p class="main-badge">Get Started</p>
            <h1>Create Account</h1>
            <p>Set up your admin account in a few secure steps.</p>
          </div>

          <transition name="fade-slide" mode="out-in">
            <el-alert
              v-if="errorMessage"
              :title="errorMessage"
              type="error"
              :closable="false"
              show-icon
              class="form-alert"
            />
          </transition>

          <el-form
            ref="signUpFormRef"
            :model="form"
            :rules="rules"
            label-position="top"
            class="sign-up-form"
            status-icon
            @submit.prevent="onSubmit"
          >
            <el-form-item label="Full Name" prop="name">
              <el-input v-model="form.name" placeholder="Your full name" size="large" />
            </el-form-item>

            <el-form-item label="Email" prop="email">
              <el-input v-model="form.email" type="email" placeholder="name@example.com" size="large" />
            </el-form-item>
            <el-form-item label="Password" prop="password">
              <el-input v-model="form.password" type="password" show-password size="large" />
            </el-form-item>
            <div class="password-meter-wrap">
              <div class="password-meter-header">
                <span>Password strength</span>
                <span :class="['strength-label', strengthClass]">{{ strengthLabel }}</span>
              </div>
              <div
                class="password-meter-track"
                role="progressbar"
                :aria-valuenow="strengthScore"
                aria-valuemin="0"
                aria-valuemax="4"
              >
                <div
                  class="password-meter-fill"
                  :class="strengthClass"
                  :style="{ width: strengthPercent + '%' }"
                />
              </div>
              <div class="password-checks">
                <span
                  v-for="check in passwordChecks"
                  :key="check.label"
                  :class="['password-check-item', { passed: check.passed }]"
                >
                  {{ check.label }}
                </span>
              </div>
            </div>
            <el-form-item label="Confirm Password" prop="confirmPassword">
              <el-input v-model="form.confirmPassword" type="password" show-password size="large" />
            </el-form-item>

            <p class="form-hint">Password must include 8+ characters, uppercase, number, and symbol.</p>

            <el-button
              type="primary"
              class="submit-btn"
              native-type="submit"
              size="large"
              :loading="isSubmitting"
            >
              Create Account
            </el-button>
          </el-form>

          <p class="main-switch">
            Already have an account?
            <router-link to="/auth/sign-in">Sign In</router-link>
          </p>
        </div>
      </el-col>
    </el-row>
  </section>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, ref, watch } from 'vue'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { useRouter } from 'vue-router'

interface SignUpForm {
  name: string
  email: string
  password: string
  confirmPassword: string
}

interface PasswordCheck {
  label: string
  passed: boolean
}

export default defineComponent({
  name: 'SignUp',
  setup() {
    const router = useRouter()
    const signUpFormRef = ref<FormInstance>()
    const isSubmitting = ref(false)
    const errorMessage = ref('')

    const form = reactive<SignUpForm>({
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    })

    const rules: FormRules<SignUpForm> = {
      name: [
        { required: true, message: 'Full name is required', trigger: 'blur' },
        { min: 3, message: 'Full name must be at least 3 characters', trigger: 'blur' },
      ],
      email: [
        { required: true, message: 'Email is required', trigger: 'blur' },
        { type: 'email', message: 'Please enter a valid email', trigger: ['blur', 'change'] },
      ],
      password: [
        { required: true, message: 'Password is required', trigger: 'blur' },
        {
          validator: (_rule, value: string, callback): void => {
            const password = value ?? ''
            const missingCriteria: string[] = []

            if (password.length < 8) {
              missingCriteria.push('8+ characters')
            }
            if (!/[A-Z]/.test(password)) {
              missingCriteria.push('one uppercase letter')
            }
            if (!/\d/.test(password)) {
              missingCriteria.push('one number')
            }
            if (!/[^A-Za-z0-9]/.test(password)) {
              missingCriteria.push('one symbol')
            }

            if (missingCriteria.length > 0) {
              callback(new Error(`Password must include ${missingCriteria.join(', ')}`))
              return
            }

            callback()
          },
          trigger: 'blur',
        },
      ],
      confirmPassword: [
        { required: true, message: 'Please confirm your password', trigger: 'blur' },
        {
          validator: (_rule, value: string, callback): void => {
            if (value !== form.password) {
              callback(new Error('Password confirmation does not match'))
              return
            }
            callback()
          },
          trigger: ['blur', 'change'],
        },
      ],
    }

    watch(
      () => [form.name, form.email, form.password, form.confirmPassword],
      () => {
        errorMessage.value = ''
      },
    )

    const passwordChecks = computed<PasswordCheck[]>(() => {
      const password = form.password
      return [
        { label: '8+ chars', passed: password.length >= 8 },
        { label: 'Uppercase', passed: /[A-Z]/.test(password) },
        { label: 'Number', passed: /\d/.test(password) },
        { label: 'Symbol', passed: /[^A-Za-z0-9]/.test(password) },
      ]
    })

    const strengthScore = computed<number>(() => passwordChecks.value.filter((check) => check.passed).length)
    const strengthPercent = computed<number>(() => (strengthScore.value / 4) * 100)
    const strengthLabel = computed<string>(() => {
      if (!form.password) {
        return 'Not set'
      }
      if (strengthScore.value <= 1) {
        return 'Weak'
      }
      if (strengthScore.value === 2) {
        return 'Fair'
      }
      if (strengthScore.value === 3) {
        return 'Good'
      }
      return 'Strong'
    })
    const strengthClass = computed<string>(() => {
      if (!form.password) {
        return 'strength-idle'
      }
      if (strengthScore.value <= 1) {
        return 'strength-weak'
      }
      if (strengthScore.value === 2) {
        return 'strength-fair'
      }
      if (strengthScore.value === 3) {
        return 'strength-good'
      }
      return 'strength-strong'
    })

    const onSubmit = async (): Promise<void> => {
      const formRef = signUpFormRef.value
      if (!formRef) {
        return
      }

      const isValid = await formRef.validate().catch(() => false)
      if (!isValid) {
        errorMessage.value = 'Please complete the required fields correctly.'
        return
      }

      isSubmitting.value = true
      errorMessage.value = ''

      ElMessage.success('Account created. You can sign in now.')
      isSubmitting.value = false
      await router.push('/auth/sign-in')
    }

    return {
      signUpFormRef,
      form,
      isSubmitting,
      errorMessage,
      rules,
      passwordChecks,
      strengthScore,
      strengthPercent,
      strengthLabel,
      strengthClass,
      onSubmit,
    }
  },
})
</script>

<style scoped>
.sign-up-page {
  overflow: hidden;
  border-radius: 16px;
}

.sign-up-shell {
  min-height: 520px;
  background: var(--app-surface);
  border: 1px solid var(--app-border);
  box-shadow: var(--app-shadow-soft);
}

.sign-up-side {
  background:
    radial-gradient(circle at 18% 22%, rgba(126, 145, 255, 0.24), transparent 36%),
    linear-gradient(165deg, #162e93 0%, #2f2fe4 62%, #3f65ff 100%);
  color: #ffffff;
}

.side-content {
  padding: 34px 28px;
  display: grid;
  gap: 16px;
  height: 100%;
  align-content: center;
}

.side-kicker {
  margin: 0;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  font-size: 12px;
  opacity: 0.9;
}

.side-content h2 {
  margin: 0;
  font-size: 30px;
  line-height: 1.18;
  color: #ffffff;
}

.side-description {
  margin: 0;
  opacity: 0.9;
  line-height: 1.6;
}

.feature-list {
  display: grid;
  gap: 10px;
  margin-top: 8px;
}

.feature-item {
  width: fit-content;
  padding: 8px 12px;
  border: 1px solid rgba(255, 255, 255, 0.28);
  border-radius: 999px;
  font-size: 12px;
  background: rgba(255, 255, 255, 0.12);
}

.sign-up-main {
  background: var(--app-surface);
}

.main-content {
  padding: 36px 30px;
}

.main-header {
  margin-bottom: 20px;
}

.form-alert {
  margin-bottom: 14px;
}

.main-badge {
  margin: 0 0 10px;
  color: var(--app-color-primary);
  font-weight: 600;
  font-size: 13px;
}

.main-header h1 {
  margin: 0;
  color: var(--app-text-main);
  font-size: 30px;
}

.main-header p {
  margin: 8px 0 0;
  color: var(--app-text-muted);
}

.form-hint {
  margin: 2px 0 14px;
  font-size: 12px;
  color: var(--app-text-muted);
}

.submit-btn {
  width: 100%;
  margin-top: 4px;
}

.main-switch {
  margin: 18px 0 0;
  color: var(--app-text-muted);
}

.main-switch a {
  color: var(--app-color-primary);
  text-decoration: none;
  font-weight: 600;
}

.password-meter-wrap {
  margin: 2px 0 12px;
}

.password-meter-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  font-size: 12px;
  color: var(--app-text-muted);
}

.strength-label {
  font-weight: 700;
}

.password-meter-track {
  width: 100%;
  height: 8px;
  border-radius: 999px;
  background: var(--app-surface-alt);
  overflow: hidden;
}

.password-meter-fill {
  height: 100%;
  border-radius: inherit;
  transition: width 0.28s ease, background-color 0.28s ease;
}

.password-checks {
  margin-top: 8px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.password-check-item {
  font-size: 11px;
  color: var(--app-text-muted);
  border: 1px solid var(--app-border);
  border-radius: 999px;
  padding: 4px 8px;
  transition: all 0.2s ease;
}

.password-check-item.passed {
  color: #15803d;
  border-color: rgba(21, 128, 61, 0.28);
  background: rgba(21, 128, 61, 0.12);
}

.strength-idle {
  color: var(--app-text-muted);
  background: var(--app-border);
}

.strength-weak {
  color: #ef4444;
  background: rgba(239, 68, 68, 0.18);
}

.strength-fair {
  color: #f59e0b;
  background: rgba(245, 158, 11, 0.18);
}

.strength-good {
  color: #60a5fa;
  background: rgba(59, 130, 246, 0.18);
}

.strength-strong {
  color: #34d399;
  background: rgba(16, 185, 129, 0.18);
}

:deep(.el-form-item__label) {
  color: var(--app-text-main);
}

:deep(.el-input__wrapper) {
  border-radius: 14px;
  background: var(--app-surface-alt);
  box-shadow: 0 0 0 1px var(--app-border) inset;
}

:deep(.el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 1px var(--app-color-primary) inset;
}

:deep(.el-input__inner) {
  color: var(--app-text-main);
}

:deep(.el-input__inner::placeholder) {
  color: var(--app-text-muted);
}

:global(:root[data-theme='dark']) .sign-up-shell {
  background: rgba(17, 27, 46, 0.86);
}

:global(:root[data-theme='dark']) .sign-up-side {
  background:
    radial-gradient(circle at 18% 22%, rgba(140, 140, 241, 0.24), transparent 36%),
    linear-gradient(165deg, #0f1d4a 0%, #1d38a3 58%, #3a57ff 100%);
}

:global(:root[data-theme='dark']) .sign-up-main {
  background: transparent;
}

:global(:root[data-theme='dark']) .password-check-item.passed {
  color: #86efac;
  background: rgba(34, 197, 94, 0.12);
  border-color: rgba(34, 197, 94, 0.24);
}

@media (max-width: 992px) {
  .side-content {
    padding: 26px 22px;
  }

  .main-content {
    padding: 26px 22px;
  }

  .side-content h2 {
    font-size: 24px;
  }

  .main-header h1 {
    font-size: 26px;
  }
}
</style>
