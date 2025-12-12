
import Layout from '../components/common/Layout';
import { Link } from 'react-router-dom';

const Blog = () => {
  const blogPosts = [
    {
      id: 1,
      title: "How NGOs Are Transforming Rural Education in India",
      excerpt: "Discover how grassroots organizations are bridging the educational gap in rural communities through innovative approaches and dedicated volunteers.",
      imageUrl: "https://images.unsplash.com/photo-1518124880723-b6aaadc9926c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      author: "Priya Sharma",
      date: "June 15, 2025",
      category: "Education"
    },
    {
      id: 2,
      title: "The Impact of Microfinance on Women Entrepreneurs",
      excerpt: "Exploring how small loans are enabling women in underserved communities to start businesses and achieve financial independence.",
      imageUrl: "https://images.unsplash.com/photo-1556484687-30636164638b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      author: "Rajat Kumar",
      date: "June 10, 2025",
      category: "Microfinance"
    },
    {
      id: 3,
      title: "Clean Water Initiatives Making a Difference in Rural India",
      excerpt: "Learn about innovative projects bringing clean water to villages and the impact on health and quality of life.",
      imageUrl: "https://images.unsplash.com/photo-1541252260730-0412e8e2108e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      author: "Ananya Patel",
      date: "June 5, 2025",
      category: "Water & Sanitation"
    },
    {
      id: 4,
      title: "Sustainable Farming Practices: NGO Success Stories",
      excerpt: "Highlighting how organizations are helping farmers adopt sustainable methods while improving yields and livelihoods.",
      imageUrl: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      author: "Vikram Singh",
      date: "May 28, 2025",
      category: "Agriculture"
    },
    {
      id: 5,
      title: "Corporate Social Responsibility: Beyond Token Philanthropy",
      excerpt: "An analysis of how companies are moving beyond performative giving to create meaningful social impact through strategic CSR.",
      imageUrl: "https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      author: "Neha Kapoor",
      date: "May 20, 2025",
      category: "Corporate Giving"
    },
    {
      id: 6,
      title: "Mental Health Support in Underserved Communities",
      excerpt: "How grassroots organizations are addressing the mental health crisis in areas with limited access to professional care.",
      imageUrl: "https://images.unsplash.com/photo-1576678927484-cc907957088c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      author: "Dr. Meera Desai",
      date: "May 15, 2025",
      category: "Healthcare"
    }
  ];

  const categories = [
    "Education",
    "Healthcare",
    "Women Empowerment",
    "Environment",
    "Child Welfare",
    "Agriculture",
    "Microfinance",
    "Water & Sanitation",
    "Skill Development"
  ];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Main Content */}
          <div className="md:w-2/3">
            <h1 className="text-3xl font-bold mb-2">SevaDaan Blog</h1>
            <p className="text-gray-600 mb-8">Insights, stories, and updates from the world of social impact</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {blogPosts.map((post) => (
                <div key={post.id} className="bg-white rounded-lg overflow-hidden shadow-md transition-transform hover:shadow-lg hover:-translate-y-1">
                  <img 
                    src={post.imageUrl} 
                    alt={post.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-5">
                    <div className="flex items-center mb-3">
                      <span className="text-xs font-medium bg-blue-100 text-blue-800 rounded-full px-2.5 py-0.5">
                        {post.category}
                      </span>
                      <span className="text-xs text-gray-500 ml-2">{post.date}</span>
                    </div>
                    <h3 className="text-xl font-bold mb-2">{post.title}</h3>
                    <p className="text-gray-600 mb-4">{post.excerpt}</p>
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                        {post.author.charAt(0)}
                      </div>
                      <div className="ml-2">
                        <p className="text-sm font-medium">{post.author}</p>
                      </div>
                    </div>
                    <Link 
                      to={`/blog/${post.id}`}
                      className="inline-flex items-center mt-4 text-blue-600 hover:underline"
                    >
                      Read more
                      <svg className="w-3.5 h-3.5 ml-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
                      </svg>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-8 flex justify-center">
              <nav aria-label="Page navigation">
                <ul className="flex space-x-1">
                  <li>
                    <a href="#" className="block px-3 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
                      Previous
                    </a>
                  </li>
                  <li>
                    <a href="#" className="block px-3 py-2 bg-blue-600 text-white border border-blue-600 rounded-md">
                      1
                    </a>
                  </li>
                  <li>
                    <a href="#" className="block px-3 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
                      2
                    </a>
                  </li>
                  <li>
                    <a href="#" className="block px-3 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
                      3
                    </a>
                  </li>
                  <li>
                    <a href="#" className="block px-3 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
                      Next
                    </a>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="md:w-1/3">
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h3 className="text-lg font-bold mb-4">Categories</h3>
              <ul className="space-y-2">
                {categories.map((category, index) => (
                  <li key={index}>
                    <a 
                      href={`/blog/category/${category.toLowerCase().replace(/\s+/g, '-')}`}
                      className="flex items-center justify-between text-gray-700 hover:text-blue-600"
                    >
                      <span>{category}</span>
                      <span className="bg-gray-100 text-gray-600 text-xs font-medium px-2.5 py-0.5 rounded-full">
                        {Math.floor(Math.random() * 20) + 1}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h3 className="text-lg font-bold mb-4">Subscribe to Newsletter</h3>
              <p className="text-gray-600 mb-4">Get the latest updates on social impact initiatives and NGO success stories</p>
              <form className="space-y-3">
                <div>
                  <input 
                    type="email" 
                    placeholder="Your email address" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <button 
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
                >
                  Subscribe
                </button>
              </form>
            </div>
            
            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="text-lg font-bold mb-3">Want to Share Your Story?</h3>
              <p className="text-gray-700 mb-4">
                If you're an NGO with a success story or impact report, we'd love to feature it on our blog.
              </p>
              <Link 
                to="/contact" 
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Blog;
