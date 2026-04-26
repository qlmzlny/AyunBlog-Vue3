<template>
  <div class="category-view">
    <div class="page-header">
      <h1 class="page-title">全部分类</h1>
      <p class="page-subtitle">构建知识体系，探索技术边界</p>
    </div>

    <div class="category-container">
      <!-- Main Category Grid -->
      <div class="category-masonry">
        <div
          v-for="(cat, index) in categories"
          :key="cat.name"
          class="category-card"
          :class="'card-size-' + (index % 3)"
          @click="handleCategoryClick(cat.name)"
        >
          <div class="card-bg" :style="{ backgroundColor: cat.color }"></div>
          <div class="card-content">
            <div class="card-top">
              <el-icon class="cat-icon"><component :is="cat.icon" /></el-icon>
              <span class="cat-count">{{ cat.count }} 篇文章</span>
            </div>
            <h3 class="cat-name">{{ cat.name }}</h3>
            <p class="cat-desc">{{ cat.description }}</p>
            <div class="cat-footer">
              <span class="update-time">最近更新：{{ cat.lastUpdate }}</span>
              <el-button link class="view-btn"
                >查看详情 <el-icon><ArrowRight /></el-icon
              ></el-button>
            </div>
          </div>
        </div>
      </div>

      <!-- Tag Sidebar -->
      <div class="tag-section">
        <div class="section-header">
          <el-icon><PriceTag /></el-icon>
          <span>热门标签</span>
          <el-input
            v-model="tagSearch"
            placeholder="搜索标签..."
            size="small"
            class="tag-search"
            clearable
          />
        </div>
        <div class="tag-list">
          <el-tag
            v-for="tag in filteredTags"
            :key="tag.name"
            :type="getTagType(tag.count)"
            class="interactive-tag"
            effect="light"
            @click="handleTagClick(tag.name)"
          >
            {{ tag.name }}
            <span class="tag-count">{{ tag.count }}</span>
          </el-tag>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import {
  Monitor,
  Connection,
  Coffee,
  Cpu,
  DataAnalysis,
  ChatLineRound,
  Tools,
  Reading,
} from '@element-plus/icons-vue'

const router = useRouter()
const tagSearch = ref('')

const categories = ref([
  {
    name: 'Vue',
    count: 12,
    icon: Monitor,
    color: '#42b883',
    description: '深入探讨 Vue 3 全家桶、Composition API 及底层原理。',
    lastUpdate: '2026-04-20',
  },
  {
    name: 'Node.js',
    count: 15,
    icon: Connection,
    color: '#339933',
    description: '服务端 JavaScript 开发、Koa/NestJS 框架及系统架构。',
    lastUpdate: '2026-04-18',
  },
  {
    name: '前端工具',
    count: 6,
    icon: Tools,
    color: '#ff9800',
    description: 'Vite、Webpack、Docker 等现代开发工具链实践。',
    lastUpdate: '2026-04-10',
  },
  {
    name: '算法',
    count: 9,
    icon: Cpu,
    color: '#f44336',
    description: 'LeetCode 题解、经典数据结构与算法设计。',
    lastUpdate: '2026-04-05',
  },
  {
    name: '面试题',
    count: 20,
    icon: Reading,
    color: '#2196f3',
    description: '前端面试知识点汇总，助力斩获心仪 Offer。',
    lastUpdate: '2026-04-22',
  },
  {
    name: '行业趋势',
    count: 4,
    icon: DataAnalysis,
    color: '#9c27b0',
    description: '关注 AI、WebAssembly、跨端技术等前沿动态。',
    lastUpdate: '2026-04-15',
  },
  {
    name: '生活随笔',
    count: 5,
    icon: Coffee,
    color: '#795548',
    description: '程序员的日常生活感悟与非技术类分享。',
    lastUpdate: '2026-03-30',
  },
])

const tags = ref([
  { name: 'Vue3', count: 15 },
  { name: 'TypeScript', count: 22 },
  { name: 'Vite', count: 8 },
  { name: 'AI', count: 12 },
  { name: 'Nodejs', count: 18 },
  { name: 'CSS', count: 14 },
  { name: 'JavaScript', count: 30 },
  { name: 'Pinia', count: 7 },
  { name: 'Webpack', count: 9 },
  { name: 'Docker', count: 6 },
  { name: 'React', count: 11 },
  { name: 'Rust', count: 4 },
])

const filteredTags = computed(() => {
  if (!tagSearch.value) return tags.value
  return tags.value.filter((t) => t.name.toLowerCase().includes(tagSearch.value.toLowerCase()))
})

const getTagType = (count: number) => {
  if (count > 20) return 'danger'
  if (count > 15) return 'warning'
  if (count > 10) return 'success'
  return 'info'
}

const handleCategoryClick = (name: string) => {
  router.push({ name: 'Home', query: { category: name } })
}

const handleTagClick = (name: string) => {
  router.push({ name: 'Home', query: { tag: name } })
}
</script>

<style scoped lang="scss">
@use '../../styles/variables.scss' as *;

.category-view {
  padding-bottom: $spacing-xl * 2;
}

.page-header {
  text-align: center;
  margin-bottom: $spacing-xl * 3;
  .page-title {
    font-size: 42px;
    font-weight: 800;
    margin-bottom: $spacing-sm;
    background: linear-gradient(135deg, $primary-color, #67c23a);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  .page-subtitle {
    color: $text-secondary;
    font-size: 18px;
  }
}

.category-container {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: $spacing-xl * 2;

  @media (max-width: 992px) {
    grid-template-columns: 1fr;
  }
}

.category-masonry {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: $spacing-lg;
  align-items: start;
}

.category-card {
  position: relative;
  background: $white;
  border-radius: $border-radius-large;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
  border: 1px solid $border-color;
  display: flex;
  flex-direction: column;

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.1);
    border-color: transparent;

    .card-bg {
      opacity: 0.1;
      transform: scale(1.1);
    }
    .view-btn {
      color: $primary-color;
    }
  }

  &.card-size-0 {
    grid-row: span 1;
  }
  &.card-size-1 {
    grid-row: span 1;
  }
  &.card-size-2 {
    grid-row: span 1;
  }

  .card-bg {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    opacity: 0.05;
    transition: all 0.4s;
    z-index: 0;
  }

  .card-content {
    position: relative;
    padding: $spacing-lg;
    z-index: 1;
    flex: 1;
    display: flex;
    flex-direction: column;

    .card-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: $spacing-md;

      .cat-icon {
        font-size: 32px;
        padding: 10px;
        background: $white;
        border-radius: 12px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
      }
      .cat-count {
        font-size: 13px;
        font-weight: 600;
        color: $text-secondary;
      }
    }

    .cat-name {
      font-size: 22px;
      font-weight: 700;
      margin: 0 0 $spacing-sm;
      color: $text-primary;
    }

    .cat-desc {
      font-size: 14px;
      color: $text-regular;
      line-height: 1.6;
      margin: 0 0 $spacing-lg;
      flex: 1;
    }

    .cat-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: $spacing-md;
      border-top: 1px solid rgba($border-color, 0.5);

      .update-time {
        font-size: 12px;
        color: $text-placeholder;
      }

      .view-btn {
        padding: 0;
        font-size: 14px;
        transition: all 0.3s;
      }
    }
  }
}

.tag-section {
  background: $white;
  padding: $spacing-lg;
  border-radius: $border-radius-large;
  border: 1px solid $border-color;
  height: fit-content;
  position: sticky;
  top: 100px;

  .section-header {
    display: flex;
    align-items: center;
    gap: $spacing-sm;
    font-size: 18px;
    font-weight: 700;
    margin-bottom: $spacing-lg;
    flex-wrap: wrap;

    .el-icon {
      color: $primary-color;
    }

    .tag-search {
      margin-top: $spacing-sm;
      width: 100%;
    }
  }

  .tag-list {
    display: flex;
    flex-wrap: wrap;
    gap: $spacing-sm;

    .interactive-tag {
      cursor: pointer;
      transition: all 0.3s;
      border-radius: 8px;
      padding: 0 10px;
      height: 32px;
      line-height: 30px;

      &:hover {
        transform: scale(1.05);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      }

      .tag-count {
        margin-left: 4px;
        opacity: 0.6;
        font-size: 11px;
      }
    }
  }
}
</style>
