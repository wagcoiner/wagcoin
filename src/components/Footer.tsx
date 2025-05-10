import React from "react";
import { Link } from "react-router-dom";
import { MessageCircle, Twitter as TwitterIcon, MailIcon, Home, CalendarDays, Users, Gift, FileText } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 border-t border-gray-800 mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <div className="mb-6 md:mb-0">
            <Link to="/" className="font-bold text-2xl text-neon-green flex items-center">
              <img
                src="/wagcoin-mascot.svg"
                alt="WagChain"
                className="h-10 w-10 mr-2"
              />
              <span>WagChain</span>
            </Link>
            <p className="text-gray-400 mt-2 max-w-md">
              Earn $WAGCoin by completing tasks, referring friends, and climbing the leaderboard.
            </p>
          </div>
          
          <div className="flex gap-4">
            <a href="https://t.me/wagcoin" target="_blank" rel="noopener noreferrer" 
              className="bg-gray-800 p-2 rounded-full hover:bg-gray-700 transition-colors">
              <MessageCircle className="h-5 w-5 text-neon-green" />
            </a>
            <a href="https://twitter.com/wagcoin" target="_blank" rel="noopener noreferrer" 
              className="bg-gray-800 p-2 rounded-full hover:bg-gray-700 transition-colors">
              <TwitterIcon className="h-5 w-5 text-neon-green" />
            </a>
            <a href="https://discord.gg/wagcoin" target="_blank" rel="noopener noreferrer" 
              className="bg-gray-800 p-2 rounded-full hover:bg-gray-700 transition-colors">
              <MailIcon className="h-5 w-5 text-neon-green" />
            </a>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-neon-green flex items-center gap-2">
                  <Home className="h-4 w-4" /> Home
                </Link>
              </li>
              <li>
                <Link to="/tasks" className="text-gray-400 hover:text-neon-green flex items-center gap-2">
                  <CalendarDays className="h-4 w-4" /> Tasks
                </Link>
              </li>
              <li>
                <Link to="/referrals" className="text-gray-400 hover:text-neon-green flex items-center gap-2">
                  <Users className="h-4 w-4" /> Referrals
                </Link>
              </li>
              <li>
                <Link to="/airdrop" className="text-gray-400 hover:text-neon-green flex items-center gap-2">
                  <Gift className="h-4 w-4" /> Airdrop
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-400 hover:text-neon-green flex items-center gap-2">
                  <FileText className="h-4 w-4" /> About
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4">Resources</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/coinomics" className="text-gray-400 hover:text-neon-green">
                  Coinomics
                </Link>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-neon-green">
                  Documentation
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-neon-green">
                  Whitepaper
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4">Legal</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-neon-green">
                  Terms of Use
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-neon-green">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-neon-green">
                  Disclaimer
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4">Stay Updated</h4>
            <p className="text-gray-400 mb-4">Join our community for updates on $WAGCoin and platform developments.</p>
            <Link to="/referrals" className="bg-neon-green text-black px-4 py-2 rounded-md hover:bg-neon-green/90 transition-colors inline-flex items-center">
              Invite Friends
            </Link>
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm mb-4 md:mb-0">
            © {new Date().getFullYear()} WagChain. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-gray-400 hover:text-neon-green text-sm">
              Support
            </a>
            <a href="#" className="text-gray-400 hover:text-neon-green text-sm">
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
