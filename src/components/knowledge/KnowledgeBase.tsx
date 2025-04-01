import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '../ui';

interface Article {
  id: string;
  title: string;
  description: string;
  category: string;
  author: string;
  date: string;
  readTime: string;
  content?: string;
}

const KnowledgeBase: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  
  // Mock articles data
  const articles: Article[] = [
    {
      id: '1',
      title: 'Understanding the Tender Submission Process',
      description: 'A comprehensive guide to submitting successful government tender applications.',
      category: 'Basics',
      author: 'Priya Sharma',
      date: '2023-06-15',
      readTime: '8 min',
      content: `
        <h2>Introduction to the Tender Process</h2>
        <p>Government tenders are formal invitations to suppliers to submit a bid or proposal to provide goods or services. Understanding the process is critical to success.</p>
        
        <h2>Steps in the Tender Submission Process</h2>
        <ol>
          <li><strong>Pre-qualification</strong>: Many tenders require suppliers to pre-qualify before they can bid. This involves demonstrating your company meets basic criteria.</li>
          <li><strong>Tender Notice</strong>: The government publishes a notice inviting tenders. This includes the scope of work, eligibility criteria, and submission deadlines.</li>
          <li><strong>Tender Document</strong>: Obtain and carefully review the tender document. This contains all requirements and specifications.</li>
          <li><strong>Clarifications</strong>: If anything is unclear, submit questions during the designated clarification period.</li>
          <li><strong>Prepare Bid</strong>: Develop your technical and financial proposals according to the format specified.</li>
          <li><strong>Submit Bid</strong>: Ensure your bid is submitted before the deadline and follows all submission guidelines.</li>
          <li><strong>Bid Opening</strong>: Bids are opened and initially evaluated for compliance with basic requirements.</li>
          <li><strong>Evaluation</strong>: Compliant bids are evaluated based on technical and financial criteria.</li>
          <li><strong>Award</strong>: The contract is awarded to the successful bidder.</li>
        </ol>
        
        <h2>Common Mistakes to Avoid</h2>
        <ul>
          <li>Missing the submission deadline</li>
          <li>Not following the exact format requirements</li>
          <li>Overlooking mandatory documents or certifications</li>
          <li>Failing to address all evaluation criteria</li>
          <li>Submitting unrealistic pricing</li>
        </ul>
      `
    },
    {
      id: '2',
      title: 'Financial Considerations for Bid Pricing',
      description: 'Learn how to develop competitive yet profitable pricing strategies for government tenders.',
      category: 'Financial',
      author: 'Rajesh Kumar',
      date: '2023-07-22',
      readTime: '12 min',
      content: `
        <h2>The Art and Science of Bid Pricing</h2>
        <p>Effective pricing is crucial for both winning tenders and ensuring profitability. This article explores strategies for competitive bid pricing.</p>
        
        <h2>Understanding Your Costs</h2>
        <p>Before setting prices, thoroughly understand your cost structure including:</p>
        <ul>
          <li>Direct costs (materials, labor, etc.)</li>
          <li>Indirect costs (overhead, administration)</li>
          <li>Compliance costs specific to government contracts</li>
          <li>Contingency allowances</li>
        </ul>
        
        <h2>Analyzing the Competition</h2>
        <p>Research previous tender awards to understand competitive pricing in your industry. Look for patterns in successful bids.</p>
        
        <h2>Pricing Strategies</h2>
        <ol>
          <li><strong>Cost-plus pricing</strong>: Adding a standard markup to your costs</li>
          <li><strong>Value-based pricing</strong>: Pricing based on the perceived value to the client</li>
          <li><strong>Competitive pricing</strong>: Setting prices in relation to competitors</li>
          <li><strong>Loss-leader strategy</strong>: Accepting lower margins to establish a relationship with a government client</li>
        </ol>
        
        <h2>Risk Management in Pricing</h2>
        <p>Government contracts often come with risks that should be factored into pricing:</p>
        <ul>
          <li>Payment delays</li>
          <li>Scope changes</li>
          <li>Regulatory compliance costs</li>
          <li>Long-term cost increases</li>
        </ul>
      `
    },
    {
      id: '3',
      title: 'Legal Compliance in Government Contracts',
      description: 'Essential legal considerations and compliance requirements for government tender participants.',
      category: 'Legal',
      author: 'Anita Desai',
      date: '2023-08-05',
      readTime: '10 min'
    },
    {
      id: '4',
      title: 'Building Strong Technical Proposals',
      description: 'Techniques for developing compelling technical proposals that meet evaluation criteria.',
      category: 'Technical',
      author: 'Vijay Mehta',
      date: '2023-09-12',
      readTime: '15 min'
    },
    {
      id: '5',
      title: 'Digital Tools for Tender Management',
      description: 'Overview of software and digital platforms to streamline the tender preparation process.',
      category: 'Technology',
      author: 'Sanjay Gupta',
      date: '2023-10-03',
      readTime: '6 min'
    },
    {
      id: '6',
      title: 'Post-Award Contract Management',
      description: 'Best practices for managing government contracts after winning the tender.',
      category: 'Management',
      author: 'Neha Singh',
      date: '2023-11-18',
      readTime: '9 min'
    }
  ];
  
  // Extract unique categories
  const categories = ['all', ...new Set(articles.map(article => article.category))];
  
  // Filter articles based on category and search query
  const filteredArticles = articles.filter(article => {
    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
    const matchesSearch = 
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesCategory && matchesSearch;
  });
  
  // Handle article selection
  const handleArticleSelect = (article: Article) => {
    setSelectedArticle(article);
    window.scrollTo(0, 0);
  };
  
  // Handle back to list
  const handleBackToList = () => {
    setSelectedArticle(null);
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      {selectedArticle ? (
        <div>
          <button 
            onClick={handleBackToList}
            className="mb-6 px-4 py-2 bg-[#1A2A44] hover:bg-[#1A2A44]/80 text-white rounded-md flex items-center"
          >
            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Articles
          </button>
          
          <Card className="bg-white/5 backdrop-blur-sm border border-[#D4AF37]/20 p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-3xl font-cinzel text-[#D4AF37] mb-4">{selectedArticle.title}</h1>
              
              <div className="flex flex-wrap items-center text-white/60 mb-6 gap-2">
                <span className="bg-[#D4AF37]/10 text-[#D4AF37] px-2 py-1 rounded text-sm">{selectedArticle.category}</span>
                <span>By {selectedArticle.author}</span>
                <span>•</span>
                <span>{new Date(selectedArticle.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                <span>•</span>
                <span>{selectedArticle.readTime} read</span>
              </div>
              
              <p className="text-white/80 text-lg mb-8">{selectedArticle.description}</p>
              
              {selectedArticle.content ? (
                <div 
                  className="article-content text-white/80 prose prose-invert prose-headings:text-[#D4AF37] prose-headings:font-cinzel max-w-none"
                  dangerouslySetInnerHTML={{ __html: selectedArticle.content }}
                />
              ) : (
                <div className="text-center py-10">
                  <p className="text-white/60">Full content for this article is not available.</p>
                </div>
              )}
            </motion.div>
          </Card>
        </div>
      ) : (
        <div>
          <h1 className="text-3xl font-cinzel text-[#D4AF37] mb-8 text-center">Knowledge Base</h1>
          
          {/* Search and filters */}
          <div className="max-w-4xl mx-auto mb-8 bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-[#D4AF37]/20">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-[#D4AF37] mb-2 font-medium">Search Articles</label>
                <input
                  type="text"
                  placeholder="Search by title, description, or author..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#1A2A44] border border-[#D4AF37]/30 rounded p-2 text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
              
              <div className="md:w-1/3">
                <label className="block text-[#D4AF37] mb-2 font-medium">Filter by Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full bg-[#1A2A44] border border-[#D4AF37]/30 rounded p-2 text-white focus:outline-none focus:border-[#D4AF37]"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category === 'all' ? 'All Categories' : category}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          
          {/* Results count */}
          <p className="text-white/60 mb-4 text-center">
            Showing {filteredArticles.length} of {articles.length} articles
          </p>
          
          {/* Articles grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {filteredArticles.map((article) => (
                <motion.div
                  key={article.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  whileHover={{ y: -10, transition: { duration: 0.2 } }}
                >
                  <Card 
                    className="bg-white/5 backdrop-blur-sm border border-[#D4AF37]/20 h-full cursor-pointer"
                    onClick={() => handleArticleSelect(article)}
                  >
                    <div className="p-6">
                      <span className="inline-block bg-[#D4AF37]/10 text-[#D4AF37] text-xs px-2 py-1 rounded-full mb-4">
                        {article.category}
                      </span>
                      
                      <h2 className="text-xl font-cinzel text-[#D4AF37] mb-2 line-clamp-2">{article.title}</h2>
                      
                      <p className="text-white/70 mb-4 line-clamp-3">{article.description}</p>
                      
                      <div className="flex justify-between items-center mt-auto pt-4 border-t border-white/10 text-white/60 text-sm">
                        <span>{article.readTime} read</span>
                        <span>{new Date(article.date).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          
          {/* No results message */}
          {filteredArticles.length === 0 && (
            <div className="text-center py-10">
              <p className="text-white/60">No articles match your search criteria.</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
                className="mt-4 px-4 py-2 bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 text-[#D4AF37] rounded-md transition-colors"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default KnowledgeBase; 