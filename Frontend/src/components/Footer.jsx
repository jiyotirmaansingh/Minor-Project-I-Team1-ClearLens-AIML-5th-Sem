// src/components/Footer.jsx
import {
    FaFacebookSquare,
    FaGithubSquare,
    FaInstagram,
    FaTwitterSquare,
    FaLinkedin,
  } from "react-icons/fa";
  
  export default function Footer() {
    return (
      <footer className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto py-16 px-6 grid lg:grid-cols-3 gap-12">
          {/* Brand Section */}
          <div>
            <h1 className="text-3xl font-extrabold text-blue-900 tracking-tight">
              CalmCam
            </h1>
            <p className="mt-4 text-gray-600 text-lg max-w-sm">
              Helping you stay <span className="font-semibold text-blue-900">focused</span> 
              and productive with real-time AI-powered attention tracking.
            </p>
            <div className="flex gap-5 mt-6 text-blue-900">
              <a href="#" className="hover:scale-110 transition transform">
                <FaFacebookSquare size={28} />
              </a>
              <a href="#" className="hover:scale-110 transition transform">
                <FaInstagram size={28} />
              </a>
              <a href="#" className="hover:scale-110 transition transform">
                <FaTwitterSquare size={28} />
              </a>
              <a href="#" className="hover:scale-110 transition transform">
                <FaGithubSquare size={28} />
              </a>
              <a href="#" className="hover:scale-110 transition transform">
                <FaLinkedin size={28} />
              </a>
            </div>
          </div>
  
          {/* Links Section */}
          <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-4 gap-8 text-gray-600">
            <div>
              <h6 className="font-semibold text-blue-900 mb-3">Product</h6>
              <ul className="space-y-2">
                <li className="hover:text-blue-700 cursor-pointer">Features</li>
                <li className="hover:text-blue-700 cursor-pointer">Focus Insights</li>
                <li className="hover:text-blue-700 cursor-pointer">Sessions</li>
                <li className="hover:text-blue-700 cursor-pointer">Reports</li>
              </ul>
            </div>
  
            <div>
              <h6 className="font-semibold text-blue-900 mb-3">Support</h6>
              <ul className="space-y-2">
                <li className="hover:text-blue-700 cursor-pointer">Help Center</li>
                <li className="hover:text-blue-700 cursor-pointer">Guides</li>
                <li className="hover:text-blue-700 cursor-pointer">API Docs</li>
                <li className="hover:text-blue-700 cursor-pointer">Contact Us</li>
              </ul>
            </div>
  
            <div>
              <h6 className="font-semibold text-blue-900 mb-3">Company</h6>
              <ul className="space-y-2">
                <li className="hover:text-blue-700 cursor-pointer">About Us</li>
                <li className="hover:text-blue-700 cursor-pointer">Blog</li>
                <li className="hover:text-blue-700 cursor-pointer">Careers</li>
                <li className="hover:text-blue-700 cursor-pointer">Press</li>
              </ul>
            </div>
  
            <div>
              <h6 className="font-semibold text-blue-900 mb-3">Legal</h6>
              <ul className="space-y-2">
                <li className="hover:text-blue-700 cursor-pointer">Privacy Policy</li>
                <li className="hover:text-blue-700 cursor-pointer">Terms of Service</li>
                <li className="hover:text-blue-700 cursor-pointer">Security</li>
              </ul>
            </div>
          </div>
        </div>
  
        {/* Bottom Bar */}
        <div className="border-t border-gray-200 py-6 text-center text-gray-500 text-sm">
          © {new Date().getFullYear()} CalmCam. All rights reserved.
        </div>
      </footer>
    );
  }
  