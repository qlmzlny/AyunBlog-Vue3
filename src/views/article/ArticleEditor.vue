<template>
  <div class="article-editor">
    <el-card class="editor-card" shadow="never">
      <template #header>
        <div class="editor-header">
          <!-- 文章标题输入 -->
          <el-input
            v-model="article.title"
            placeholder="请输入文章标题..."
            class="title-input"
            maxlength="100"
          />
          <div class="header-actions">
            <el-button @click="handleSaveDraft">保存草稿</el-button>
            <el-button
              type="primary"
              :disabled="!article.title || !article.content"
              @click="showPublishDialog = true"
            >
              发布文章
            </el-button>
          </div>
        </div>
      </template>

      <!-- Markdown 编辑器 -->
      <div class="editor-content">
        <md-editor
          v-model="article.content"
          placeholder="开始你的创作..."
          :toolbars-exclude="['github']"
          @on-upload-img="onUploadImg"
          style="height: calc(100vh - 250px)"
        />
      </div>
    </el-card>

    <!-- 发布设置弹窗 -->
    <PublishDialog v-model="showPublishDialog" :loading="submitting" @confirm="handleRealPublish" />

    <!-- 发布成功弹窗 -->
    <el-dialog v-model="publishSuccess" title="发布成功" width="400px" center>
      <div class="success-content">
        <el-icon class="success-icon"><CircleCheckFilled /></el-icon>
        <span>您的文章已成功发布！</span>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="handleGoBack">返回编辑</el-button>
          <el-button type="primary" @click="$router.push('/')">回到首页</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { MdEditor } from 'md-editor-v3'
import 'md-editor-v3/lib/style.css'
import { ElMessage, ElMessageBox } from 'element-plus'
import { CircleCheckFilled } from '@element-plus/icons-vue'
import { useArticleStore } from '@/stores/article'
import {
  getArticleDetail,
  createArticle,
  updateArticle,
  uploadArticleImage,
  uploadCoverImage,
} from '@/api/article'
import PublishDialog from './components/PublishDialog.vue'

const route = useRoute()
const router = useRouter()
const articleStore = useArticleStore()

// 使用 Pinia store 中的状态
const article = articleStore.editArticle
const isEdit = ref(false)
const showPublishDialog = ref(false)
const submitting = ref(false)
const publishSuccess = ref(false)

onMounted(async () => {
  const id = route.params.id
  if (id) {
    isEdit.value = true
    try {
      const res = await getArticleDetail(Number(id))
      if (res.code === 200) {
        articleStore.initEditArticle(res.data)
      }
    } catch (error) {
      ElMessage.error('获取文章详情失败')
    }
  } else {
    articleStore.resetEditArticle()
  }
})

onUnmounted(() => {
  // 组件卸载时重置状态
  articleStore.resetEditArticle()
})

/**
 * 图片处理逻辑：延迟上传
 * 用户上传时，先生成本地预览链接，并将文件存入 store
 */
const onUploadImg = async (files: File[], callback: (urls: string[]) => void) => {
  const urls = files.map((file) => {
    const localUrl = URL.createObjectURL(file)
    articleStore.addLocalImage(localUrl, file)
    return localUrl
  })
  callback(urls)
}

/**
 * 保存草稿
 */
const handleSaveDraft = async () => {
  if (!article.title) {
    ElMessage.warning('保存草稿也需要填写标题哦')
    return
  }
  article.status = 'draft'
  await handleRealPublish()
}

/**
 * 核心发布流程
 */
const handleRealPublish = async () => {
  submitting.value = true
  try {
    // 1. 处理文章内容中的本地图片
    let finalContent = article.content
    const localImageEntries = Array.from(articleStore.localImages.entries())

    // 过滤出内容中实际存在的本地图片
    const imagesToUpload = localImageEntries.filter(([url]) => finalContent.includes(url))

    if (imagesToUpload.length > 0) {
      ElMessage.info(`正在上传内容图片 (${imagesToUpload.length} 张)...`)
      for (const [localUrl, file] of imagesToUpload) {
        const res = await uploadArticleImage(file)
        if (res.code === 200) {
          // 将内容中的本地 blob 链接替换为真实的远程链接
          finalContent = finalContent.replaceAll(localUrl, res.data)
        }
      }
    }

    // 2. 处理封面图
    let finalCover = article.cover
    if (articleStore.localCover) {
      ElMessage.info('正在上传封面图...')
      const res = await uploadCoverImage(articleStore.localCover)
      if (res.code === 200) {
        finalCover = res.data
      }
    }

    // 3. 构造提交数据
    // 处理标签：分离已有的 ID 和新创建的标签名称
    const tagIds = article.tags.filter((t) => typeof t === 'number')
    const newTagNames = article.tags.filter((t) => typeof t === 'string')

    const submitData = {
      ...article,
      content: finalContent,
      cover: finalCover,
      tagIds,
      newTags: newTagNames, // 假设后端支持这样接收新标签
    }

    // 4. 提交到后端
    let result
    if (isEdit.value && article.id) {
      result = await updateArticle(article.id, submitData)
    } else {
      result = await createArticle(submitData)
    }

    if (result.code === 200) {
      showPublishDialog.value = false
      publishSuccess.value = true
      ElMessage.success(article.status === 'draft' ? '草稿已保存' : '文章已发布')
    }
  } catch (error) {
    console.error('Submit failed:', error)
    ElMessage.error('发布失败，请检查网络或稍后再试')
  } finally {
    submitting.value = false
  }
}

const handleGoBack = () => {
  publishSuccess.value = false
  if (!isEdit.value) {
    // 如果是新建，发布成功后跳转到详情或重置
    router.push(`/article/${articleStore.editArticle.id}`)
  }
}
</script>

<style scoped lang="scss">
@use '../../styles/variables.scss' as *;

.article-editor {
  padding: $spacing-md;
  background-color: $bg-color;
  min-height: calc(100vh - 64px);
}

.editor-card {
  border-radius: $border-radius-large;
  border: 1px solid $border-color;
  box-shadow: $box-shadow-light;

  .editor-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: $spacing-xl;

    .title-input {
      flex: 1;
      :deep(.el-input__wrapper) {
        box-shadow: none !important;
        padding: 0;
        background: transparent;
      }
      :deep(.el-input__inner) {
        font-size: 24px;
        font-weight: 700;
        height: 50px;
        color: $text-primary;
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

  .editor-content {
    margin-top: $spacing-sm;
    :deep(.md-editor) {
      border: none;
    }
  }
}

.success-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: $spacing-lg 0;
  gap: $spacing-md;

  .success-icon {
    font-size: 48px;
    color: $success-color;
  }

  span {
    font-size: 18px;
    font-weight: 500;
    color: $text-primary;
  }
}

.dialog-footer {
  display: flex;
  justify-content: center;
  gap: $spacing-md;
}

@media (max-width: 768px) {
  .editor-header {
    flex-direction: column;
    align-items: flex-start;
    gap: $spacing-md;

    .title-input {
      width: 100%;
    }

    .header-actions {
      width: 100%;
      justify-content: flex-end;
    }
  }
}
</style>
