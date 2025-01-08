/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useRef, useState } from "react";
import AuthModal from "../auth/AuthModal";
import Cookies from "js-cookie";
import { logoutAPI } from "../../api/loginAPI";
import "./header.css";

function Header() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<string>("");
  const menuRef = useRef<HTMLDivElement>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const isLoggin = Cookies.get("user");
    const username = Cookies.get("username");
    const role = Cookies.get("role");
    if (isLoggin && username) {
      setIsLoggedIn(true);
      setUser(username);
      setIsAdmin(role === "admin");
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);

  const toggleUserMenu = () => setIsMenuOpen(!isMenuOpen);

  const logout = () => {
    logoutAPI()
      .then(() => {
        setIsLoggedIn(false);
        Cookies.remove("access_token");
        Cookies.remove("refresh_Token");
        Cookies.remove("user");
        window.location.reload();
      })
      .catch((err) => console.error(err));
  };

  return (
    <header className="bg-gray-800 shadow fixed z-10 w-full">
      <div className="center mx-auto flex flex-wrap justify-between items-center py-4 px-6">
        {/* Logo and Home section */}
        <nav className="center flex items-center space-x-4">
          <a
            href="/"
            className="flex items-center group transition-transform hover:scale-105"
          >
            <div className="center flex items-center bg-gray-700 rounded-lg px-4 py-2 shadow-lg hover:shadow-xl transition-all duration-300">
              <span className="text-xl md:text-2xl font-extrabold text-blue-500">
                TOEIC
              </span>
              <span className="text-xl md:text-2xl font-extrabold text-blue-500 ml-1">
                Master
              </span>
              <svg
                className="w-6 h-6 md:w-7 md:h-7 ml-2 text-blue-500 animate-pulse"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
          </a>
          <a
            className="text-white hover:text-yellow-300 text-center flex items-center justify-center"
            href="/"
          >
            Trang chủ
          </a>
        </nav>

        {/* Mobile Menu Button */}
        <div className="md:hidden space-x-4">
          <button className="text-white p-2 md:hidden" onClick={toggleUserMenu}>
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={
                  isMenuOpen
                    ? "M6 18L18 6M6 6l12 12"
                    : "M4 6h16M4 12h16M4 18h16"
                }
              />
            </svg>
          </button>
        </div>

        {/* Navigation Links - Desktop */}
        <nav className="hidden md:flex space-x-4">
          <a className="text-white hover:text-yellow-300" href="/test">
            Full test
          </a>
          <a className="text-white hover:text-yellow-300" href="#">
            Listening
          </a>
          <a className="text-white hover:text-yellow-300" href="#">
            Reading
          </a>
          <a className="text-white hover:text-yellow-300" href="#">
            Part of test
          </a>
        </nav>

        {/* User Menu Section - Desktop */}
        <div className="hidden md:flex space-x-4">
          {isLoggedIn ? (
            <div className="relative" ref={menuRef}>
              <button
                className="flex center items-center gap-2 px-3 py-2 rounded-full bg-white/10 text-white hover:bg-white/20 focus:outline-none transition-colors duration-200"
                onClick={toggleUserMenu}
              >
                <img
                  src="https://via.placeholder.com/40"
                  alt="User Avatar"
                  className="w-8 h-8 rounded-full border-2 border-white/50"
                />
                <span className="font-medium">{user}</span>
                <svg
                  className="w-4 h-4 ml-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              {isMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-20">
                  <a
                    href="/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Profile
                  </a>
                  {isAdmin && (
                    <a
                      href="/admin/dashboard"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Admin Dashboard
                    </a>
                  )}
                  <a
                    href="/settings"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Settings
                  </a>
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={logout}
                  >
                    Logout
                  </a>
                </div>
              )}
            </div>
          ) : (
            <div className="center flex space-x-4">
              <button
                className="text-white hover:text-yellow-300"
                onClick={() => setIsModalOpen(true)}
              >
                Đăng nhập
              </button>
              <a
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                href="#"
              >
                Đăng ký
              </a>
            </div>
          )}
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-gradient-to-r from-blue-500 to-purple-600 md:hidden">
            <div className="px-4 py-3 space-y-3">
              <div className="space-y-2">
                <a
                  className="block text-white hover:text-yellow-300 py-2"
                  href="#"
                >
                  Full test
                </a>
                <a
                  className="block text-white hover:text-yellow-300 py-2"
                  href="#"
                >
                  Listening
                </a>
                <a
                  className="block text-white hover:text-yellow-300 py-2"
                  href="#"
                >
                  Reading
                </a>
                <a
                  className="block text-white hover:text-yellow-300 py-2"
                  href="#"
                >
                  Part of test
                </a>
              </div>

              {isLoggedIn ? (
                <div className="border-t border-white/20 pt-2">
                  <div className="flex items-center space-x-3 py-2">
                    <img
                      src="https://via.placeholder.com/40"
                      alt="User Avatar"
                      className="w-8 h-8 rounded-full border-2 border-white/50"
                    />
                    <span className="text-white">{user}</span>
                  </div>
                  <div className="space-y-2">
                    <a
                      href="/profile"
                      className="block text-white hover:text-yellow-300 py-1"
                    >
                      Profile
                    </a>
                    {isAdmin && (
                      <a
                        href="/admin/dashboard"
                        className="block text-white hover:text-yellow-300 py-1"
                      >
                        Admin Dashboard
                      </a>
                    )}
                    <a
                      href="/settings"
                      className="block text-white hover:text-yellow-300 py-1"
                    >
                      Settings
                    </a>
                    <a
                      href="#"
                      onClick={logout}
                      className="block text-white hover:text-yellow-300 py-1"
                    >
                      Logout
                    </a>
                  </div>
                </div>
              ) : (
                <div className="border-t border-white/20 pt-2 flex flex-col space-y-2">
                  <button
                    className="text-white hover:text-yellow-300 py-2"
                    onClick={() => {
                      setIsModalOpen(true);
                      setIsMenuOpen(false);
                    }}
                  >
                    Đăng nhập
                  </button>
                  <a
                    className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 text-center"
                    href="#"
                  >
                    Đăng ký
                  </a>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      <AuthModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </header>
  );
}

export default Header;
