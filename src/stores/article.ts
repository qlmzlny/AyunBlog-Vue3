import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Article } from '@/api/types/article'
import { getArticleDetail } from '@/api/article'

export const useArticleStore = defineStore('article', () => {
  const currentArticle = ref<Article | null>(null)
  const loading = ref(false)

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

  const clearArticle = () => {
    currentArticle.value = null
  }

  return {
    currentArticle,
    loading,
    fetchArticleDetail,
    clearArticle,
  }
})
