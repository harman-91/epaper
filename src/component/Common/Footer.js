"use Client"

import React from 'react'
import GlobalLink from '../global/GlobalLink'

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
                        <GlobalLink href="#">About Us</GlobalLink>
                        <GlobalLink href="#">Privacy Policy</GlobalLink>
                        <GlobalLink href="#">Terms and Conditions</GlobalLink>
                        <GlobalLink href="#">Contact Us</GlobalLink>
                        <GlobalLink href="#">Support</GlobalLink>
                        <GlobalLink href="#">Faq</GlobalLink>
                        <GlobalLink href="#">Refund Policy</GlobalLink>                                                 
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
