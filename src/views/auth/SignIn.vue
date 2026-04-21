<template>
  <section class="sign-in-page">
    <el-row :gutter="0" class="sign-in-shell">
      <el-col :xs="24" :sm="24" :md="10" :lg="10" class="sign-in-side">
        <div class="side-content">
          <p class="side-kicker">Admin Dashboard</p>
          <h2>Manage your operations in one secure place.</h2>
          <p class="side-description">
            Track users, menus, roles, and performance metrics with a focused control panel.
          </p>
          <div class="feature-list">
            <div class="feature-item">Real-time overview</div>
            <div class="feature-item">Role based access</div>
            <div class="feature-item">Consistent UI system</div>
          </div>
        </div>
      </el-col>

      <el-col :xs="24" :sm="24" :md="14" :lg="14" class="sign-in-main">
        <div class="main-content">
          <div class="main-header">
            <p class="main-badge">Welcome Back</p>
            <h1>Sign In</h1>
            <p>Use your admin credentials to access the dashboard.</p>
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
            ref="signInFormRef"
            :model="form"
            :rules="rules"
            label-position="top"
            class="sign-in-form"
            status-icon
            @submit.prevent="onSubmit"
          >
            <el-form-item label="Email Address" prop="email">
              <el-input v-model="form.email" type="email" placeholder="admin@example.com" size="large" />
            </el-form-item>

            <el-form-item label="Password" prop="password">
              <el-input
                v-model="form.password"
                type="password"
                show-password
                placeholder="Enter your password"
                size="large"
              />
            </el-form-item>

            <div class="form-meta">
              <el-checkbox v-model="form.rememberMe">Remember me</el-checkbox>
              <router-link to="/auth/sign-up">Forgot password?</router-link>
            </div>

            <el-button
              type="primary"
              class="submit-btn"
              native-type="submit"
              size="large"
              :loading="isSubmitting"
            >
              Sign In to Dashboard
            </el-button>
          </el-form>

          <p class="main-switch">
            Need an account?
            <router-link to="/auth/sign-up">Create one</router-link>
          </p>
        </div>
      </el-col>
    </el-row>
  </section>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, watch } from 'vue'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

interface SignInForm {
  email: string
  password: string
  rememberMe: boolean
}

export default defineComponent({
  name: 'SignIn',
  setup() {
    const router = useRouter()
    const authStore = useAuthStore()
    const signInFormRef = ref<FormInstance>()
    const isSubmitting = ref(false)
    const errorMessage = ref('')

    const form = reactive<SignInForm>({
      email: 'admin@example.com',
      password: 'password',
      rememberMe: true,
    })

    const rules: FormRules<SignInForm> = {
      email: [
        { required: true, message: 'Email is required', trigger: 'blur' },
        { type: 'email', message: 'Please enter a valid email', trigger: ['blur', 'change'] },
      ],
      password: [
        { required: true, message: 'Password is required', trigger: 'blur' },
        { min: 6, message: 'Password must be at least 6 characters', trigger: 'blur' },
      ],
    }

    watch(
      () => [form.email, form.password],
      () => {
        errorMessage.value = ''
      },
    )

    const onSubmit = async (): Promise<void> => {
      const formRef = signInFormRef.value
      if (!formRef) {
        return
      }

      const isValid = await formRef.validate().catch(() => false)
      if (!isValid) {
        errorMessage.value = 'Please review the highlighted fields before continuing.'
        return
      }

      isSubmitting.value = true
      errorMessage.value = ''

      if (form.password !== 'password') {
        isSubmitting.value = false
        errorMessage.value = 'Incorrect credentials. For demo, use password: password'
        return
      }

      authStore.signIn(form)
      ElMessage.success('Signed in successfully')
      isSubmitting.value = false
      await router.push('/dashboard')
    }

    return {
      signInFormRef,
      form,
      isSubmitting,
      errorMessage,
      rules,
      onSubmit,
    }
  },
})
</script>

<style scoped>
.sign-in-page {
  overflow: hidden;
  border-radius: 16px;
}

.sign-in-shell {
  min-height: 520px;
  background: var(--app-surface);
  border: 1px solid var(--app-border);
  box-shadow: var(--app-shadow-soft);
}

.sign-in-side {
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

.sign-in-main {
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

.form-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 4px 0 18px;
}

.form-meta a {
  font-size: 13px;
  color: var(--app-color-primary);
  text-decoration: none;
  font-weight: 500;
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

:deep(.el-checkbox__label) {
  color: var(--app-text-muted);
}

:deep(.el-checkbox__input.is-checked .el-checkbox__inner) {
  background-color: var(--app-color-primary);
  border-color: var(--app-color-primary);
}

:global(:root[data-theme='dark']) .sign-in-shell {
  background: rgba(17, 27, 46, 0.86);
}

:global(:root[data-theme='dark']) .sign-in-side {
  background:
    radial-gradient(circle at 18% 22%, rgba(140, 140, 241, 0.24), transparent 36%),
    linear-gradient(165deg, #0f1d4a 0%, #1d38a3 58%, #3a57ff 100%);
}

:global(:root[data-theme='dark']) .sign-in-main {
  background: transparent;
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
