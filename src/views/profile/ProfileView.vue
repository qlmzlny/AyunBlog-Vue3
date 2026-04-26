<template>
  <div class="profile-view">
    <el-row :gutter="24">
      <el-col :xs="24" :md="8">
        <el-card class="profile-card" shadow="never">
          <div class="user-info">
            <el-avatar :size="100" :src="user.avatar" />
            <h2 class="username">{{ user.username }}</h2>
            <p class="email">{{ user.email }}</p>
            <p class="bio">{{ user.bio || '这个博主很懒，什么都没写~' }}</p>
            <el-button type="primary" @click="editProfile">编辑资料</el-button>
          </div>
          <div class="user-stats">
            <div class="stat-item">
              <span class="value">42</span>
              <span class="label">文章</span>
            </div>
            <div class="stat-item">
              <span class="value">1.2k</span>
              <span class="label">获赞</span>
            </div>
            <div class="stat-item">
              <span class="value">560</span>
              <span class="label">粉丝</span>
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :xs="24" :md="16">
        <el-tabs v-model="activeTab" class="profile-tabs">
          <el-tab-pane label="我的文章" name="articles">
            <div class="article-list">
              <div v-for="article in myArticles" :key="article.id" class="my-article-item">
                <div class="article-main">
                  <h3 class="article-title" @click="$router.push(`/article/${article.id}`)">{{ article.title }}</h3>
                  <div class="article-meta">
                    <span>{{ article.date }}</span>
                    <el-divider direction="vertical" />
                    <span>{{ article.category }}</span>
                    <el-divider direction="vertical" />
                    <span>{{ article.views }} 阅读</span>
                  </div>
                </div>
                <div class="article-actions">
                  <el-button size="small" link @click="$router.push(`/editor/${article.id}`)">
                    <el-icon><Edit /></el-icon> 编辑
                  </el-button>
                  <el-button size="small" link type="danger" @click="handleDelete(article.id)">
                    <el-icon><Delete /></el-icon> 删除
                  </el-button>
                </div>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="收藏的文章" name="favorites">
            <div class="empty-state">
              <el-empty description="暂无收藏文章" />
            </div>
          </el-tab-pane>
          <el-tab-pane label="账号设置" name="settings">
            <el-form :model="settingsForm" label-position="top" class="settings-form">
              <el-form-item label="用户名">
                <el-input v-model="settingsForm.username" />
              </el-form-item>
              <el-form-item label="个人简介">
                <el-input v-model="settingsForm.bio" type="textarea" :rows="4" />
              </el-form-item>
              <el-form-item label="邮箱">
                <el-input v-model="settingsForm.email" disabled />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="saveSettings">保存更改</el-button>
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>
      </el-col>
    </el-row>

    <!-- Edit Profile Dialog -->
    <el-dialog v-model="editVisible" title="编辑资料" width="500px">
      <el-form :model="editForm" label-width="80px">
        <el-form-item label="头像">
          <el-upload
            class="avatar-uploader"
            action="#"
            :show-file-list="false"
          >
            <img v-if="editForm.avatar" :src="editForm.avatar" class="avatar-preview" />
            <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
          </el-upload>
        </el-form-item>
        <el-form-item label="用户名">
          <el-input v-model="editForm.username" />
        </el-form-item>
        <el-form-item label="个人简介">
          <el-input v-model="editForm.bio" type="textarea" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="editVisible = false">取消</el-button>
        <el-button type="primary" @click="saveProfile">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';

const user = reactive({
  username: 'Ayun',
  email: 'ayun@example.com',
  avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
  bio: 'Full-stack Developer & Blogger'
});

const activeTab = ref('articles');
const editVisible = ref(false);

const myArticles = ref([
  { id: 1, title: '如何使用 Vue 3 + TypeScript 构建企业级博客', date: '2026-04-20', category: 'Vue', views: 1254 },
  { id: 2, title: '深度解析 Vite 的插件机制', date: '2026-04-18', category: '前端工具', views: 856 },
  { id: 3, title: '2026 年前端开发趋势展望', date: '2026-04-15', category: '行业趋势', views: 2341 }
]);

const editForm = reactive({ ...user });
const settingsForm = reactive({ ...user });

const editProfile = () => {
  Object.assign(editForm, user);
  editVisible.value = true;
};

const saveProfile = () => {
  Object.assign(user, editForm);
  editVisible.value = false;
  ElMessage.success('个人资料已更新');
};

const saveSettings = () => {
  Object.assign(user, settingsForm);
  ElMessage.success('设置已保存');
};

const handleDelete = (id: number) => {
  ElMessageBox.confirm('确定要删除这篇文章吗？', '警告', {
    type: 'warning'
  }).then(() => {
    myArticles.value = myArticles.value.filter(a => a.id !== id);
    ElMessage.success('文章已删除');
  });
};
</script>

<style scoped lang="scss">
@use "../../styles/variables.scss" as *;

.profile-view {
  padding-bottom: $spacing-xl;
}

.profile-card {
  border-radius: $border-radius-large;
  border: 1px solid $border-color;
  text-align: center;
  padding: $spacing-lg 0;

  .user-info {
    margin-bottom: $spacing-xl;
    .username {
      margin: $spacing-md 0 $spacing-xs;
      font-size: 24px;
      font-weight: 700;
    }
    .email {
      color: $text-secondary;
      font-size: 14px;
      margin-bottom: $spacing-md;
    }
    .bio {
      color: $text-regular;
      font-size: 14px;
      margin-bottom: $spacing-lg;
      padding: 0 $spacing-lg;
    }
  }

  .user-stats {
    display: flex;
    justify-content: space-around;
    padding-top: $spacing-xl;
    border-top: 1px solid rgba($border-color, 0.5);

    .stat-item {
      display: flex;
      flex-direction: column;
      .value {
        font-weight: 700;
        font-size: 18px;
      }
      .label {
        font-size: 12px;
        color: $text-secondary;
      }
    }
  }
}

.profile-tabs {
  background-color: $white;
  border-radius: $border-radius-large;
  border: 1px solid $border-color;
  padding: $spacing-lg;
  min-height: 500px;
}

.my-article-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: $spacing-md 0;
  border-bottom: 1px solid rgba($border-color, 0.5);

  &:last-child {
    border-bottom: none;
  }

  .article-main {
    .article-title {
      margin: 0 0 $spacing-xs;
      font-size: 18px;
      cursor: pointer;
      transition: color 0.3s;
      &:hover {
        color: $primary-color;
      }
    }
    .article-meta {
      font-size: 13px;
      color: $text-secondary;
    }
  }

  .article-actions {
    display: flex;
    gap: $spacing-md;
  }
}

.settings-form {
  max-width: 500px;
  margin-top: $spacing-md;
}

.avatar-uploader {
  .avatar-preview {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    object-fit: cover;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 100px;
    height: 100px;
    line-height: 100px;
    text-align: center;
    border: 1px dashed #d9d9d9;
    border-radius: 50%;
  }
}
</style>
