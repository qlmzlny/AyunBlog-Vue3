<template>
  <div class="drafts-view">
    <div class="page-header">
      <div class="header-left">
        <h1 class="page-title">草稿箱</h1>
        <p class="page-subtitle">继续你的创作之旅，共有 {{ drafts.length }} 篇草稿</p>
      </div>
      <el-button type="primary" @click="$router.push('/editor')">
        <el-icon><Plus /></el-icon> 新建文章
      </el-button>
    </div>

    <div v-if="drafts.length > 0" class="draft-list">
      <el-card v-for="draft in drafts" :key="draft.id" class="draft-card" shadow="hover">
        <div class="draft-content">
          <div class="draft-main">
            <h3 class="draft-title" @click="editDraft(draft.id)">{{ draft.title || '无标题草稿' }}</h3>
            <div class="draft-meta">
              <span class="meta-item">
                <el-icon><Calendar /></el-icon> 最后修改：{{ draft.updateTime }}
              </span>
              <el-divider direction="vertical" />
              <span class="meta-item">
                <el-icon><Folder /></el-icon> {{ draft.category || '未分类' }}
              </span>
            </div>
          </div>
          <div class="draft-actions">
            <el-button link type="primary" @click="editDraft(draft.id)">
              <el-icon><Edit /></el-icon> 编辑
            </el-button>
            <el-button link type="danger" @click="confirmDelete(draft.id)">
              <el-icon><Delete /></el-icon> 删除
            </el-button>
          </div>
        </div>
      </el-card>
    </div>

    <el-empty v-else description="草稿箱空空如也" :image-size="200">
      <el-button type="primary" @click="$router.push('/editor')">去写文章</el-button>
    </el-empty>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage, ElMessageBox } from 'element-plus';

const router = useRouter();

const drafts = ref([
  {
    id: 101,
    title: '深度解析 React Server Components',
    updateTime: '2026-04-25 14:30',
    category: 'React'
  },
  {
    id: 102,
    title: 'CSS Container Queries 实战指南',
    updateTime: '2026-04-24 09:15',
    category: 'CSS'
  },
  {
    id: 103,
    title: '',
    updateTime: '2026-04-22 22:10',
    category: '前端工具'
  }
]);

const editDraft = (id: number) => {
  router.push(`/editor/${id}`);
};

const confirmDelete = (id: number) => {
  ElMessageBox.confirm('确定要删除这篇草稿吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    drafts.value = drafts.value.filter(d => d.id !== id);
    ElMessage.success('草稿已删除');
  });
};
</script>

<style scoped lang="scss">
@use "../../styles/variables.scss" as *;

.drafts-view {
  padding-bottom: $spacing-xl;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: $spacing-xl * 2;

  .page-title {
    font-size: 32px;
    font-weight: 800;
    margin: 0 0 $spacing-xs;
  }
  .page-subtitle {
    color: $text-secondary;
    font-size: 14px;
    margin: 0;
  }
}

.draft-list {
  display: flex;
  flex-direction: column;
  gap: $spacing-md;
}

.draft-card {
  border-radius: $border-radius-large;
  border: 1px solid $border-color;
  transition: all 0.3s;

  &:hover {
    border-color: $primary-color;
    .draft-title {
      color: $primary-color;
    }
  }

  .draft-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .draft-main {
    .draft-title {
      font-size: 18px;
      font-weight: 600;
      margin: 0 0 $spacing-sm;
      cursor: pointer;
      transition: color 0.3s;
    }
    .draft-meta {
      font-size: 13px;
      color: $text-secondary;
      display: flex;
      align-items: center;
      gap: 4px;

      .meta-item {
        display: flex;
        align-items: center;
        gap: 4px;
      }
    }
  }

  .draft-actions {
    display: flex;
    gap: $spacing-md;
  }
}
</style>
