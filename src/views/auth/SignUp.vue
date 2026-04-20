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
import { defineComponent } from 'vue'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'

interface SignUpForm {
  name: string
  email: string
  password: string
  confirmPassword: string
}

interface SignUpViewState {
  form: SignUpForm
  isSubmitting: boolean
  errorMessage: string
  rules: FormRules<SignUpForm>
}

interface PasswordCheck {
  label: string
  passed: boolean
}

export default defineComponent({
  name: 'SignUp',
  data(): SignUpViewState {
    return {
      form: {
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
      },
      isSubmitting: false,
      errorMessage: '',
      rules: {
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
              const vm = this as unknown as { form: SignUpForm }
              if (value !== vm.form.password) {
                callback(new Error('Password confirmation does not match'))
                return
              }
              callback()
            },
            trigger: ['blur', 'change'],
          },
        ],
      },
    }
  },
  watch: {
    'form.name'() {
      this.errorMessage = ''
    },
    'form.email'() {
      this.errorMessage = ''
    },
    'form.password'() {
      this.errorMessage = ''
    },
    'form.confirmPassword'() {
      this.errorMessage = ''
    },
  },
  computed: {
    passwordChecks(): PasswordCheck[] {
      const password = this.form.password
      return [
        { label: '8+ chars', passed: password.length >= 8 },
        { label: 'Uppercase', passed: /[A-Z]/.test(password) },
        { label: 'Number', passed: /\d/.test(password) },
        { label: 'Symbol', passed: /[^A-Za-z0-9]/.test(password) },
      ]
    },
    strengthScore(): number {
      return this.passwordChecks.filter((check) => check.passed).length
    },
    strengthPercent(): number {
      return (this.strengthScore / 4) * 100
    },
    strengthLabel(): string {
      if (!this.form.password) {
        return 'Not set'
      }
      if (this.strengthScore <= 1) {
        return 'Weak'
      }
      if (this.strengthScore === 2) {
        return 'Fair'
      }
      if (this.strengthScore === 3) {
        return 'Good'
      }
      return 'Strong'
    },
    strengthClass(): string {
      if (!this.form.password) {
        return 'strength-idle'
      }
      if (this.strengthScore <= 1) {
        return 'strength-weak'
      }
      if (this.strengthScore === 2) {
        return 'strength-fair'
      }
      if (this.strengthScore === 3) {
        return 'strength-good'
      }
      return 'strength-strong'
    },
  },
  methods: {
    async onSubmit(): Promise<void> {
      const formRef = this.$refs.signUpFormRef as FormInstance | undefined
      if (!formRef) {
        return
      }

      const isValid = await formRef.validate().catch(() => false)
      if (!isValid) {
        this.errorMessage = 'Please complete the required fields correctly.'
        return
      }

      this.isSubmitting = true
      this.errorMessage = ''

      ElMessage.success('Account created. You can sign in now.')
      this.isSubmitting = false
      await this.$router.push('/auth/sign-in')
    },
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
  background: #ffffff;
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
  background: #ffffff;
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
  color: #2f2fe4;
  font-weight: 600;
  font-size: 13px;
}

.main-header h1 {
  margin: 0;
  color: #18233d;
  font-size: 30px;
}

.main-header p {
  margin: 8px 0 0;
  color: #697286;
}

.form-hint {
  margin: 2px 0 14px;
  font-size: 12px;
  color: #6f778a;
}

.submit-btn {
  width: 100%;
  margin-top: 4px;
}

.main-switch {
  margin: 18px 0 0;
  color: #697286;
}

.main-switch a {
  color: #2f2fe4;
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
  color: #6f778a;
}

.strength-label {
  font-weight: 700;
}

.password-meter-track {
  width: 100%;
  height: 8px;
  border-radius: 999px;
  background: #e8ebf6;
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
  color: #78819a;
  border: 1px solid #d7dced;
  border-radius: 999px;
  padding: 4px 8px;
  transition: all 0.2s ease;
}

.password-check-item.passed {
  color: #166534;
  border-color: #9fe3b6;
  background: #edfdf3;
}

.strength-idle {
  color: #7d869e;
  background: #bcc4d8;
}

.strength-weak {
  color: #dc2626;
  background: #ef4444;
}

.strength-fair {
  color: #d97706;
  background: #f59e0b;
}

.strength-good {
  color: #2563eb;
  background: #3b82f6;
}

.strength-strong {
  color: #047857;
  background: #10b981;
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
