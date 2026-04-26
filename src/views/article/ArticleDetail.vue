<template>
  <div class="article-detail">
    <el-row :gutter="24">
      <el-col :xs="24" :sm="24" :md="18" :offset="isAdmin ? 0 : 3" class="main-col">
        <el-card class="detail-card" shadow="never">
          <header class="article-header">
            <h1 class="article-title">{{ article.title }}</h1>
            <div class="article-meta">
              <span class="meta-item">
                <el-icon><Calendar /></el-icon> 发布于 {{ article.date }}
              </span>
              <span class="meta-item">
                <el-icon><User /></el-icon> {{ article.author }}
              </span>
              <span class="meta-item">
                <el-icon><View /></el-icon> {{ article.views }} 次阅读
              </span>
              <el-button v-if="canEdit" type="primary" link @click="handleEdit">
                <el-icon><Edit /></el-icon> 编辑
              </el-button>
            </div>
            <div class="article-tags">
              <el-tag v-for="tag in article.tags" :key="tag" size="small" class="tag">
                {{ tag }}
              </el-tag>
            </div>
          </header>

          <div class="article-content">
            <md-preview :model-value="article.content" />
          </div>

          <footer class="article-footer">
            <div class="share-actions">
              <span class="share-label">分享到：</span>
              <el-button-group>
                <el-tooltip content="分享到微博" placement="top">
                  <el-button circle @click="shareTo('weibo')">
                    <el-icon><Share /></el-icon>
                  </el-button>
                </el-tooltip>
                <el-tooltip content="微信扫码分享" placement="top">
                  <el-button circle @click="shareTo('wechat')">
                    <el-icon><ChatDotRound /></el-icon>
                  </el-button>
                </el-tooltip>
                <el-tooltip content="分享到 Twitter" placement="top">
                  <el-button circle @click="shareTo('twitter')">
                    <el-icon><Position /></el-icon>
                  </el-button>
                </el-tooltip>
              </el-button-group>
            </div>

            <div class="article-copyright">
              <p>本文作者：{{ article.author }}</p>
              <p>
                本文链接：<el-link type="primary">{{ articleLink }}</el-link>
              </p>
              <p>
                版权声明：本博客所有文章除特别声明外，均采用
                <el-link type="primary">CC BY-NC-SA 4.0</el-link> 许可协议。转载请注明来自
                AyunBlog！
              </p>
            </div>
          </footer>
        </el-card>

        <!-- Comments Section -->
        <el-card class="comments-card" shadow="never">
          <template #header>
            <div class="card-header">
              <span>评论 ({{ comments.length }})</span>
            </div>
          </template>
          <div class="comment-input">
            <el-input v-model="newComment" type="textarea" :rows="3" placeholder="说点什么吧..." />
            <div class="input-actions">
              <el-button type="primary" @click="submitComment">提交评论</el-button>
            </div>
          </div>
          <div class="comment-list">
            <div v-for="comment in comments" :key="comment.id" class="comment-item">
              <el-avatar :size="40" :src="comment.avatar" />
              <div class="comment-body">
                <div class="comment-header">
                  <span class="comment-user">{{ comment.user }}</span>
                  <span class="comment-time">{{ comment.time }}</span>
                </div>
                <div class="comment-text">{{ comment.text }}</div>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>

      <!-- Table of Contents (Sidebar) -->
      <el-col :xs="0" :sm="0" :md="6">
        <div class="sidebar-wrapper">
          <!-- Author Card -->
          <el-card class="author-card" shadow="never">
            <div class="author-header">
              <el-avatar :size="64" :src="article.authorAvatar" />
              <div class="author-info-text">
                <h3 class="author-name">{{ article.author }}</h3>
                <p class="author-title">前端开发工程师 / 博主</p>
              </div>
            </div>
            <p class="author-bio">
              专注于 Vue.js 和 TypeScript 领域，热衷于分享技术干货和开发心得。
            </p>
            <div class="author-stats">
              <div class="stat-item">
                <span class="label">文章</span>
                <span class="value">42</span>
              </div>
              <div class="stat-item">
                <span class="label">获赞</span>
                <span class="value">1.2k</span>
              </div>
            </div>
            <el-button type="primary" class="follow-btn" plain>关注作者</el-button>
          </el-card>
        </div>

        <div class="toc-sidebar">
          <el-card class="toc-card" shadow="never">
            <template #header>
              <div class="card-header">
                <span>文章目录</span>
              </div>
            </template>
            <div class="toc-content">
              <p class="toc-item active">1. 项目背景</p>
              <p class="toc-item">2. 技术栈选型</p>
              <p class="toc-item sub">2.1 前端框架</p>
              <p class="toc-item sub">2.2 状态管理</p>
              <p class="toc-item">3. 核心功能实现</p>
              <p class="toc-item">4. 总结</p>
            </div>
          </el-card>
        </div>
      </el-col>
    </el-row>

    <!-- WeChat QR Code Dialog -->
    <el-dialog v-model="wechatDialogVisible" title="微信扫码分享" width="200px" center>
      <div class="wechat-qr">
        <el-image
          src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://github.com/AyunBlog"
        />
        <p>微信扫一扫，分享文章</p>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { MdPreview } from 'md-editor-v3'
import { useSEO } from '../../utils/seo'

const route = useRoute()
const router = useRouter()
const { updateMeta } = useSEO()

const isAdmin = ref(true) // Mock
const canEdit = ref(true) // Mock
const wechatDialogVisible = ref(false)

const article = ref({
  id: route.params.id,
  title: '如何使用 Vue 3 + TypeScript 构建企业级博客',
  excerpt:
    '在这篇文章中，我们将探讨如何利用 Vue 3 的 Composition API 和 TypeScript 的强大类型 system 来构建一个可维护、高性能的博客系统。',
  date: '2026-04-20',
  author: 'Ayun',
  authorAvatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
  views: 1254,
  tags: ['Vue3', 'TypeScript', 'Web开发'],
  content: `
# 项目背景
在当前的前端开发生态中，Vue 3 和 TypeScript 已经成为了构建大型应用的首选。

## 技术栈选型
我们选择了以下技术栈：
- **Vue 3**: 响应式框架
- **TypeScript**: 静态类型检查
- **Vite**: 下一代构建工具

### 前端框架
Vue 3 的 Composition API 提供了更好的代码组织方式。

### 状态管理
Pinia 是 Vuex 的完美替代者。

## 核心功能实现
我们将重点讨论如何实现权限管理和文章编辑器。

## 总结
通过这一套技术栈，我们可以快速构建出一个高性能的博客系统。
  `,
})

onMounted(() => {
  updateMeta(article.value.title, article.value.excerpt, article.value.tags)
})

const articleLink = computed(() => window.location.href)

const newComment = ref('')
const comments = ref([
  {
    id: 1,
    user: '张三',
    avatar: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
    time: '2小时前',
    text: '写得太棒了，非常有参考价值！',
  },
  {
    id: 2,
    user: '李四',
    avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
    time: '5小时前',
    text: '想请教一下关于 Vite 插件开发的问题。',
  },
])

const handleEdit = () => {
  router.push(`/editor/${article.value.id}`)
}

const shareTo = (platform: string) => {
  const url = encodeURIComponent(window.location.href)
  const title = encodeURIComponent(article.value.title)

  let shareUrl = ''
  switch (platform) {
    case 'weibo':
      shareUrl = `http://service.weibo.com/share/share.php?url=${url}&title=${title}`
      window.open(shareUrl, '_blank')
      break
    case 'twitter':
      shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${title}`
      window.open(shareUrl, '_blank')
      break
    case 'wechat':
      wechatDialogVisible.value = true
      break
  }
}

const submitComment = () => {
  if (newComment.value.trim()) {
    comments.value.unshift({
      id: Date.now(),
      user: '当前用户',
      avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
      time: '刚刚',
      text: newComment.value,
    })
    newComment.value = ''
  }
}
</script>

<style scoped lang="scss">
@use '../../styles/variables.scss' as *;

.article-detail {
  padding-bottom: $spacing-xl;
}

.detail-card {
  border-radius: $border-radius-large;
  border: 1px solid $border-color;
  margin-bottom: $spacing-lg;

  .article-header {
    text-align: center;
    padding-bottom: $spacing-xl;
    border-bottom: 1px solid rgba($border-color, 0.5);
    margin-bottom: $spacing-xl;

    .article-title {
      font-size: 32px;
      font-weight: 800;
      margin-bottom: $spacing-lg;
      color: $text-primary;
    }

    .article-meta {
      display: flex;
      justify-content: center;
      gap: $spacing-lg;
      color: $text-secondary;
      font-size: 14px;
      margin-bottom: $spacing-md;

      .meta-item {
        display: flex;
        align-items: center;
        gap: 4px;
      }
    }

    .article-tags {
      display: flex;
      justify-content: center;
      gap: $spacing-sm;
    }
  }

  .article-content {
    padding: 0 $spacing-sm;
  }

  .article-footer {
    margin-top: $spacing-xl;
    padding-top: $spacing-lg;
    border-top: 1px dashed $border-color;

    .share-actions {
      display: flex;
      align-items: center;
      gap: $spacing-md;
      margin-bottom: $spacing-xl;

      .share-label {
        font-size: 14px;
        color: $text-secondary;
      }
    }

    .article-copyright {
      background-color: $bg-color;
      padding: $spacing-md;
      border-left: 4px solid $primary-color;
      font-size: 14px;
      color: $text-regular;
      p {
        margin: $spacing-xs 0;
      }
    }
  }
}

.comments-card {
  border-radius: $border-radius-large;
  border: 1px solid $border-color;

  .comment-input {
    margin-bottom: $spacing-xl;
    .input-actions {
      margin-top: $spacing-sm;
      display: flex;
      justify-content: flex-end;
    }
  }

  .comment-list {
    display: flex;
    flex-direction: column;
    gap: $spacing-lg;

    .comment-item {
      display: flex;
      gap: $spacing-md;

      .comment-body {
        flex: 1;
        .comment-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 4px;
          .comment-user {
            font-weight: 700;
            font-size: 14px;
          }
          .comment-time {
            font-size: 12px;
            color: $text-secondary;
          }
        }
        .comment-text {
          font-size: 14px;
          line-height: 1.6;
          color: $text-regular;
        }
      }
    }
  }
}

.sidebar-wrapper {
  display: flex;
  flex-direction: column;
  gap: $spacing-lg;
}

.author-card {
  border-radius: $border-radius-large;
  border: 1px solid $border-color;

  .author-header {
    display: flex;
    align-items: center;
    gap: $spacing-md;
    margin-bottom: $spacing-md;

    .author-info-text {
      .author-name {
        margin: 0;
        font-size: 18px;
        font-weight: 700;
      }
      .author-title {
        margin: 4px 0 0;
        font-size: 13px;
        color: $text-secondary;
      }
    }
  }

  .author-bio {
    font-size: 14px;
    color: $text-regular;
    line-height: 1.6;
    margin: 0 0 $spacing-md;
  }

  .author-stats {
    display: flex;
    gap: $spacing-xl;
    padding: $spacing-md 0;
    border-top: 1px solid rgba($border-color, 0.5);
    margin-bottom: $spacing-md;

    .stat-item {
      display: flex;
      flex-direction: column;
      .label {
        font-size: 12px;
        color: $text-secondary;
      }
      .value {
        font-weight: 700;
        font-size: 16px;
      }
    }
  }

  .follow-btn {
    width: 100%;
  }
}

.toc-sidebar {
  position: sticky;
  top: 84px;

  .toc-card {
    border-radius: $border-radius-large;
    border: 1px solid $border-color;

    .toc-content {
      .toc-item {
        font-size: 14px;
        padding: 8px 0;
        color: $text-regular;
        cursor: pointer;
        transition: all 0.3s;

        &:hover {
          color: $primary-color;
          padding-left: 4px;
        }

        &.active {
          color: $primary-color;
          font-weight: 700;
          border-left: 2px solid $primary-color;
          padding-left: 8px;
        }

        &.sub {
          padding-left: 16px;
          font-size: 13px;
          color: $text-secondary;
          &:hover {
            padding-left: 20px;
          }
        }
      }
    }
  }
}

.wechat-qr {
  text-align: center;
  p {
    font-size: 12px;
    color: $text-secondary;
    margin-top: $spacing-sm;
  }
}

@media (max-width: 768px) {
  .detail-card .article-header .article-title {
    font-size: 24px;
  }
  .main-col {
    offset: 0 !important;
  }
}
</style>
