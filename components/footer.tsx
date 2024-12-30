type Props = {
  content: string
}

const Footer = () => {
  return (
    <footer className="bg-gray-100">
      <div className="max-w-screen-lg mx-auto px-4 py-10 font-serif">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-gray-600">© 2024 Roam's Blog. All rights reserved.</p>
          </div>

          <div className="flex items-center space-x-6">
            <a href="https://github.com/roamzhen" className="text-gray-600 hover:text-gray-800 transition-colors duration-200">
              GitHub
            </a>
            <a href="mailto:roamzhen@gmail.com" className="text-gray-600 hover:text-gray-800 transition-colors duration-200">
              Email
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer