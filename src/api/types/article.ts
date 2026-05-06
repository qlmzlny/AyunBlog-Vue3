export interface Author {
  id: number;
  username: string;
  avatar: string | null;
}

export interface Category {
  id: number;
  name: string | null;
}

export interface Tag {
  id: number;
  name: string;
}

export interface Article {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  cover: string | null;
  publishedAt: string;
  author: Author;
  category: Category;
  tags: Tag[];
  views: number;
  likes: number;
  comments: number;
  isTop: number;
}

export interface ArticleListParams {
  page?: number;
  pageSize?: number;
  categoryId?: number;
  tagId?: number;
  keyword?: string;
}

export interface ArticleListResponse {
  total: number;
  page: number;
  pageSize: number;
  list: Article[];
}
