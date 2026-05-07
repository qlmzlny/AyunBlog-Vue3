import request from '@/utils/request'
import type { Result } from './types/auth'
import type { Article, ArticleListParams, ArticleListResponse, Category, Tag } from './types/article'

/**
 * 获取文章列表
 * @param params 查询参数
 */
export function getArticles(params?: ArticleListParams) {
  return request.get<any, Result<ArticleListResponse>>('/articles', {
    params
  })
}

/**
 * 获取文章详情
 * @param id 文章ID
 */
export function getArticleDetail(id: number) {
  return request.get<any, Result<Article>>(`/articles/${id}`)
}

/**
 * 创建文章
 * @param data 文章数据
 */
export function createArticle(data: any) {
  return request.post<any, Result<Article>>('/articles', data)
}

/**
 * 更新文章
 * @param id 文章ID
 * @param data 文章数据
 */
export function updateArticle(id: number, data: any) {
  return request.put<any, Result<Article>>(`/articles/${id}`, data)
}

/**
 * 上传文章内容图片
 * @param file 图片文件
 */
export function uploadArticleImage(file: File) {
  const formData = new FormData()
  formData.append('file', file)
  return request.post<any, Result<string>>('/upload/article-image', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}

/**
 * 上传文章封面图片
 * @param file 图片文件
 */
export function uploadCoverImage(file: File) {
  const formData = new FormData()
  formData.append('file', file)
  return request.post<any, Result<string>>('/upload/cover-image', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}

/**
 * 获取所有分类
 */
export function getCategories() {
  return request.get<any, Result<Category[]>>('/categories')
}

/**
 * 获取所有标签
 */
export function getTags() {
  return request.get<any, Result<Tag[]>>('/tags')
}
