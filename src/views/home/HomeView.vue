<template>
  <div class="home-view">
    <el-row :gutter="24">
      <!-- Main Content -->
      <el-col :xs="24" :sm="24" :md="17">
        <div v-loading="loading" class="article-list">
          <!-- Filter Header -->
          <div v-if="filterInfo" class="filter-header">
            <div class="filter-text">
              <span class="filter-label">{{ filterInfo.type }}：</span>
              <span class="filter-value">{{ filterInfo.value }}</span>
              <span class="result-count">共找到 {{ total }} 篇相关文章</span>
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

          <div v-if="articles.length > 0">
            <ArticleCard v-for="article in articles" :key="article.id" :article="article" />

            <div class="pagination">
              <el-pagination
                v-model:current-page="currentPage"
                v-model:page-size="pageSize"
                :page-sizes="[5, 10, 15, 20]"
                layout="total, sizes, prev, pager, next"
                :total="total"
                @current-change="handlePageChange"
                @size-change="handlePageSizeChange"
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
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { getArticles } from '@/api/article'
import type { Article } from '@/api/types/article'
import ArticleCard from '@/components/ArticleCard.vue'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const currentPage = ref(1)
const pageSize = ref(5)
const total = ref(0)
const articles = ref<Article[]>([])
const loading = ref(false)
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

const fetchArticles = async () => {
  loading.value = true
  try {
    const params: any = {
      page: currentPage.value,
      pageSize: pageSize.value,
      keyword: route.query.q as string,
      categoryId: route.query.categoryId,
      tagId: route.query.tagId,
    }
    const { data } = await getArticles(params)
    articles.value = data.list
    total.value = data.total
  } catch (error) {
    console.error('Failed to fetch articles:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchArticles()
})

watch(
  () => [route.query, currentPage.value],
  () => {
    fetchArticles()
  },
)

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
  currentPage.value = page
}

const handlePageSizeChange = (size: number) => {
  pageSize.value = size
  currentPage.value = 1
  fetchArticles()
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
  padding: $spacing-xs;
  margin-bottom: $spacing-md;
  display: flex;
  gap: $spacing-xs;
  cursor: pointer;
  transition:
    transform 0.3s,
    box-shadow 0.3s;
  border: 1px solid $border-color;
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
