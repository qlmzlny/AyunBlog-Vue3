<script setup lang="ts">
import type { Article } from '@/api/types/article'
import { useRouter } from 'vue-router'
import { Calendar, View, Star, ChatLineRound, User } from '@element-plus/icons-vue'
import dayjs from 'dayjs'

const props = defineProps<{
  article: Article
}>()

const router = useRouter()

const goToDetail = () => {
  router.push(`/article/${props.article.id}`)
}

const formatDate = (date: string) => {
  return dayjs(date).format('YYYY-MM-DD HH:mm')
}
</script>

<template>
  <el-card class="article-card" shadow="hover" @click="goToDetail">
    <div class="article-content">
      <div class="article-info">
        <h2 class="title">
          <el-tag v-if="article.isTop" size="small" type="danger" effect="dark" class="top-tag"
            >置顶</el-tag
          >
          {{ article.title }}
        </h2>
        <p class="excerpt">{{ article.excerpt }}</p>

        <div class="meta">
          <div class="meta-left">
            <span class="author">
              <el-avatar :size="20" :src="article.author.avatar">
                <el-icon><User /></el-icon>
              </el-avatar>
              {{ article.author.username }}
            </span>
            <span class="date">
              <el-icon><Calendar /></el-icon>
              {{ formatDate(article.publishedAt) }}
            </span>
            <span v-if="article.category?.name" class="category">
              <el-tag size="small">{{ article.category.name }}</el-tag>
            </span>
            <div v-if="article.tags && article.tags.length > 0" class="tags">
              <el-tag
                v-for="tag in article.tags"
                :key="tag.id"
                size="small"
                type="info"
                effect="plain"
                class="tag"
              >
                {{ tag.name }}
              </el-tag>
            </div>
          </div>
          <div class="meta-right">
            <span class="stat">
              <el-icon><View /></el-icon>
              {{ article.views }}
            </span>
            <span class="stat">
              <el-icon><Star /></el-icon>
              {{ article.likes }}
            </span>
            <span class="stat">
              <el-icon><ChatLineRound /></el-icon>
              {{ article.comments }}
            </span>
          </div>
        </div>
      </div>
      <div v-if="article.cover" class="article-cover">
        <el-image :src="article.cover" fit="cover" />
      </div>
    </div>
  </el-card>
</template>

<style scoped lang="scss">
.article-card {
  margin-bottom: 20px;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    transform: translateY(-2px);
  }

  .article-content {
    display: flex;
    gap: 20px;

    .article-cover {
      width: 200px;
      height: 120px;
      flex-shrink: 0;
      border-radius: 4px;
      overflow: hidden;

      .el-image {
        width: 100%;
        height: 100%;
        transition: transform 0.5s;
      }
    }
    &:hover .article-cover .el-image {
      transform: scale(1.1);
    }

    .article-info {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;

      .title {
        margin: 0 0 10px 0;
        font-size: 18px;
        color: var(--el-text-color-primary);
        display: flex;
        align-items: center;
        gap: 8px;

        &:hover {
          color: var(--el-color-primary);
        }
      }

      .excerpt {
        font-size: 14px;
        color: var(--el-text-color-regular);
        margin: 0 0 15px 0;
        line-height: 1.6;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }

      .meta {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 13px;
        color: var(--el-text-color-secondary);

        .meta-left,
        .meta-right {
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .author {
          display: flex;
          align-items: center;
          gap: 5px;
        }

        .tags {
          display: flex;
          gap: 5px;
          flex-wrap: wrap;
        }

        .date,
        .stat {
          display: flex;
          align-items: center;
          gap: 4px;
        }
      }
    }
  }
}

@media (max-width: 768px) {
  .article-content {
    flex-direction: column;

    .article-cover {
      width: 100% !important;
      height: 180px !important;
    }
  }
}
</style>
