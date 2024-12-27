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
      <div className='blog-post max-w-4xl px-10 mx-auto'>
          <div>
            <p className='text-3xl font-mediun text-black'>{post.title}</p>
            <p className='text-xl mt-2'>
              <span className='inline-block w-8 h-8 bg-contain align-middle' style={{backgroundImage: `url(${post.author.picture})`}}></span>
              <span className='inline-block align-middle ml-2'>{post.author.name}</span>
              <span className='inline-block font-thin align-middle ml-2'>{post.date}</span>
            </p>
          </div>
          <PostBody content={post.content} />
      </div>

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
