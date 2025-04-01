import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
// @ts-expect-error - React icons package
import { FaHeart, FaRegHeart, FaBookmark, FaRegBookmark, FaShare, FaArrowLeft } from 'react-icons/fa';
// @ts-expect-error - React markdown package
import ReactMarkdown from 'react-markdown';
// @ts-expect-error - React syntax highlighter
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
// @ts-expect-error - React syntax highlighter styles
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';

// Types
interface Author {
  _id: string;
  firstName: string;
  lastName: string;
  avatar?: string;
}

interface Comment {
  _id: string;
  content: string;
  createdAt: string;
  user: {
    _id: string;
    firstName: string;
    lastName: string;
    avatar?: string;
  };
  likes: number;
}

interface Article {
  _id: string;
  title: string;
  slug: string;
  content: string;
  summary: string;
  author: Author;
  category: string;
  tags: string[];
  coverImage?: string;
  readTime: number;
  views: number;
  likes: number;
  createdAt: string;
  updatedAt: string;
  isLiked: boolean;
  isSaved: boolean;
}

const ArticleView: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [article, setArticle] = useState<Article | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [commentText, setCommentText] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const [relatedArticles, setRelatedArticles] = useState<Article[]>([]);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setLoading(true);
        const articleResponse = await axios.get(`/api/v1/articles/${slug}`);
        setArticle(articleResponse.data.data.article);
        
        const commentsResponse = await axios.get(`/api/v1/articles/${articleResponse.data.data.article._id}/comments`);
        setComments(commentsResponse.data.data.comments);
        
        const relatedResponse = await axios.get(`/api/v1/articles/related/${articleResponse.data.data.article._id}`);
        setRelatedArticles(relatedResponse.data.data.articles);
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching article:', err);
        setError('Failed to load article. Please try again later.');
        setLoading(false);
      }
    };

    if (slug) {
      fetchArticle();
    }
  }, [slug]);

  const handleLikeArticle = async () => {
    if (!article) return;
    
    try {
      const response = await axios.post(`/api/v1/articles/${article._id}/like`);
      setArticle({
        ...article,
        likes: response.data.data.likes,
        isLiked: response.data.data.isLiked
      });
    } catch (err) {
      console.error('Error liking article:', err);
    }
  };

  const handleSaveArticle = async () => {
    if (!article) return;
    
    try {
      const response = await axios.post(`/api/v1/articles/${article._id}/save`);
      setArticle({
        ...article,
        isSaved: response.data.data.isSaved
      });
    } catch (err) {
      console.error('Error saving article:', err);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!article || !commentText.trim()) return;
    
    try {
      setSubmittingComment(true);
      const response = await axios.post(`/api/v1/articles/${article._id}/comments`, {
        content: commentText
      });
      
      setComments([response.data.data.comment, ...comments]);
      setCommentText('');
      setSubmittingComment(false);
    } catch (err) {
      console.error('Error submitting comment:', err);
      setSubmittingComment(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 p-4 rounded-md text-red-800">
          <p>{error || 'Article not found'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-4 py-8"
      >
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
        >
          <FaArrowLeft className="mr-2" /> Back to Articles
        </button>
        
        {/* Article header */}
        <header className="mb-8">
          <div className="flex flex-wrap items-center text-sm text-gray-500 mb-3">
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md mr-3">
              {article.category}
            </span>
            <span className="mr-3">{new Date(article.createdAt).toLocaleDateString()}</span>
            <span className="mr-3">{article.readTime} min read</span>
            <span>{article.views} views</span>
          </div>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{article.title}</h1>
          
          <div className="flex items-center mb-6">
            <div className="flex items-center">
              {article.author.avatar ? (
                <img 
                  src={article.author.avatar} 
                  alt={`${article.author.firstName} ${article.author.lastName}`}
                  className="w-10 h-10 rounded-full mr-3"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center mr-3">
                  {article.author.firstName[0]}{article.author.lastName[0]}
                </div>
              )}
              <div>
                <p className="font-medium text-gray-900">
                  {article.author.firstName} {article.author.lastName}
                </p>
                <p className="text-sm text-gray-500">Author</p>
              </div>
            </div>
          </div>
          
          {article.coverImage && (
            <img 
              src={article.coverImage} 
              alt={article.title}
              className="w-full h-64 md:h-96 object-cover rounded-lg mb-6"
            />
          )}
          
          <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm">
            <div className="flex items-center">
              <button
                onClick={handleLikeArticle}
                className="flex items-center mr-4 text-gray-600 hover:text-red-500"
              >
                {article.isLiked ? (
                  <FaHeart className="text-red-500 mr-1" />
                ) : (
                  <FaRegHeart className="mr-1" />
                )}
                <span>{article.likes}</span>
              </button>
              
              <button
                onClick={handleSaveArticle}
                className="flex items-center mr-4 text-gray-600 hover:text-blue-500"
              >
                {article.isSaved ? (
                  <FaBookmark className="text-blue-500 mr-1" />
                ) : (
                  <FaRegBookmark className="mr-1" />
                )}
                <span>Save</span>
              </button>
              
              <button className="flex items-center text-gray-600 hover:text-gray-900">
                <FaShare className="mr-1" />
                <span>Share</span>
              </button>
            </div>
            
            <div className="flex space-x-2">
              {article.tags.map(tag => (
                <span 
                  key={tag} 
                  className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-md"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </header>
        
        {/* Article content */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="prose prose-lg max-w-none">
            <ReactMarkdown
              components={{
                code({node, inline, className, children, ...props}: {
                  node: React.ReactNode;
                  inline?: boolean;
                  className?: string;
                  children: React.ReactNode;
                  [key: string]: any;
                }) {
                  const match = /language-(\w+)/.exec(className || '');
                  return !inline && match ? (
                    <SyntaxHighlighter
                      style={tomorrow}
                      language={match[1]}
                      PreTag="div"
                      {...props}
                    >
                      {String(children).replace(/\n$/, '')}
                    </SyntaxHighlighter>
                  ) : (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  );
                }
              }}
            >
              {article.content}
            </ReactMarkdown>
          </div>
        </div>
        
        {/* Comments section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Comments ({comments.length})</h2>
          
          <form onSubmit={handleSubmitComment} className="mb-8">
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Add a comment..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              rows={4}
              required
            />
            <div className="flex justify-end mt-2">
              <button
                type="submit"
                disabled={submittingComment || !commentText.trim()}
                className={`px-4 py-2 rounded-md ${
                  submittingComment || !commentText.trim()
                    ? 'bg-gray-300 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                {submittingComment ? 'Submitting...' : 'Post Comment'}
              </button>
            </div>
          </form>
          
          <div className="space-y-6">
            {comments.length === 0 ? (
              <p className="text-center text-gray-500 py-4">No comments yet. Be the first to comment!</p>
            ) : (
              comments.map(comment => (
                <div key={comment._id} className="border-b border-gray-100 pb-6">
                  <div className="flex items-start">
                    {comment.user.avatar ? (
                      <img 
                        src={comment.user.avatar} 
                        alt={`${comment.user.firstName} ${comment.user.lastName}`}
                        className="w-10 h-10 rounded-full mr-3"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center mr-3">
                        {comment.user.firstName[0]}{comment.user.lastName[0]}
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="flex items-center mb-1">
                        <h4 className="font-medium text-gray-900 mr-2">
                          {comment.user.firstName} {comment.user.lastName}
                        </h4>
                        <span className="text-xs text-gray-500">
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-gray-700">{comment.content}</p>
                      <div className="flex items-center mt-2">
                        <button className="text-sm text-gray-500 hover:text-gray-700 mr-4">
                          Like
                        </button>
                        <button className="text-sm text-gray-500 hover:text-gray-700">
                          Reply
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        
        {/* Related articles */}
        {relatedArticles.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedArticles.map(article => (
                <div 
                  key={article._id}
                  className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-200 cursor-pointer"
                  onClick={() => navigate(`/articles/${article.slug}`)}
                >
                  {article.coverImage && (
                    <img 
                      src={article.coverImage} 
                      alt={article.title}
                      className="w-full h-40 object-cover"
                    />
                  )}
                  <div className="p-4">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      {article.title}
                    </h3>
                    <p className="text-sm text-gray-500 mb-2">
                      {article.summary.substring(0, 100)}...
                    </p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{new Date(article.createdAt).toLocaleDateString()}</span>
                      <span>{article.readTime} min read</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default ArticleView; 