import { useRouter } from 'next/router'
import Head from 'next/head'
import ErrorPage from 'next/error'
import { getPostBySlug, getAllPosts } from '../../lib/api'
import { CMS_NAME } from '../../lib/constants'
import markdownToHtml from '../../lib/markdownToHtml'
import type PostType from '../../interfaces/post'
import PostBody from "../../components/post/post-body";

// Components
import Tabbar from '../../components/tabbar';
import Footer from '../../components/footer';

type Props = {
  post: PostType
  morePosts: PostType[]
  preview?: boolean
}

export default function Post({ post, morePosts, preview }: Props) {
  const router = useRouter()
  if (!router.isFallback && !post?.slug) {
    return <ErrorPage statusCode={404} />
  }
  return (
    <>
      <Head>
        <title>{post.title}</title>
        <meta name="description" content={post.title} />
      </Head>

      {/* 顶部导航栏 */}
      <Tabbar />

      {/* 正文区域 */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl mb-6">
            {post.title}
          </h1>
          <div className="flex items-center justify-center space-x-4 text-gray-600">
            <div className="flex items-center">
              <img 
                src={post.author.picture} 
                alt={post.author.name}
                className="w-10 h-10 rounded-full object-cover"
              />
              <span className="ml-2 font-medium">{post.author.name}</span>
            </div>
            <span className="text-gray-300">|</span>
            <time className="font-light">{post.date}</time>
          </div>
        </header>

        <div className="prose prose-lg prose-indigo mx-auto">
          <PostBody content={post.content} />
        </div>
      </article>

      {/* 底部导航栏 */}
      <Footer />
    </>
  )
}

type Params = {
  params: {
    slug: string
  }
}

export async function getStaticProps({ params }: Params) {
  const post = getPostBySlug(params.slug, [
    'title',
    'date',
    'slug',
    'author',
    'content',
  ])
  const content = await markdownToHtml(post.content || '')

  return {
    props: {
      post: {
        ...post,
        content,
      },
    },
  }
}

export async function getStaticPaths() {
  const posts = getAllPosts(['slug'])

  return {
    paths: posts.map((post) => {
      return {
        params: {
          slug: post.slug,
        },
      }
    }),
    fallback: false,
  }
}
