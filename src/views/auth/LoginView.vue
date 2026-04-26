<template>
  <div class="auth-view">
    <el-card class="auth-card" shadow="never">
      <div class="auth-header">
        <el-icon class="logo-icon"><IceTea /></el-icon>
        <h2>{{ isLogin ? '欢迎回来' : '加入我们' }}</h2>
        <p>{{ isLogin ? '登录您的 AyunBlog 账号' : '创建一个新账号以开始写作' }}</p>
      </div>

      <el-form :model="authForm" :rules="rules" ref="authFormRef" label-position="top">
        <template v-if="!isLogin">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="authForm.username" placeholder="请输入用户名">
              <template #prefix>
                <el-icon><User /></el-icon>
              </template>
            </el-input>
          </el-form-item>
        </template>

        <el-form-item label="邮箱" prop="email">
          <el-input v-model="authForm.email" placeholder="your@email.com">
            <template #prefix>
              <el-icon><Message /></el-icon>
            </template>
          </el-input>
        </el-form-item>

        <el-form-item label="密码" prop="password">
          <el-input
            v-model="authForm.password"
            type="password"
            placeholder="请输入密码"
            show-password
          >
            <template #prefix>
              <el-icon><Lock /></el-icon>
            </template>
          </el-input>
        </el-form-item>

        <template v-if="!isLogin">
          <el-form-item label="确认密码" prop="confirmPassword">
            <el-input
              v-model="authForm.confirmPassword"
              type="password"
              placeholder="请再次输入密码"
              show-password
            >
              <template #prefix>
                <el-icon><Lock /></el-icon>
              </template>
            </el-input>
          </el-form-item>
        </template>

        <div v-if="isLogin" class="form-footer">
          <el-checkbox v-model="authForm.remember">记住我</el-checkbox>
          <el-link type="primary" :underline="false">忘记密码？</el-link>
        </div>

        <el-button type="primary" class="submit-btn" :loading="loading" @click="handleSubmit">
          {{ isLogin ? '立即登录' : '立即注册' }}
        </el-button>
      </el-form>

      <div class="auth-footer">
        <span>{{ isLogin ? '还没有账号？' : '已有账号？' }}</span>
        <el-link type="primary" :underline="false" @click="toggleMode">
          {{ isLogin ? '立即注册' : '立即登录' }}
        </el-link>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import type { FormInstance } from 'element-plus'

const router = useRouter()
const route = useRoute()
const loading = ref(false)
const authFormRef = ref<FormInstance>()

const isLogin = computed(() => route.name === 'Login')

const authForm = reactive({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  remember: false,
})

const validatePass2 = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('请再次输入密码'))
  } else if (value !== authForm.password) {
    callback(new Error('两次输入密码不一致!'))
  } else {
    callback()
  }
}

const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' },
  ],
  email: [
    { required: true, message: '请输入邮箱地址', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能少于 6 位', trigger: 'blur' },
  ],
  confirmPassword: [{ validator: validatePass2, trigger: 'blur' }],
}

const handleSubmit = async () => {
  if (!authFormRef.value) return

  await authFormRef.value.validate((valid) => {
    if (valid) {
      loading.value = true
      // Mock API call
      setTimeout(() => {
        loading.value = false
        ElMessage.success(isLogin.value ? '登录成功' : '注册成功')
        router.push('/')
      }, 1000)
    }
  })
}

const toggleMode = () => {
  if (isLogin.value) {
    router.push('/register')
  } else {
    router.push('/login')
  }
}
</script>

<style scoped lang="scss">
@use '../../styles/variables.scss' as *;

.auth-view {
  min-height: calc(100vh - 200px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: $spacing-xl 0;
}

.auth-card {
  width: 100%;
  max-width: 450px;
  border-radius: $border-radius-large;
  border: 1px solid $border-color;
  padding: $spacing-lg;

  .auth-header {
    text-align: center;
    margin-bottom: $spacing-xl;

    .logo-icon {
      font-size: 48px;
      color: $primary-color;
      margin-bottom: $spacing-md;
    }

    h2 {
      margin: 0 0 $spacing-xs;
      font-size: 24px;
      font-weight: 700;
    }

    p {
      color: $text-secondary;
      font-size: 14px;
      margin: 0;
    }
  }

  .form-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: $spacing-lg;
  }

  .submit-btn {
    width: 100%;
    height: 42px;
    font-size: 16px;
    margin-bottom: $spacing-xl;
  }

  .auth-footer {
    text-align: center;
    font-size: 14px;
    color: $text-regular;
  }
}
</style>
