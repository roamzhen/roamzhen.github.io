import { Link, Button, Navbar } from "@nextui-org/react";
import { useState, useEffect } from 'react';

// 获取当前页面路径的 hook
function useCurrentPath() {
  const [currentPath, setCurrentPath] = useState('/');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCurrentPath(window.location.pathname);
    }
  }, []);

  return currentPath;
}

const Tabbar = () => {
  const currentPath = useCurrentPath();
  
  return (
    <header className="header-tabbar bg-white border-b border-gray-200">
      <nav className="max-w-screen-lg mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <a href="/" className="block w-20 text-xl font-light hover:underline">
              Roam Ye
            </a>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/blog">
              <Button 
                variant="light" 
                className="text-gray-800 hover:text-gray-600"
              >
                BLOG
              </Button>
            </Link>
            <Link href="/labs">
              <Button 
                variant="light"
                className="text-gray-800 hover:text-gray-600"
              >
                LABS
              </Button>
            </Link>
            <Link href="/">
              <Button 
                variant="light"
                className="text-gray-800 hover:text-gray-600"
              >
                ABOUT
              </Button>
            </Link>
          </div>

          {/* 移动端菜单 */}
          <div className="md:hidden flex justify-center w-full">
            <select 
              className="absolute top-4 right-4 w-32 px-3 py-1.5 text-gray-800 border rounded-md focus:outline-none bg-white shadow-sm"
              value={currentPath}
              onChange={(e) => {
                window.location.href = e.target.value;
              }}
            >
              <option value="/blog">BLOG</option>
              <option value="/labs">LABS</option>
              <option value="/">ABOUT</option>
            </select>
          </div>
        </div>
      </nav>
    </header>
  )
}

export default Tabbar