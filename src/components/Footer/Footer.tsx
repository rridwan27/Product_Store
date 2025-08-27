"use client";

import React from "react";

const Footer = () => {
  return (
    <footer className="bg-white">
      <div className="mx-auto container px-4 pt-16 pb-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-md">
          <strong className="block text-center text-xl font-bold text-gray-900 sm:text-3xl">
            Want us to email you with the latest Jubilee updates?
          </strong>

          <form className="mt-6">
            <div className="relative max-w-lg">
              <label className="sr-only" htmlFor="email">
                Email
              </label>

              <input
                className="w-full rounded-full border-gray-200 bg-gray-100 p-4 pe-32 text-sm font-medium"
                id="email"
                type="email"
                placeholder="john@doe.com"
              />

              <button
                type="submit"
                className="absolute end-1 top-1/2 -translate-y-1/2 rounded-full bg-blue-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-blue-700"
              >
                Subscribe
              </button>
            </div>
          </form>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-32">
          <div className="mx-auto max-w-sm lg:max-w-none">
            <p className="mt-4 text-center text-gray-500 lg:text-left lg:text-lg">
              Jubilee is your trusted store for modern essentials. From stylish
              clothing to quality accessories, we deliver the best picks at fair
              prices.
            </p>

            <div className="mt-6 flex justify-center gap-4 lg:justify-start">
              {/* Social links (dummy hrefs) */}
              <a
                className="text-gray-700 transition hover:text-gray-700/75"
                href="#"
                target="_blank"
                rel="noreferrer"
              >
                <span className="sr-only">Facebook</span>
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 
                    9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 
                    1.492-3.89 3.777-3.89 1.094 0 2.238.195 
                    2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 
                    1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 
                    21.128 22 16.991 22 12z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
              {/* Repeat other socials if needed */}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8 text-center lg:grid-cols-3 lg:text-left">
            <div>
              <strong className="font-medium text-gray-900">Services</strong>
              <ul className="mt-6 space-y-1">
                <li>
                  <a className="text-gray-700 hover:text-gray-900" href="#">
                    Marketing
                  </a>
                </li>
                <li>
                  <a className="text-gray-700 hover:text-gray-900" href="#">
                    Graphic Design
                  </a>
                </li>
                <li>
                  <a className="text-gray-700 hover:text-gray-900" href="#">
                    App Development
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <strong className="font-medium text-gray-900">About</strong>
              <ul className="mt-6 space-y-1">
                <li>
                  <a className="text-gray-700 hover:text-gray-900" href="#">
                    Our Story
                  </a>
                </li>
                <li>
                  <a className="text-gray-700 hover:text-gray-900" href="#">
                    Careers
                  </a>
                </li>
                <li>
                  <a className="text-gray-700 hover:text-gray-900" href="#">
                    Team
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <strong className="font-medium text-gray-900">Support</strong>
              <ul className="mt-6 space-y-1">
                <li>
                  <a className="text-gray-700 hover:text-gray-900" href="#">
                    FAQs
                  </a>
                </li>
                <li>
                  <a className="text-gray-700 hover:text-gray-900" href="#">
                    Contact
                  </a>
                </li>
                <li>
                  <a className="text-gray-700 hover:text-gray-900" href="#">
                    Live Chat
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-16 border-t border-gray-100 pt-8">
          <p className="text-center text-xs text-gray-500">
            © {new Date().getFullYear()} Jubilee. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
