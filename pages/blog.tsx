import type { NextPage } from 'next';
import Head from 'next/head'
import React, { useRef, useState, useEffect } from 'react'
import Link from 'next/link'

// Components
import Tabbar from '../components/tabbar';
import Footer from '../components/footer';

// Blog
import { getAllPosts } from '../lib/api'
import Post from '../interfaces/post'

type Props = {
  allPosts: Post[]
}

// Blog infos
export const getStaticProps = async () => {
  const allPosts = getAllPosts([
    'title',
    'date',
    'slug',
    'author',
    'excerpt',
    'hide',
  ])

  return {
    props: { allPosts },
  }
}

// Hook
function useWindowSize() {
  const [windowSize, setWindowSize] = useState({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const resizeHandler = () => {
        setWindowSize({
          width: window.innerWidth,
          height: window.innerHeight,
        });
      };
      // Add event listener
      window.addEventListener("resize", resizeHandler);
      
      console.log(window.location.pathname)

      resizeHandler();
    
      // Remove event listener on cleanup
      return () => window.removeEventListener("resize", resizeHandler);
    }
  }, []); // Empty array ensures that effect is only run on mount
  return windowSize;
}

// Blog
const Blog: NextPage<Props> = ({ allPosts }) => {
  const windowSize = useWindowSize();
  return (
    <>
      <Head>
        <title>Roam's Blog</title>
        <meta name="description" content="Roamzhen's Blog Generated by Next" />
      </Head>

      {/* 顶部导航栏 */}
      <Tabbar />

      {/* 正文区域 */}
      <div className='container max-w-screen-lg mx-auto px-4 py-10'>
        <div className='grid gap-8'>
          {allPosts.map((post) => (
            !post.hide && (
              <article key={post.slug} className="border-b pb-8">
                <Link href={`/posts/${post.slug}`}>
                  <h2 className="text-2xl font-bold mb-2 hover:text-blue-600 transition-colors">
                  {post.title}
                </h2>
              </Link>
              <div className="text-gray-600 mb-4">
                <time>{post.date}</time>
                {post.author && (
                  <span className="ml-4">By {post.author.name}</span>
                )}
              </div>
              {post.excerpt && (
                <p className="text-gray-700 leading-relaxed">
                  {post.excerpt}
                </p>
              )}
              </article>
            )
          ))}
        </div>
      </div>

      {/* 底部导航栏 */}
      <Footer />
    </>
  );
};

export default Blog
