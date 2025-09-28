




import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  
  const searchHandler = (e) => {
    e.preventDefault();
    if(searchQuery.trim() !== ""){
      navigate(`/course/search?query=${searchQuery}`)
    }
    setSearchQuery("");
  }

  return (
    <div className="relative bg-gradient-to-r from-purple-600 to-fuchsia-700 dark:from-gray-900 dark:to-gray-950 py-28 px-4 text-center overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute -top-20 -right-20 w-72 h-72 bg-purple-500/20 rounded-full mix-blend-soft-light"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-fuchsia-500/20 rounded-full mix-blend-soft-light"></div>
        <div className="absolute top-1/3 left-1/4 w-16 h-16 bg-white/10 rounded-full"></div>
        <div className="absolute top-1/4 right-1/3 w-10 h-10 bg-yellow-400/20 rounded-full animate-pulse"></div>
      </div>
      
      <div className="relative z-10 max-w-3xl mx-auto ">
        <h1 className="text-white dark:text-white  text-5xl font-bold mb-6 tracking-tight">
          Transform Your Future with World-Class Learning
        </h1>
        <p className="text-purple-100 dark:text-purple-200 text-xl mb-10 max-w-2xl mx-auto">
          Gain in-demand skills, advance your career, and unlock new opportunities
        </p>

        <form onSubmit={searchHandler} className="flex items-center bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full shadow-xl overflow-hidden max-w-xl mx-auto mb-8 ring-2 ring-white/20">
          <Input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search skills, topics, or instructors"
            className="flex-grow border-none focus-visible:ring-0 px-6 py-4 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 text-base"
          />
          <Button 
            type="submit" 
            className="bg-purple-600 dark:bg-purple-700 text-white px-8 py-4 rounded-r-full hover:bg-purple-700 dark:hover:bg-purple-800 transition-all duration-300 hover:scale-[1.03]"
          >
            Discover
          </Button>
        </form>
        
        <div className="flex justify-center gap-4">
          <Button 
            onClick={() => navigate(`/course/search?query`)} 
            className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm text-purple-600 dark:text-purple-400 font-medium rounded-full px-8 py-5 shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700/90 transition-all duration-300 border border-purple-200/50 dark:border-gray-700 hover:shadow-xl"
          >
            Explore All Courses
          </Button>
          {/* <Button 
            onClick={() => navigate(`/categories`)} 
            className="bg-transparent text-white font-medium rounded-full px-8 py-5 shadow-lg hover:bg-white/10 transition-all duration-300 border border-white/30 hover:shadow-xl"
          >
            Browse Categories
          </Button> */}
        </div>
      </div>
    </div>
  );
};

export default HeroSection;