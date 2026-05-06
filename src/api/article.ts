import request from '@/utils/request'
import type { Result } from './types/auth'
import type { Article, ArticleListParams, ArticleListResponse } from './types/article'

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
