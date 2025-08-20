"use Client"

import React from 'react'

export default function Footer() {
  return (
    <footer className="footer-main">
        <div className="container">
            <div className="row justify-content-center">
                <div className="col-12 col-lg-8">
                    <div className="disclaimer text-center">
                        <p>All contents and images on this website are the subject of copyright and copying, reproducing, modifying, distributing, displaying, transmitting any of the content for any purpose may expose you to legal action for copyright infringement.</p>
                    </div>
                </div>
            </div>
            <div className="row justify-content-center">
                <div className="col-12 col-lg-8">
                    <nav className="footer-main-nav">
                        <a href="#">About Us</a>
                        <a href="#">Privacy Policy</a>
                        <a href="#">Terms and Conditions</a>
                        <a href="#">Contact Us</a>
                        <a href="#">Support</a>
                        <a href="#">Faq</a>
                        <a href="#">Refund Policy</a>                                                 
                    </nav>
                    <div className="copyright">
                        <p>Copyright © 2025 Jagran Prakashan Limited.</p>
                    </div>
                </div>
            </div>
        </div>
    </footer>
  )
}
