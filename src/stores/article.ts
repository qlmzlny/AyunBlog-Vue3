import { defineStore } from 'pinia'
import { ref, reactive } from 'vue'
import type { Article, Category, Tag } from '@/api/types/article'
import { getArticleDetail } from '@/api/article'

export const useArticleStore = defineStore('article', () => {
  // 当前查看的文章详情
  const currentArticle = ref<Article | null>(null)
  const loading = ref(false)

  // --- 编辑器相关状态 ---
  const editArticle = reactive({
    id: null as number | null,
    title: '',
    content: '',
    cover: '' as string | null,
    categoryId: null as number | null,
    tags: [] as number[],
    excerpt: '',
    status: 'published' as 'draft' | 'published' | 'scheduled',
    publishTime: null as string | null,
  })

  // 待上传的本地图片对象 (Blob URL -> File)
  const localImages = ref<Map<string, File>>(new Map())
  // 封面图本地文件
  const localCover = ref<File | null>(null)

  /**
   * 获取文章详情用于查看
   */
  const fetchArticleDetail = async (id: number) => {
    loading.value = true
    try {
      const res = await getArticleDetail(id)
      if (res.code === 200) {
        currentArticle.value = res.data
      }
    } catch (error) {
      console.error('Failed to fetch article detail:', error)
    } finally {
      loading.value = false
    }
  }

  /**
   * 初始化编辑器数据（回显逻辑）
   */
  const initEditArticle = (article: Article) => {
    editArticle.id = article.id
    editArticle.title = article.title
    editArticle.content = article.content
    editArticle.cover = article.cover
    editArticle.categoryId = article.category?.id || null
    editArticle.tags = article.tags.map((t) => t.id)
    editArticle.excerpt = article.excerpt
    editArticle.status = 'published'

    // 清除之前的本地状态
    localImages.value.clear()
    localCover.value = null
  }

  /**
   * 重置编辑器状态
   */
  const resetEditArticle = () => {
    editArticle.id = null
    editArticle.title = ''
    editArticle.content = ''
    editArticle.cover = null
    editArticle.categoryId = null
    editArticle.tags = []
    editArticle.excerpt = ''
    editArticle.status = 'published'
    editArticle.publishTime = null

    localImages.value.clear()
    localCover.value = null
  }

  /**
   * 添加本地图片预览
   */
  const addLocalImage = (url: string, file: File) => {
    localImages.value.set(url, file)
  }

  /**
   * 设置本地封面预览
   */
  const setLocalCover = (file: File) => {
    localCover.value = file
  }

  const clearArticle = () => {
    currentArticle.value = null
  }

  return {
    currentArticle,
    loading,
    editArticle,
    localImages,
    localCover,
    fetchArticleDetail,
    initEditArticle,
    resetEditArticle,
    addLocalImage,
    setLocalCover,
    clearArticle,
  }
})
