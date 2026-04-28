<template>
  <div class="home-view">
    <el-row :gutter="24">
      <!-- Main Content -->
      <el-col :xs="24" :sm="24" :md="17">
        <div class="article-list">
          <!-- Filter Header -->
          <div v-if="filterInfo" class="filter-header">
            <div class="filter-text">
              <span class="filter-label">{{ filterInfo.type }}：</span>
              <span class="filter-value">{{ filterInfo.value }}</span>
              <span class="result-count">共找到 {{ filteredArticles.length }} 篇相关文章</span>
            </div>
            <div class="filter-actions">
              <el-select
                v-model="sortBy"
                placeholder="排序方式"
                size="small"
                style="width: 120px; margin-right: 15px"
              >
                <el-option label="最新发布" value="latest" />
                <el-option label="最多阅读" value="views" />
              </el-select>
              <el-button link type="primary" @click="clearFilter">
                清除筛选 <el-icon class="el-icon--right"><Close /></el-icon>
              </el-button>
            </div>
          </div>

          <div v-if="filteredArticles.length > 0">
            <div
              v-for="article in filteredArticles"
              :key="article.id"
              class="article-card"
              @click="goToDetail(article.id)"
            >
              <div class="article-info">
                <h2 class="article-title">{{ article.title }}</h2>
                <p class="article-excerpt">{{ article.excerpt }}</p>
                <div class="article-meta">
                  <span class="meta-item">
                    <el-icon><Calendar /></el-icon> {{ article.date }}
                  </span>
                  <span class="meta-item">
                    <el-icon><User /></el-icon> {{ article.author }}
                  </span>
                  <span class="meta-item">
                    <el-icon><Folder /></el-icon> {{ article.category }}
                  </span>
                  <div class="tags">
                    <el-tag
                      v-for="tag in article.tags"
                      :key="tag"
                      size="small"
                      effect="plain"
                      class="tag"
                    >
                      {{ tag }}
                    </el-tag>
                  </div>
                </div>
              </div>
              <div v-if="article.cover" class="article-cover">
                <el-image :src="article.cover" fit="cover" />
              </div>
            </div>

            <div class="pagination">
              <el-pagination
                v-model:current-page="currentPage"
                :page-size="10"
                layout="prev, pager, next"
                :total="50"
                @current-change="handlePageChange"
              />
            </div>
          </div>
          <el-empty v-else description="未找到相关内容" :image-size="200" class="empty-results">
            <el-button type="primary" @click="clearFilter">查看全部文章</el-button>
          </el-empty>
        </div>
      </el-col>

      <!-- Sidebar -->
      <el-col :xs="0" :sm="0" :md="7">
        <div class="sidebar">
          <!-- Profile Card -->
          <el-card class="sidebar-card profile-card" shadow="never">
            <template v-if="isLoggedIn">
              <div class="profile-header">
                <el-avatar
                  :size="64"
                  src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
                />
                <h3>{{ userStore.userInfo?.username || 'Ayun' }}</h3>
                <p>Full-stack Developer & Blogger</p>
              </div>
              <div class="profile-stats">
                <div class="stat-item">
                  <span class="count">42</span>
                  <span class="label">文章</span>
                </div>
                <div class="stat-item">
                  <span class="count">1.2k</span>
                  <span class="label">获赞</span>
                </div>
                <div class="stat-item">
                  <span class="count">560</span>
                  <span class="label">粉丝</span>
                </div>
              </div>
              <el-button type="primary" class="action-btn" plain @click="$router.push('/profile')"
                >进入主页</el-button
              >
            </template>
            <template v-else>
              <div class="login-prompt">
                <el-icon class="prompt-icon"><UserFilled /></el-icon>
                <h3>欢迎来到 AyunBlog</h3>
                <p>登录后可发表评论、收藏文章和管理个人内容</p>
                <div class="prompt-actions">
                  <el-button type="primary" @click="$router.push('/login')">立即登录</el-button>
                  <el-button @click="$router.push('/register')">注册账号</el-button>
                </div>
              </div>
            </template>
          </el-card>

          <!-- Popular Articles -->
          <el-card class="sidebar-card popular-card" shadow="never">
            <template #header>
              <div class="card-header">
                <el-icon><TrendCharts /></el-icon>
                <span>热门文章</span>
              </div>
            </template>
            <div class="popular-list">
              <div
                v-for="(item, index) in popularArticles"
                :key="index"
                class="popular-item"
                @click="goToDetail(item.id)"
              >
                <span class="rank" :class="{ 'top-three': index < 3 }">{{ index + 1 }}</span>
                <span class="title">{{ item.title }}</span>
              </div>
            </div>
          </el-card>

          <!-- Site Stats (New Placeholder) -->
          <el-card class="sidebar-card stats-card" shadow="never">
            <template #header>
              <div class="card-header">
                <el-icon><DataLine /></el-icon>
                <span>全站统计</span>
              </div>
            </template>
            <div class="stats-grid">
              <div class="stats-item">
                <span class="label">文章总数</span>
                <span class="value">128</span>
              </div>
              <div class="stats-item">
                <span class="label">运行天数</span>
                <span class="value">452</span>
              </div>
              <div class="stats-item">
                <span class="label">访问总量</span>
                <span class="value">12.5k</span>
              </div>
            </div>
          </el-card>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const currentPage = ref(1)
const isLoggedIn = computed(() => !!userStore.token)
const sortBy = ref('latest')

const filterInfo = computed(() => {
  if (route.query.q) return { type: '搜索', value: route.query.q as string }
  if (route.query.category) return { type: '分类', value: route.query.category as string }
  if (route.query.tag) return { type: '标签', value: route.query.tag as string }
  return null
})

const clearFilter = () => {
  router.push({ name: 'Home' })
}

const articles = ref([
  {
    id: 1,
    title: '如何使用 Vue 3 + TypeScript 构建企业级博客',
    excerpt:
      '在这篇文章中，我们将探讨如何利用 Vue 3 的 Composition API 和 TypeScript 的强大类型系统来构建一个可维护、高性能的博客系统...',
    date: '2026-04-20',
    author: 'Ayun',
    category: 'Vue',
    views: 1254,
    tags: ['Vue3', 'TypeScript'],
    cover: 'https://picsum.photos/seed/vue/400/250',
  },
  {
    id: 2,
    title: '深度解析 Vite 的插件机制',
    excerpt:
      'Vite 的极速体验离不开其创新的插件机制。本文将带你深入源码，理解 Vite 是如何处理各种模块的...',
    date: '2026-04-18',
    author: 'Ayun',
    category: '前端工具',
    views: 856,
    tags: ['Vite', '构建工具'],
    cover: 'https://picsum.photos/seed/vite/400/250',
  },
  {
    id: 3,
    title: '2026 年前端开发趋势展望',
    excerpt: '从 AI 驱动的编程到 WebAssembly 的普及，前端开发正在经历一场前所未有的变革...',
    date: '2026-04-15',
    author: 'Ayun',
    category: '行业趋势',
    views: 2341,
    tags: ['AI', 'Wasm'],
    cover: 'https://picsum.photos/seed/future/400/250',
  },
])

const filteredArticles = computed(() => {
  let result = [...articles.value]

  // Apply filtering
  if (route.query.q) {
    const q = (route.query.q as string).toLowerCase()
    result = result.filter(
      (a) => a.title.toLowerCase().includes(q) || a.excerpt.toLowerCase().includes(q),
    )
  } else if (route.query.category) {
    result = result.filter((a) => a.category === route.query.category)
  } else if (route.query.tag) {
    result = result.filter((a) => a.tags.includes(route.query.tag as string))
  }

  // Apply sorting
  if (sortBy.value === 'views') {
    result.sort((a, b: any) => b.views - a.views)
  } else {
    // latest by default (mock date sorting)
    result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }

  return result
})

const popularArticles = ref([
  { id: 1, title: '2026 年前端开发趋势展望' },
  { id: 2, title: 'Vue 3.5 新特性深度解析' },
  { id: 3, title: '如何优化 Web 应用的 LCP 指标' },
  { id: 4, title: 'TypeScript 5.4 实战技巧' },
  { id: 5, title: 'Node.js 事件循环详解' },
])

const goToDetail = (id: number) => {
  router.push(`/article/${id}`)
}

const handlePageChange = (page: number) => {
  console.log('Page changed to:', page)
}
</script>

<style scoped lang="scss">
@use '../../styles/variables.scss' as *;

.home-view {
  padding-bottom: $spacing-xl;
}

.article-list {
  display: flex;
  flex-direction: column;
  gap: $spacing-lg;

  .filter-header {
    background: $white;
    padding: $spacing-md $spacing-lg;
    border-radius: $border-radius-large;
    border: 1px solid $border-color;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: $spacing-sm;

    .filter-text {
      display: flex;
      align-items: center;
      gap: $spacing-xs;

      .filter-label {
        color: $text-secondary;
        font-size: 14px;
      }
      .filter-value {
        font-weight: 700;
        font-size: 18px;
        color: $primary-color;
        margin-right: $spacing-md;
      }
      .result-count {
        font-size: 13px;
        color: $text-placeholder;
      }
    }

    .filter-actions {
      display: flex;
      align-items: center;
    }
  }

  .empty-results {
    background: $white;
    border-radius: $border-radius-large;
    padding: $spacing-xl * 2 0;
    margin-top: $spacing-lg;
  }
}

.article-card {
  background-color: $white;
  border-radius: $border-radius-large;
  padding: $spacing-lg;
  margin-bottom: $spacing-md;
  display: flex;
  gap: $spacing-lg;
  cursor: pointer;
  transition:
    transform 0.3s,
    box-shadow 0.3s;
  border: 1px solid $border-color;

  &:hover {
    transform: translateY(-4px);
    box-shadow: $box-shadow;
    border-color: rgba($primary-color, 0.2);

    .article-title {
      color: $primary-color;
    }
  }

  .article-info {
    flex: 1;

    .article-title {
      margin: 0 0 $spacing-sm;
      font-size: 22px;
      font-weight: 700;
      line-height: 1.4;
      color: $text-primary;
      transition: color 0.3s;
    }

    .article-excerpt {
      color: $text-regular;
      font-size: 15px;
      line-height: 1.6;
      margin-bottom: $spacing-md;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .article-meta {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: $spacing-md;
      font-size: 13px;
      color: $text-secondary;

      .meta-item {
        display: flex;
        align-items: center;
        gap: 4px;
      }

      .tags {
        display: flex;
        gap: $spacing-sm;
        margin-left: auto;
      }
    }
  }

  .article-cover {
    width: 200px;
    height: 125px;
    border-radius: $border-radius-base;
    overflow: hidden;
    flex-shrink: 0;

    .el-image {
      width: 100%;
      height: 100%;
      transition: transform 0.5s;
    }
  }

  &:hover .article-cover .el-image {
    transform: scale(1.1);
  }
}

.sidebar {
  display: flex;
  flex-direction: column;
  gap: $spacing-lg;
}

.sidebar-card {
  border-radius: $border-radius-large;
  border: 1px solid $border-color;

  .card-header {
    display: flex;
    align-items: center;
    gap: $spacing-sm;
    font-weight: 700;
    .el-icon {
      color: $primary-color;
    }
  }
}

.profile-card {
  text-align: center;
  .profile-header {
    margin-bottom: $spacing-lg;
    h3 {
      margin: $spacing-sm 0 4px;
      font-size: 18px;
    }
    p {
      font-size: 13px;
      color: $text-secondary;
      margin: 0;
    }
  }
  .profile-stats {
    display: flex;
    justify-content: space-around;
    margin-bottom: $spacing-lg;
    .stat-item {
      display: flex;
      flex-direction: column;
      .count {
        font-weight: 700;
        font-size: 16px;
      }
      .label {
        font-size: 12px;
        color: $text-secondary;
      }
    }
  }
  .action-btn {
    width: 100%;
  }
}

.login-prompt {
  padding: $spacing-md 0;
  .prompt-icon {
    font-size: 40px;
    color: $text-placeholder;
    margin-bottom: $spacing-sm;
  }
  h3 {
    margin: 0 0 $spacing-xs;
    font-size: 16px;
  }
  p {
    font-size: 13px;
    color: $text-secondary;
    margin-bottom: $spacing-lg;
  }
  .prompt-actions {
    display: flex;
    flex-direction: column;
    gap: $spacing-sm;
    .el-button {
      margin: 0;
    }
  }
}

.popular-list {
  display: flex;
  flex-direction: column;
  gap: $spacing-md;
  .popular-item {
    display: flex;
    align-items: center;
    gap: $spacing-md;
    cursor: pointer;
    &:hover .title {
      color: $primary-color;
    }
    .rank {
      font-size: 14px;
      font-weight: 700;
      color: $text-placeholder;
      width: 20px;
      &.top-three {
        color: $primary-color;
        font-style: italic;
      }
    }
    .title {
      font-size: 14px;
      color: $text-regular;
      transition: color 0.3s;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
}

.stats-grid {
  display: flex;
  flex-direction: column;
  gap: $spacing-sm;
  .stats-item {
    display: flex;
    justify-content: space-between;
    font-size: 13px;
    .label {
      color: $text-secondary;
    }
    .value {
      font-weight: 600;
      color: $text-regular;
    }
  }
}

.pagination {
  margin-top: $spacing-xl;
  display: flex;
  justify-content: center;
}
</style>
