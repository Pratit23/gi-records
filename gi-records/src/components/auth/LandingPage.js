import React, { useEffect } from 'react'
import M from 'materialize-css'
import { Link, NavLink, Redirect } from 'react-router-dom'

const LandingPage = () => {

    useEffect(() => {
        window.$(document).ready(function () {
            window.$('.parallax').parallax();
        });
        window.$(function () {
            window.$(document).scroll(function () {
              var $nav = window.$(".theNav");
              $nav.toggleClass('scrolled', window.$(this).scrollTop() > $nav.height());
            });
          });
    }, [])

    return (
        <div>
            <div className="section landing1 blue navbar-fixed">
                <nav className="transparent z-depth-0 theNav">
                    <div className="nav-wrapper">
                        <Link to='/' className="brand-logo">Gi-Records</Link>
                        <ul id="nav-mobile" className="right hide-on-med-and-down">
                            <li><NavLink to='/SignUp'>Signup</NavLink></li>
                            <li><NavLink to='/signin'>Login</NavLink></li>
                        </ul>
                    </div>
                </nav>
                <div className="section subFirst container">
                    <h1 className="white-text">BLOCKCHAIN LAND REGISTRY PLATFORM – REDUCING FRAUDS AND DELAYS</h1>
                    <Link to='/signup' className="subFirstBtn btn-large"><span className="signUpBtn">Sign up now</span></Link>
                </div>
            </div>
            <div className="parallax-container">
                <h3 className="black-text holistic">Get Holistic View of Land Records</h3>
                <h5 className="black-text center-align">Adding your land as a permanent record in a few simple steps</h5>
                <div className="parallax forParallax"><img src={require('../../images/17969351.jpg')} alt="Unsplashed background img 1" /></div>
            </div>
            <div className="section landing2">
                <div className="container">
                    <div className="row">
                        <div className="col s4 card featureCard">
                            <p className="center-align"><img className="featureImages" src={require('../../images/network-block.jpg')} alt="Unsplashed background img 1" />The platform is based on Blockchain Technology hence data alteration and fradulent data is eliminated</p>
                        </div>
                        <div className="col s4 card featureCard">
                            <p className="center-align"><img className="featureImages" src={require('../../images/neural.png')} alt="Unsplashed background img 1" /><br/>The platform is based on Blockchain Technology hence data alteration and fradulent data is eliminated</p>
                        </div>
                        <div className="col s4 card featureCard">
                            <p className="center-align"><img className="featureImages" src={require('../../images/network-block.jpg')} alt="Unsplashed background img 1" />The platform is based on Blockchain Technology hence data alteration and fradulent data is eliminated</p>
                        </div>
                    </div>
                </div>
            </div>
            <footer className="page-footer black">
                <div className="container">
                    <div className="row">
                        <div className="col l6 s12">
                            <h5 className="white-text">Gi-Records</h5>
                            <p className="grey-text text-lighten-4">Department of Land Records India</p>
                        </div>
                        <div className="col l4 offset-l2 s12">
                            <h5 className="white-text">Links</h5>
                            <ul>
                                <li><a className="grey-text text-lighten-3" href="#!">About us</a></li>
                                <li><a className="grey-text text-lighten-3" href="#!">Contact us</a></li>
                                <li><a className="grey-text text-lighten-3" href="#!">Terms of use3</a></li>
                                <li><a className="grey-text text-lighten-3" href="#!">Site map</a></li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="footer-copyright">
                    <div className="container">
                        © 2020 Copyright Pratit Bandiwadekar
                    </div>
                </div>
            </footer>
        </div>
    )
}

export default LandingPage
