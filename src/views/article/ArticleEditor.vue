<template>
  <div class="article-editor">
    <el-card class="editor-card" shadow="never">
      <template #header>
        <div class="editor-header">
          <el-input v-model="article.title" placeholder="请输入文章标题..." class="title-input" />
          <div class="header-actions">
            <el-button @click="handleSaveDraft">保存草稿</el-button>
            <el-button type="primary" @click="handlePublish">发布文章</el-button>
          </div>
        </div>
      </template>

      <div class="editor-settings">
        <el-form :model="article" label-width="80px" inline>
          <el-form-item label="分类">
            <el-select v-model="article.category" placeholder="选择分类">
              <el-option label="Vue" value="vue" />
              <el-option label="React" value="react" />
              <el-option label="Node.js" value="nodejs" />
            </el-select>
          </el-form-item>
          <el-form-item label="标签">
            <el-select
              v-model="article.tags"
              multiple
              filterable
              allow-create
              default-first-option
              placeholder="选择或创建标签"
            >
              <el-option label="Vue3" value="vue3" />
              <el-option label="TypeScript" value="ts" />
              <el-option label="Vite" value="vite" />
            </el-select>
          </el-form-item>
          <el-form-item label="发布时间">
            <el-date-picker
              v-model="article.publishTime"
              type="datetime"
              placeholder="选择发布时间 (留空立即发布)"
            />
          </el-form-item>
        </el-form>
      </div>

      <div class="editor-content">
        <md-editor
          v-model="article.content"
          :toolbars-exclude="['github']"
          @on-upload-img="onUploadImg"
          style="height: 600px"
        />
      </div>
    </el-card>

    <!-- Publish Success Dialog -->
    <el-dialog v-model="publishSuccess" title="发布成功" width="30%" center>
      <span>您的文章已成功发布！</span>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="publishSuccess = false">返回编辑</el-button>
          <el-button type="primary" @click="$router.push('/')">回到首页</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { MdEditor } from 'md-editor-v3'
import { ElMessage } from 'element-plus'

const route = useRoute()
const router = useRouter()

const article = reactive({
  title: '',
  category: '',
  tags: [] as string[],
  content: '',
  publishTime: null as string | null,
})

const isEdit = ref(false)
const publishSuccess = ref(false)

onMounted(() => {
  const id = route.params.id
  if (id) {
    isEdit.value = true
    // Mock fetching article data for backfill
    setTimeout(() => {
      Object.assign(article, {
        title: `回填的文章标题 (${id})`,
        category: 'vue',
        tags: ['vue3', 'ts'],
        content: '# 这是一个回填的 Markdown 内容\n\n编辑器已经成功获取并回填了文章数据。',
        publishTime: '2026-04-26 10:00:00',
      })
    }, 500)
  }
})

const handleSaveDraft = () => {
  ElMessage.success('草稿已保存')
}

const handlePublish = () => {
  if (!article.title || !article.content) {
    ElMessage.warning('请填写标题和内容')
    return
  }
  publishSuccess.value = true
}

const onUploadImg = async (files: File[], callback: (urls: string[]) => void) => {
  // Mock image upload
  const urls = files.map(() => 'https://picsum.photos/800/450')
  callback(urls)
}
</script>

<style scoped lang="scss">
@use '../../styles/variables.scss' as *;

.article-editor {
  padding-bottom: $spacing-xl;
}

.editor-card {
  border-radius: $border-radius-large;
  border: 1px solid $border-color;

  .editor-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: $spacing-xl;

    .title-input {
      :deep(.el-input__wrapper) {
        box-shadow: none;
        padding: 0;
        background: transparent;
      }
      :deep(.el-input__inner) {
        font-size: 24px;
        font-weight: 700;
        height: 40px;
        &::placeholder {
          color: $text-placeholder;
        }
      }
    }

    .header-actions {
      display: flex;
      gap: $spacing-md;
      flex-shrink: 0;
    }
  }

  .editor-settings {
    padding: $spacing-md 0;
    border-bottom: 1px solid rgba($border-color, 0.5);
    margin-bottom: $spacing-md;

    :deep(.el-form-item) {
      margin-bottom: $spacing-sm;
    }
  }

  .editor-content {
    :deep(.md-editor) {
      border: none;
    }
  }
}

@media (max-width: 768px) {
  .editor-header {
    flex-direction: column;
    align-items: flex-start;
    gap: $spacing-md;

    .header-actions {
      width: 100%;
      justify-content: flex-end;
    }
  }
}
</style>
